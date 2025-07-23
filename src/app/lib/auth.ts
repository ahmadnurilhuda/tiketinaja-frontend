import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            {
              method: "POST",
              body: JSON.stringify({ email, password }),
            }
          );
          const body = await response.json();
          console.log("\n\n\nResponse:", body);
          if (!response.ok) {
            throw new Error(body.message);
          }
          const token = body.data;
          if (token) {
            const userDataResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const user = await userDataResponse.json()
            return {
              ...user.data,
              accessToken: token,
            };
          }
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.fullName = user.fullName;
        token.nickName = user.nickName;
        token.email = user.email;
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.isOrganizer = user.isOrganizer;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.name = token.username as string;
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.fullName = token.fullName as string;
      session.user.nickName = token.nickName as string;
      session.user.role = token.role as string;
      session.user.isVerified = token.isVerified as boolean;
      session.user.isOrganizer = token.isOrganizer as boolean;
      console.log("Session Callback - Session 2:", session);
      return session;
    },
  },
}
