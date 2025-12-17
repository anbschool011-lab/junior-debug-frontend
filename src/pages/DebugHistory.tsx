import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DebugHistoryItem {
  id: string;
  timestamp: string;
  code: string;
  task: string;
  model: string;
  language: string;
  result: string;
}

const DebugHistory = () => {
  const { getAccessToken } = useAuth();
  const [history, setHistory] = useState<DebugHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view debug history",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // TODO: Implement backend endpoint to fetch user debug history
      // For now, show empty state
      setHistory([]);
    } catch (error) {
      toast({
        title: "Error loading history",
        description: "Failed to load debug history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      // TODO: Implement backend endpoint to clear history
      setHistory([]);
      toast({
        title: "History cleared",
        description: "All debug history has been removed",
      });
    } catch (error) {
      toast({
        title: "Error clearing history",
        description: "Failed to clear debug history",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background gradient-dark">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">Loading history...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background gradient-dark">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Debug History
            </h1>
            <p className="text-muted-foreground mt-2">
              View your past code analysis sessions
            </p>
          </div>
          {history.length > 0 && (
            <Button
              variant="destructive"
              onClick={clearHistory}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No debug history yet
              </h3>
              <p className="text-muted-foreground text-center">
                Your code analysis sessions will appear here once you start
                debugging.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {item.task} - {item.language}
                    </CardTitle>
                    <Badge variant="secondary">{item.model}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Input Code:</h4>
                      <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                        {item.code}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Analysis Result:</h4>
                      <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                        {item.result}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DebugHistory;
