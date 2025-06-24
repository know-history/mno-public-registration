data "aws_vpc" "default" {
  default = true
}

module "rds_sg" {
  source        = "./modules/security_group"
  vpc_id        = data.aws_vpc.default.id
  allowed_cidrs = var.allowed_cidrs
}

module "rds" {
  source                 = "./modules/rds"
  db_identifier          = var.db_identifier
  db_username            = var.db_username
  db_password            = var.db_password
  vpc_security_group_ids = [module.rds_sg.sg_id]
}

module "cognito" {
  source                = "./modules/cognito"
  user_pool_name        = var.user_pool_name
  user_pool_domain      = var.user_pool_domain
  app_client_name       = var.app_client_name
  callback_urls         = var.callback_urls
  logout_urls           = var.logout_urls
  admin_user_email      = var.admin_user_email
  admin_user_password   = var.admin_user_password
  cloudflare_api_token  = var.cloudflare_api_token
  cloudflare_zone_id    = var.cloudflare_zone_id
  cognito_custom_domain = var.cognito_custom_domain
}
