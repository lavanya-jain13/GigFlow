import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SocketProvider } from "@/components/SocketProvider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import GigList from "@/pages/GigList";
import GigDetails from "@/pages/GigDetails";
import PostGig from "@/pages/PostGig";
import Dashboard from "@/pages/Dashboard";
import AuthPage from "@/pages/Auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/gigs" component={GigList} />
      <Route path="/gigs/:id" component={GigDetails} />
      <Route path="/post-gig" component={PostGig} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </SocketProvider>
    </QueryClientProvider>
  );
}

export default App;
