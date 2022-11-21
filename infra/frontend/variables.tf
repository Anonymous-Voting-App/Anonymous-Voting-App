locals {
  environment = terraform.workspace
  tags = {
    environment = terraform.workspace
  }
}

variable "region" {
  type        = string
  description = "AWS region to use"
  default     = "eu-north-1"
}

variable "profile" {
  type        = string
  description = "AWS profile to use"
  default     = "ava-mfa"
}

variable "name" {
  type    = string
  default = "ava"
}

variable "cloudfront_alias" {
  type        = string
  description = "Alias to use for cloudfront"
}

variable "cloudfront_alias_certificate_arn" {
  type        = string
  description = "ARN of the certificate for the cloudfront alias"
}

variable "s3_frontend_expiration_days" {
  default     = 30
  description = "Expiration time for non-current versions"
}

variable "cdn_access_log_expiration_days" {
  default     = 90
  description = "Expiration time for CloudFront access logs"
}

