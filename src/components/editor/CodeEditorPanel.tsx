"use client";

import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Settings,
    Maximize,
    Minimize,
    ZoomIn,
    ZoomOut,
    RotateCcw,
} from "lucide-react";
import { useEditor, EditorLanguage } from "@/context/EditorContext";
import { useThemeContext } from "@/context/ThemeContext";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const LANGUAGE_OPTIONS = [
    { value: "python", label: "Python 3" },
    { value: "javascript", label: "JavaScript" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "c", label: "C" },
    { value: "sql", label: "SQL" },
] as const;

export function CodeEditorPanel() {
    const {
        language,
        code,
        setLanguage,
        setCode,
        fontSize,
        setFontSize,
        setEditorTheme,
    } = useEditor();
    const { theme: appTheme } = useThemeContext();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const editorRef = useRef<{ focus: () => void } | null>(null);

    const handleEditorDidMount = (editor: { focus: () => void }) => {
        editorRef.current = editor;
    };

    const handleFontSizeChange = (delta: number) => {
        const newSize = Math.max(10, Math.min(24, fontSize + delta));
        setFontSize(newSize);
    };

    const handleReset = () => {
        // Reset to template
        const templates: Record<string, string> = {
            python: `def solution():
    # Write your code here
    pass`,
            javascript: `function solution() {
    // Write your code here
}`,
            java: `class Solution {
    public void solution() {
        // Write your code here
    }
}`,
            cpp: `class Solution {
public:
    void solution() {
        // Write your code here
    }
};`,
            go: `func solution() {
    // Write your code here
}`,
            rust: `fn solution() {
    // Write your code here
}`,
            c: `void solution() {
    // Write your code here
}`,
            sql: `-- Write your SQL query here
SELECT * FROM table_name;`,
        };
        setCode(templates[language] || "");
    };

    const editorTheme = appTheme === "dark" ? "vs-dark" : "vs";

    return (
        <div className="flex flex-col h-full border-r bg-background">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-3 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                    <Select
                        value={language}
                        onValueChange={(v) => setLanguage(v as EditorLanguage)}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {LANGUAGE_OPTIONS.map((lang) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                    {lang.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64" align="start">
                            <div className="space-y-4">
                                <div>
                                    <Label>Font Size</Label>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleFontSizeChange(-1)}
                                        >
                                            <ZoomOut className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            type="number"
                                            value={fontSize}
                                            onChange={(e) =>
                                                setFontSize(
                                                    parseInt(e.target.value) || 14
                                                )
                                            }
                                            className="w-20 text-center"
                                            min={10}
                                            max={24}
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleFontSizeChange(1)}
                                        >
                                            <ZoomIn className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <Label>Theme</Label>
                                    <Select
                                        value={editorTheme}
                                        onValueChange={(v: "vs-dark" | "vs") =>
                                            setEditorTheme(v)
                                        }
                                    >
                                        <SelectTrigger className="mt-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="vs">Light</SelectItem>
                                            <SelectItem value="vs-dark">Dark</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button variant="outline" size="sm" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                >
                    {isFullscreen ? (
                        <Minimize className="h-4 w-4" />
                    ) : (
                        <Maximize className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    theme={editorTheme}
                    options={{
                        fontSize,
                        minimap: { enabled: false },
                        wordWrap: "on",
                        tabSize: 2,
                        fontFamily: "Fira Code, Consolas, Monaco, monospace",
                        lineNumbers: "on",
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        formatOnPaste: true,
                        formatOnType: true,
                    }}
                    onMount={handleEditorDidMount}
                />
            </div>
        </div>
    );
}

