resource "aws_security_group" "nsg_lb" {
  name        = "${var.name}-${local.environment}-lb"
  description = "Allow connections from external resources while limiting connections from ${var.name}-${local.environment}-lb to internal resources"
  vpc_id      = var.vpc

  tags = local.tags
}

resource "aws_security_group" "nsg_task" {
  name        = "${var.name}-${local.environment}-task"
  description = "Limit connections from internal resources while allowing ${var.name}-${local.environment}-task to connect to all external resources"
  vpc_id      = var.vpc

  tags = local.tags
}

# Rules for the LB (Targets the task SG)
resource "aws_security_group_rule" "nsg_lb_egress_rule" {
  description              = "Only allow SG ${var.name}-${local.environment}-lb to connect to ${var.name}-${local.environment}-task on port ${var.container_port}"
  type                     = "egress"
  from_port                = var.container_port
  to_port                  = var.container_port
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.nsg_task.id

  security_group_id = aws_security_group.nsg_lb.id
}

# Rules for the TASK (Targets the LB SG)
resource "aws_security_group_rule" "nsg_task_ingress_rule" {
  description              = "Only allow connections from SG ${var.name}-${local.environment}-lb on port ${var.container_port}"
  type                     = "ingress"
  from_port                = var.container_port
  to_port                  = var.container_port
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.nsg_lb.id

  security_group_id = aws_security_group.nsg_task.id
}

resource "aws_security_group_rule" "nsg_task_egress_rule" {
  description = "Allows task to establish connections to all resources"
  type        = "egress"
  from_port   = "0"
  to_port     = "0"
  protocol    = "-1"
  cidr_blocks = ["0.0.0.0/0"]

  security_group_id = aws_security_group.nsg_task.id
}
