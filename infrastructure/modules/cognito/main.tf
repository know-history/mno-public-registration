resource "aws_cognito_user_pool" "main" {
  name = var.user_pool_name

  # Password policy
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  # Username configuration
  username_attributes = ["email"]
  
  # Auto-verified attributes
  auto_verified_attributes = ["email"]

  # Account recovery settings
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  # Schema for additional user attributes
  schema {
    attribute_data_type = "String"
    name               = "email"
    required           = true
    mutable            = true
  }

  schema {
    attribute_data_type = "String"
    name               = "given_name"
    required           = false
    mutable            = true
  }

  schema {
    attribute_data_type = "String"
    name               = "family_name"
    required           = false
    mutable            = true
  }

  schema {
    attribute_data_type = "String"
    name               = "user_role"
    required           = false
    mutable            = true
    
    string_attribute_constraints {
      min_length = 1
      max_length = 20
    }
  }

  # Email configuration
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  # Verification message templates
  verification_message_template {
    default_email_option  = "CONFIRM_WITH_LINK"
    email_subject_by_link = "Your MNO Registration Account Verification"
    email_message_by_link = "Please click the link below to verify your account: {##Click Here##}"
  }

  tags = var.tags
}

# User Pool Client
resource "aws_cognito_user_pool_client" "main" {
  name         = var.user_pool_client_name
  user_pool_id = aws_cognito_user_pool.main.id

  # Client settings
  generate_secret = false
  
  # Token validity
  access_token_validity  = 60    # 1 hour
  id_token_validity      = 60    # 1 hour
  refresh_token_validity = 30    # 30 days
  
  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }

  # OAuth settings - only for API access, not hosted UI
  allowed_oauth_flows_user_pool_client = false
  
  # Callback URLs (not used since no hosted UI, but required by AWS)
  callback_urls = ["http://localhost:3000"]
  logout_urls   = ["http://localhost:3000"]

  # Explicit auth flows - for direct API access
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH"
  ]

  # Prevent user existence errors
  prevent_user_existence_errors = "ENABLED"

  # Read and write attributes
  read_attributes = [
    "email",
    "email_verified",
    "given_name",
    "family_name",
    "custom:user_role"
  ]

  write_attributes = [
    "email",
    "given_name",
    "family_name",
    "custom:user_role"
  ]
}

# Identity Pool for AWS resource access
resource "aws_cognito_identity_pool" "main" {
  identity_pool_name               = var.identity_pool_name
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.main.id
    provider_name           = aws_cognito_user_pool.main.endpoint
    server_side_token_check = false
  }

  tags = var.tags
}

# IAM roles for authenticated and unauthenticated users
resource "aws_iam_role" "authenticated" {
  name = "${var.user_pool_name}-authenticated-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.main.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "authenticated"
          }
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy" "authenticated" {
  name = "${var.user_pool_name}-authenticated-policy"
  role = aws_iam_role.authenticated.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Resource = "${var.s3_bucket_arn}/applications/*/applicants/${cognito-identity.amazonaws.com:sub}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = var.s3_bucket_arn
        Condition = {
          StringLike = {
            "s3:prefix" = "applications/*/applicants/${cognito-identity.amazonaws.com:sub}/*"
          }
        }
      }
    ]
  })
}

# Attach roles to identity pool with role mapping
resource "aws_cognito_identity_pool_roles_attachment" "main" {
  identity_pool_id = aws_cognito_identity_pool.main.id

  roles = {
    authenticated = aws_iam_role.applicant_role.arn
  }

  role_mapping {
    identity_provider         = aws_cognito_user_pool.main.endpoint
    ambiguous_role_resolution = "AuthenticatedRole"
    type                     = "Rules"

    mapping_rule {
      claim      = "custom:user_role"
      match_type = "Equals"
      value      = "applicant"
      role_arn   = aws_iam_role.applicant_role.arn
    }

    mapping_rule {
      claim      = "custom:user_role"
      match_type = "Equals"
      value      = "researcher"
      role_arn   = aws_iam_role.researcher_role.arn
    }

    mapping_rule {
      claim      = "custom:user_role"
      match_type = "Equals"
      value      = "harvesting_admin"
      role_arn   = aws_iam_role.harvesting_admin_role.arn
    }

    mapping_rule {
      claim      = "custom:user_role"
      match_type = "Equals"
      value      = "harvesting_captain"
      role_arn   = aws_iam_role.harvesting_captain_role.arn
    }

    mapping_rule {
      claim      = "custom:user_role"
      match_type = "Equals"
      value      = "admin"
      role_arn   = aws_iam_role.admin_role.arn
    }
  }
}

# Create admin user
resource "aws_cognito_user" "admin" {
  count        = var.admin_user_email != "" ? 1 : 0
  user_pool_id = aws_cognito_user_pool.main.id
  username     = var.admin_user_email

  attributes = {
    email          = var.admin_user_email
    email_verified = true
    given_name     = "Admin"
    family_name    = "User"
    "custom:user_role" = "admin"
  }

  temporary_password = var.admin_user_password
  message_action     = "SUPPRESS"  # Don't send welcome email
}

# Set permanent password for admin user
resource "aws_cognito_user" "admin_permanent_password" {
  count        = var.admin_user_email != "" ? 1 : 0
  user_pool_id = aws_cognito_user_pool.main.id
  username     = var.admin_user_email
  password     = var.admin_user_password

  depends_on = [aws_cognito_user.admin]

  lifecycle {
    ignore_changes = [
      temporary_password,
      message_action
    ]
  }
}