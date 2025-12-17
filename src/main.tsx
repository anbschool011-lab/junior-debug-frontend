import { createRoot } from "react-dom/client";
import "./index.css";

async function bootstrap() {
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
