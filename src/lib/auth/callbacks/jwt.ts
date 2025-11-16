import { JWT } from "next-auth/jwt";
import { User as NextAuthUser } from "next-auth";

export const handleJWT = async ({
    token,
    user,
}: {
    token: JWT;
    user?: NextAuthUser;
}) => {
    if (user) {
        token.id = user.id;
        token.name = user.name!;
        token.email = user.email!;
        token.image = user.image || undefined;
    }
    return token;
};
