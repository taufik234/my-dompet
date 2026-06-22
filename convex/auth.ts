import { Auth } from "convex/server";

/**
 * Helper untuk mendapatkan userId dari Clerk melalui Convex auth.
 * Digunakan di dalam queries dan mutations untuk memastikan data hanya
 * bisa diakses oleh pemiliknya.
 */
export async function getUserId(auth: Auth): Promise<string> {
  const identity = await auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: Not authenticated");
  }
  return identity.subject;
}
