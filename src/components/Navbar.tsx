"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { BookOpen, LayoutDashboard, LogIn, PenLine, Sparkles } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated" && Boolean(session?.user?.email);
  const isAuthor = session?.user?.role === "author";

  async function handleSignOut() {
    await signOut({
      redirect: false,
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span className="brand-mark">
          <Sparkles size={18} aria-hidden="true" />
        </span>
        <span>Whisper Pages</span>
      </Link>

      <nav className="nav-links" aria-label="Primary navigation">
        <Link href="/">
          <BookOpen size={17} aria-hidden="true" />
          Home
        </Link>
        {isSignedIn && (
          <Link href="/dashboard">
            <LayoutDashboard size={17} aria-hidden="true" />
            Dashboard
          </Link>
        )}
        {isAuthor && (
          <Link href="/dashboard/create">
            <PenLine size={17} aria-hidden="true" />
            Write
          </Link>
        )}
      </nav>

      <div className="nav-actions">
        {isSignedIn ? (
          <>
            <div className="user-pill">
              <span>{session.user?.name}</span>
              <small>{session.user?.role ?? "reader"}</small>
            </div>
            <button className="button button-ghost" type="button" onClick={handleSignOut}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link className="button button-ghost" href="/login">
              <LogIn size={16} aria-hidden="true" />
              Login
            </Link>
            <Link className="button button-primary" href="/signup">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
