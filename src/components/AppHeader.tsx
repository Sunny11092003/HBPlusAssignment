import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../constants/theme";

export default function AppHeader() {
  const { user, logout } = useAuth();
  const { width } = useWindowDimensions();
  const compact = width < 640;

  return (
    <View style={styles.header}>
      <View style={styles.inner}>
        <View style={styles.left}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>HB+</Text>
          </View>
          <Text style={styles.brand}>Dashboard</Text>
        </View>

        <View style={styles.right}>
          {!compact && <Text style={styles.email}>{user?.email}</Text>}
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : null}
          <Pressable onPress={logout} style={styles.logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  inner: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    paddingHorizontal: 16,
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: { flexDirection: "row", alignItems: "center", gap: 10 },
  right: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  brand: { fontSize: 16, fontWeight: "700", color: colors.text },
  email: { fontSize: 13, color: colors.muted },
  avatar: { width: 34, height: 34, borderRadius: 17 },
  logout: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  logoutText: { fontSize: 13, fontWeight: "600", color: colors.text },
});