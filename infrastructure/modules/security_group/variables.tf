variable "vpc_id" {
  description = "VPC ID to associate security group with"
  type        = string
}

variable "allowed_cidrs" {
  type        = list(string)
  description = "List of allowed CIDR blocks"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
