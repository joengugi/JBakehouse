// lib/auth.ts

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

/**
 * NextAuth configuration
 *
 * Authentication methods:
 * 1. Email + Password
 * 2. Google OAuth
 *
 * Authorization:
 * - Only active users with role ADMIN can access
 *   the administration system.
 *
 * Session:
 * - JWT-based
 */
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
         * Step 1:
         * Make sure credentials were supplied.
         */
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();

        try {
          /*
           * Step 2:
           * Find the user in PostgreSQL.
           */
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          /*
           * Step 3:
           * The user must:
           * - exist
           * - be active
           * - have ADMIN privileges
           */
          if (
            !user ||
            !user.active ||
            user.role !== "ADMIN"
          ) {
            return null;
          }

          /*
           * Step 4:
           * Credentials-based users need a password hash.
           *
           * Google-only accounts may have null passwordHash.
           */
          if (!user.passwordHash) {
            return null;
          }

          /*
           * Step 5:
           * Compare the supplied password with the
           * bcrypt hash stored in PostgreSQL.
           */
          const passwordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (!passwordValid) {
            return null;
          }

          /*
           * Step 6:
           * Return only safe user information.
           *
           * Never return passwordHash.
           */
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: "admin",
            image: user.image,
          };
        } catch (error) {
          console.error(
            "[NextAuth] Credentials authorization error:",
            error
          );

          /*
           * Do not expose database errors to the user.
           */
          return null;
        }
      },
    }),

    /*
     * ----------------------------------------------------------
     * GOOGLE OAUTH
     * ----------------------------------------------------------
     *
     * Google authentication is only enabled when both
     * Google environment variables exist.
     *
     * This allows credentials login to work locally before
     * Google OAuth has been configured.
     * ----------------------------------------------------------
     */
    ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            /*
             * Do not automatically link accounts based only
             * on an email match.
             */
            allowDangerousEmailAccountLinking: false,
          }),
        ]
      : []),
  ],

  /*
   * ============================================================
   * SESSION
   * ============================================================
   */
  session: {
    /*
     * We are using JWT sessions rather than database sessions.
     */
    strategy: "jwt",

    /*
     * Maximum session lifetime: 24 hours.
     */
    maxAge: 24 * 60 * 60,

    /*
     * Update the session token approximately every hour.
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
     * Determines whether authentication should be allowed.
     *
     * Credentials:
     * authorize() has already completed all checks.
     *
     * Google:
     * Google confirms identity, but PostgreSQL determines
     * whether the account has administrator privileges.
     * ----------------------------------------------------------
     */
    async signIn({ user, account }) {
      try {
        /*
         * ------------------------------------------------------
         * Credentials login
         * ------------------------------------------------------
         *
         * authorize() already verified:
         * - user exists
         * - account is active
         * - role is ADMIN
         * - password is correct
         */
        if (account?.provider === "credentials") {
          return true;
        }

        /*
         * ------------------------------------------------------
         * Google login
         * ------------------------------------------------------
         */
        if (account?.provider === "google") {
          /*
           * Google must provide an email address.
           */
          if (!user.email) {
            return false;
          }

          const email = user.email.trim().toLowerCase();

          /*
           * Find the corresponding account in our
           * PostgreSQL database.
           */
          const admin = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          /*
           * Google authentication alone is NOT enough.
           *
           * The account must:
           * - exist in our database
           * - be active
           * - have ADMIN role
           */
          if (
            !admin ||
            !admin.active ||
            admin.role !== "ADMIN"
          ) {
            console.warn(
              `[NextAuth] Unauthorized Google login attempt: ${email}`
            );

            return false;
          }

          /*
           * PostgreSQL is our authoritative source for
           * application identity and role.
           */
          user.id = admin.id;
          user.name = admin.name;
          user.email = admin.email;
          user.role = "admin";
          user.image = admin.image;

          console.log(
            `[NextAuth] Google admin login successful: ${email}`
          );

          return true;
        }

        /*
         * Unknown/unconfigured provider.
         */
        return false;
      } catch (error) {
        console.error(
          "[NextAuth] signIn callback error:",
          error
        );

        return false;
      }
    },

    /*
     * ----------------------------------------------------------
     * jwt()
     *
     * Runs when a JWT is created or updated.
     *
     * We copy only the information needed later.
     * ----------------------------------------------------------
     */
    async jwt({ token, user }) {
      /*
       * `user` is available during the initial sign-in.
       */
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
     * Makes selected JWT information available through
     * `session.user`.
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
   * CUSTOM PAGES
   * ============================================================
   *
   * These routes should eventually exist:
   *
   * /admin/login
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
   *
   * Useful for development/debugging.
   * Avoid logging passwords, tokens, or other secrets.
   * ============================================================
   */
  events: {
    async signIn({ user, account }) {
      console.log(
        `[NextAuth] Sign-in successful - User: ${user.email}, Provider: ${account?.provider}`
      );
    },

    async signOut(message) {
      const email =
        message.token?.email ??
        message.session?.user?.email ??
        "unknown";

      console.log(
        `[NextAuth] Sign-out - User: ${email}`
      );
    },
  },

  /*
   * ============================================================
   * SECURITY
   * ============================================================
   */
  secret: process.env.NEXTAUTH_SECRET,

  /*
   * Only use secure cookies once the application is running
   * over HTTPS in production.
   */
  useSecureCookies:
    process.env.NODE_ENV === "production",

  /*
   * Keep this false during development.
   */
  debug: process.env.NODE_ENV === "development",
};