const ALLOWED_DOMAIN = process.env.EXPO_PUBLIC_ALLOWED_DOMAIN ?? "hbplus.fit";

export const isAllowedEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN.toLowerCase()}`);
};

export const DOMAIN_ERROR =
  "Access restricted. Please login using your official domain email.";