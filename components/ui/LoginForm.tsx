"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "./card";
import { Input } from "./input";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Label } from "./label";
import { useAuth } from "@/hooks/useAuth";
import { LoginSchema, type LoginData } from "@/lib/validations";

// Simple extended schema for login form
const LoginFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

interface LoginFormInputs extends z.infer<typeof LoginFormSchema> {}

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    }
  });

  const onSubmit = async (data: LoginFormInputs) => {
    // Prevent submission if not properly mounted
    if (!isMounted) return;
    
    setAuthError(null);
    const result = await login(data.email, data.password);
    if (!result.success) {
      setAuthError(result.error || "Invalid email or password");
    } else {
      router.push("/");
    }
  };

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="space-y-4 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-md shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>Enter your credentials below to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                disabled={isSubmitting}
              />
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" {...register("remember")}/>
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <a href="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</a>
            </div>
            {authError && <p className="text-sm text-destructive mt-1">{authError}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
            <div className="flex items-center my-2">
              <div className="flex-grow border-t border-muted-foreground/20" />
              <span className="mx-2 text-xs text-muted-foreground">or</span>
              <div className="flex-grow border-t border-muted-foreground/20" />
            </div>
            <div className="flex flex-col gap-2">
              <Button type="button" variant="outline" className="w-full" onClick={() => alert("Google login stub")}>Sign in with Google</Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => alert("Facebook login stub")}>Sign in with Facebook</Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <span className="text-sm text-muted-foreground">Don't have an account? <a href="/register" className="text-primary hover:underline">Sign up</a></span>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 