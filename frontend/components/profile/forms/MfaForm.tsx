"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Shield,
  Check,
  AlertTriangle,
  Info,
  Copy,
  CheckCircle,
  Smartphone,
} from "lucide-react";
import {
  FormField,
  SubmitButton,
  ErrorAlert,
  SuccessAlert,
} from "@/components/ui/shared";
import {
  mfaService,
  type MFAStatus,
  type TOTPSetupResult,
} from "@/lib/auth/services/mfaService";
import QRCode from "qrcode";

const totpSchema = z.object({
  totp_code: z
    .string()
    .min(6, "Code must be 6 digits")
    .max(6, "Code must be 6 digits")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});

type TOTPFormData = z.infer<typeof totpSchema>;

interface MFAFormProps {
  onSuccess?: () => void;
}

export function MFAForm({ onSuccess }: MFAFormProps) {
  const [loading, setLoading] = useState(false);
  const [mfaStatus, setMFAStatus] = useState<MFAStatus | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [setupMode, setSetupMode] = useState<boolean>(false);
  const [totpSetup, setTotpSetup] = useState<TOTPSetupResult | null>(null);
  const [secretCopied, setSecretCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  const totpForm = useForm<TOTPFormData>({
    resolver: zodResolver(totpSchema),
    defaultValues: { totp_code: "" },
  });

  useEffect(() => {
    loadMFAStatus();
  }, []);

  const loadMFAStatus = async () => {
    try {
      setLoading(true);
      const status = await mfaService.getMFAStatus();
      setMFAStatus(status);
    } catch (error) {
      setErrorMessage("Failed to load MFA settings");
    } finally {
      setLoading(false);
    }
  };

  const handleTOTPSetup = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const setup = await mfaService.setupTOTP();
      setTotpSetup(setup);

      try {
        const qrDataUrl = QRCode.toDataURL(setup.qrCodeUrl, {
          errorCorrectionLevel: "M",
          type: "image/png",
          quality: 0.92,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
          width: 256,
        });
        setQrCodeDataUrl(qrDataUrl);
      } catch (qrError) {
        console.error("Error generating QR code:", qrError);
        setErrorMessage(
          "Failed to generate QR code, but you can still use the manual setup key"
        );
      }

      setSetupMode(true);
    } catch (error) {
      setErrorMessage("Failed to setup authenticator app");
    } finally {
      setLoading(false);
    }
  };

  const handleTOTPVerify = async (data: TOTPFormData) => {
    try {
      setLoading(true);
      setErrorMessage("");

      await mfaService.verifyTOTP(data.totp_code);
      setSuccessMessage("Authenticator app setup successfully!");
      setSetupMode(false);
      setTotpSetup(null);
      totpForm.reset();
      await loadMFAStatus();
      onSuccess?.();
    } catch (error) {
      setErrorMessage("Invalid authenticator code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisableTOTP = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      await mfaService.disableTOTP();
      setSuccessMessage("Two-factor authentication disabled successfully!");
      await loadMFAStatus();
      onSuccess?.();
    } catch (error) {
      setErrorMessage("Failed to disable two-factor authentication");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSecretCopied(true);
      setTimeout(() => setSecretCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const dismissError = useCallback(() => setErrorMessage(""), []);
  const dismissSuccess = useCallback(() => setSuccessMessage(""), []);

  if (loading && !mfaStatus) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading security settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <SuccessAlert message={successMessage} onDismiss={dismissSuccess} />
      )}
      {errorMessage && (
        <ErrorAlert message={errorMessage} onDismiss={dismissError} />
      )}

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield
            className={`w-6 h-6 ${mfaStatus?.totpEnabled ? "text-green-600" : "text-gray-400"}`}
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-600">
              {mfaStatus?.totpEnabled
                ? "Your account is protected with two-factor authentication"
                : "Add an extra layer of security to your account"}
            </p>
          </div>
        </div>

        {!mfaStatus?.totpEnabled && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700 mb-2">
                  Two-factor authentication is currently disabled. Enable it to
                  add an extra layer of security to your account.
                </p>
                <p className="text-xs text-blue-600">
                  Works with Google Authenticator, Authy, 1Password, and other
                  authenticator apps.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-gray-600" />
            <div>
              <h4 className="font-medium text-gray-900">Authenticator App</h4>
              <p className="text-sm text-gray-600">
                Use an authenticator app like Google Authenticator, Authy, or
                1Password for secure login codes.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {mfaStatus?.totpEnabled ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  Enabled
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-500">Disabled</span>
            )}
          </div>
        </div>

        {setupMode && totpSetup ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 mb-3">
                Scan this QR code with your authenticator app, then enter the
                6-digit code to verify setup.
              </p>

              <div className="bg-white border-2 border-gray-300 rounded-lg p-4 text-center mb-4">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="QR Code for TOTP setup"
                    className="mx-auto"
                    style={{ maxWidth: "256px", height: "auto" }}
                  />
                ) : (
                  <div className="p-8">
                    <div className="w-16 h-16 bg-gray-200 rounded mx-auto mb-2 flex items-center justify-center">
                      <Smartphone className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Generating QR code...
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-2">
                  Can't scan? Enter this code manually in your app:
                </p>
                <div className="flex items-center gap-2">
                  <code className="bg-white px-2 py-1 rounded text-xs font-mono flex-1 break-all">
                    {totpSetup.secretKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(totpSetup.secretKey)}
                    className="px-2 py-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                  >
                    {secretCopied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <FormProvider {...totpForm}>
              <form
                onSubmit={totpForm.handleSubmit(handleTOTPVerify)}
                className="space-y-4"
              >
                <FormField
                  name="totp_code"
                  label="Verification Code"
                  placeholder="Enter 6-digit code"
                  required
                />

                <div className="flex gap-2">
                  <SubmitButton
                    loading={loading}
                    text="Verify & Enable"
                    loadingText="Verifying..."
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSetupMode(false);
                      setTotpSetup(null);
                      setQrCodeDataUrl("");
                      totpForm.reset();
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        ) : (
          <div className="flex gap-2">
            {!mfaStatus?.totpEnabled ? (
              <button
                onClick={handleTOTPSetup}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? "Setting up..." : "Setup Two-Factor Auth"}
              </button>
            ) : (
              <button
                onClick={handleDisableTOTP}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400"
              >
                {loading ? "Disabling..." : "Disable Two-Factor Auth"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-medium text-gray-900 mb-1">How it works</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • Download an authenticator app like Google Authenticator or
                Authy
              </li>
              <li>• Scan the QR code or enter the setup key manually</li>
              <li>• Enter the 6-digit code from your app to verify</li>
              <li>• You'll need this code every time you sign in</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
