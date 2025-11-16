"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type EditorLanguage = 
    | "python" 
    | "javascript" 
    | "java" 
    | "cpp" 
    | "go" 
    | "rust" 
    | "c" 
    | "sql";

interface EditorContextType {
    language: EditorLanguage;
    code: string;
    setLanguage: (lang: EditorLanguage) => void;
    setCode: (code: string) => void;
    fontSize: number;
    setFontSize: (size: number) => void;
    theme: "vs-dark" | "vs";
    setEditorTheme: (theme: "vs-dark" | "vs") => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

const LANGUAGE_TEMPLATES: Record<EditorLanguage, string> = {
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

export function EditorProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<EditorLanguage>("python");
    const [code, setCode] = useState<string>(LANGUAGE_TEMPLATES.python);
    const [fontSize, setFontSize] = useState(14);
    const [theme, setEditorTheme] = useState<"vs-dark" | "vs">("vs-dark");

    const handleSetLanguage = (lang: EditorLanguage) => {
        setLanguage(lang);
        setCode(LANGUAGE_TEMPLATES[lang]);
    };

    return (
        <EditorContext.Provider
            value={{
                language,
                code,
                setLanguage: handleSetLanguage,
                setCode,
                fontSize,
                setFontSize,
                theme,
                setEditorTheme,
            }}
        >
            {children}
        </EditorContext.Provider>
    );
}

export function useEditor() {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error("useEditor must be used within EditorProvider");
    }
    return context;
}

