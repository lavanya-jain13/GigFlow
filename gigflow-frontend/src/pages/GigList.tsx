import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useGigs } from "@/hooks/use-gigs";
import { GigCard } from "@/components/GigCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

type User = {
  _id: string;
  name: string;
  email: string;
};

type Gig = {
  _id: string;
  title: string;
  description: string;
  budget: number;
  status: "open" | "assigned";
  ownerId?: User;
  createdAt?: string;
};

export default function GigList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: gigs, isLoading } = useGigs();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is reactive to searchTerm state via useQuery key
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Browse Gigs</h1>
            <p className="text-muted-foreground">Find the perfect project that matches your skills.</p>
          </div>
          
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search gigs..." 
              className="pl-10 h-12 bg-card rounded-xl border-2 focus:border-primary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : gigs?.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/10">
            <h3 className="text-xl font-medium mb-2">No gigs found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search terms or check back later.</p>
            <Button onClick={() => setSearchTerm("")} variant="outline">Clear Search</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs?.map((gig: Gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
