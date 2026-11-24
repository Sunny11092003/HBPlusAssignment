import { Redirect } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";

const DOMAIN = process.env.EXPO_PUBLIC_ALLOWED_DOMAIN ?? "hbplus.fit";

export default function Login() {
  const { user, loading, error, login, clearError } = useAuth();

  if (user) return <Redirect href="/dashboard" />;

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Sign in with your official HB+ account to continue.
        </Text>

        {error && (
          <Pressable onPress={clearError} style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </Pressable>
        )}

        <Pressable
          onPress={login}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            (pressed || loading) && styles.buttonDim,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login with Google</Text>
          )}
        </Pressable>

        <Text style={styles.hint}>Only @{DOMAIN} accounts are allowed.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  title: { fontSize: 26, fontWeight: "700", color: "#111827", marginBottom: 6 },
  subtitle: { fontSize: 15, color: "#6B7280", marginBottom: 24, lineHeight: 22 },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: "#B91C1C", fontSize: 14 },
  button: {
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDim: { opacity: 0.7 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  hint: { marginTop: 16, fontSize: 12, color: "#9CA3AF", textAlign: "center" },
});