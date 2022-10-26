resource "aws_secretsmanager_secret" "database_secret" {
  name                    = "ava-${local.environment}-database"
  description             = "Database connection URL for ${local.environment}"
  recovery_window_in_days = 0
  tags                    = local.tags
}

resource "aws_secretsmanager_secret_version" "set_secret" {
  secret_id     = aws_secretsmanager_secret.database_secret.arn
  secret_string = var.db_url
}
