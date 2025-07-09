# MNO Public Registration Infrastructure

This repository contains Terraform code for deploying and managing the cloud infrastructure for MNO’s Public Registration system. It provisions:

- AWS RDS PostgreSQL database
- Cognito User Pool for authentication
- S3 storage for document uploads
- n8n and Wappler-compatible app infrastructure
- Tagged AWS resources for cost tracking

## Database Schema

The `database/` folder contains the PostgreSQL schema and ERD for the MNO Public Registration system:

- `schema.sql`: Source-controlled DDL for all normalized tables, enums, indexes, and constraints.
- `erd.svg`: Auto-generated entity relationship diagram reflecting the current schema.

The schema is designed around clear separation of application types (e.g., citizenship, harvesting), with normalized references for document types, relationship types, and multilingual support (English and French). It follows 3NF standards and is optimized for clean join logic and future system scaling.

## Usage

### Secrets & Configuration

Each environment (`dev`, `prod`, etc.) has its own configuration directory under `envs/`.

Before running Terraform, copy the example tfvars files and populate your secrets:

```bash
cp terraform.tfvars.example envs/dev/terraform.tfvars
```

Do the same for envs/prod/ when you're ready.

```bash
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
- `terraform.tfvars` is ignored by Git; never commit secrets!
- Tags are applied to all resources for cost tracking and auditing.
- Each environment can be expanded with additional modules (e.g., Cognito, ECS, SES, etc.)
