import { authOptions } from "@/lib/auth/options";
import { connectDB } from "@/lib/db/connect";
import { Interview } from "@/lib/db/models/Interview";
import { InterviewSession } from "@/lib/db/models/InterviewSession";
import { generateInterviewQuestions } from "@/lib/functions/gen-ai";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user)
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 }
        );

    const { title, position, techStack, type, difficulty, numberOfQuestions } =
        await req.json();

    if (
        !title ||
        !position ||
        !techStack?.length ||
        !type ||
        !difficulty ||
        !numberOfQuestions
    )
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );

    await connectDB();
    try {
        // 1. Generate questions as strings
        const questionTexts = await generateInterviewQuestions({
            position,
            techStack,
            type,
            difficulty,
            numberOfQuestions,
        });

        // 2. Convert to embedded question objects
        const questionDocs = questionTexts.map((q) => ({ text: q }));

        // 3. Create interview
        const interview = await Interview.create({
            title,
            position,
            techStack,
            numberOfQuestions,
            type,
            difficulty,
            questions: questionDocs,
            createdBy: new Types.ObjectId(session.user.id),
        });

        // 4. Create session tied to user
        const sessionDoc = await InterviewSession.create({
            interviewId: interview._id,
            userId: new Types.ObjectId(session.user.id),
            startedAt: new Date(),
        });

        return NextResponse.json({
            session: {
                id: sessionDoc._id.toString(),
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
                startedAt: sessionDoc.startedAt,
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to generate interview" },
            { status: 500 }
        );
    }
}
