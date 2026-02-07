import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDuplicateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      console.log("Duplicating project", id);
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project duplicated");
    },
    onError: () => {
      toast.error("Failed to duplicate project");
    }
  });
};
