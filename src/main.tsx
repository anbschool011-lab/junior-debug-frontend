import { createRoot } from "react-dom/client";
import "./index.css";
import supabase from "./lib/supabase";

async function handleAuthRedirect() {
  // If the URL contains auth query/hash params from Supabase (magic link,
  // OAuth redirect), let the Supabase client parse and store the session.
  try {
    const raw = window.location.href;
    if (
      raw.includes("access_token") ||
      raw.includes("refresh_token") ||
      raw.includes("provider_token") ||
      raw.includes("type")
    ) {
      // supabase-js v2: getSessionFromUrl will parse the URL and store the
      // session in local storage. We call it conditionally to avoid handling
      // unrelated navigations.
      // @ts-ignore -- method exists on the client at runtime
      await supabase.auth.getSessionFromUrl({ storeSession: true });
      // Clean up URL to remove sensitive tokens from the address bar
      try {
        const url = new URL(window.location.href);
        url.hash = "";
        url.search = "";
        window.history.replaceState({}, document.title, url.toString());
      } catch (_) {
        /* ignore */
      }

      // After processing the auth link, ensure the user lands on Home (/).
      // Use the configured `VITE_FRONTEND_URL` when provided, otherwise use
      // the current origin. Only redirect if not already on the root path.
      try {
        const redirectHost =
          (import.meta.env.VITE_FRONTEND_URL as string) ||
          window.location.origin;
        const currentPath = window.location.pathname;
        if (currentPath !== "/") {
          window.location.replace(redirectHost.replace(/\/$/, "") + "/");
        }
      } catch (_) {
        try {
          if (window.location.pathname !== "/") window.location.replace("/");
        } catch (
          __
          /* ignore */
        ) {}
      }
    }
  } catch (e) {
    console.warn("Auth redirect handling failed:", e);
  }
}

async function bootstrap() {
  await handleAuthRedirect();
  try {
    const rootEl = document.getElementById("root");
    if (!rootEl) throw new Error("Root element not found");
    const { default: App } = await import("./App");
    const root = createRoot(rootEl);
    root.render(<App />);
  } catch (err: any) {
    // Ensure any client-side error renders to the page for easier debugging
    console.error("App bootstrap error:", err);
    const rootEl = document.getElementById("root");
    if (rootEl) {
      rootEl.style.padding = "24px";
      rootEl.style.color = "red";
      rootEl.innerText = `Application error: ${err?.message ?? String(err)}`;
    }
  }
}

bootstrap();
