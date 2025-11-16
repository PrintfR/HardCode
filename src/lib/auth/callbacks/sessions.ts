import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export const handleSession = async ({
    session,
    token,
}: {
    session: Session;
    token: JWT;
}) => {
    if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image || undefined;
    }
    return session;
};
