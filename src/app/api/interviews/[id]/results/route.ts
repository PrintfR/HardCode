import { authOptions } from "@/lib/auth/options";
import { connectDB } from "@/lib/db/connect";
import { Interview } from "@/lib/db/models/Interview";
import { InterviewSession } from "@/lib/db/models/InterviewSession";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user)
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 }
        );

    const interviewSessionId = (await params).id;

    await connectDB();
    try {
        const interviewSession = await InterviewSession.findById(
            new Types.ObjectId(interviewSessionId)
        );

        if (!interviewSession)
            return NextResponse.json(
                { error: "Session not found" },
                { status: 404 }
            );

        const interview = await Interview.findById(
            interviewSession.interviewId
        ).lean();

        if (!interview)
            return NextResponse.json(
                { error: "Interview not found" },
                { status: 404 }
            );

        return NextResponse.json(
            {
                feedback: interviewSession.feedback,
                interview: {
                    id: interview._id.toString(),
                    title: interview.title,
                    createdAt: interview.createdAt,
                    questions: interview.questions.map((q) => ({
                        id: q._id.toString(),
                        text: q.text,
                    })),
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to get results" },
            { status: 500 }
        );
    }
}
