import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/photoslibrary https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async jwt({token, user, account, profile, isNewUser}) {
      console.log(account);
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.id = user?.id ?? null;
      session.accessToken = token.accessToken;
      session.token = token;
      console.log(session);
      return Promise.resolve(session);
    },
  },
});
