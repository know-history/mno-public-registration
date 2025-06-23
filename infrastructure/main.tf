provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}

data "aws_vpc" "default" {
  default = true
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
