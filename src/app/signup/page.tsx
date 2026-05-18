import Link from "next/link";
import { SignupForm } from "@/src/components/SignupForm";

export default function SignupPage() {
  return (
    <section className="auth-layout">
      <div className="auth-copy">
        <p className="eyebrow">Create your account</p>
        <h1>Choose your role and start with the right tools.</h1>
        <p>
          Readers can follow the conversation, while authors can create drafts,
          publish posts, and manage their work.
        </p>
      </div>

      <div className="auth-card">
        <SignupForm />
        <p className="auth-switch">
          Already registered? <Link href="/login">Login instead</Link>
        </p>
      </div>
    </section>
  );
}
