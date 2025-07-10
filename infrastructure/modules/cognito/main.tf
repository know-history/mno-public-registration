resource "aws_cognito_user_pool" "main" {
  name = var.user_pool_name

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

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

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  verification_message_template {
    default_email_option  = "CONFIRM_WITH_LINK"
    email_subject_by_link = "Your MNO Registration Account Verification"
    email_message_by_link = "Please click the link below to verify your account: {##Click Here##}"
  }

  tags = var.tags
}

resource "aws_cognito_user_pool_client" "main" {
  name         = var.user_pool_client_name
  user_pool_id = aws_cognito_user_pool.main.id

  generate_secret = false
  
  access_token_validity  = 60
  id_token_validity      = 60
  refresh_token_validity = 30
  
  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }

  allowed_oauth_flows_user_pool_client = false
  
  callback_urls = ["http://localhost:3000"]
  logout_urls   = ["http://localhost:3000"]

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH"
  ]

  prevent_user_existence_errors = "ENABLED"

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

resource "aws_iam_role" "applicant_role" {
  name = "${var.user_pool_name}-applicant-role"

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

resource "aws_iam_role" "researcher_role" {
  name = "${var.user_pool_name}-researcher-role"

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

resource "aws_iam_role" "harvesting_admin_role" {
  name = "${var.user_pool_name}-harvesting-admin-role"

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

resource "aws_iam_role" "harvesting_captain_role" {
  name = "${var.user_pool_name}-harvesting-captain-role"

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

resource "aws_iam_role" "admin_role" {
  name = "${var.user_pool_name}-admin-role"

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

resource "aws_iam_role_policy" "applicant_s3_policy" {
  name = "${var.user_pool_name}-applicant-s3-policy"
  role = aws_iam_role.applicant_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:PutObjectAcl",
          "s3:GetObject",
          "s3:DeleteObject"
        ]
        Resource = "${var.s3_bucket_arn}/applications/*/applicants/$${cognito-identity.amazonaws.com:sub}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = var.s3_bucket_arn
        Condition = {
          StringLike = {
            "s3:prefix" = "applications/*/applicants/$${cognito-identity.amazonaws.com:sub}/*"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "researcher_s3_policy" {
  name = "${var.user_pool_name}-researcher-s3-policy"
  role = aws_iam_role.researcher_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject"
        ]
        Resource = "${var.s3_bucket_arn}/applications/*/applicants/*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = var.s3_bucket_arn
        Condition = {
          StringLike = {
            "s3:prefix" = "applications/*"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "harvesting_admin_s3_policy" {
  name = "${var.user_pool_name}-harvesting-admin-s3-policy"
  role = aws_iam_role.harvesting_admin_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject"
        ]
        Resource = "${var.s3_bucket_arn}/applications/harvesting-*/applicants/*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = var.s3_bucket_arn
        Condition = {
          StringLike = {
            "s3:prefix" = "applications/harvesting-*"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "harvesting_captain_s3_policy" {
  name = "${var.user_pool_name}-harvesting-captain-s3-policy"
  role = aws_iam_role.harvesting_captain_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject"
        ]
        Resource = "${var.s3_bucket_arn}/applications/harvesting-*/applicants/*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = var.s3_bucket_arn
        Condition = {
          StringLike = {
            "s3:prefix" = "applications/harvesting-*"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "admin_s3_policy" {
  name = "${var.user_pool_name}-admin-s3-policy"
  role = aws_iam_role.admin_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:*"
        ]
        Resource = [
          var.s3_bucket_arn,
          "${var.s3_bucket_arn}/*"
        ]
      }
    ]
  })
}

resource "aws_cognito_identity_pool_roles_attachment" "main" {
  identity_pool_id = aws_cognito_identity_pool.main.id

  roles = {
    authenticated = aws_iam_role.applicant_role.arn
  }

  role_mapping {
    identity_provider         = "${aws_cognito_user_pool.main.endpoint}:${aws_cognito_user_pool_client.main.id}"
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

resource "aws_cognito_user" "admin" {
  count        = var.admin_user_email != "" ? 1 : 0
  user_pool_id = aws_cognito_user_pool.main.id
  username     = var.admin_user_email

  attributes = {
    email              = var.admin_user_email
    email_verified     = "true"
    given_name         = "Admin"
    family_name        = "User"
    "custom:user_role" = "admin"
  }

  password       = var.admin_user_password
  message_action = "SUPPRESS"
}