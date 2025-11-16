import { authOptions } from "@/lib/auth/options";
import { connectDB } from "@/lib/db/connect";
import { InterviewSession } from "@/lib/db/models/InterviewSession";
import { evaluateInterviewSession } from "@/lib/functions/gen-ai";
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

    const interviewSessionId = (await params).id;
    const { transcript } = await req.json();
    if (!transcript)
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );

    await connectDB();
    try {
        const session = await InterviewSession.findById(
            new Types.ObjectId(interviewSessionId)
        );

        if (!session)
            return NextResponse.json(
                { error: "Session not found" },
                { status: 404 }
            );

        const { scores, suggestions } = await evaluateInterviewSession({
            transcript,
        });

        session.feedback = {
            scores,
            suggestions,
        };
        session.completedAt = new Date();
        await session.save();

        return NextResponse.json(
            { feedback: session.feedback },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to analyze session" },
            { status: 500 }
        );
    }
}
