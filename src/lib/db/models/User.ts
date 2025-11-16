import { Schema, model, models, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    image?: string;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    image: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const User: Model<IUser> =
    models.User || model<IUser>("User", UserSchema);
