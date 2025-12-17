import { AIModel } from "@/components/ModelSelector";
import { Language } from "@/components/LanguageSelector";

export interface AnalyzeRequest {
  code: string;
  // `task` was previously the task id. We now send the human-friendly label as
  // snake_case `task_description`. `task` is optional and may still be sent.
  task?: string;
  task_description?: string;
  model: AIModel;
  language: Language;
}

export interface Explanation {
  title: string;
  description: string;
}

export interface AnalyzeResponse {
  code: string;
  explanations: Explanation[];
}

const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:8000";

export const analyzeCode = async (
  request: AnalyzeRequest,
  token?: string
): Promise<AnalyzeResponse> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BACKEND_URL}/analyze`, {
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    let detail = await res.text();
    try {
      const json = JSON.parse(detail);
      detail = json.detail || json.error || JSON.stringify(json);
    } catch (_) {
      // keep original text
    }
    throw new Error(detail);
  }

  const data = await res.json();
  return data as AnalyzeResponse;
};
