import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Key, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoadingScreen from "@/components/ui/loading-screen";
import { useNavigate } from "react-router-dom";

const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:8000";

const detectProvider = (key: string) => {
  if (!key) return null;
  const k = key.trim();
  if (k.startsWith("sk-")) return "OpenAI";
  if (k.startsWith("ya29.") || k.startsWith("AIza") || k.startsWith("gcp-"))
    return "Gemini";
  return "Unknown";
};

export default function Settings() {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [loadingKey, setLoadingKey] = useState<boolean>(false);
  const { getAccessToken } = useAuth();

  const saveKey = async () => {
    setStatus(null);
    setSaving(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BACKEND_URL}/save-api-key`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ api_key: apiKey }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data?.detail || data?.error || "Failed to save API key";
        const lower = (message || "").toLowerCase();
        if (
          lower.includes("leak") ||
          lower.includes("leaked") ||
          lower.includes("reported")
        ) {
          setStatus("AI provider key invalid — rotate your key in Settings.");
        } else {
          setStatus("Failed to save API key");
        }
        return;
      }
      // Backend returns masked key for display
      if (data?.api_key) setApiKey(data.api_key);
      setProvider(detectProvider(data?.api_key ?? apiKey));
      setStatus("Saved");
      // saved
    } catch (e: any) {
      setStatus(e?.message ?? "Error");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    // Load existing masked key on mount
    (async () => {
      setLoadingKey(true);
      try {
        const token = await getAccessToken();
        const res = await fetch(`${BACKEND_URL}/get-api-key`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.status === "ok" && data?.api_key) {
          setApiKey(data.api_key);
          setProvider(detectProvider(data.api_key));
          setStatus("Loaded saved key");
        }
      } catch (e) {
        // ignore load errors silently
      } finally {
        setLoadingKey(false);
      }
    })();
  }, [getAccessToken]);

  const deleteKey = async () => {
    setStatus(null);
    setDeleting(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BACKEND_URL}/delete-api-key`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus(data?.detail || "Failed to delete key");
        return;
      }
      setApiKey("");
      setProvider(null);
      setStatus("Deleted");
    } catch (e: any) {
      setStatus(e?.message ?? "Error");
    } finally {
      setDeleting(false);
    }
  };

  // testKey removed per request

  const navigate = useNavigate();

  return (
    <div className="p-6">
      {loadingKey && <LoadingScreen message="Loading saved API key..." />}
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <div className="w-12 h-12 rounded-lg bg-card flex items-center justify-center">
              <Key className="w-6 h-6 text-white-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Settings</h1>
              <p className="text-sm text-muted-foreground">
                Manage your application preferences
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>AI API Key</CardTitle>
            <CardDescription>
              Connect your AI provider to enable intelligent features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="pr-12"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Your API key is encrypted and stored securely
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={saveKey} variant={"default"}>
                  Save Key
                </Button>
                {apiKey && (
                  <>
                    <Button
                      onClick={() => setConfirmOpen(true)}
                      variant={"destructive"}
                    >
                      Delete Key
                    </Button>

                    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete saved API key?</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                          This will remove the saved API key from your account.
                          Are you sure you want to continue?
                        </DialogDescription>
                        <DialogFooter className="mt-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              onClick={() => setConfirmOpen(false)}
                            >
                              No
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={async () => {
                                setConfirmOpen(false);
                                await deleteKey();
                              }}
                            >
                              Yes
                            </Button>
                          </div>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
                <div className="text-sm text-muted-foreground">
                  Detected provider:{" "}
                  <span className="font-medium ml-1">{provider ?? "—"}</span>
                </div>
              </div>
              {status && <div className="mt-2 text-sm">{status}</div>}
              {(saving || deleting) && (
                <LoadingScreen
                  message={saving ? "Saving API key..." : "Deleting API key..."}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                O
              </div>
              <div>
                <div className="font-semibold">OpenAI</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Keys start with <Badge variant="outline">sk-</Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-amber-900/20 flex items-center justify-center text-amber-400">
                A
              </div>
              <div>
                <div className="font-semibold">Anthropic</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Keys start with <Badge variant="outline">ant-</Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-sky-900/20 flex items-center justify-center text-sky-400">
                G
              </div>
              <div>
                <div className="font-semibold">Google AI</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Keys start with <Badge variant="outline">AIza</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
