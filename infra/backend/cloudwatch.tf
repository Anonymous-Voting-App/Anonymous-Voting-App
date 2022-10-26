resource "aws_cloudwatch_log_group" "log_group" {
  name              = "fargate/services/${var.name}-${local.environment}-backend-log-group"
  retention_in_days = var.logs_retention_in_days
  tags              = local.tags
}
