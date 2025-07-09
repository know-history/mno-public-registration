variable "user_pool_name" {
  description = "Name for the Cognito User Pool"
  type        = string
}

variable "user_pool_client_name" {
  description = "Name for the Cognito User Pool Client"
  type        = string
}

variable "identity_pool_name" {
  description = "Name for the Cognito Identity Pool"
  type        = string
}

variable "callback_urls" {
  description = "List of callback URLs for OAuth"
  type        = list(string)
  default     = ["http://localhost:3000/auth/callback"]
}

variable "logout_urls" {
  description = "List of logout URLs for OAuth"
  type        = list(string)
  default     = ["http://localhost:3000/"]
}

variable "create_hosted_ui_domain" {
  description = "Whether to create a hosted UI domain"
  type        = bool
  default     = false
}

variable "cognito_domain_name" {
  description = "Domain name for Cognito hosted UI"
  type        = string
  default     = ""
}

variable "s3_bucket_arn" {
  description = "ARN of the S3 bucket for user uploads"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}