import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { publicApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

/* =======================
   FETCH ALL GIGS
======================= */
export function useGigs() {
  return useQuery({
    queryKey: ["gigs"],
    queryFn: async () => {
      const res = await publicApi.get("/gigs");
      return res.data;
    },
  });
}

/* =======================
   FETCH SINGLE GIG
======================= */
export function useGig(id: string) {
  return useQuery({
    queryKey: ["gig", id],
    queryFn: async () => {
      const res = await publicApi.get("/gigs");
      return res.data.find((g: any) => g._id === id);
    },
    enabled: !!id,
  });
}

/* =======================
   CREATE GIG
======================= */
export function useCreateGig() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      budget: number;
    }) => {
      await api.post("/gigs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gigs"] });
      toast({
        title: "Gig posted",
        description: "Your gig has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create gig",
        variant: "destructive",
      });
    },
  });
}

/* =======================
   CREATE BID
======================= */
export function useCreateBid() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      gigId: string;
      message: string;
      price: number;
    }) => {
      await api.post("/bids", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gigs"] });
      toast({
        title: "Bid submitted",
        description: "Your proposal has been sent.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit bid",
        variant: "destructive",
      });
    },
  });
}

/* =======================
   FETCH USER'S GIGS
======================= */
export function useMyGigs() {
  return useQuery({
    queryKey: ["my-gigs"],
    queryFn: async () => {
      const res = await api.get("/gigs/my");
      return res.data;
    },
  });
}

/* =======================
   HIRE FREELANCER
======================= */
export function useHireFreelancer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (bidId: string) => {
      await api.patch(`/bids/${bidId}/hire`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gigs"] });
      queryClient.invalidateQueries({ queryKey: ["my-gigs"] });
      queryClient.invalidateQueries({ queryKey: ["received-bids"] });
      toast({
        title: "Freelancer hired",
        description: "The gig has been assigned successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to hire freelancer",
        variant: "destructive",
      });
    },
  });
}
