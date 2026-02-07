import { useQuery } from "@tanstack/react-query";

export const useGetSubscription = () => {
  const query = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      // Mock subscription for now as Hono backend is removed
      return {
        active: false,
        planId: "free",
        customerId: "mock_customer_id",
      };
    },
  });

  return query;
};
