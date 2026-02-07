import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateProject = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      // Dummy API call
      console.log("Updating project", id, values);
      return { data: values };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", { id }] });
    },
    onError: () => {
      toast.error("Failed to update project");
    }
  });

  return mutation;
};
