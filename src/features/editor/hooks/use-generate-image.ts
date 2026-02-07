import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGenerateImage = () => {
  const mutation = useMutation({
    mutationFn: async ({ prompt }: { prompt: string }) => {
      // Dummy API call
      console.log("Generating image for prompt:", prompt);
      // Return a placeholder image
      return { data: "https://picsum.photos/1080/1080" };
    },
    onSuccess: () => {
      toast.success("Image generated");
    },
    onError: () => {
      toast.error("Failed to generate image");
    }
  });

  return mutation;
};
