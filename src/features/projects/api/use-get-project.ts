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
    queryKey: ["project", { id }],
    queryFn: async () => {
      // Dummy data
      return {
        id,
        json: "",
        width: 1080,
        height: 1080,
        name: "Untitled project",
        updatedAt: new Date().toISOString(),
      };
    },
  });

  return query;
};
