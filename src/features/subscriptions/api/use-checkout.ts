import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCheckout = () => {
  const mutation = useMutation({
    mutationFn: async () => {
      // Mock checkout
      console.log("Checkout triggered");
      return { url: "#" };
    },
    onSuccess: () => {
      toast.success("Checkout simulation successful");
    },
    onError: () => {
      toast.error("Failed to trigger checkout");
    }
  });

  return mutation;
};
