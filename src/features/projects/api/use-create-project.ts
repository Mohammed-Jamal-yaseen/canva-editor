import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: { 
      name: string, 
      json: string, 
      width: number, 
      height: number 
    }) => {
      // Dummy API call
      console.log("Creating project", values);
      return { 
        data: { 
          id: Math.random().toString(36).substring(7),
          ...values 
        } 
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return mutation;
};
