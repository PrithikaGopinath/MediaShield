import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

function extractScore(result: any, positiveLabels: string[]) {
  if (!result) return 0;

  // If model returns nested arrays
  const flat = Array.isArray(result[0]) ? result[0] : result;

  if (!Array.isArray(flat)) return 0;

  // Find the label that matches our positive labels
  const match = flat.find((x: any) =>
    positiveLabels.includes(x.label.toLowerCase())
  );

  if (match) return match.score;

  // If no match, assume the opposite
  return 1 - flat[0].score;
}

export const authOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER!,
      authorization: { params: { scope: "openid profile email" } },
      checks: ["pkce"],
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
