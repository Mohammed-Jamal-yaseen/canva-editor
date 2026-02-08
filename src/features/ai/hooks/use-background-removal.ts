// hooks/use-bg-removal.ts
import { useState, useCallback } from "react";

export const useBgRemoval = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeBg = useCallback(async (source: string | Blob) => {
    setLoading(true);
    setError(null);
    try {
      // Dynamic import prevents the heavy library from slowing down initial page load
      const { removeBackground } = await import("@imgly/background-removal");

      let input = source;

      // Pre-fetch to handle CORS issues explicitly and provide better error messages
      if (typeof source === "string" && !source.startsWith("data:")) {
        try {
          const response = await fetch(source);
          if (!response.ok) throw new Error("Failed to fetch image");
          input = await response.blob();
        } catch (fetchErr) {
          console.error("Fetch failed:", fetchErr);
          throw new Error("Could not access image. This is usually due to CORS restrictions. Try downloading and re-uploading the image.");
        }
      }

      const blob = await removeBackground(input, {
        device: undefined, 
        model: "isnet", 
        debug: true,
        publicPath: "https://cdn.jsdelivr.net/npm/@imgly/background-removal-data@1.7.0/dist/",
        progress: (key, current, total) => {
          // Progress tracking can be implemented here if needed
        },
      });

      return URL.createObjectURL(blob);
    } catch (e: any) {
      console.error("BG_REMOVAL_ENGINE_ERROR:", e);
      // More descriptive error messages for Wasm/Service worker failures
      const message = e?.message || "Background removal failed. This may be due to browser limitations or blocked assets.";
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { removeBg, loading, error };
};