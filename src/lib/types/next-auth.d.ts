import { User as NextAuthUser } from "next-auth";

declare module "next-auth" {
    interface User extends NextAuthUser {
        id: string;
        name: string;
        email: string;
        image?: string;
    }

    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            image?: string;
        };
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        name: string;
        email: string;
        image?: string;
    }
}
