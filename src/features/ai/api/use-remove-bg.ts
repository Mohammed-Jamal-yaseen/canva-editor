import { useMutation } from "@tanstack/react-query";

type ResponseType = { data: string };
type RequestType = { image: string };

export const useRemoveBg = () => {
  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await fetch("/api/ai/remove-bg", {
        method: "POST",
        body: JSON.stringify(json),
      });

      if (!response.ok) {
        throw new Error("Failed to remove background");
      }

      return await response.json();
    },
  });

  return mutation;
};

