import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GetUserCommand,
  GlobalSignOutCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";

interface CognitoConfig {
  region: string;
  userPoolId: string;
  clientId: string;
}

class CognitoAuthError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "CognitoAuthError";
  }
}

const formatCognitoError = (error: any): CognitoAuthError => {
  const errorCode = error.name || error.__type || error.code;
  const errorMessage = error.message || "An unexpected error occurred";

  switch (errorCode) {
    case "UserNotConfirmedException":
      return new CognitoAuthError(
        "Please check your email and confirm your account before signing in.",
        "USER_NOT_CONFIRMED"
      );
    case "NotAuthorizedException":
      return new CognitoAuthError(
        "Invalid email or password. Please try again.",
        "INVALID_CREDENTIALS"
      );
    case "UserNotFoundException":
      return new CognitoAuthError(
        "No account found with this email address.",
        "USER_NOT_FOUND"
      );
    case "UsernameExistsException":
      return new CognitoAuthError(
        "An account with this email already exists.",
        "USER_EXISTS"
      );
    case "InvalidPasswordException":
      return new CognitoAuthError(
        "Password does not meet requirements. Must be at least 8 characters with uppercase, lowercase, number, and special character.",
        "INVALID_PASSWORD"
      );
    case "CodeMismatchException":
      return new CognitoAuthError(
        "Invalid confirmation code. Please try again.",
        "INVALID_CODE"
      );
    case "ExpiredCodeException":
      return new CognitoAuthError(
        "Confirmation code has expired. Please request a new one.",
        "EXPIRED_CODE"
      );
    case "LimitExceededException":
      return new CognitoAuthError(
        "Too many attempts. Please wait before trying again.",
        "RATE_LIMITED"
      );
    case "TooManyRequestsException":
      return new CognitoAuthError(
        "Too many requests. Please wait a moment and try again.",
        "TOO_MANY_REQUESTS"
      );
    case "InvalidParameterException":
      return new CognitoAuthError(
        "Invalid request. Please check your information and try again.",
        "INVALID_PARAMETER"
      );
    default:
      return new CognitoAuthError(errorMessage, "UNKNOWN_ERROR");
  }
};

export class CognitoAuthService {
  private client: CognitoIdentityProviderClient;
  private config: CognitoConfig;

  constructor(config: CognitoConfig) {
    this.config = config;
    this.client = new CognitoIdentityProviderClient({
      region: config.region,
      credentials: undefined, // Let the SDK handle credentials
    });
  }

  async signUp(
    email: string,
    password: string,
    givenName?: string,
    familyName?: string
  ) {
    try {
      const command = new SignUpCommand({
        ClientId: this.config.clientId,
        Username: email.toLowerCase().trim(),
        Password: password,
        UserAttributes: [
          { Name: "email", Value: email.toLowerCase().trim() },
          { Name: "custom:user_role", Value: "applicant" },
          { Name: "given_name", Value: givenName },
          { Name: "family_name", Value: familyName },
        ],
      });

      const response = await this.client.send(command);

      return {
        userSub: response.UserSub,
        needsConfirmation: !response.UserConfirmed,
      };
    } catch (error: any) {
      throw formatCognitoError(error);
    }
  }

  async confirmSignUp(email: string, confirmationCode: string) {
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: this.config.clientId,
        Username: email.toLowerCase().trim(),
        ConfirmationCode: confirmationCode.trim(),
      });

      await this.client.send(command);
      return { success: true };
    } catch (error) {
      throw formatCognitoError(error);
    }
  }

  async signIn(email: string, password: string) {
    try {
      const command = new InitiateAuthCommand({
        ClientId: this.config.clientId,
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
          USERNAME: email.toLowerCase().trim(),
          PASSWORD: password,
        },
      });

      const response = await this.client.send(command);

      if (response.ChallengeName) {
        throw new CognitoAuthError(
          "Additional verification required",
          "CHALLENGE_REQUIRED"
        );
      }

      const tokens = response.AuthenticationResult;
      if (!tokens?.AccessToken) {
        throw new CognitoAuthError("Authentication failed", "AUTH_FAILED");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("mno_access_token", tokens.AccessToken);
        localStorage.setItem("mno_refresh_token", tokens.RefreshToken || "");
        localStorage.setItem("mno_id_token", tokens.IdToken || "");
      }

      return {
        accessToken: tokens.AccessToken,
        refreshToken: tokens.RefreshToken,
        idToken: tokens.IdToken,
      };
    } catch (error) {
      throw formatCognitoError(error);
    }
  }

  async getCurrentUser() {
    try {
      if (typeof window === "undefined") {
        return null;
      }

      const accessToken = localStorage.getItem("mno_access_token");
      if (!accessToken) {
        return null;
      }

      const command = new GetUserCommand({
        AccessToken: accessToken,
      });

      const response = await this.client.send(command);

      const attributes: Record<string, string> = {};
      response.UserAttributes?.forEach((attr) => {
        if (attr.Name && attr.Value) {
          attributes[attr.Name] = attr.Value;
        }
      });

      return {
        username: response.Username,
        attributes,
      };
    } catch (error) {
      this.signOut();
      return null;
    }
  }

  async signOut() {
    try {
      if (typeof window === "undefined") {
        return;
      }

      const accessToken = localStorage.getItem("mno_access_token");

      if (accessToken) {
        try {
          const command = new GlobalSignOutCommand({
            AccessToken: accessToken,
          });
          await this.client.send(command);
        } catch (error) {
          console.warn("Server signout failed:", error);
        }
      }
    } catch (error) {
      console.warn("Signout error:", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("mno_access_token");
        localStorage.removeItem("mno_refresh_token");
        localStorage.removeItem("mno_id_token");
      }
    }
  }

  async forgotPassword(email: string) {
    try {
      const command = new ForgotPasswordCommand({
        ClientId: this.config.clientId,
        Username: email.toLowerCase().trim(),
      });

      await this.client.send(command);
      return { success: true };
    } catch (error) {
      throw formatCognitoError(error);
    }
  }

  async confirmForgotPassword(
    email: string,
    confirmationCode: string,
    newPassword: string
  ) {
    try {
      const command = new ConfirmForgotPasswordCommand({
        ClientId: this.config.clientId,
        Username: email.toLowerCase().trim(),
        ConfirmationCode: confirmationCode.trim(),
        Password: newPassword,
      });

      await this.client.send(command);
      return { success: true };
    } catch (error) {
      throw formatCognitoError(error);
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") {
      return false;
    }
    return !!localStorage.getItem("mno_access_token");
  }
}
