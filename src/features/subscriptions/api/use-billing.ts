import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useBilling = () => {
  const mutation = useMutation({
    mutationFn: async () => {
      // Mock billing
      console.log("Billing triggered");
      return { url: "#" };
    },
    onSuccess: () => {
      toast.success("Billing simulation successful");
    },
    onError: () => {
      toast.error("Failed to trigger billing");
    }
  });

  return mutation;
};
