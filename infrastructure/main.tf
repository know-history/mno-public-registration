provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}

data "aws_vpc" "default" {
  default = true
}

module "s3" {
  source          = "./modules/s3"
  bucket_name     = var.s3_bucket_name != "" ? var.s3_bucket_name : "${var.db_identifier}-documents"
  allowed_origins = var.allowed_origins
  tags            = var.tags
}

module "rds_sg" {
  source        = "./modules/security_group"
  vpc_id        = data.aws_vpc.default.id
  allowed_cidrs = var.allowed_cidrs
  tags          = var.tags
}

module "rds" {
  source                 = "./modules/rds"
  db_identifier          = var.db_identifier
  db_username            = var.db_username
  db_password            = var.db_password
  vpc_security_group_ids = [module.rds_sg.sg_id]
  tags                   = var.tags
}

module "cognito" {
  source                = "./modules/cognito"
  user_pool_name        = var.user_pool_name
  user_pool_client_name = var.app_client_name
  identity_pool_name    = "${var.user_pool_name}-identity"
  admin_user_email      = var.admin_user_email
  admin_user_password   = var.admin_user_password
  s3_bucket_arn         = module.s3.bucket_arn
  tags                  = var.tags
}

module "hosting" {
  source                 = "./modules/hosting"
  website_bucket_name    = var.website_bucket_name
  create_deployment_user = var.create_deployment_user
  tags                   = var.tags
}
