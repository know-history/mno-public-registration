import {
  setUpTOTP,
  verifyTOTPSetup,
  fetchMFAPreference,
  updateMFAPreference,
  getCurrentUser,
} from "aws-amplify/auth";

export interface MFAStatus {
  totpEnabled: boolean;
  preferredMFA?: string;
}

export interface TOTPSetupResult {
  qrCodeUrl: string;
  secretKey: string;
}

export const mfaService = {
  async getMFAStatus(): Promise<MFAStatus> {
    try {
      const mfaPreference = await fetchMFAPreference();

      return {
        totpEnabled:
          mfaPreference.enabled?.includes("TOTP") ||
          mfaPreference.preferred === "TOTP",
        preferredMFA: mfaPreference.preferred,
      };
    } catch (error) {
      console.error("Error fetching MFA status:", error);
      return {
        totpEnabled: false,
        preferredMFA: undefined,
      };
    }
  },

  async setupTOTP(): Promise<TOTPSetupResult> {
    try {
      const totpSetup = await setUpTOTP();

      const user = await getCurrentUser();
      const email = user.signInDetails?.loginId || user.username || "User";
      const issuer = "MNO Public Registration";

      const setupUri = totpSetup.getSetupUri(issuer, email);

      const setupUriString = setupUri.toString();
      const urlParams = new URLSearchParams(setupUri.search);
      const secretKey = urlParams.get("secret") || "";

      const qrCodeUrl = setupUriString;

      return {
        qrCodeUrl,
        secretKey,
      };
    } catch (error) {
      console.error("Error setting up TOTP:", error);
      throw error;
    }
  },

  async verifyTOTP(totpCode: string): Promise<void> {
    try {
      await verifyTOTPSetup({ code: totpCode });

      await updateMFAPreference({
        totp: "PREFERRED",
      });
    } catch (error) {
      console.error("Error verifying TOTP:", error);
      throw error;
    }
  },

  async disableTOTP(): Promise<void> {
    try {
      await updateMFAPreference({
        totp: "DISABLED",
      });
    } catch (error) {
      console.error("Error disabling TOTP MFA:", error);
      throw error;
    }
  },
};
