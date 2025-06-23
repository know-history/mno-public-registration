#!/usr/bin/env bash

set -e

ENV="$1"

if [ -z "$ENV" ]; then
  echo "❌ Usage: ./run.sh [dev|prod]"
  exit 1
fi

echo "🚀 Starting Terraform Apply for '$ENV' environment..."

cd "$(dirname "$0")"

VARS_FILE="envs/$ENV/terraform.tfvars"
SECRETS_FILE="envs/$ENV/terraform.secret.tfvars"

if [ ! -f "$VARS_FILE" ]; then
  echo "❌ $VARS_FILE not found."
  exit 1
fi

if [ ! -f "$SECRETS_FILE" ]; then
  echo "❌ $SECRETS_FILE not found. Make sure your secrets file exists and is excluded from Git."
  exit 1
fi

echo "🔄 Running terraform init..."
terraform init

echo "📋 Running terraform plan..."
terraform plan \
  -var-file="$VARS_FILE" \
  -var-file="$SECRETS_FILE"

echo "⚠️  Applying changes to AWS (press 'yes' to confirm)..."
terraform apply \
  -var-file="$VARS_FILE" \
  -var-file="$SECRETS_FILE"

echo "✅ Terraform apply complete!"
