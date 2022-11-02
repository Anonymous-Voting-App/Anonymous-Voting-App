# Infrastructure as code

This folder contains different parts of the infrastructure as code.
The infrastructure is defined using Terraform and is configured to use a private S3-bucket to maintain state.

## ECR

Creates an ECR (Elastic Container Registry) for the project to use and creates a policy that allows push to it. The policy needs to be manually linked to a role/user.

Outputs:

-   Used AWS profile
-   Used AWS region
-   Environment
-   ECR repository address

## Backend

Creates a backend for the project, but does not create a database.

Backend includes:

-   Load balancer
-   Target group
-   Automatically scaling ECS (default 1-4 instances)
-   Cloudwatch logging
-   Secrets manager for DB connection string
-   Security groups

Requires:

-   Certificate ARN
-   ECR repository address
-   Container image tag
-   Database connection string
-   Subnets to use
-   VPC to use

Outputs:

-   Used AWS profile
-   Used AWS region
-   Environment
-   The load balancer address

## Frontend

Creates a frontend hosting solution for the project.

Frontend includes:

-   Cloudfront CDN
-   S3 bucket for files
-   /api\* calls are redirected to backend load balancer
-   Access logging

Requires:

-   Alias address to use for Cloudfront
-   ARN of certificate for the alias address (needs to be located in us-east-1)
-   Backend load balancer address

Outputs:

-   Used AWS profile
-   Used AWS region
-   Environment
-   ID of the S3 bucket
-   URL of the CDN
