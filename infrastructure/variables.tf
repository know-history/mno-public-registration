variable "aws_region" {
  description = "AWS region to deploy resources in"
  default     = "ca-central-1"
}

variable "aws_profile" {
  description = "AWS CLI profile name"
  default     = "kh"
}

variable "db_identifier" {
  description = "Unique identifier for the RDS instance"
}

variable "db_username" {
  description = "Master username for RDS"
}

variable "db_password" {
  description = "Master password for RDS"
  sensitive   = true
}

variable "allowed_cidrs" {
  type        = list(string)
  description = "List of CIDR blocks to allow PostgreSQL access from"
}

variable "s3_bucket_name" {
  description = "Name of the S3 bucket for document storage"
  type        = string
  default     = ""
}

variable "allowed_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default     = ["http://localhost:3000"]
}

variable "user_pool_name" {
  description = "Name for the Cognito User Pool"
  type        = string
}

variable "app_client_name" {
  description = "Name for the Cognito User Pool Client"
  type        = string
}

variable "admin_user_email" {
  description = "Email for the admin user"
  type        = string
}

variable "admin_user_password" {
  description = "Password for the admin user"
  type        = string
  sensitive   = true
}

variable "website_bucket_name" {
  description = "Name of the S3 bucket for hosting the website"
  type        = string
}

variable "create_deployment_user" {
  description = "Whether to create an IAM user for deployment"
  type        = bool
  default     = true
}

variable "tags" {
  type        = map(string)
  description = "Tags to apply to all resources"
}
