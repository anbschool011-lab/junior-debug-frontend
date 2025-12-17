import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cpu } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/ui/loading-screen";
import { useAuth } from "@/hooks/useAuth";

export type AIModel =
  | "gemini-pro-latest"
  | "gemini-flash-latest"
  | "gpt-4"
  | "gpt-4o"
  | "gpt-4o-mini"
  | "auto";

interface ModelSelectorProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

const defaultModels = [
  {
    id: "auto" as AIModel,
    label: "Auto Detect",
    description: "Best model for your task",
  },
];

const geminiModels = [
  {
    id: "gemini-pro-latest" as AIModel,
    label: "Gemini Pro Latest",
    description: "Google's most capable model",
  },
  {
    id: "gemini-flash-latest" as AIModel,
    label: "Gemini Flash Latest",
    description: "Fast & efficient",
  },
];

const openaiModels = [
  {
    id: "auto" as AIModel,
    label: "Auto (OpenAI)",
    description: "Choose best available OpenAI model",
  },
  {
    id: "gpt-4" as AIModel,
    label: "GPT-4",
    description: "OpenAI GPT-4",
  },
  {
    id: "gpt-4o" as AIModel,
    label: "GPT-4o",
    description: "OpenAI GPT-4o",
  },
  {
    id: "gpt-4o-mini" as AIModel,
    label: "GPT-4o-mini",
    description: "OpenAI GPT-4o-mini (fast)",
  },
];

const ModelSelector = ({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) => {
  const { getAccessToken } = useAuth();
  const [availableModels, setAvailableModels] = useState(defaultModels);
  const [modelsLoading, setModelsLoading] = useState<boolean>(true);
  const BACKEND_URL =
    (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:8000";

  useEffect(() => {
    let mounted = true;
    async function detect() {
      setModelsLoading(true);
      try {
        const token = await getAccessToken();
        if (!token) {
          if (!mounted) return;
          setAvailableModels([...defaultModels, ...geminiModels]);
          return;
        }
        const res = await fetch(`${BACKEND_URL}/test-api-key`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (!mounted) return;
          setAvailableModels([...defaultModels, ...geminiModels]);
          return;
        }
        const data = await res.json();
        const provider = data?.provider ?? null;
        if (!provider) {
          if (!mounted) return;
          setAvailableModels([...defaultModels, ...geminiModels]);
          return;
        }
        if (provider === "OpenAI") {
          if (!mounted) return;
          setAvailableModels(openaiModels);
          return;
        }
        if (provider === "Gemini" || provider === "gemini") {
          if (!mounted) return;
          setAvailableModels([...defaultModels, ...geminiModels]);
          return;
        }
      } catch (e) {
        if (!mounted) return;
        setAvailableModels([...defaultModels, ...geminiModels]);
      } finally {
        if (!mounted) return;
        setModelsLoading(false);
      }
    }

    detect();

    return () => {
      mounted = false;
    };
  }, [getAccessToken]);

  return (
    <div className="space-y-2">
      {modelsLoading && (
        <LoadingScreen message="Detecting available AI models..." />
      )}
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Cpu className="w-4 h-4 text-primary" />
        AI Model
      </label>
      <Select
        value={selectedModel}
        onValueChange={(value) => onModelChange(value as AIModel)}
      >
        <SelectTrigger className="w-full bg-card border-border">
          <SelectValue placeholder="Select AI Model" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {availableModels.map((model) => (
            <SelectItem
              key={model.id}
              value={model.id}
              className="cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-medium">{model.label}</span>
                <span className="text-xs text-muted-foreground">
                  {model.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelector;
