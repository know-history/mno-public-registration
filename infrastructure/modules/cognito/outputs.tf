output "user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.id
}

output "user_pool_client_id" {
  description = "ID of the Cognito User Pool Client"
  value       = aws_cognito_user_pool_client.main.id
}

output "user_pool_endpoint" {
  description = "Endpoint of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.endpoint
}

output "identity_pool_id" {
  description = "ID of the Cognito Identity Pool"
  value       = aws_cognito_identity_pool.main.id
}

output "hosted_ui_domain" {
  description = "Domain for the Cognito hosted UI"
  value       = var.create_hosted_ui_domain ? aws_cognito_user_pool_domain.main[0].domain : null
}

output "cognito_domain_url" {
  description = "Full URL for the Cognito hosted UI"
  value       = var.create_hosted_ui_domain ? "https://${aws_cognito_user_pool_domain.main[0].domain}.auth.${data.aws_region.current.name}.amazoncognito.com" : null
}

data "aws_region" "current" {}