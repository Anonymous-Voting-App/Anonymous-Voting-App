resource "aws_iam_policy" "allow_access_to_ecr" {
  name        = "${var.name}-${local.environment}-allow-ecr-access"
  path        = "/"
  description = "Allow access to ECR for ${local.environment} environment of ${var.name}"
  depends_on  = [aws_ecr_repository.ecr]
  tags        = local.tags

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid = "AllowImageUploadToECRRepository",
        Action = [
          "ecr:CompleteLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:InitiateLayerUpload",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage"
        ]
        Effect   = "Allow"
        Resource = [aws_ecr_repository.ecr.arn]
      },
      {
        Sid      = "AllowAuthorizationFromAnywhere",
        Action   = ["ecr:GetAuthorizationToken"],
        Effect   = "Allow",
        Resource = "*"
      }
    ]
  })
}
