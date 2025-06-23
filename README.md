# MNO Public Registration Infrastructure

This repository contains Terraform code for deploying and managing the cloud infrastructure for MNO’s Public Registration system. It provisions:

- AWS RDS PostgreSQL database
- Cognito User Pool for authentication
- S3 storage for document uploads
- n8n and Wappler-compatible app infrastructure
- Tagged AWS resources for cost tracking

## Usage

### Secrets & Configuration

Each environment (`dev`, `prod`, etc.) has its own configuration directory under `envs/`.

Before running Terraform, copy the example tfvars files and populate your secrets:

```bash
cp terraform.secret.tfvars.example envs/dev/terraform.secret.tfvars
cp terraform.tfvars.example envs/dev/terraform.tfvars
```

Do the same for envs/prod/ when you're ready.

```bash
cp terraform.secret.tfvars.example envs/prod/terraform.secret.tfvars
cp terraform.tfvars.example envs/prod/terraform.tfvars
```

### Prerequisites
- Terraform CLI
- AWS CLI with a configured `kh` profile
- GitHub PAT 

### Quickstart

Run Terraform for a specific environment:

```bash
./run.sh dev
./run.sh prod
```

This will:
- Use the appropriate tfvars from envs/dev/
- Run `terraform init`, `plan`, and `apply`

### Notes
- `terraform.secret.tfvars` is ignored by Git; never commit secrets!
- Tags are applied to all resources for cost tracking and auditing.
- Each environment can be expanded with additional modules (e.g., Cognito, ECS, SES, etc.)
