// Provider configuration
terraform {
  backend "s3" {
    bucket  = "anonymous-voting-app-terraform-state"
    key     = "terraform/backend/terraform.tfstate"
    region  = "eu-north-1"
    profile = "ava-mfa"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "3.4.3"
    }
  }
}

provider "aws" {
  region  = var.region
  profile = var.profile
}
