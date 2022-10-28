resource "aws_iam_policy" "allow_logging" {
  name        = "${var.name}-${local.environment}-allow-logging"
  path        = "/"
  description = "Allow logging for Anonymous Voting App"
  depends_on  = [aws_cloudwatch_log_group.log_group]
  tags        = local.tags

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect = "Allow"
        Resource = [
          "${aws_cloudwatch_log_group.log_group.arn}:log-stream:*",
          "${aws_cloudwatch_log_group.log_group.arn}"
        ]
      },
    ]
  })
}

resource "aws_iam_policy" "allow_get_db_secret" {
  name        = "${var.name}-${local.environment}-allow-get-db-secret"
  path        = "/"
  description = "Allows getting DB connection string from Secrets Manager"
  depends_on  = [aws_secretsmanager_secret.database_secret]
  tags        = local.tags

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "secretsmanager:GetSecretValue",
        ]
        Effect   = "Allow"
        Resource = "${aws_secretsmanager_secret.database_secret.arn}"
      },
    ]
  })
}

resource "aws_iam_policy" "allow_ecs_deployment" {
  name        = "${var.name}-${local.environment}-allow-ecs-deployment"
  path        = "/"
  description = "Allows deployment of ECS tasks"
  depends_on = [
    aws_iam_role.ecs_task_execution_role,
    aws_ecs_service.app
  ]
  tags = local.tags

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "RegisterTaskDefinition",
        Effect = "Allow",
        Action = [
          "ecs:RegisterTaskDefinition",
          "ecs:DescribeTaskDefinition",
          "ecs:DeregisterTaskDefinition"
        ],
        Resource = "*"
      },
      {
        Sid    = "PassRolesInTaskDefinition",
        Effect = "Allow",
        Action = [
          "iam:PassRole"
        ],
        Resource = "${aws_iam_role.ecs_task_execution_role.arn}"
      },
      {
        Sid    = "DeployService",
        Effect = "Allow",
        Action = [
          "ecs:UpdateService",
          "ecs:DescribeServices"
        ],
        Resource = "${aws_ecs_service.app.id}"
      }
    ]
  })
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.name}-${local.environment}-ecsTaskExecutionRole"
  tags = local.tags

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "attach_allow_logging" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.allow_logging.arn
}

resource "aws_iam_role_policy_attachment" "attach_allow_get_secret" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.allow_get_db_secret.arn
}
