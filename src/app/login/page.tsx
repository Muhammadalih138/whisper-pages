import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/src/components/LoginForm";

export default function LoginPage() {
  return (
    <section className="auth-layout">
      <div className="auth-copy">
        <p className="eyebrow">Welcome back</p>
        <h1>Step into your writing room.</h1>
        <p>
          Sign in to manage drafts, read saved stories, and keep your role-based
          workspace close at hand.
        </p>
      </div>

      <div className="auth-card">
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="auth-switch">
          New here? <Link href="/signup">Create an account</Link>
        </p>
      </div>
    </section>
  );
}
