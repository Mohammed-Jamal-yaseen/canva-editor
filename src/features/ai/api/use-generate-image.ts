import { useMutation } from "@tanstack/react-query";

type ResponseType = { data: string[] }; // Replicate returns an array of URLs usually
type RequestType = { prompt: string };

export const useGenerateImage = () => {
  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await fetch("/api/ai/generate-image", {
        method: "POST",
        body: JSON.stringify(json),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      return await response.json();
    },
  });

  return mutation;
};

