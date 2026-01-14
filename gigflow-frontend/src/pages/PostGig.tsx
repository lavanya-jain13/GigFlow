import { Navbar } from "@/components/Navbar";
import { useCreateGig } from "@/hooks/use-gigs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLocation } from "wouter";
import { z } from "zod";

/* =======================
   SCHEMA (FRONTEND ONLY)
======================= */
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  budget: z.coerce.number().min(1, "Budget must be at least $1"),
});

type FormData = z.infer<typeof formSchema>;

export default function PostGig() {
  const [, setLocation] = useLocation();
  const createGig = useCreateGig();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    createGig.mutate(data, {
      onSuccess: () => setLocation("/dashboard"),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Post a New Gig</h1>
            <p className="text-muted-foreground">
              Tell us what you need done and connect with talent.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Be specific about your requirements
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Input
                    placeholder="Project title"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="number"
                    placeholder="Budget ($)"
                    {...register("budget")}
                  />
                  {errors.budget && (
                    <p className="text-xs text-destructive">
                      {errors.budget.message}
                    </p>
                  )}
                </div>

                <div>
                  <Textarea
                    placeholder="Describe the work in detail..."
                    {...register("description")}
                    className="min-h-[160px]"
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setLocation("/")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createGig.isPending}
                  >
                    {createGig.isPending ? "Publishing..." : "Publish Gig"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
