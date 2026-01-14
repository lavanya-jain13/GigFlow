import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase } from "lucide-react";


const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  useEffect(() => {
    if (user) setLocation("/dashboard");

    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "register") {
      setActiveTab("register");
    }
  }, [user, setLocation]);

  /* =======================
     FORMS
  ======================= */
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT: FORM */}
      <div className="flex items-center justify-center p-4 lg:p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight">
                GigFlow
              </span>
            </div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Enter your details to access your account.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
            <TabsList className="grid grid-cols-2 mb-8 h-12 rounded-xl bg-muted/50 p-1">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login">
              <form
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="space-y-4"
              >
                <Input
                  type="email"
                  placeholder="Email"
                  {...loginForm.register("email")}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  {...loginForm.register("password")}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in..." : "Log In"}
                </Button>
              </form>
            </TabsContent>

            {/* REGISTER */}
            <TabsContent value="register">
              <form
                onSubmit={registerForm.handleSubmit(onRegister)}
                className="space-y-4"
              >
                <Input placeholder="Full name" {...registerForm.register("name")} />
                <Input
                  placeholder="Username"
                  {...registerForm.register("username")}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  {...registerForm.register("email")}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  {...registerForm.register("password")}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending
                    ? "Creating account..."
                    : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* RIGHT: VISUAL */}
      <div className="hidden lg:flex items-center justify-center bg-muted/20">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
          className="rounded-2xl w-3/4 shadow-xl"
          alt="Collaboration"
        />
      </div>
    </div>
  );
}
