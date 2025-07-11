"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "./card";
import { Input } from "./input";
import { Button } from "./button";
import { Label } from "./label";
import { useAuth } from "@/hooks/useAuth";

interface RegisterFormInputs {
  name: string;
  department: string;
  otherDepartment?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const { register: registerField, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormInputs>();
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
  const { register: registerUser } = useAuth();
  const department = watch("department");
  const otherDepartment = watch("otherDepartment");

  const onSubmit = async (data: RegisterFormInputs) => {
    setRegisterError(null);
    setRegisterSuccess(false);
    if (data.password !== data.confirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }
    let departmentValue = data.department === "Other" ? data.otherDepartment || "Other" : data.department;
    const result = await registerUser(data.name, data.email, data.password, departmentValue);
    if (!result.success) {
      setRegisterError(result.error || "Registration failed");
    } else {
      setRegisterSuccess(true);
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
                {...registerField("name", { required: "Name is required" })}
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <select
                id="department"
                className="w-full border rounded px-3 py-2 mt-1"
                {...registerField("department", { required: "Department is required" })}
                disabled={isSubmitting}
                defaultValue=""
              >
                <option value="" disabled>Select Department</option>
                <option value="UniFAST">UniFAST</option>
                <option value="IZN">IZN</option>
                <option value="CoScho">CoScho</option>
                <option value="LSGO">LSGO</option>
                <option value="Scholarship">Scholarship</option>
                <option value="MIS">MIS</option>
                <option value="Other">Other</option>
              </select>
              {errors.department && <p className="text-sm text-destructive mt-1">{errors.department.message}</p>}
              {department === "Other" && (
                <div className="mt-2">
                  <Label htmlFor="otherDepartment">Specify Department</Label>
                  <Input
                    id="otherDepartment"
                    type="text"
                    placeholder="Enter department"
                    {...registerField("otherDepartment", { required: "Please specify your department" })}
                    disabled={isSubmitting}
                  />
                  {errors.otherDepartment && <p className="text-sm text-destructive mt-1">{errors.otherDepartment.message}</p>}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...registerField("email", { required: "Email is required", pattern: { value: /.+@.+\..+/, message: "Invalid email" } })}
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
                {...registerField("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
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
                {...registerField("confirmPassword", { required: "Please confirm your password" })}
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