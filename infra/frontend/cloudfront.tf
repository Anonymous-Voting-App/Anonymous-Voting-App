locals {
  s3_origin_id = aws_s3_bucket.s3_frontend.bucket
  lb_origin_id = "${var.name}-${local.environment}-backend-lb"
}

resource "aws_cloudfront_origin_access_identity" "s3_distribution_oai" {
  comment = "Origin access identity for ${var.name}-${local.environment}"
}

resource "aws_cloudfront_cache_policy" "CachingOptimizedFrontend" {
  name        = "CachingOptimizedFrontend"
  comment     = "Default policy when CF compression is enabled"
  default_ttl = 86400
  max_ttl     = 31536000
  min_ttl     = 1

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true

    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

resource "aws_cloudfront_cache_policy" "CachingDisabledAPICalls" {
  name        = "CachingDisabledAPICalls"
  comment     = "Policy with caching disabled"
  default_ttl = 0
  max_ttl     = 0
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = false
    enable_accept_encoding_gzip   = false

    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.s3_frontend.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.s3_distribution_oai.cloudfront_access_identity_path
    }
  }

  origin {
    domain_name = var.backend_load_balancer_address
    origin_id   = local.lb_origin_id

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for ${var.name}-${local.environment}"
  price_class         = "PriceClass_100"
  default_root_object = "index.html"
  depends_on          = [aws_s3_bucket.s3_frontend, aws_s3_bucket.cdn_access_logs]
  aliases             = ["${var.cloudfront_alias}"]

  logging_config {
    include_cookies = false
    bucket          = aws_s3_bucket.cdn_access_logs.bucket_domain_name
    prefix          = "${var.name}-${local.environment}"
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = aws_cloudfront_cache_policy.CachingOptimizedFrontend.id
    target_origin_id       = local.s3_origin_id
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  ordered_cache_behavior {
    path_pattern           = "/api*"
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = aws_cloudfront_cache_policy.CachingDisabledAPICalls.id
    target_origin_id       = local.lb_origin_id
    compress               = false
    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.cloudfront_alias_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }

  tags = local.tags
}
