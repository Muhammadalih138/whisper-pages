"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import type { FormEvent } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("That email and password combination did not work.");
      return;
    }

    router.push(searchParams.get("callbackUrl") ?? "/dashboard");
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div>
        <h2>Login</h2>
        <p>Use your email and password to continue.</p>
      </div>

      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <button className="button button-primary button-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
