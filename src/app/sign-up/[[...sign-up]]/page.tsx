import { SignUp } from "@clerk/nextjs";

/**
 * Halaman Sign Up menggunakan Clerk.
 */
export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-nb-bg">
      <div className="nb-card bg-white p-8">
        <h2 className="mb-6 text-center text-2xl font-extrabold">
          Daftar DompetKu
        </h2>
        <SignUp
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
