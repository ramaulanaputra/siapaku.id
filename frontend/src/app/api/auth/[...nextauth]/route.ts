import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        console.log("[AUTH] Google signIn callback - user:", user.email);
        // Sync user to backend (non-blocking — login succeeds even if backend is down)
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          if (apiUrl) {
            await axios.post(
              `${apiUrl}/api/auth/google`,
              {
                google_id: account.providerAccountId,
                email: user.email,
                nama: user.name,
                profile_picture_url: user.image,
              },
              { timeout: 5000 }
            );
            console.log("[AUTH] Backend sync success");
          }
        } catch (error: any) {
          console.error("[AUTH] Backend sync failed (non-blocking):", error?.message || error);
        }
        return true;
      }
      return true;
    },
    async jwt({ token, account, trigger }) {
      if (account) {
        token.google_id = account.providerAccountId;
        token.accessToken = account.access_token;
      }
      if (trigger === "update" || account) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          if (apiUrl && token.accessToken) {
            const res = await axios.get(
              `${apiUrl}/api/user/me`,
              { headers: { Authorization: `Bearer ${token.accessToken}` }, timeout: 3000 }
            );
            token.has_premium_package = res.data?.user?.has_premium_package || false;
            token.free_psikolog_session = res.data?.user?.free_psikolog_session || false;
          }
        } catch {
          // Non-blocking — use cached values
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).google_id = token.google_id;
        (session.user as any).has_premium_package = token.has_premium_package || false;
        (session.user as any).free_psikolog_session = token.free_psikolog_session || false;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Ensure redirects stay within the app
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",  // Redirect errors to signin page so user sees error message
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Enable debug in production temporarily to diagnose OAuth issues
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
