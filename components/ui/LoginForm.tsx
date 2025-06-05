"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "./card";
import { Input } from "./input";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

interface LoginFormInputs {
  email: string;
  password: string;
  remember: boolean;
}

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>();
  const [authError, setAuthError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormInputs) => {
    setAuthError(null);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    if (data.email !== "admin@example.com" || data.password !== "password") {
      setAuthError("Invalid email or password");
    } else {
      // Redirect or set auth state here
      alert("Login successful!");
    }
  };

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
                {...register("email", { required: "Email is required", pattern: { value: /.+@.+\..+/, message: "Invalid email" } })}
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
                {...register("password", { required: "Password is required" })}
                disabled={isSubmitting}
              />
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" {...register("remember")}/>
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
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
            <span className="text-sm text-muted-foreground">Don't have an account? <a href="#" className="text-primary hover:underline">Sign up</a></span>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 