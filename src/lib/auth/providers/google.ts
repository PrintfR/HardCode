import GoogleProvider from "next-auth/providers/google";

const GoogleAuthProvider = GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    authorization: {
        params: {
            prompt: "select_account",
            access_type: "offline",
            response_type: "code",
        },
    },
});

export default GoogleAuthProvider;
