import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bug, Code, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-background gradient-dark">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                <Bug className="w-8 h-8 text-primary-foreground" />
              </div>
              <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="gradient-text">Junior</span>
            <span className="text-foreground">Debug</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered code debugging and refactoring assistant designed for
            learners. Fix bugs, improve performance, and learn better coding
            practices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/debug">
                <Code className="w-5 h-5" />
                Start Debugging
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/features">Learn More</Link>
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Bug className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Smart Debugging</CardTitle>
              <CardDescription>
                Detect and fix syntax errors, logic mistakes, and common
                programming issues
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Code Refactoring</CardTitle>
              <CardDescription>
                Improve code readability, structure, and maintainability with AI
                suggestions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Learn as You Code</CardTitle>
              <CardDescription>
                Get clear explanations of what was changed and why, helping you
                learn better
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">
                Ready to improve your code?
              </h2>
              <p className="text-muted-foreground mb-6">
                Whether you're a beginner struggling with bugs or a developer
                looking to optimize code, JuniorDebug helps you write better
                code faster.
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link to="/debug">
                  <Code className="w-5 h-5" />
                  Try It Now
                </Link>
              </Button>
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

export default Home;
