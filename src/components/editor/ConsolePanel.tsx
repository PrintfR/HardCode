"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConsolePanelProps {
    testCases: Array<{
        id: string;
        input: string;
        expectedOutput?: string;
    }>;
    results?: {
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
    };
    consoleOutput?: string[];
    onAddTestCase: () => void;
    onDeleteTestCase: (id: string) => void;
    onTestCaseChange: (id: string, input: string, expected?: string) => void;
}

export function ConsolePanel({
    testCases,
    results,
    consoleOutput = [],
    onAddTestCase,
    onDeleteTestCase,
    onTestCaseChange,
}: ConsolePanelProps) {
    const [activeTab, setActiveTab] = useState("test-cases");

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "accepted":
                return "text-green-600";
            case "wrong-answer":
                return "text-red-600";
            case "runtime-error":
                return "text-orange-600";
            case "time-limit-exceeded":
                return "text-yellow-600";
            default:
                return "text-muted-foreground";
        }
    };

    return (
        <div className="h-full flex flex-col border-l bg-background">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="border-b px-4">
                    <TabsList className="w-full justify-start">
                        <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
                        <TabsTrigger value="results">Results</TabsTrigger>
                        <TabsTrigger value="console">Console</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="test-cases" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
                    {testCases.map((testCase) => (
                        <Card key={testCase.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm">
                                        Case {testCases.indexOf(testCase) + 1}
                                    </CardTitle>
                                    {testCases.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => onDeleteTestCase(testCase.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div>
                                    <label className="text-xs text-muted-foreground">
                                        Input
                                    </label>
                                    <textarea
                                        className="w-full mt-1 p-2 border rounded-md font-mono text-sm bg-muted"
                                        rows={3}
                                        value={testCase.input}
                                        onChange={(e) =>
                                            onTestCaseChange(
                                                testCase.id,
                                                e.target.value,
                                                testCase.expectedOutput
                                            )
                                        }
                                        placeholder="Enter test case input..."
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground">
                                        Expected Output (optional)
                                    </label>
                                    <textarea
                                        className="w-full mt-1 p-2 border rounded-md font-mono text-sm bg-muted"
                                        rows={2}
                                        value={testCase.expectedOutput || ""}
                                        onChange={(e) =>
                                            onTestCaseChange(
                                                testCase.id,
                                                testCase.input,
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter expected output..."
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={onAddTestCase}
                    >
                        + Add Test Case
                    </Button>
                </TabsContent>

                <TabsContent value="results" className="flex-1 overflow-y-auto p-4 m-0">
                    {results ? (
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        <span
                                            className={cn(
                                                "capitalize",
                                                getStatusColor(results.status)
                                            )}
                                        >
                                            {results.status.replace("-", " ")}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {results.runtime && (
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">
                                                Runtime:{" "}
                                            </span>
                                            <span className="font-semibold">
                                                {results.runtime}ms
                                            </span>
                                        </div>
                                    )}
                                    {results.memory && (
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">
                                                Memory:{" "}
                                            </span>
                                            <span className="font-semibold">
                                                {results.memory}MB
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {results.testResults && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold">Test Results</h3>
                                    {results.testResults.map((result, index) => (
                                        <Card
                                            key={index}
                                            className={cn(
                                                result.passed
                                                    ? "border-green-500"
                                                    : "border-red-500"
                                            )}
                                        >
                                            <CardContent className="p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span
                                                        className={cn(
                                                            "text-sm font-semibold",
                                                            result.passed
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        )}
                                                    >
                                                        {result.passed
                                                            ? "✓ Passed"
                                                            : "✗ Failed"}
                                                    </span>
                                                </div>
                                                {!result.passed && (
                                                    <div className="space-y-1 text-sm">
                                                        {result.expected && (
                                                            <div>
                                                                <span className="text-muted-foreground">
                                                                    Expected:{" "}
                                                                </span>
                                                                <code className="bg-muted px-1 rounded">
                                                                    {result.expected}
                                                                </code>
                                                            </div>
                                                        )}
                                                        {result.actual && (
                                                            <div>
                                                                <span className="text-muted-foreground">
                                                                    Got:{" "}
                                                                </span>
                                                                <code className="bg-muted px-1 rounded">
                                                                    {result.actual}
                                                                </code>
                                                            </div>
                                                        )}
                                                        {result.error && (
                                                            <div className="text-red-600">
                                                                Error: {result.error}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            No results yet. Run your code to see results.
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="console" className="flex-1 overflow-y-auto p-4 m-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Console Output</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                // Clear console
                            }}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear
                        </Button>
                    </div>
                    <div className="bg-muted rounded-md p-3 font-mono text-sm space-y-1 max-h-full overflow-y-auto">
                        {consoleOutput.length === 0 ? (
                            <div className="text-muted-foreground">
                                No output yet
                            </div>
                        ) : (
                            consoleOutput.map((line, index) => (
                                <div key={index} className="text-foreground">
                                    {line}
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

