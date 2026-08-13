// src/lib/auth.ts

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  /*
   * ============================================================
   * PROVIDERS
   * ============================================================
   */

  providers: [
    /*
     * ----------------------------------------------------------
     * EMAIL + PASSWORD
     * ----------------------------------------------------------
     */
    CredentialsProvider({
      id: "credentials",
      name: "Email & Password",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "admin@jomosbakery.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "••••••••",
        },
      },

      async authorize(credentials) {
        /*
         * 1. Make sure the credentials were supplied.
         */
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();

        try {
          /*
           * 2. Find the user in PostgreSQL.
           */
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          /*
           * 3. Only active administrators are allowed
           *    to authenticate through this provider.
           */
          if (
            !user ||
            !user.active ||
            user.role !== "ADMIN"
          ) {
            return null;
          }

          /*
           * 4. Google-only accounts may not have a password.
           */
          if (!user.passwordHash) {
            return null;
          }

          /*
           * 5. Compare supplied password with bcrypt hash.
           */
          const passwordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (!passwordValid) {
            return null;
          }

          /*
           * 6. Return only safe user information.
           *
           * NEVER return passwordHash here.
           */
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: "admin",
            image: user.image,
          };
        } catch (error) {
          console.error("[Auth] Credentials error:", error);
          return null;
        }
      },
    }),

    /*
     * ----------------------------------------------------------
     * GOOGLE OAUTH
     * ----------------------------------------------------------
     */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",

      /*
       * Keep account linking restrictive.
       */
      allowDangerousEmailAccountLinking: false,
    }),
  ],

  /*
   * ============================================================
   * SESSION CONFIGURATION
   * ============================================================
   */

  session: {
    strategy: "jwt",

    /*
     * Maximum session lifetime:
     * 24 hours
     */
    maxAge: 24 * 60 * 60,

    /*
     * Refresh/update interval:
     * 1 hour
     */
    updateAge: 60 * 60,
  },

  /*
   * ============================================================
   * CALLBACKS
   * ============================================================
   */

  callbacks: {
    /*
     * ----------------------------------------------------------
     * signIn()
     *
     * Runs when a user attempts to authenticate.
     *
     * Credentials:
     *   authorize() has already verified the user.
     *
     * Google:
     *   We must check OUR database to make sure the
     *   Google account belongs to an active admin.
     * ----------------------------------------------------------
     */
    async signIn({ user, account }) {
      try {
        /*
         * Credentials login was already validated
         * inside authorize().
         */
        if (account?.provider === "credentials") {
          return true;
        }

        /*
         * Google login
         */
        if (account?.provider === "google") {
          if (!user.email) {
            return false;
          }

          const email = user.email.trim().toLowerCase();

          /*
           * Find the Google user's email in our
           * PostgreSQL users table.
           */
          const admin = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          /*
           * Authentication by Google does NOT automatically
           * grant administrator privileges.
           */
          if (
            !admin ||
            !admin.active ||
            admin.role !== "ADMIN"
          ) {
            console.warn(
              `[Auth] Unauthorized Google login attempt: ${email}`
            );

            return false;
          }

          /*
           * Replace the Google user data with the
           * authoritative information from our database.
           */
          user.id = admin.id;
          user.role = "admin";
          user.name = admin.name;
          user.image = admin.image;

          console.log(
            `[Auth] Google admin login successful: ${email}`
          );

          return true;
        }

        /*
         * Unknown provider
         */
        return false;
      } catch (error) {
        console.error("[Auth] signIn callback error:", error);
        return false;
      }
    },

    /*
     * ----------------------------------------------------------
     * jwt()
     *
     * Runs when the JWT is created/updated.
     *
     * We copy the user's identity and role into the token.
     * ----------------------------------------------------------
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? undefined;
        token.role = user.role;
      }

      return token;
    },

    /*
     * ----------------------------------------------------------
     * session()
     *
     * Exposes selected JWT information to the application.
     * ----------------------------------------------------------
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.role = token.role ?? "user";

        if (token.email) {
          session.user.email = token.email;
        }
      }

      return session;
    },
  },

  /*
   * ============================================================
   * CUSTOM AUTHENTICATION PAGES
   * ============================================================
   */

  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
    signOut: "/admin/login",
  },

  /*
   * ============================================================
   * EVENTS
   * ============================================================
   */

  events: {
    async signIn({ user, account }) {
      console.log(
        `[Auth Event] signIn - User: ${user.email}, Provider: ${account?.provider}`
      );
    },

    async signOut(message) {
      const email =
        "token" in message
          ? message.token?.email
          : message.session?.user?.email;

      console.log(
        `[Auth Event] signOut - User: ${email ?? "unknown"}`
      );
    },
  },

  /*
   * ============================================================
   * SECURITY
   * ============================================================
   */

  secret: process.env.NEXTAUTH_SECRET,

  useSecureCookies:
    process.env.NODE_ENV === "production",
};