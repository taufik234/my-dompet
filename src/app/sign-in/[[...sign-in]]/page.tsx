import { SignIn } from "@clerk/nextjs";

/**
 * Halaman Sign In menggunakan Clerk.
 * Redirect otomatis ke dashboard setelah login berhasil.
 */
export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-nb-bg">
      <div className="nb-card bg-white p-8">
        <h2 className="mb-6 text-center text-2xl font-extrabold">
          Masuk ke DompetKu
        </h2>
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border-none",
              formButtonPrimary:
                "nb-btn bg-nb-yellow text-nb-dark border-3 border-black",
            },
          }}
        />
      </div>
    </div>
  );
}
