import { useQuery } from "@tanstack/react-query";

export type ResponseType = {
  data: {
    id: string;
    json: string;
    width: number;
    height: number;
    name: string;
    updatedAt: string;
  }
};

export const useGetProject = (id: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["project", { id }],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
