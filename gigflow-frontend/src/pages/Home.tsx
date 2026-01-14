import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGigs } from "@/hooks/use-gigs";
import { GigCard } from "@/components/GigCard";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Search, Zap, Shield, Users } from "lucide-react";

export default function Home() {
  const { data: gigs, isLoading } = useGigs();
  const featuredGigs = gigs?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-50 -translate-y-1/2 translate-x-1/3" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-foreground leading-[1.1]">
              Find the perfect <span className="text-gradient">freelance</span> services for your business
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              GigFlow connects top-tier talent with ambitious businesses. Post a job or find your next big project today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/gigs">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-200">
                  <Search className="w-5 h-5 mr-2" />
                  Find Work
                </Button>
              </Link>
              <Link href="/post-gig">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-secondary/50">
                  Post a Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fast & Efficient</h3>
              <p className="text-muted-foreground">Connect with freelancers in minutes, not days. Get your project started immediately.</p>
            </div>
            <div className="bg-background p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
              <p className="text-muted-foreground">Your money is held safely until you're satisfied with the work delivered.</p>
            </div>
            <div className="bg-background p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Vetted Talent</h3>
              <p className="text-muted-foreground">Access a global network of professional freelancers across every industry.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Gigs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Opportunities</h2>
              <p className="text-muted-foreground">Fresh gigs posted by top clients</p>
            </div>
            <Link href="/gigs">
              <Button variant="ghost" className="hidden sm:flex group">
                View All Gigs 
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredGigs.map((gig: any) => (
                <GigCard key={gig._id} gig={gig} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center sm:hidden">
            <Link href="/gigs">
              <Button size="lg" className="w-full">View All Gigs</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground mt-auto relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2850&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        {/* Unsplash image: team working together */}
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to get started?</h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of freelancers and businesses building the future of work together.
          </p>
          <Link href="/auth?tab=register">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
