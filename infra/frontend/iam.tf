resource "aws_iam_policy" "allow_s3_file_upload" {
  name        = "${var.name}-${local.environment}-allow-s3-file-upload"
  path        = "/"
  description = "Allows uploading files to frontend S3"
  depends_on  = [aws_s3_bucket.s3_frontend]
  tags        = local.tags

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowS3FileUploadToStagingBucket",
        Effect = "Allow",
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket"
        ],
        Resource = [
          "${aws_s3_bucket.s3_frontend.arn}/*",
          "${aws_s3_bucket.s3_frontend.arn}"
        ]
      }
    ]
  })
}
