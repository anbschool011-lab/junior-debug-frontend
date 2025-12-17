import { CheckCircle2, Copy, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeEditor from "./CodeEditor";
import { Language } from "./LanguageSelector";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Explanation } from "@/lib/api";

interface OutputPanelProps {
  fixedCode: string;
  explanations: Explanation[];
  language: Language;
  isLoading?: boolean;
}

const OutputPanel = ({
  fixedCode,
  explanations,
  language,
  isLoading = false,
}: OutputPanelProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fixedCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse"></div>
        </div>
        <p className="mt-4 text-foreground font-medium">
          Analyzing your code...
        </p>
        <p className="text-sm text-muted-foreground">
          This may take a few seconds
        </p>
      </div>
    );
  }

  if (!fixedCode) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-foreground font-medium">No output yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Paste your code and click "Analyze Code" to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Fixed Code */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="font-medium text-sm text-foreground">
              Fixed Code
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <CodeEditor
          value={fixedCode}
          onChange={() => {}}
          language={language}
          readOnly
          height="250px"
        />
      </div>

      {/* Explanations */}
      {explanations.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            What was changed
          </h3>
          <ul className="space-y-3">
            {explanations.map((item, index) => (
              <li
                key={index}
                className="flex gap-3 animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-primary font-mono text-sm mt-0.5">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-foreground font-medium text-sm">
                    {item.title}
                  </p>
                  <p
                    className={`text-sm mt-0.5 ${
                      item.title === "Quota Exceeded"
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OutputPanel;
