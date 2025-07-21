export const USER_ROLES = {
  ADMIN: 'admin',
  RESEARCHER: 'researcher',
  HARVESTING_ADMIN: 'harvesting_admin',
  HARVESTING_CAPTAIN: 'harvesting_captain',
  APPLICANT: 'applicant',
} as const;

export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    'view_all_applications',
    'manage_users',
    'access_admin_tools',
    'view_documents',
    'manage_system',
  ],
  [USER_ROLES.RESEARCHER]: [
    'view_all_applications',
    'view_documents',
    'export_data',
  ],
  [USER_ROLES.HARVESTING_ADMIN]: [
    'view_harvesting_applications',
    'approve_harvesting',
    'manage_harvesting_users',
  ],
  [USER_ROLES.HARVESTING_CAPTAIN]: [
    'view_harvesting_applications',
    'recommend_harvesting',
  ],
  [USER_ROLES.APPLICANT]: [
    'view_own_applications',
    'create_applications',
    'update_profile',
  ],
} as const;

export const APP_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ] as const,
  SESSION_TIMEOUT: 8 * 60 * 60 * 1000,
  PASSWORD_MIN_LENGTH: 8,
  CONFIRMATION_CODE_LENGTH: 6,
} as const;

export const validateEnvironment = () => {
  if (typeof window !== 'undefined') {
    return;
  }

  const requiredEnvVars = [
    'NEXT_PUBLIC_COGNITO_USER_POOL_ID',
    'NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID',
    'NEXT_PUBLIC_AWS_REGION',
    'NEXT_PUBLIC_S3_BUCKET_NAME',
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn(
      `⚠️  Missing environment variables: ${missingVars.join(', ')}\n` +
      '   Create a .env.local file with these variables for full functionality.'
    );
  }
};

if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  validateEnvironment();
}