import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  email: string;
  name?: string;
};

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Current user
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["auth-me"],
    queryFn: async () => {
      try {
        const res = await api.get("/auth/me");
        return res.data;
      } catch (err: any) {
        if (err.response?.status === 401) {
          // User is not authenticated - this is expected
          return null;
        }
        // Log other errors but don't throw them to avoid breaking the app
        console.warn('Auth check failed:', err.message);
        return null;
      }
    },
    retry: false,
  });

  // Login
  const loginMutation = useMutation({
    mutationFn: async (credentials: {
      email: string;
      password: string;
    }) => {
      const res = await api.post("/auth/login", credentials);
      return res.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth-me"], user);
      toast({
        title: "Welcome back",
        description: `Logged in as ${user.email}`,
      });
    },
    onError: () => {
      toast({
        title: "Login failed",
        description: "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  // Register
  const registerMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
    }) => {
      await api.post("/auth/register", data);
    },
    onSuccess: () => {
      toast({
        title: "Account created",
        description: "You can now log in",
      });
    },
    onError: () => {
      toast({
        title: "Registration failed",
        description: "Unable to create account",
        variant: "destructive",
      });
    },
  });

  // Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged out",
      });
    },
  });

  return {
    user,
    isLoading,
    loginMutation,
    registerMutation,
    logoutMutation,
  };
}
