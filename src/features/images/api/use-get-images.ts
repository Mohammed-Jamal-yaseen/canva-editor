import { useQuery } from "@tanstack/react-query";

export const useGetImages = (query?: string) => {
  const queryKey = ["images", { query }];
  const queryFn = async () => {
      const response = await fetch(`/api/images?query=${query || ""}`);


      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch images");
      }

      const { data } = await response.json();
      return data;
  };

  return useQuery({ queryKey, queryFn });
};




