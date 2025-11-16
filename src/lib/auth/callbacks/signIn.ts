import { connectDB } from "@/lib/db/connect";
import { IUser, User } from "@/lib/db/models/User";
import { User as NextAuthUser } from "next-auth";

export const handleSignIn = async ({ user }: { user: NextAuthUser }) => {
    try {
        const { name, email, image } = user;
        if (!email) return false;

        await connectDB();
        let existingUser = await User.findOne({ email }).lean<IUser>();

        if (!existingUser) {
            const newUser = await User.create({
                name,
                email,
                image,
                interviews: [],
            });
            existingUser = newUser.toObject();
        }

        user.id = existingUser._id.toString();
        user.name = existingUser.name;
        user.email = existingUser.email;
        user.image = existingUser.image || undefined;

        return true;
    } catch (err) {
        console.error("Sign-in error:", err);
        return false;
    }
};
