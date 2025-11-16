import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface IScore {
    communicationSkills: number;
    technicalKnowledge: number;
    problemSolving: number;
    culturalFit: number;
    confidenceAndClarity: number;
}

export interface IFeedback {
    suggestions: string[];
    scores: IScore;
}

export interface IInterviewSession extends Document {
    _id: Types.ObjectId;
    interviewId: Types.ObjectId;
    userId: Types.ObjectId;
    feedback?: IFeedback;
    startedAt: Date;
    completedAt?: Date;
}

const ScoreSchema = new Schema<IScore>({
    communicationSkills: { type: Number, required: true, min: 0, max: 100 },
    technicalKnowledge: { type: Number, required: true, min: 0, max: 100 },
    problemSolving: { type: Number, required: true, min: 0, max: 100 },
    culturalFit: { type: Number, required: true, min: 0, max: 100 },
    confidenceAndClarity: { type: Number, required: true, min: 0, max: 100 },
});

const FeedbackSchema = new Schema<IFeedback>({
    suggestions: { type: [String], default: [] },
    scores: { type: ScoreSchema, required: true },
});

const InterviewSessionSchema = new Schema<IInterviewSession>({
    interviewId: {
        type: Schema.Types.ObjectId,
        ref: "Interview",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    feedback: FeedbackSchema,
    startedAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    completedAt: Date,
});

export const InterviewSession: Model<IInterviewSession> =
    models.InterviewSession ||
    model<IInterviewSession>("InterviewSession", InterviewSessionSchema);
