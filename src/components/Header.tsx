import {
  Bug,
  Sparkles,
  Home,
  Code,
  Star,
  Settings,
  History,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import LoadingScreen from "@/components/ui/loading-screen";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
// OTP input removed — using email confirmation link instead
import supabase from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const location = useLocation();
  const { user } = useAuth();

  const baseNavItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/debug", label: "Debug", icon: Code },
    { path: "/features", label: "Features", icon: Star },
  ];

  // Authenticated-only pages will be available from the avatar menu
  const navItems = baseNavItems;

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                <Bug className="w-5 h-5 text-primary-foreground" />
              </div>
              <Sparkles className="w-3 h-3 text-primary absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="gradient-text">Junior</span>
                <span className="text-foreground">Debug</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                AI-Powered Code Assistant
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="sr-only sm:not-sr-only">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth area (tagline placed inside AuthControls to sit beside button) */}
          <div className="ml-4">
            <AuthControls />
          </div>
        </div>
      </div>
    </header>
  );
};

const AuthControls = () => {
  const { user, getAccessToken, signOut, authLoading, setAuthLoading } =
    useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | null>(
    null
  );
  // OTP flow removed: confirmation via email link

  const handleSignIn = async () => {
    setLoading(true);
    setAuthLoading(true);
    setMessage(null);
    setMessageType(null);
    try {
      const res = await supabase.auth.signInWithPassword({ email, password });
      if (res.error) {
        setMessage(res.error.message);
        setMessageType("error");
      } else {
        setMessage("Signed in");
        setMessageType("success");
      }
    } catch (e: any) {
      setMessage(e.message ?? String(e));
      setMessageType("error");
    } finally {
      setLoading(false);
      setAuthLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setAuthLoading(true);
    setMessage(null);
    setMessageType(null);
    try {
      if (password !== confirmPassword) {
        setMessage("Passwords do not match");
        setMessageType("error");
        setLoading(false);
        setAuthLoading(false);
        return;
      }
      // Prefer explicit redirect to the deployed frontend so the confirmation
      // link returns the user to the correct Vercel domain. Falls back to
      // window.location.origin when `VITE_FRONTEND_URL` is not set.
      const redirectTo =
        (import.meta.env.VITE_FRONTEND_URL as string) || window.location.origin;

      const res = await supabase.auth.signUp(
        { email, password },
        // supabase-js (v2) accepts a redirect option; Dashboard settings
        // also control redirects. Providing this helps ensure the link
        // targets the correct frontend host.
        { redirectTo }
      );
      if (res.error) {
        setMessage(res.error.message);
        setMessageType("error");
      } else {
        setMessage(
          "Confirmation email sent. Please click the link in your email to confirm your account."
        );
        setMessageType("success");
      }
    } catch (e: any) {
      setMessage(e.message ?? String(e));
      setMessageType("error");
    } finally {
      setLoading(false);
      setAuthLoading(false);
    }
  };

  // verifyOtp removed — relying on email confirmation link

  return (
    <div className="relative">
      {authLoading && (
        <LoadingScreen
          message={mode === "sign-in" ? "Signing in..." : "Creating account..."}
        />
      )}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Made for learners</span>
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-2">
                  <Avatar>
                    {user?.user_metadata?.avatar_url ? (
                      <AvatarImage src={user.user_metadata.avatar_url} />
                    ) : (
                      <AvatarFallback>
                        {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <div className="px-3 py-2">
                  <div className="text-sm font-semibold">My Account</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[15rem]">
                    {user?.email}
                  </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link to="/debug-history" className="flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Debug History
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-destructive"
                  onSelect={() => signOut()}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Dialog
            open={open}
            onOpenChange={(v) => {
              setOpen(v);
              if (!v) {
                setMode("sign-in");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setMessage(null);
              }
            }}
          >
            <div>
              <DialogTrigger asChild>
                <button className="px-3 py-1 rounded bg-primary text-primary-foreground text-sm">
                  Sign in
                </button>
              </DialogTrigger>
            </div>

            <DialogContent className="w-[380px] p-6 bg-card/70 backdrop-blur-md rounded-lg">
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {mode === "sign-in" ? "Sign in" : "Sign up"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {mode === "sign-in"
                        ? "Access Junior Debug with your account"
                        : "Create an account to access Junior Debug"}
                    </p>
                  </div>
                  {/* Use the dialog's built-in close button (provided by DialogContent) */}
                </div>

                <div className="mt-4">
                  <label className="text-xs">Email</label>
                  <input
                    className="w-full mt-1 p-3 rounded-md bg-input/80 placeholder:text-muted-foreground"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />

                  {mode === "sign-in" ? (
                    <>
                      <label className="text-xs mt-3">Password</label>

                      <input
                        type="password"
                        className="w-full mt-1 p-3 rounded-md bg-input/80 placeholder:text-muted-foreground"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                      />

                      <div className="mt-3">
                        <button
                          className="w-full px-3 py-2 rounded-md bg-primary text-primary-foreground"
                          onClick={handleSignIn}
                          disabled={loading}
                        >
                          Sign in
                        </button>
                      </div>

                      <div className="mt-2 text-sm text-muted-foreground text-center">
                        <button
                          className="hover:underline"
                          onClick={() => setMode("sign-up")}
                        >
                          Sign up
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <label className="text-xs mt-3">password</label>
                      <input
                        type="password"
                        className="w-full mt-1 p-3 rounded-md bg-input/80 placeholder:text-muted-foreground"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                      />

                      <label className="text-xs mt-3">Confirm password</label>
                      <input
                        type="password"
                        className="w-full mt-1 p-3 rounded-md bg-input/80 placeholder:text-muted-foreground"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="confirm password"
                      />

                      <div className="mt-3">
                        <button
                          className="w-full px-3 py-2 rounded-md bg-primary text-primary-foreground"
                          onClick={handleSignUp}
                          disabled={loading}
                        >
                          Create account
                        </button>
                      </div>

                      <div className="flex items-center justify-end mt-3">
                        <div className="text-sm text-muted-foreground">
                          <button
                            className="hover:underline"
                            onClick={() => {
                              setMode("sign-in");
                            }}
                          >
                            Back to sign in
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-4 text-xs text-muted-foreground">
                  {mode === "sign-in" ? "Or sign in with" : "Or sign up with"}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-muted text-sm"
                    onClick={() => handleOAuth("google")}
                  >
                    <span className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                      G
                    </span>
                    <span>Google</span>
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-muted text-sm"
                    onClick={() => handleOAuth("github")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-4 h-4 fill-current"
                    >
                      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.92 3.19 9.09 7.61 10.56.56.1.76-.24.76-.53 0-.26-.01-1.12-.02-2.03-3.09.67-3.74-1.32-3.74-1.32-.51-1.3-1.24-1.65-1.24-1.65-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.16 1.71 1.16.99 1.71 2.6 1.22 3.23.93.1-.73.39-1.22.71-1.5-2.47-.28-5.07-1.24-5.07-5.52 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.4.11-2.92 0 0 .95-.31 3.12 1.15.9-.25 1.86-.37 2.82-.37.96 0 1.92.12 2.82.37 2.17-1.47 3.12-1.15 3.12-1.15.61 1.52.23 2.64.11 2.92.72.78 1.16 1.78 1.16 3 0 4.29-2.61 5.24-5.09 5.52.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .29.2.64.77.53C19.06 20.84 22.25 16.67 22.25 11.75 22.25 5.48 17.27.5 11 .5z" />
                    </svg>
                    <span>GitHub</span>
                  </button>
                </div>

                {message && (
                  <div
                    className={
                      "mt-3 text-xs " +
                      (messageType === "error"
                        ? "text-destructive"
                        : "text-muted-foreground")
                    }
                  >
                    {message}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Header;
