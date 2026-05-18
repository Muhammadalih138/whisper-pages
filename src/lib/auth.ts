import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/src/lib/db";
import { verifyPassword } from "@/src/lib/password";
import { User } from "@/src/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        await connectToDatabase();
        const user = await User.findOne({ email }).lean();

        if (!user?.passwordHash) {
          return null;
        }

        const isValid = await verifyPassword(password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name ?? "",
          email: user.email,
          role: user.role ?? "reader",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
} satisfies NextAuthOptions;
