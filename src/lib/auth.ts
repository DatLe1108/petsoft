import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./db";
import bcrypt from "bcryptjs";

const config = {
  pages: {
    signIn: "/login",
  },
  //session here is default value already, add here just to understand more
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    strategy: "jwt",
  },
  //How the user would login (email, google, etc)
  providers: [
    Credentials({
      async authorize(credentials) {
        //run on login
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          console.log("User not found");
          return null;
        }

        const passwordsMath = await bcrypt.compare(
          password,
          user.hashedPassword
        );

        if (!passwordsMath) {
          console.log("Invalid credentials");
          return null;
        }

        return user;
      },
    }),
  ],
  // do something with callbacks when user login
  callbacks: {
    authorized: ({ auth, request }) => {
      // runs on every request with middleware
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");

      if (!isLoggedIn && isTryingToAccessApp) {
        return false;
      }

      if (isLoggedIn && isTryingToAccessApp) {
        return true;
      }

      if (!isTryingToAccessApp) {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn } = NextAuth(config);
