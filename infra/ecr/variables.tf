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

