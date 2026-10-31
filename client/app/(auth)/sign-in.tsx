import { useAuth, useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants";

type VerificationStrategy =
  | "email_code"
  | "phone_code"
  | "totp"
  | "backup_code";

export default function SignInScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [verificationStrategy, setVerificationStrategy] =
    useState<VerificationStrategy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  const completeSignIn = async () => {
    if (signIn.status !== "complete") {
      setFeedback({
        message: "Sign-in needs another verification step. Please try again.",
        type: "error",
      });
      return;
    }

    const { error } = await signIn.finalize();
    if (error) {
      setFeedback({ message: error.message, type: "error" });
      return;
    }

    router.replace("/");
  };

  const handleSignIn = async () => {
    const normalizedEmail = emailAddress.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setFeedback({
        message: "Enter your email address and password to continue.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const { error } = await signIn.password({
        emailAddress: normalizedEmail,
        password,
      });

      if (error) {
        setFeedback({ message: error.message, type: "error" });
        return;
      }

      if (signIn.status === "complete") {
        await completeSignIn();
        return;
      }

      if (
        signIn.status === "needs_second_factor" ||
        signIn.status === "needs_client_trust"
      ) {
        const factors = signIn.supportedSecondFactors;
        const availableStrategy: VerificationStrategy | undefined =
          factors.find(
            (factor): factor is typeof factor & { strategy: "email_code" } =>
              factor.strategy === "email_code",
          )?.strategy ??
          factors.find(
            (factor): factor is typeof factor & { strategy: "phone_code" } =>
              factor.strategy === "phone_code",
          )?.strategy ??
          factors.find((factor) => factor.strategy === "totp")?.strategy ??
          factors.find((factor) => factor.strategy === "backup_code")?.strategy;

        if (!availableStrategy) {
          setFeedback({
            message:
              "This account requires a verification method that is not available here.",
            type: "error",
          });
          return;
        }

        setVerificationStrategy(availableStrategy);
        setCode("");

        if (availableStrategy === "email_code") {
          const { error: sendError } = await signIn.mfa.sendEmailCode();
          if (sendError) {
            setFeedback({ message: sendError.message, type: "error" });
          }
        } else if (availableStrategy === "phone_code") {
          const { error: sendError } = await signIn.mfa.sendPhoneCode();
          if (sendError) {
            setFeedback({ message: sendError.message, type: "error" });
          }
        }
        return;
      }

      setFeedback({
        message: "We couldn't complete sign-in. Please try again.",
        type: "error",
      });
    } catch (error) {
      setFeedback({
        message:
          error instanceof Error
            ? error.message
            : "We couldn't sign you in. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.trim();
    if (!verificationStrategy || !verificationCode) {
      setFeedback({
        message: "Enter your verification code to continue.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      let error: Error | null = null;
      switch (verificationStrategy) {
        case "email_code":
          ({ error } = await signIn.mfa.verifyEmailCode({
            code: verificationCode,
          }));
          break;
        case "phone_code":
          ({ error } = await signIn.mfa.verifyPhoneCode({
            code: verificationCode,
          }));
          break;
        case "totp":
          ({ error } = await signIn.mfa.verifyTOTP({
            code: verificationCode,
          }));
          break;
        case "backup_code":
          ({ error } = await signIn.mfa.verifyBackupCode({
            code: verificationCode,
          }));
          break;
      }

      if (error) {
        setFeedback({ message: error.message, type: "error" });
        return;
      }

      await completeSignIn();
    } catch (error) {
      setFeedback({
        message:
          error instanceof Error
            ? error.message
            : "We couldn't verify your sign-in. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (
      verificationStrategy !== "email_code" &&
      verificationStrategy !== "phone_code"
    ) {
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const { error } =
        verificationStrategy === "email_code"
          ? await signIn.mfa.sendEmailCode()
          : await signIn.mfa.sendPhoneCode();

      setFeedback({
        message:
          error?.message ??
          `A new ${verificationStrategy === "email_code" ? "email" : "text"} code was sent.`,
        type: error ? "error" : "success",
      });
    } catch (error) {
      setFeedback({
        message:
          error instanceof Error
            ? error.message
            : "We couldn't resend the verification code. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || isSignedIn) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  const isVerifying = verificationStrategy !== null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.heading}>
              <Text style={styles.eyebrow}>ECO APP</Text>
              <Text style={styles.title}>
                {isVerifying ? "Verify your sign-in" : "Welcome back"}
              </Text>
              <Text style={styles.subtitle}>
                {isVerifying
                  ? `Enter your ${
                      verificationStrategy === "email_code"
                        ? "email"
                        : verificationStrategy === "phone_code"
                          ? "text"
                          : "verification"
                    } code to continue.`
                  : "Sign in to continue shopping and manage your account."}
              </Text>
            </View>

            {isVerifying ? (
              <View style={styles.field}>
                <Text style={styles.label}>
                  {verificationStrategy === "totp"
                    ? "Authenticator code"
                    : verificationStrategy === "backup_code"
                      ? "Backup code"
                      : "Verification code"}
                </Text>
                <TextInput
                  style={[styles.input, styles.codeInput]}
                  value={code}
                  onChangeText={setCode}
                  placeholder="Enter your code"
                  placeholderTextColor="#999"
                  keyboardType={
                    verificationStrategy === "backup_code" ? "default" : "number-pad"
                  }
                  autoCapitalize={
                    verificationStrategy === "backup_code" ? "characters" : "none"
                  }
                  autoComplete="one-time-code"
                  textContentType="oneTimeCode"
                  returnKeyType="done"
                  onSubmitEditing={handleVerify}
                  editable={!isLoading}
                  accessibilityLabel="Sign-in verification code"
                />
              </View>
            ) : (
              <>
                <View style={styles.field}>
                  <Text style={styles.label}>Email address</Text>
                  <TextInput
                    style={styles.input}
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    placeholder="you@example.com"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    returnKeyType="next"
                    editable={!isLoading}
                    accessibilityLabel="Email address"
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="current-password"
                    textContentType="password"
                    returnKeyType="done"
                    onSubmitEditing={handleSignIn}
                    editable={!isLoading}
                    accessibilityLabel="Password"
                  />
                </View>
              </>
            )}

            {feedback ? (
              <Text
                accessibilityRole={
                  feedback.type === "error" ? "alert" : "text"
                }
                style={[
                  styles.message,
                  feedback.type === "success"
                    ? styles.successMessage
                    : styles.errorMessage,
                ]}
              >
                {feedback.message}
              </Text>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                (isLoading || pressed) && styles.submitButtonPressed,
              ]}
              onPress={isVerifying ? handleVerify : handleSignIn}
              disabled={
                isLoading ||
                (isVerifying
                  ? !code.trim()
                  : !emailAddress.trim() || !password)
              }
              accessibilityRole="button"
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isVerifying ? "Verify and sign in" : "Sign in"}
                </Text>
              )}
            </Pressable>

            {isVerifying &&
            (verificationStrategy === "email_code" ||
              verificationStrategy === "phone_code") ? (
              <Pressable
                style={styles.secondaryButton}
                onPress={handleResendCode}
                disabled={isLoading}
                accessibilityRole="button"
              >
                <Text style={styles.secondaryButtonText}>Resend code</Text>
              </Pressable>
            ) : null}

            {!isVerifying ? (
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don&apos;t have an account? </Text>
                <Link href="/sign-up" style={styles.link}>
                  Sign up
                </Link>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View nativeID="clerk-captcha" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    padding: 28,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heading: {
    marginBottom: 30,
  },
  eyebrow: {
    marginBottom: 12,
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.6,
  },
  title: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 8,
    color: COLORS.secondary,
    fontSize: 15,
    lineHeight: 22,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    marginBottom: 8,
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    minHeight: 54,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    color: COLORS.primary,
    fontSize: 16,
  },
  codeInput: {
    textAlign: "center",
    letterSpacing: 4,
  },
  message: {
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
  },
  errorMessage: {
    color: COLORS.error,
  },
  successMessage: {
    color: "#247A45",
  },
  submitButton: {
    minHeight: 54,
    marginTop: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: COLORS.primary,
  },
  submitButtonPressed: {
    opacity: 0.75,
  },
  submitButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    minHeight: 48,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: COLORS.secondary,
    fontSize: 14,
  },
  link: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});
