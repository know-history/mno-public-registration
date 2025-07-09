#!/usr/bin/env bash

set -e

ENV="$1"

if [ -z "$ENV" ]; then
  echo "Usage: ./run.sh [dev|prod]"
  exit 1
fi

echo "Starting Terraform Apply for '$ENV' environment..."

cd "$(dirname "$0")"

VARS_FILE="envs/$ENV/terraform.tfvars"

if [ ! -f "$VARS_FILE" ]; then
  echo "$VARS_FILE not found."
  exit 1
fi

echo "Running terraform init..."
terraform init

echo "Running terraform plan..."
terraform plan \
  -var-file="$VARS_FILE"

echo "Applying changes to AWS (press 'yes' to confirm)..."
terraform apply \
  -var-file="$VARS_FILE"

echo "Terraform apply complete!"