variable "vpc_id" {
  description = "VPC ID to associate security group with"
}

variable "allowed_cidrs" {
  type        = list(string)
  description = "List of allowed CIDR blocks"
}
