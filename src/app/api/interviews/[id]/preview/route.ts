import { authOptions } from "@/lib/auth/options";
import { connectDB } from "@/lib/db/connect";
import { Interview } from "@/lib/db/models/Interview";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const interviewId = (await params).id;
    try {
        const interview = await Interview.findById(
            new Types.ObjectId(interviewId)
        ).lean();

        if (!interview)
            return NextResponse.json(
                { error: "Interview not found" },
                { status: 404 }
            );

        return NextResponse.json(
            {
                interview: {
                    ...interview,
                    questions: interview.questions.map((question) => ({
                        id: question._id.toString(),
                        text: question.text,
                    })),
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch interview" },
            { status: 500 }
        );
    }
}
