import { authOptions } from "@/lib/auth/options";
import { connectDB } from "@/lib/db/connect";
import { Interview } from "@/lib/db/models/Interview";
import { InterviewSession } from "@/lib/db/models/InterviewSession";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { discoverPagePaginationPageSize } from "@/lib/constants";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");

    try {
        const userId = new Types.ObjectId(session.user.id);
        const attempted = await InterviewSession.find({ userId }).distinct(
            "interviewId"
        );

        const query = {
            createdBy: { $ne: userId },
            _id: { $nin: attempted },
        };

        const PAGE_SIZE = discoverPagePaginationPageSize;
        const total = await Interview.countDocuments(query);
        const interviews = await Interview.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE);

        return NextResponse.json({
            data: interviews.map((interview) => ({
                id: interview._id,
                title: interview.title,
                position: interview.position,
                techStack: interview.techStack,
                numberOfQuestions: interview.numberOfQuestions,
                type: interview.type,
                difficulty: interview.difficulty,
                createdAt: interview.createdAt,
            })),
            total,
            page,
            totalPages: Math.ceil(total / PAGE_SIZE),
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to fetch interviews" },
            { status: 500 }
        );
    }
}
