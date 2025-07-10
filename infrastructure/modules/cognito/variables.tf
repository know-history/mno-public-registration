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

variable "admin_user_email" {
  description = "Email for the admin user"
  type        = string
  default     = ""
}

variable "admin_user_password" {
  description = "Password for the admin user"
  type        = string
  default     = ""
  sensitive   = true
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
