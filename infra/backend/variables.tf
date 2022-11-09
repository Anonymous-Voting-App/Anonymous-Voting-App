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

variable "container_port" {
  default = "8080"
}

# The port the load balancer will listen on
variable "lb_port" {
  default = "443"
}

variable "lb_tg_protocol" {
  default = "HTTP"
}

# The load balancer protocol
variable "lb_protocol" {
  default = "HTTPS"
}

variable "logs_retention_in_days" {
  type        = number
  default     = 90
  description = "Specifies the number of days you want to retain log events"
}

variable "db_url" {
  type        = string
  description = "The connection string for the database to be used with the application"
}

variable "cors_allow_origin" {
  type        = string
  description = "The URL to set as Access-Control-Allow-Origin header"
}

variable "container_repository_address" {
  type        = string
  description = "Address of the container repository used"
}

variable "container_image_tag" {
  type        = string
  description = "A tag of the container image to be used"
}

variable "replicas" {
  default     = "1"
  description = "How many containers to run"
}

# The minimum number of containers that should be running.
# Must be at least 1.
# used by autoscale-perf.tf
# For production, consider using at least "2".
variable "ecs_autoscale_min_instances" {
  default     = "1"
  description = "The minimum number of containers that should be running"
}

# The maximum number of containers that should be running.
# used by autoscale-perf.tf
variable "ecs_autoscale_max_instances" {
  default     = "4"
  description = "The maximum number of containers that should be running"
}

# Network configuration

# The VPC to use for the Fargate cluster
variable "vpc" {
  type        = string
  description = "The VPC to use"
}

# The subnets, minimum of 2, that are a part of the VPC(s)
variable "subnets" {
  type        = string
  description = "The subnets to use"
}
