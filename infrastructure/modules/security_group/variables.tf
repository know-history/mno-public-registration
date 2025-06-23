variable "vpc_id" {
  description = "VPC ID to associate security group with"
}

variable "allowed_cidrs" {
  type        = list(string)
  description = "List of allowed CIDR blocks"
}

variable "tags" {
  type        = map(string)
  description = "Tags to apply to the security group"
}
