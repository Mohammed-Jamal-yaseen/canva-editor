import { useQuery } from "@tanstack/react-query";

export type ResponseType = {
  data: {
    id: string;
    name: string;
    thumbnailUrl: string | null;
    isPro: boolean;
    width: number;
    height: number;
    json: string;
    updatedAt: string;
  }[];
};

export const useGetTemplates = (apiQuery: { limit: string; page: string; search?: string }) => {
  return useQuery({
    queryKey: ["templates", { limit: apiQuery.limit, page: apiQuery.page, search: apiQuery.search }],
    queryFn: async () => {
      const response = await fetch(`/api/projects/templates?limit=${apiQuery.limit}&page=${apiQuery.page}&search=${apiQuery.search || ""}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }

      const { data } = await response.json();
      return data;
    },
  });
};

