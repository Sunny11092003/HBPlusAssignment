import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Platform } from "react-native";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { saveUser } from "../services/users";
import { isAllowedEmail, DOMAIN_ERROR } from "../utils/domain";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && !isAllowedEmail(firebaseUser.email)) {
        await signOut(auth);
        setUser(null);
        setError(DOMAIN_ERROR);
      } else {
        if (firebaseUser) {
          saveUser(firebaseUser).catch((e) =>
            console.warn("Could not save user", e)
          );
        }
        setUser(firebaseUser);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      if (Platform.OS === "web") {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        await signInWithPopup(auth, provider);
        // Domain check and Firestore save happen in onAuthStateChanged
      } else {
        setError("Mobile sign-in is added in a later step.");
      }
    } catch (e: any) {
      if (e?.code !== "auth/popup-closed-by-user") {
        setError("Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};