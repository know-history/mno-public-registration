resource "aws_cognito_user_pool" "this" {
  name = var.user_pool_name

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  schema {
    name                = "email"
    attribute_data_type = "String"
    mutable             = true
    required            = true
  }
}

resource "aws_cognito_user_pool_client" "this" {
  name            = var.app_client_name
  user_pool_id    = aws_cognito_user_pool.this.id
  generate_secret = false

  allowed_oauth_flows_user_pool_client = true
  supported_identity_providers         = ["COGNITO"]

  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]

  callback_urls = var.callback_urls
  logout_urls   = var.logout_urls

  allowed_oauth_flows  = ["code"]
  allowed_oauth_scopes = ["email", "openid", "profile"]
}

resource "aws_acm_certificate" "cognito_cert" {
  provider          = aws.us_east_1
  domain_name       = var.cognito_custom_domain
  validation_method = "DNS"
}

resource "cloudflare_record" "cognito_cert_validation" {
  provider = cloudflare

  zone_id = var.cloudflare_zone_id
  name    = aws_acm_certificate.cognito_cert.domain_validation_options[0].resource_record_name
  type    = aws_acm_certificate.cognito_cert.domain_validation_options[0].resource_record_type
  value   = aws_acm_certificate.cognito_cert.domain_validation_options[0].resource_record_value
  ttl     = 300
  proxied = false
}

resource "aws_acm_certificate_validation" "cognito_cert_validation" {
  provider        = aws.us_east_1
  certificate_arn = aws_acm_certificate.cognito_cert.arn

  validation_record_fqdns = [
    cloudflare_record.cognito_cert_validation.fqdn
  ]
}

resource "aws_cognito_user_pool_domain" "this" {
  domain       = var.user_pool_domain
  user_pool_id = aws_cognito_user_pool.this.id
}

resource "aws_cognito_user" "admin_user" {
  user_pool_id = aws_cognito_user_pool.this.id
  username     = "admin"

  attributes = {
    email          = var.admin_user_email
    email_verified = "true"
  }

  password             = var.admin_user_password
  force_alias_creation = false
  message_action       = "SUPPRESS"
}
