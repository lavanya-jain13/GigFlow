import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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

interface GigCardProps {
  gig: Gig & { ownerId?: User };
  compact?: boolean;
}

export function GigCard({ gig, compact = false }: GigCardProps) {
  const isOpen = gig.status === 'open';

  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 border-border/50 bg-card ${!isOpen ? 'opacity-80' : ''}`}>
      <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${isOpen ? 'bg-primary' : 'bg-muted-foreground'}`} />
      
      <CardHeader className="pb-3 pt-6">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={isOpen ? "default" : "secondary"} className={isOpen ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20" : ""}>
                {gig.status === 'open' ? 'Open for Bids' : 'Assigned'}
              </Badge>
              {gig.createdAt && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(gig.createdAt), { addSuffix: true })}
                </span>
              )}
            </div>
            <Link href={`/gigs/${gig._id}`}>
              <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors cursor-pointer line-clamp-1">
                {gig.title}
              </h3>
            </Link>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold tracking-tight text-foreground flex items-center">
              <span className="text-sm text-muted-foreground font-normal mr-1">Budget</span>
              ${gig.budget}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
          {gig.description}
        </p>
      </CardContent>

      {!compact && (
        <CardFooter className="pt-0 flex items-center justify-between border-t bg-muted/20 p-4 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              {gig.ownerId?.name?.[0] || 'U'}
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Posted by {gig.ownerId?.name || 'Unknown'}
            </span>
          </div>
          
          <Link href={`/gigs/${gig._id}`}>
            <Button variant="ghost" size="sm" className="group/btn gap-1 hover:bg-primary hover:text-primary-foreground">
              View Details
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
