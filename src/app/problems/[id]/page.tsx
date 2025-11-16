"use client";

import { useState, useEffect } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CodeEditorPanel } from "@/components/editor/CodeEditorPanel";
import { ProblemDescription } from "@/components/editor/ProblemDescription";
import { ConsolePanel } from "@/components/editor/ConsolePanel";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle, Loader2 } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

interface TestCase {
    id: string;
    input: string;
    expectedOutput?: string;
}

const mockProblem = {
    id: "1",
    number: 1,
    title: "Two Sum",
    difficulty: "Easy" as const,
    likes: 1234,
    dislikes: 45,
    views: 50000,
    description: `
        <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
        <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
        <p>You can return the answer in any order.</p>
    `,
    examples: [
        {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation:
                "Because nums[0] + nums[1] == 9, we return [0, 1].",
        },
        {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]",
        },
        {
            input: "nums = [3,3], target = 6",
            output: "[0,1]",
        },
    ],
    constraints: [
        "2 ≤ nums.length ≤ 10⁴",
        "-10⁹ ≤ nums[i] ≤ 10⁹",
        "-10⁹ ≤ target ≤ 10⁹",
        "Only one valid answer exists.",
    ],
    companies: ["Amazon", "Google", "Microsoft", "Apple"],
    tags: ["Array", "Hash Table"],
};

