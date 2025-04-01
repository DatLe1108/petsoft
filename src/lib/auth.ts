import NextAuth, { NextAuthConfig } from "next-auth";

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
  providers: [],
  // do something with callbacks when user login
  callbacks: {
    authorized: ({ request }) => {
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");

      if (isTryingToAccessApp) {
        return false;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

const { auth } = NextAuth(config);

export default auth;
