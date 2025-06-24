variable "db_identifier" {
  description = "Unique name for the DB instance"
}

variable "db_username" {
  description = "Master username"
}

variable "db_password" {
  description = "Master password"
  sensitive   = true
}

variable "vpc_security_group_ids" {
  type        = list(string)
  description = "List of security group IDs to attach"
}
