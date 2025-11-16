import { Difficulty, InterviewType } from "@/lib/types/customTypes";
import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface IQuestion {
    _id: Types.ObjectId;
    text: string;
}

export interface IInterview extends Document {
    _id: Types.ObjectId;
    title: string;
    position: string;
    techStack: string[];
    numberOfQuestions: number;
    type: InterviewType;
    difficulty: Difficulty;
    questions: IQuestion[];
    createdAt: Date;
    createdBy: Types.ObjectId;
}

const QuestionSchema = new Schema<IQuestion>({
    text: { type: String, required: true },
});

const InterviewSchema = new Schema<IInterview>({
    title: { type: String, required: true },
    position: { type: String, required: true },
    techStack: { type: [String], default: [] },
    numberOfQuestions: { type: Number, required: true },
    type: {
        type: String,
        enum: ["technical", "behavioral", "mix"],
        required: true,
    },
    questions: {
        type: [QuestionSchema],
        default: [],
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
        default: "easy",
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Interview: Model<IInterview> =
    models.Interview || model<IInterview>("Interview", InterviewSchema);
