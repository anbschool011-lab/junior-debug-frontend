import Header from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bug,
  Code,
  Sparkles,
  Zap,
  FileText,
  Settings,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  const features = [
    {
      icon: Bug,
      title: "Intelligent Bug Detection",
      description:
        "Advanced AI algorithms detect syntax errors, logic mistakes, and common programming pitfalls across multiple languages.",
      benefits: [
        "Multi-language support",
        "Real-time error detection",
        "Context-aware suggestions",
      ],
    },
    {
      icon: Code,
      title: "Smart Code Refactoring",
      description:
        "Automatically improve code structure, readability, and maintainability while preserving functionality.",
      benefits: [
        "Performance optimization",
        "Best practices enforcement",
        "Clean code principles",
      ],
    },
    {
      icon: Sparkles,
      title: "AI-Powered Explanations",
      description:
        "Get detailed, easy-to-understand explanations of what was changed and why, helping you learn as you code.",
      benefits: [
        "Educational approach",
        "Step-by-step reasoning",
        "Learning reinforcement",
      ],
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description:
        "Identify and fix performance bottlenecks, optimize algorithms, and improve code efficiency.",
      benefits: [
        "Speed improvements",
        "Memory optimization",
        "Algorithm analysis",
      ],
    },
    {
      icon: FileText,
      title: "Comment Generation",
      description:
        "Automatically add meaningful comments to your code, making it more readable and maintainable.",
      benefits: [
        "Documentation assistance",
        "Code clarity",
        "Team collaboration",
      ],
    },
    {
      icon: Settings,
      title: "Flexible Task Selection",
      description:
        "Choose from various analysis modes: Debug Only, Refactor Only, Debug + Refactor, and more.",
      benefits: [
        "Customizable workflows",
        "Targeted improvements",
        "Workflow efficiency",
      ],
    },
  ];

  const supportedLanguages = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "HTML",
    "CSS",
    "SQL",
  ];

  return (
    <div className="min-h-screen bg-background gradient-dark">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <section className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Powerful Features for
            <span className="gradient-text block">Better Coding</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover all the tools and capabilities that make JuniorDebug the
            perfect companion for developers at every level.
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <feature.icon className="w-12 h-12 mb-4 text-primary" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Supported Languages */}
        <section className="mb-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Supported Languages</CardTitle>
              <CardDescription>
                JuniorDebug works with a wide range of programming languages and
                markup formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 justify-center">
                {supportedLanguages.map((lang) => (
                  <Badge key={lang} variant="secondary" className="text-sm">
                    {lang}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">
                Experience the Power of AI-Assisted Debugging
              </h2>
              <p className="text-muted-foreground mb-6">
                Ready to transform your coding experience? Start using
                JuniorDebug today and see the difference AI can make in your
                development workflow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/debug">
                    <Code className="w-5 h-5" />
                    Start Debugging
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
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

export default Features;
