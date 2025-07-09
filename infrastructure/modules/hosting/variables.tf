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
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}