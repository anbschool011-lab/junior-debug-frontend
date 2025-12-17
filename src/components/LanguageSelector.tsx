import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Code } from "lucide-react";

export type Language = "javascript" | "typescript" | "python" | "php" | "html" | "css" | "java" | "csharp" | "go" | "rust";

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const languages = [
  { id: "javascript" as Language, label: "JavaScript" },
  { id: "typescript" as Language, label: "TypeScript" },
  { id: "python" as Language, label: "Python" },
  { id: "php" as Language, label: "PHP" },
  { id: "html" as Language, label: "HTML" },
  { id: "css" as Language, label: "CSS" },
  { id: "java" as Language, label: "Java" },
  { id: "csharp" as Language, label: "C#" },
  { id: "go" as Language, label: "Go" },
  { id: "rust" as Language, label: "Rust" },
];

const LanguageSelector = ({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Code className="w-4 h-4 text-primary" />
        Language
      </label>
      <Select value={selectedLanguage} onValueChange={(value) => onLanguageChange(value as Language)}>
        <SelectTrigger className="w-full bg-card border-border">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {languages.map((lang) => (
            <SelectItem key={lang.id} value={lang.id} className="cursor-pointer">
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;