import Editor from "@monaco-editor/react";
import { Language } from "./LanguageSelector";
import { Loader2 } from "lucide-react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  readOnly?: boolean;
  height?: string;
}

const languageMap: Record<Language, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  php: "php",
  html: "html",
  css: "css",
  java: "java",
  csharp: "csharp",
  go: "go",
  rust: "rust",
};

const CodeEditor = ({ value, onChange, language, readOnly = false, height = "300px" }: CodeEditorProps) => {
  return (
    <div className="editor-container border border-border rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={languageMap[language]}
        value={value}
        onChange={(value) => onChange(value || "")}
        theme="vs-dark"
        loading={
          <div className="flex items-center justify-center h-full bg-card">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        }
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: "line",
          cursorBlinking: "smooth",
          smoothScrolling: true,
          bracketPairColorization: { enabled: true },
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;