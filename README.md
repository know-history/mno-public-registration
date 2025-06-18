# MNO Public Registration Infrastructure

This repository contains Terraform code for deploying and managing the cloud infrastructure for MNO’s Public Registration system. It provisions:

- AWS RDS PostgreSQL database
- Cognito User Pool for authentication
- n8n and Wappler-compatible app infrastructure
- Tagged AWS resources for cost tracking

## Usage

### Prerequisites
- Terraform CLI
- AWS CLI with a configured `kh` profile
- GitHub PAT 

### Quickstart

```bash
terraform init
terraform plan -var-file="terraform.tfvars"
terraform apply -var-file="terraform.tfvars"
