output "aws_profile" {
  value = var.profile
}

output "aws_region" {
  value = var.region
}

output "environment" {
  value = local.environment
}

output "s3_frontend_id" {
  value = aws_s3_bucket.s3_frontend.id
}

output "cdn_url" {
  value = aws_cloudfront_distribution.s3_distribution.domain_name
}
