# bucket for storing frontend files
resource "aws_s3_bucket" "s3_frontend" {
  bucket        = "${var.name}-${local.environment}-s3-frontend"
  tags          = local.tags
  force_destroy = true
}

resource "aws_s3_bucket_acl" "s3_frontend_acl" {
  bucket = aws_s3_bucket.s3_frontend.id
  acl    = "private"
}

resource "aws_s3_bucket_versioning" "s3_frontend_versioning" {
  bucket = aws_s3_bucket.s3_frontend.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "s3_frontend_lifecycle_configuration" {
  bucket = aws_s3_bucket.s3_frontend.id


  rule {
    id     = "cleanup"
    status = "Enabled"

    filter {
      prefix = ""
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }

    noncurrent_version_expiration {
      newer_noncurrent_versions = 3
      noncurrent_days           = var.s3_frontend_expiration_days
    }
  }
}

data "aws_iam_policy_document" "s3_frontend_get_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.s3_frontend.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = ["${aws_cloudfront_origin_access_identity.s3_distribution_oai.iam_arn}"]
    }
  }

  statement {
    actions   = ["s3:ListBucket"]
    resources = ["${aws_s3_bucket.s3_frontend.arn}"]

    principals {
      type        = "AWS"
      identifiers = ["${aws_cloudfront_origin_access_identity.s3_distribution_oai.iam_arn}"]
    }
  }
}

resource "aws_s3_bucket_policy" "s3_frontend_attach_get_policy" {
  bucket = aws_s3_bucket.s3_frontend.id
  policy = data.aws_iam_policy_document.s3_frontend_get_policy.json
  depends_on = [
    aws_s3_bucket.s3_frontend,
    aws_cloudfront_origin_access_identity.s3_distribution_oai
  ]
}

# bucket for storing Cloudfront access logs
resource "aws_s3_bucket" "cdn_access_logs" {
  bucket        = "${var.name}-${local.environment}-cdn-access-logs"
  tags          = local.tags
  force_destroy = true
}

resource "aws_s3_bucket_acl" "cdn_access_logs_acl" {
  bucket = aws_s3_bucket.cdn_access_logs.bucket
  acl    = "private"
}

resource "aws_s3_bucket_lifecycle_configuration" "cdn_access_logs_lifecycle_configuration" {
  bucket = aws_s3_bucket.cdn_access_logs.bucket

  rule {
    id     = "cleanup"
    status = "Enabled"

    filter {
      prefix = ""
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }

    expiration {
      days = var.cdn_access_log_expiration_days
    }
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "cdn_access_logs_encryption" {
  bucket = aws_s3_bucket.cdn_access_logs.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

data "aws_iam_policy_document" "cdn_access_logs_policy" {
  statement {
    actions   = ["s3:GetObject", "s3:PutObject"]
    resources = ["${aws_s3_bucket.cdn_access_logs.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = ["${aws_cloudfront_origin_access_identity.s3_distribution_oai.iam_arn}"]
    }
  }

  statement {
    actions   = ["s3:ListBucket"]
    resources = ["${aws_s3_bucket.cdn_access_logs.arn}"]

    principals {
      type        = "AWS"
      identifiers = ["${aws_cloudfront_origin_access_identity.s3_distribution_oai.iam_arn}"]
    }
  }
}

resource "aws_s3_bucket_policy" "cdn_access_attach_logs_policy" {
  bucket = aws_s3_bucket.cdn_access_logs.id
  policy = data.aws_iam_policy_document.cdn_access_logs_policy.json
  depends_on = [
    aws_s3_bucket.cdn_access_logs,
    aws_cloudfront_origin_access_identity.s3_distribution_oai
  ]
}
