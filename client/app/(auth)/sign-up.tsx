import { useAuth, useSignUp } from "@clerk/expo";
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

export default function SignUpScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signUp } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
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

  const handleSignUp = async () => {
    const normalizedEmail = emailAddress.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setFeedback({
        message: "Enter your email address and password to continue.",
        type: "error",
      });
      return;
    }
    if (password.length < 8) {
      setFeedback({
        message: "Your password must be at least 8 characters long.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const { error: signUpError } = await signUp.password({
        emailAddress: normalizedEmail,
        password,
      });

      if (signUpError) {
        setFeedback({ message: signUpError.message, type: "error" });
        return;
      }

      setEmailAddress(normalizedEmail);
      setIsVerifying(true);

      const { error: sendError } =
        await signUp.verifications.sendEmailCode();
      if (sendError) {
        setFeedback({
          message: `Your account was created, but the verification email could not be sent. ${sendError.message}`,
          type: "error",
        });
      }
    } catch (error) {
      setFeedback({
        message:
          error instanceof Error
            ? error.message
            : "We couldn't create your account. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.trim();
    if (!verificationCode) {
      setFeedback({
        message: "Enter the verification code sent to your email.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const { error: verifyError } =
        await signUp.verifications.verifyEmailCode({ code: verificationCode });
      if (verifyError) {
        setFeedback({ message: verifyError.message, type: "error" });
        return;
      }

      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        setFeedback({ message: finalizeError.message, type: "error" });
        return;
      }

      router.replace("/");
    } catch (error) {
      setFeedback({
        message:
          error instanceof Error
            ? error.message
            : "We couldn't verify your email. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setFeedback(null);

    try {
      const { error } = await signUp.verifications.sendEmailCode();
      if (error) {
        setFeedback({ message: error.message, type: "error" });
      } else {
        setFeedback({
          message: "A new verification code was sent to your email.",
          type: "success",
        });
      }
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
                {isVerifying ? "Verify your email" : "Create your account"}
              </Text>
              <Text style={styles.subtitle}>
                {isVerifying
                  ? `Enter the code we sent to ${emailAddress}.`
                  : "Sign up to continue shopping and keep everything in one place."}
              </Text>
            </View>

            {isVerifying ? (
              <View style={styles.field}>
                <Text style={styles.label}>Verification code</Text>
                <TextInput
                  style={[styles.input, styles.codeInput]}
                  value={code}
                  onChangeText={setCode}
                  placeholder="Enter your code"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  autoComplete="one-time-code"
                  textContentType="oneTimeCode"
                  returnKeyType="done"
                  onSubmitEditing={handleVerify}
                  editable={!isLoading}
                  accessibilityLabel="Email verification code"
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
                    placeholder="Create a password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="new-password"
                    textContentType="newPassword"
                    returnKeyType="done"
                    onSubmitEditing={handleSignUp}
                    editable={!isLoading}
                    accessibilityLabel="Password"
                  />
                  <Text style={styles.helperText}>
                    Use at least 8 characters.
                  </Text>
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
              onPress={isVerifying ? handleVerify : handleSignUp}
              disabled={
                isLoading ||
                (isVerifying
                  ? !code.trim()
                  : !emailAddress.trim() || password.length < 8)
              }
              accessibilityRole="button"
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isVerifying ? "Verify email" : "Create account"}
                </Text>
              )}
            </Pressable>

            {isVerifying ? (
              <Pressable
                style={styles.secondaryButton}
                onPress={handleResendCode}
                disabled={isLoading}
                accessibilityRole="button"
              >
                <Text style={styles.secondaryButtonText}>Resend code</Text>
              </Pressable>
            ) : (
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Already have an account?{" "}
                </Text>
                <Link href="/sign-in" style={styles.link}>
                  Sign in
                </Link>
              </View>
            )}
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
  helperText: {
    marginTop: 6,
    color: COLORS.secondary,
    fontSize: 12,
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
