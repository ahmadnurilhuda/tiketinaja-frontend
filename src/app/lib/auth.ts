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
          return null;
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
        token.verified = user.verified;
        token.organizer = user.organizer;
        return token;
      }
      // console.log("JWT Callback - Token:", token);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });
        if (response.status !== 200) {
          throw new Error("Failed to refresh token data");
        }
        const profile = await response.json();
        token.organizer = profile.data.organizer;
      } catch (error) {
        console.error("Error refreshing JWT:", error);
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
      session.user.verified = token.verified as boolean;
      session.user.organizer = token.organizer as boolean;
      return session;
    },
  },
}
