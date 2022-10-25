output "aws_profile" {
  value = var.profile
}

output "aws_region" {
  value = var.region
}

output "environment" {
  value = local.environment
}

# The load balancer DNS name
output "lb_dns" {
  value = aws_alb.main.dns_name
}
