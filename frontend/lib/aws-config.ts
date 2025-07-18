import { Amplify } from 'aws-amplify';

const hasRequiredEnvVars = () => {
  if (typeof window === 'undefined') return false;
  
  const required = [
    'NEXT_PUBLIC_COGNITO_USER_POOL_ID',
    'NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID', 
    'NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID',
    'NEXT_PUBLIC_AWS_REGION',
    'NEXT_PUBLIC_S3_BUCKET_NAME'
  ];
  
  return required.every(varName => {
    const value = process.env[varName];
    return value && value !== 'your-user-pool-id' && value !== 'your-client-id' && value !== 'your-identity-pool-id' && value !== 'your-bucket-name';
  });
};

let amplifyConfigured = false;

if (typeof window !== 'undefined') {
  const hasEnvVars = hasRequiredEnvVars();
  
  if (hasEnvVars) {
    const awsConfig = {
      Auth: {
        Cognito: {
          userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
          userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!,
          identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID!,
        }
      },
      Storage: {
        S3: {
          bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
          region: process.env.NEXT_PUBLIC_AWS_REGION!,
        }
      }
    };

    Amplify.configure(awsConfig);
    amplifyConfigured = true;
  }
}

export default amplifyConfigured;