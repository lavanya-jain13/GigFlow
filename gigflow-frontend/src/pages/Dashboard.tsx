import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useMyGigs, useHireFreelancer } from "@/hooks/use-gigs";
import { GigCard } from "@/components/GigCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: myGigs = [], isLoading: gigsLoading } = useMyGigs();
  const hireFreelancer = useHireFreelancer();

  const { data: receivedBids = [] } = useQuery({
    queryKey: ["received-bids"],
    queryFn: async () => {
      const res = await api.get("/bids/received");
      return res.data;
    },
    enabled: !!user,
  });

  if (authLoading || gigsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-20">
          <p>Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your posted projects
            </p>
          </div>

          <Link href="/post-gig">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="posted">
          <TabsList>
            <TabsTrigger value="posted">Posted Gigs</TabsTrigger>
            <TabsTrigger value="bids">Received Bids ({receivedBids.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="posted">
            {myGigs.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <p className="mb-4">No gigs posted yet</p>
                  <Link href="/post-gig">
                    <Button>Post your first gig</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myGigs.map((gig: any) => (
                  <GigCard key={gig._id} gig={gig} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bids">
            {receivedBids.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <p>No bids received yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {receivedBids.map((bid: any) => (
                  <Card key={bid._id}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 flex-1">
                          <p className="font-semibold">
                            Gig: {bid.gigId?.title || 'Unknown Gig'}
                          </p>

                          <p>
                            Freelancer:{" "}
                            <span className="font-medium">
                              {bid.freelancerId?.name || 'Unknown Freelancer'}
                            </span>
                          </p>

                          <p>Price: ₹{bid.price}</p>

                          <p className="text-muted-foreground text-sm">
                            {bid.message}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            {bid.status === 'hired' && (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Hired</span>
                              </div>
                            )}
                            {bid.status === 'rejected' && (
                              <div className="flex items-center gap-1 text-red-600">
                                <XCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Rejected</span>
                              </div>
                            )}
                            {bid.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => hireFreelancer.mutate(bid._id)}
                                disabled={hireFreelancer.isPending}
                              >
                                {hireFreelancer.isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : null}
                                Hire
                              </Button>
                            )}
                          </div>

                          <span className={`text-xs px-2 py-1 rounded-full ${
                            bid.status === 'hired'
                              ? 'bg-green-100 text-green-800'
                              : bid.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {bid.status || 'pending'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

