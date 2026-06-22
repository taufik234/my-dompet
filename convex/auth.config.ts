import { AuthConfig } from "convex/server";

/**
 * Konfigurasi autentikasi Convex untuk memverifikasi JWT dari Clerk.
 * Domain menggunakan environment variable CLERK_JWT_ISSUER_DOMAIN.
 */
export default {
  providers: [
    {
      domain: "https://relaxed-gar-6.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
