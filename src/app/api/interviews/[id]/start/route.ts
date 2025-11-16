import { authOptions } from "@/lib/auth/options";
import { connectDB } from "@/lib/db/connect";
import { Interview } from "@/lib/db/models/Interview";
import { InterviewSession } from "@/lib/db/models/InterviewSession";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user)
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 }
        );

    const interviewId = (await params).id;
    if (!interviewId)
        return NextResponse.json(
            { error: "Missing interview ID" },
            { status: 400 }
        );

    await connectDB();

    try {
        const interview = await Interview.findById(interviewId);
        if (!interview)
            return NextResponse.json(
                { error: "Interview not found" },
                { status: 404 }
            );

        const existing = await InterviewSession.findOne({
            interviewId: interview._id,
            userId: new Types.ObjectId(session.user.id),
        });

        if (existing)
            return NextResponse.json(
                { error: "You’ve already attempted this interview" },
                { status: 409 }
            );

        const newSession = await InterviewSession.create({
            interviewId: interview._id,
            userId: new Types.ObjectId(session.user.id),
            startedAt: new Date(),
        });

        return NextResponse.json({
            session: {
                id: newSession._id.toString(),
                interview: {
                    id: interview._id.toString(),
                    title: interview.title,
                    position: interview.position,
                    techStack: interview.techStack,
                    numberOfQuestions: interview.numberOfQuestions,
                    type: interview.type,
                    difficulty: interview.difficulty,
                    questions: interview.questions.map((q) => ({
                        id: q._id.toString(),
                        text: q.text,
                    })),
                    createdAt: interview.createdAt,
                },
                startedAt: newSession.startedAt,
            },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to start interview" },
            { status: 500 }
        );
    }
}
