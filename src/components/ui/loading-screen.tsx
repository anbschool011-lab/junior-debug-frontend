import React from "react";
import { createPortal } from "react-dom";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  const overlay = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40">
      <div
        className="flex flex-col items-center gap-4 bg-card/90 rounded-xl backdrop-blur-md"
        style={{
          padding: "2rem",
          minWidth: 320,
          boxShadow:
            "0 10px 40px rgba(59,130,246,0.28), 0 0 120px rgba(59,130,246,0.12)",
        }}
      >
        <div className="w-20 h-20 border-4 border-t-primary border-gray-200 rounded-full animate-spin" />
        <div className="text-sm text-foreground">{message ?? "Loading..."}</div>
      </div>
    </div>
  );

  if (typeof document !== "undefined" && document.body) {
    return createPortal(overlay, document.body);
  }

  return overlay;
};

export default LoadingScreen;
