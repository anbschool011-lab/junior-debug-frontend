import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import TaskSelector, { TaskType } from "@/components/TaskSelector";
import ModelSelector, { AIModel } from "@/components/ModelSelector";
import LanguageSelector, { Language } from "@/components/LanguageSelector";
import CodeEditor from "@/components/CodeEditor";
import OutputPanel from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Sparkles, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { analyzeCode, AnalyzeRequest, Explanation } from "@/lib/api";

const sampleCode = `function calculateSum(arr) {
  let sum = 0
  for (i = 0; i < arr.length; i++) {
    sum = sum + arr[i]
  }
  return sum
}

// This function has issues:
// - Missing variable declaration for 'i'
// - Could use modern array methods
// - Missing semicolons`;

const Debug = () => {
  const [selectedTask, setSelectedTask] = useState<TaskType>("debug-refactor");
  const [selectedModel, setSelectedModel] = useState<AIModel>("auto");
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>("javascript");
  const [inputCode, setInputCode] = useState(sampleCode);
  const [outputCode, setOutputCode] = useState("");
  const [explanations, setExplanations] = useState<Explanation[]>([]);
  const { getAccessToken } = useAuth();

  const analyzeMutation = useMutation({
    mutationFn: (vars: { request: AnalyzeRequest; token?: string }) =>
      analyzeCode(vars.request, vars.token),
    onSuccess: (data) => {
      setOutputCode(data.code);
      setExplanations(data.explanations);
      toast({
        title: "Analysis complete!",
        description: `Found ${data.explanations.length} suggestions`,
      });
    },
    onError: (error) => {
      const msg = (error?.message || "").toLowerCase();
      const isKeyIssue =
        msg.includes("leak") ||
        msg.includes("leaked") ||
        msg.includes("reported") ||
        msg.includes("invalid") ||
        msg.includes("unauthorized");
      const isQuota =
        msg.includes("quota") ||
        msg.includes("rate limit") ||
        msg.includes("429");

      toast({
        title: "Analysis failed",
        description: isKeyIssue
          ? "AI provider key invalid — rotate your key in Settings."
          : isQuota
          ? "AI provider quota exceeded — try again later or rotate your key."
          : error?.message || "An error occurred while analyzing the code",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!inputCode.trim()) {
      toast({
        title: "No code provided",
        description: "Please paste some code to analyze",
        variant: "destructive",
      });
      return;
    }

    const mapTaskToDescription = (task: TaskType) => {
      const map: Record<TaskType, string> = {
        debug: "Find and fix errors",
        refactor: "Improve Structure",
        "debug-refactor": "Full cleanup",
        performance: "Optimize Speed",
        comments: "Add Comments",
      };
      return map[task];
    };

    const request: AnalyzeRequest = {
      code: inputCode,
      task_description: mapTaskToDescription(selectedTask),
      model: selectedModel,
      language: selectedLanguage,
    } as unknown as AnalyzeRequest;

    (async () => {
      const token = await getAccessToken();
      analyzeMutation.mutate({ request, token });
    })();
  };

  const handleClear = () => {
    setInputCode("");
    setOutputCode("");
    setExplanations([]);
  };

  return (
    <div className="min-h-screen bg-background gradient-dark">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Task Selection */}
        <section className="animate-fade-in">
          <TaskSelector
            selectedTask={selectedTask}
            onTaskChange={setSelectedTask}
          />
        </section>

        {/* Settings Row */}
        <section
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </section>

        {/* Main Editor Grid */}
        <section
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          {/* Input Panel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Your Code
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </Button>
            </div>
            <CodeEditor
              value={inputCode}
              onChange={setInputCode}
              language={selectedLanguage}
              height="400px"
            />
            <Button
              onClick={handleAnalyze}
              disabled={analyzeMutation.isPending || !inputCode.trim()}
              className="w-full gap-2"
              size="lg"
            >
              <Sparkles className="w-5 h-5" />
              {analyzeMutation.isPending ? "Analyzing..." : "Analyze Code"}
            </Button>
          </div>

          {/* Output Panel */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Output
            </label>
            <OutputPanel
              fixedCode={outputCode}
              explanations={explanations}
              language={selectedLanguage}
              isLoading={analyzeMutation.isPending}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-muted-foreground border-t border-border mt-12">
          <p>JuniorDebug — Built for learners, powered by AI</p>
          <p className="mt-1 text-xs">
            Reduce debugging time • Improve code quality • Learn as you code
          </p>
          <p className="mt-1 text-xs">Create By: Monyrothana</p>
        </footer>
      </main>
    </div>
  );
};

export default Debug;
