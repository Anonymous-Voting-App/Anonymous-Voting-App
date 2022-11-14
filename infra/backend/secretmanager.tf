resource "aws_secretsmanager_secret" "database_secret" {
  name                    = "ava-${local.environment}-database"
  description             = "Database connection URL for ${local.environment}"
  recovery_window_in_days = 0
  tags                    = local.tags
}

resource "aws_secretsmanager_secret" "jwt_secret" {
  name                    = "ava-${local.environment}-jwt"
  description             = "JWT secret for ${local.environment}"
  recovery_window_in_days = 0
  tags                    = local.tags
}

resource "aws_secretsmanager_secret_version" "set_db_secret" {
  secret_id     = aws_secretsmanager_secret.database_secret.arn
  secret_string = var.db_url
}

resource "random_string" "jwt_secret" {
  length  = 128
  special = false
}

resource "aws_secretsmanager_secret_version" "set_jwt_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_secret.arn
  secret_string = random_string.jwt_secret.result
}
