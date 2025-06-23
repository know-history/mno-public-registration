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

variable "tags" {
  type        = map(string)
  description = "Tags to apply to all resources"
}

variable "allowed_cidrs" {
  type        = list(string)
  description = "List of CIDR blocks to allow PostgreSQL access from"
}