export default function ProblemDetailPage() {
    const { addNotification } = useNotifications();
    const [testCases, setTestCases] = useState<TestCase[]>([
        {
            id: "1",
            input: "nums = [2,7,11,15], target = 9",
            expectedOutput: "[0,1]",
        },
    ]);
    const [results, setResults] = useState<{
        status: "accepted" | "wrong-answer" | "runtime-error" | "time-limit-exceeded";
        runtime?: number;
        memory?: number;
        testResults?: Array<{
            testCaseId: string;
            passed: boolean;
            input: string;
            expected?: string;
            actual?: string;
            error?: string;
        }>;
    } | undefined>(undefined);
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [leftWidth, setLeftWidth] = useState(40);
    const [rightWidth, setRightWidth] = useState(20);
    const [isResizing, setIsResizing] = useState(false);

    useEffect(() => {
        // Load saved panel widths
        const savedLeft = localStorage.getItem("editor-left-width");
        const savedRight = localStorage.getItem("editor-right-width");
        if (savedLeft) setLeftWidth(parseInt(savedLeft));
        if (savedRight) setRightWidth(parseInt(savedRight));
    }, []);

    const handleRun = async () => {
        setIsRunning(true);
        setResults(undefined);
        setConsoleOutput(["Running code..."]);

        // Simulate code execution
        setTimeout(() => {
            const mockResults = {
                status: "accepted" as const,
                runtime: Math.floor(Math.random() * 50) + 10,
                memory: Math.round((Math.random() * 10 + 5) * 100) / 100,
                testResults: testCases.map((tc) => ({
                    testCaseId: tc.id,
                    passed: Math.random() > 0.2,
                    input: tc.input,
                    expected: tc.expectedOutput,
                    actual: tc.expectedOutput,
                })),
            };
            setResults(mockResults);
            setConsoleOutput([
                "Code executed successfully",
                `Runtime: ${mockResults.runtime}ms`,
                `Memory: ${mockResults.memory}MB`,
            ]);
            setIsRunning(false);
            addNotification("success", "Code executed successfully");
        }, 2000);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setResults(undefined);
        setConsoleOutput(["Submitting solution..."]);

        // Simulate submission
        setTimeout(() => {
            const mockResults = {
                status: "accepted" as const,
                runtime: Math.floor(Math.random() * 50) + 10,
                memory: Math.round((Math.random() * 10 + 5) * 100) / 100,
                testResults: testCases.map((tc) => ({
                    testCaseId: tc.id,
                    passed: true,
                    input: tc.input,
                    expected: tc.expectedOutput,
                    actual: tc.expectedOutput,
                })),
            };
            setResults(mockResults);
            setConsoleOutput([
                "Solution accepted!",
                `Runtime: ${mockResults.runtime}ms (faster than 95.20% of submissions)`,
                `Memory: ${mockResults.memory}MB (less than 80.15% of submissions)`,
            ]);
            setIsSubmitting(false);
            addNotification("success", "Solution accepted!");
        }, 2000);
    };

    const handleAddTestCase = () => {
        setTestCases([
            ...testCases,
            {
                id: Date.now().toString(),
                input: "",
                expectedOutput: "",
            },
        ]);
    };

    const handleDeleteTestCase = (id: string) => {
        if (testCases.length > 1) {
            setTestCases(testCases.filter((tc) => tc.id !== id));
        }
    };

    const handleTestCaseChange = (
        id: string,
        input: string,
        expected?: string
    ) => {
        setTestCases(
            testCases.map((tc) =>
                tc.id === id ? { ...tc, input, expectedOutput: expected } : tc
            )
        );
    };

    const handleResize = (e: MouseEvent, side: "left" | "right") => {
        if (!isResizing) return;

        const container = document.getElementById("editor-container");
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const newLeftWidth =
            ((e.clientX - containerRect.left) / containerRect.width) * 100;
        const newRightWidth =
            ((containerRect.right - e.clientX) / containerRect.width) * 100;

        if (side === "left" && newLeftWidth > 20 && newLeftWidth < 60) {
            setLeftWidth(newLeftWidth);
            localStorage.setItem("editor-left-width", newLeftWidth.toString());
        } else if (side === "right" && newRightWidth > 15 && newRightWidth < 40) {
            setRightWidth(newRightWidth);
            localStorage.setItem("editor-right-width", newRightWidth.toString());
        }
    };

    useEffect(() => {
        if (isResizing) {
            const handleMouseMove = (e: MouseEvent) => {
                handleResize(e, "left");
            };
            const handleMouseUp = () => setIsResizing(false);

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);

            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isResizing]);

    return (
        <div className="h-screen flex flex-col">
            <div className="border-b px-4 py-2 flex items-center justify-between bg-background">
                <Breadcrumb
                    items={[
                        { label: "Problems", href: "/problems" },
                        { label: mockProblem.title },
                    ]}
                />
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleRun}
                        disabled={isRunning || isSubmitting}
                        variant="outline"
                    >
                        {isRunning ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Play className="h-4 w-4 mr-2" />
                        )}
                        Run Code
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isRunning || isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Submit
                    </Button>
                </div>
            </div>

            <div
                id="editor-container"
                className="flex-1 flex overflow-hidden"
            >
                {/* Left Panel - Problem Description */}
                <div
                    className="border-r bg-background"
                    style={{ width: `${leftWidth}%` }}
                >
                    <ProblemDescription problem={mockProblem} />
                </div>

                {/* Resize Handle */}
                <div
                    className="w-1 bg-border cursor-col-resize hover:bg-primary transition-colors"
                    onMouseDown={() => setIsResizing(true)}
                />

                {/* Middle Panel - Code Editor */}
                <div
                    className="flex-1 bg-background"
                    style={{
                        width: `${100 - leftWidth - rightWidth}%`,
                    }}
                >
                    <CodeEditorPanel />
                </div>

                {/* Resize Handle */}
                <div
                    className="w-1 bg-border cursor-col-resize hover:bg-primary transition-colors"
                    onMouseDown={() => setIsResizing(true)}
                />

                {/* Right Panel - Console */}
                <div
                    className="bg-background"
                    style={{ width: `${rightWidth}%` }}
                >
                    <ConsolePanel
                        testCases={testCases}
                        results={results}
                        consoleOutput={consoleOutput}
                        onAddTestCase={handleAddTestCase}
                        onDeleteTestCase={handleDeleteTestCase}
                        onTestCaseChange={handleTestCaseChange}
                    />
                </div>
            </div>
        </div>
    );
}

