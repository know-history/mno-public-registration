variable "user_pool_name" {
  description = "Name of the Cognito User Pool"
  type        = string
}

variable "user_pool_domain" {
  description = "Friendly name of the Cognito User Pool Domain"
  type        = string
}

variable "app_client_name" {
  description = "Name of the Cognito App Client"
  type        = string
}

variable "callback_urls" {
  description = "OAuth2 callback URLs"
  type        = list(string)
}

variable "logout_urls" {
  description = "OAuth2 logout URLs"
  type        = list(string)
}

variable "admin_user_email" {
  description = "Default Admin user email"
  type        = string
}

variable "admin_user_password" {
  description = "Default Admin user password"
  type        = string
}

variable "cloudflare_api_token" {
  description = "API token with Zone.DNS:Edit permissions"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "The Cloudflare Zone ID for the domain"
  type        = string
}

variable "cognito_custom_domain" {
  description = "Custom domain for Cognito (e.g. auth.example.com)"
  type        = string
}
