"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import type { FormEvent } from "react";

const roles = [
  {
    id: "reader",
    title: "Reader",
    description: "Explore, like, and comment on stories.",
  },
  {
    id: "author",
    title: "Author",
    description: "Create posts and manage your drafts.",
  },
] as const;

export function SignupForm() {
  const router = useRouter();
  const [role, setRole] = useState<(typeof roles)[number]["id"]>("reader");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role,
    };

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.message ?? "Could not create your account.");
      setIsSubmitting(false);
      return;
    }

    const result = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      router.push("/login");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div>
        <h2>Sign up</h2>
        <p>Tell us who you are in the Whisper Pages room.</p>
      </div>

      <label>
        Name
        <input name="name" type="text" autoComplete="name" required />
      </label>

      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>

      <label>
        Password
        <input
          minLength={8}
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
      </label>

      <fieldset className="role-picker">
        <legend>Choose role</legend>
        {roles.map((item) => (
          <label
            className={role === item.id ? "role-option role-option-active" : "role-option"}
            key={item.id}
          >
            <input
              checked={role === item.id}
              name="role"
              type="radio"
              value={item.id}
              onChange={() => setRole(item.id)}
            />
            <span>{item.title}</span>
            <small>{item.description}</small>
          </label>
        ))}
      </fieldset>

      {error && <p className="form-error">{error}</p>}

      <button className="button button-primary button-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
