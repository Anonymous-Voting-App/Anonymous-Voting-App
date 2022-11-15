resource "aws_appautoscaling_target" "app_scale_target" {
  service_namespace  = "ecs"
  resource_id        = "service/${aws_ecs_cluster.app.name}/${aws_ecs_service.app.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  max_capacity       = var.ecs_autoscale_max_instances
  min_capacity       = var.ecs_autoscale_min_instances
}


resource "aws_ecs_task_definition" "app" {
  family                   = "${var.name}-${local.environment}-backend-task"
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  container_definitions = jsonencode([
    {
      "name" : "${var.name}-${local.environment}-backend-container",
      "image" : "${var.container_repository_address}:${var.container_image_tag}",
      "portMappings" : [
        {
          "containerPort" : 8080,
          "hostPort" : 8080,
          "protocol" : "tcp"
        },
        {
          "containerPort" : 5432,
          "hostPort" : 5432,
          "protocol" : "tcp"
        }
      ],
      "healthCheck" : {
        "retries" : 3,
        "command" : [
          "CMD-SHELL",
          "curl -f http://localhost:8080/api/health || exit 1"
        ],
        "timeout" : 5,
        "interval" : 30,
        "startPeriod" : null
      },
      "essential" : true,
      "secrets" : [
        {
          "name" : "DATABASE_URL",
          "valueFrom" : "${aws_secretsmanager_secret.database_secret.arn}"
        },
        {
          "name" : "JWT_SECRET",
          "valueFrom" : "${aws_secretsmanager_secret.jwt_secret.arn}"
        }
      ],
      "environment" : [
        {
          "name" : "PRODUCT",
          "value" : "${var.name}"
        },
        {
          "name" : "ENVIRONMENT",
          "value" : "${local.environment}"
        },
        {
          "name" : "NODE_ENV",
          "value" : "${local.environment}"
        },
        {
          "name" : "CORS_ALLOW_ORIGIN",
          "value" : "${var.cors_allow_origin}"
        }
      ],
      "logConfiguration" : {
        "logDriver" : "awslogs",
        "options" : {
          "awslogs-group" : "${aws_cloudwatch_log_group.log_group.name}",
          "awslogs-region" : "${var.region}",
          "awslogs-stream-prefix" : "ecs"
        }
      },
      "tags" : "${local.tags}"
    }
  ])

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  tags = local.tags
}

resource "aws_ecs_cluster" "app" {
  name = "${var.name}-${local.environment}-backend-cluster"
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
  tags = local.tags
}

resource "aws_ecs_service" "app" {
  name            = "${var.name}-${local.environment}-backend-service"
  cluster         = aws_ecs_cluster.app.id
  launch_type     = "FARGATE"
  task_definition = "${var.name}-${local.environment}-backend-task"
  desired_count   = var.replicas

  network_configuration {
    security_groups  = [aws_security_group.nsg_task.id]
    subnets          = split(",", var.subnets)
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.main.id
    container_name   = "${var.name}-${local.environment}-backend-container"
    container_port   = var.container_port
  }

  tags                    = local.tags
  enable_ecs_managed_tags = true
  propagate_tags          = "SERVICE"

  # workaround for https://github.com/hashicorp/terraform/issues/12634
  depends_on = [aws_alb_listener.https, aws_ecs_task_definition.app]

  # [after initial apply] don't override changes made to task_definition
  # from outside of terraform (i.e.; fargate cli)
  lifecycle {
    ignore_changes = [task_definition]
  }
}
