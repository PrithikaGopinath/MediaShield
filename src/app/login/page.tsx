"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <button
        onClick={() => signIn("auth0", { callbackUrl: "/upload" })}
        className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded text-sm font-medium"
      >
        Sign in with Auth0
      </button>
    </main>
  );
}
