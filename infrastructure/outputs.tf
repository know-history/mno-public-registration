output "db_endpoint" {
  description = "The database endpoint to connect to"
  value       = module.rds.db_endpoint
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket for document storage"
  value       = module.s3.bucket_name
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = module.s3.bucket_arn
}

output "cognito_user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = module.cognito.user_pool_id
}

output "cognito_user_pool_client_id" {
  description = "ID of the Cognito User Pool Client"
  value       = module.cognito.user_pool_client_id
}

output "cognito_identity_pool_id" {
  description = "ID of the Cognito Identity Pool"
  value       = module.cognito.identity_pool_id
}

output "website_url" {
  description = "URL of the hosted website"
  value       = module.hosting.website_url
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for cache invalidation"
  value       = module.hosting.cloudfront_distribution_id
}

output "deployment_access_key_id" {
  description = "Access key for deployment"
  value       = module.hosting.deployment_access_key_id
}

output "deployment_secret_access_key" {
  description = "Secret key for deployment"
  value       = module.hosting.deployment_secret_access_key
  sensitive   = true
}

output "frontend_env_vars" {
  description = "Environment variables for frontend configuration"
  value = {
    NEXT_PUBLIC_AWS_REGION                  = var.aws_region
    NEXT_PUBLIC_COGNITO_USER_POOL_ID        = module.cognito.user_pool_id
    NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID = module.cognito.user_pool_client_id
    NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID    = module.cognito.identity_pool_id
    NEXT_PUBLIC_S3_BUCKET_NAME              = module.s3.bucket_name
    NEXT_PUBLIC_WEBSITE_URL                 = module.hosting.website_url
    DATABASE_URL                            = "postgresql://${var.db_username}:${var.db_password}@${module.rds.db_endpoint}/postgres"
  }
  sensitive = true
}
