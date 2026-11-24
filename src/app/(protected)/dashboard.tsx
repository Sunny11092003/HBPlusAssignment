import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [imgFailed, setImgFailed] = useState(false);
  const initial = (user?.displayName ?? user?.email ?? "U")[0].toUpperCase();

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        {user?.photoURL && !imgFailed ? (
          <Image
            source={{ uri: user.photoURL }}
            style={styles.avatar}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        )}

        <Text style={styles.title}>Hello, {user?.displayName ?? "there"}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <Pressable onPress={logout} style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
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
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  avatar: { width: 72, height: 72, borderRadius: 36, marginBottom: 16 },
  avatarFallback: {
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 28, fontWeight: "800", color: "#4F46E5" },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  email: { fontSize: 14, color: "#6B7280", marginTop: 4, marginBottom: 24 },
  button: {
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});