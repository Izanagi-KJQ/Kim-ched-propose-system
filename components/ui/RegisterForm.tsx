"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "./card";
import { Input } from "./input";
import { Button } from "./button";
import { Label } from "./label";

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormInputs>();
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);

  const onSubmit = async (data: RegisterFormInputs) => {
    setRegisterError(null);
    setRegisterSuccess(false);
    if (data.password !== data.confirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password
        })
      });
      if (!res.ok) {
        throw new Error("Registration failed");
      }
      setRegisterSuccess(true);
    } catch (err) {
      setRegisterError((err as Error).message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-md shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Fill in the details below to register.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                autoComplete="name"
                {...register("name", { required: "Name is required" })}
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
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
                autoComplete="new-password"
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                disabled={isSubmitting}
              />
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("confirmPassword", { required: "Please confirm your password" })}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>}
            </div>
            {registerError && <p className="text-sm text-destructive mt-1">{registerError}</p>}
            {registerSuccess && <p className="text-sm text-green-600 mt-1">Registration successful! You can now <a href="/login" className="underline text-primary">login</a>.</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Sign Up"}
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <span className="text-sm text-muted-foreground">Already have an account? <a href="/login" className="text-primary hover:underline">Sign in</a></span>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 