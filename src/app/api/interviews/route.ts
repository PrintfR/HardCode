import { authOptions } from "@/lib/auth/options";
import { connectDB } from "@/lib/db/connect";
import { InterviewSession } from "@/lib/db/models/InterviewSession";
import { Interview } from "@/lib/db/models/Interview";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user)
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );

        const url = new URL(req.url);
        const limit = parseInt(url.searchParams.get("limit") || "0");
        const includeSummary = url.searchParams.get("summary") === "true";

        const userId = new Types.ObjectId(session.user.id);

        await connectDB();
        let query = InterviewSession.find({ userId }).sort({ startedAt: -1 });
        if (limit > 0) query = query.limit(limit);

        const sessions = await query.lean();
        const populated = await Promise.all(
            sessions.map(async (sess) => {
                const interview = await Interview.findById(
                    sess.interviewId
                ).lean();

                if (!interview) {
                    console.warn(`Missing interview for session ${sess._id}`);
                    return null;
                }

                const avgScore = sess.feedback
                    ? Math.round(
                          (sess.feedback.scores.communicationSkills +
                              sess.feedback.scores.technicalKnowledge +
                              sess.feedback.scores.problemSolving +
                              sess.feedback.scores.culturalFit +
                              sess.feedback.scores.confidenceAndClarity) /
                              5
                      )
                    : null;

                return {
                    id: sess._id.toString(),
                    startedAt: sess.startedAt.toISOString(),
                    completedAt: sess.completedAt?.toISOString(),
                    score: avgScore,
                    interview: {
                        id: interview._id.toString(),
                        title: interview.title,
                        type: interview.type,
                        techStack: interview.techStack,
                        numberOfQuestions: interview.numberOfQuestions,
                        createdAt: interview.createdAt,
                    },
                };
            })
        );

        const filteredPopulated = populated.filter(Boolean);

        let summary;
        if (includeSummary) {
            const allSessions = await InterviewSession.find({ userId }).lean();
            const completedCount = allSessions.filter(
                (s) => s.completedAt
            ).length;

            const avgScore =
                allSessions.length > 0
                    ? Math.round(
                          allSessions.reduce((sum, s) => {
                              if (!s.feedback) return sum;
                              const sc = s.feedback.scores;
                              return (
                                  sum +
                                  (sc.communicationSkills +
                                      sc.confidenceAndClarity +
                                      sc.culturalFit +
                                      sc.problemSolving +
                                      sc.technicalKnowledge) /
                                      5
                              );
                          }, 0) / allSessions.length
                      )
                    : 0;

            summary = { completedCount, averageScore: avgScore };
        }

        return NextResponse.json({
            sessions: filteredPopulated,
            ...(summary ? { summary } : {}),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to get details" },
            { status: 500 }
        );
    }
}
