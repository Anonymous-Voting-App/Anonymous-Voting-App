output "aws_profile" {
  value = var.profile
}

output "aws_region" {
  value = var.region
}

output "environment" {
  value = local.environment
}

output "ecr_address" {
  value = aws_ecr_repository.ecr.repository_url
}
