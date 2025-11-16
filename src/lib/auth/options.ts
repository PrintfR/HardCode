import GoogleAuthProvider from "@/lib/auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { handleJWT } from "@/lib/auth/callbacks/jwt";
import { handleSession } from "@/lib/auth/callbacks/sessions";
import { handleSignIn } from "@/lib/auth/callbacks/signIn";

export const authOptions: NextAuthOptions = {
    providers: [GoogleAuthProvider],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
    pages: { signIn: "/auth/login" },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        signIn: handleSignIn,
        jwt: handleJWT,
        session: handleSession,
    },
};
