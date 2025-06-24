output "user_pool_id" {
  description = "ID of the created Cognito User Pool"
  value       = aws_cognito_user_pool.this.id
}

output "app_client_id" {
  description = "ID of the App Client associated with the Cognito User Pool"
  value       = aws_cognito_user_pool_client.this.id
}
