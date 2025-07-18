"use client";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "./card";
import { Input } from "./input";
import { Button } from "./button";
import { Label } from "./label";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, User, Mail, Lock, Briefcase, CheckCircle, XCircle, Info, AlertTriangle, CheckCircle as SuccessIcon, Loader2, } from "lucide-react";
import zxcvbn from "zxcvbn";

// Extend the Window interface to include google
declare global {
  interface Window {
    google?: any;
  }
}

// Add Google icon SVG
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" width={20} height={20} {...props} aria-hidden="true">
    <g>
      <path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.5l6-6C36.1 5.1 30.4 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.2-.3-3.5z"/>
      <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.3 16.1 18.7 13 24 13c2.7 0 5.2.9 7.2 2.5l6-6C36.1 5.1 30.4 3 24 3 15.1 3 7.4 8.7 6.3 14.7z"/>
      <path fill="#FBBC05" d="M24 43c5.4 0 10-1.8 13.3-4.9l-6.1-5c-2.1 1.5-4.8 2.4-7.2 2.4-5.6 0-10.3-3.8-12-9l-6.5 5C7.3 39.3 14.9 43 24 43z"/>
      <path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.1 3-4.1 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.5l6-6C36.1 5.1 30.4 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.2-.3-3.5z"/>
    </g>
  </svg>
);

interface RegisterFormInputs {
  firstName: string;
  middleName?: string;
  lastName: string;
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
  const { register: registerUser, loginWithGoogle } = useAuth();
  const department = watch("department");
  const otherDepartment = watch("otherDepartment");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = watch("password");
  const passwordStrength = password ? zxcvbn(password) : null;
  const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-green-600"
  ];

  // Password requirements
  const requirements = [
    {
      label: "At least 8 characters",
      test: (pw: string) => pw.length >= 8,
    },
    {
      label: "At least one uppercase letter",
      test: (pw: string) => /[A-Z]/.test(pw),
    },
    {
      label: "At least one lowercase letter",
      test: (pw: string) => /[a-z]/.test(pw),
    },
    {
      label: "At least one number",
      test: (pw: string) => /[0-9]/.test(pw),
    },
    {
      label: "At least one symbol",
      test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
    },
  ];
  const unmet = requirements.filter(r => !r.test(password || ""));
  const allMet = unmet.length === 0 && password;

  // Dynamic tips
  const tips = unmet.map(r => r.label);

  const onSubmit = async (data: RegisterFormInputs) => {
    setRegisterError(null);
    setRegisterSuccess(false);
    if (data.password !== data.confirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }
    let departmentValue = data.department === "Other" ? data.otherDepartment || "Other" : data.department;
    const result = await registerUser(data.firstName, data.middleName, data.lastName, data.email, data.password, departmentValue);
    if (!result.success) {
      setRegisterError(result.error || "Registration failed");
    } else {
      setRegisterSuccess(true);
    }
  };

  const googleButtonRef = useRef<HTMLButtonElement>(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Load Google Identity Services script
  useEffect(() => {
    if (window.google && window.google.accounts) {
      setGoogleLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleLoaded(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  async function handleGoogleCredentialResponse(response: any) {
    setRegisterError(null);
    setRegisterSuccess(false);
    setGoogleLoading(true);
    try {
      const result = await loginWithGoogle(response.credential);
      if (!result.success) {
        setRegisterError(result.error || "Google authentication failed");
        setRegisterSuccess(false);
      } else {
        setRegisterSuccess(true);
        // Optionally redirect to dashboard or home
        window.location.href = "/";
      }
    } catch (err: any) {
      setRegisterError(err.message || "Google authentication failed");
      setRegisterSuccess(false);
    } finally {
      setGoogleLoading(false);
    }
  }

  // Initialize Google Sign-In (One Tap or Prompt)
  useEffect(() => {
    if (!googleLoaded || !(window as any).google) return;
    const google = (window as any).google;
    if (!google.accounts || !google.accounts.id) return;
    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
      callback: handleGoogleCredentialResponse,
      ux_mode: "popup",
    });
    // Optionally, you can render the default Google button:
    // google.accounts.id.renderButton(googleButtonRef.current, { theme: "outline", size: "large" });
  }, [googleLoaded]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-2 sm:px-0">
      <Card className="w-full max-w-md shadow-lg">
        {/* Error Feedback */}
        {registerError && (
          <div
            className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-t-md animate-shake"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            tabIndex={-1}
            style={{ borderBottom: '1px solid #fca5a5' }}
          >
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" aria-hidden="true" />
            <span className="font-medium">{registerError}</span>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} aria-label="Registration form" autoComplete="on">
          <CardHeader>
            <CardTitle tabIndex={0}>Create your account</CardTitle>
            <CardDescription tabIndex={0}>Fill in the details below to register.</CardDescription>
          </CardHeader>
          {/* Sign in with Google button (relocated) */}
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                ref={googleButtonRef}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors font-medium text-gray-700 shadow-sm"
                aria-label="Sign in with Google"
                tabIndex={0}
                onClick={() => {
                  if (!(window as any).google || !(window as any).google.accounts || !(window as any).google.accounts.id) {
                    setRegisterError("Google Sign-In not loaded. Please try again later.");
                    return;
                  }
                  (window as any).google.accounts.id.prompt();
                }}
                disabled={!googleLoaded || isSubmitting || googleLoading}
              >
                <GoogleIcon className="mr-2" />
                <span>{googleLoading ? "Signing in..." : "Sign in with Google"}</span>
              </button>
              <div className="flex items-center w-full my-4">
                <div className="flex-1 h-px bg-gray-200" aria-hidden="true"></div>
                <span className="mx-2 text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" aria-hidden="true"></div>
              </div>
            </div>
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  autoComplete="given-name"
                  className="pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
                  {...registerField("firstName", { required: "First name is required" })}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                />
              </div>
              {errors.firstName && <p id="firstName-error" className="text-sm text-destructive mt-1" role="alert">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" aria-hidden="true" />
                <Input
                  id="middleName"
                  type="text"
                  placeholder="Middle Name (optional)"
                  autoComplete="additional-name"
                  className="pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
                  {...registerField("middleName")}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  autoComplete="family-name"
                  className="pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
                  {...registerField("lastName", { required: "Last name is required" })}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                />
              </div>
              {errors.lastName && <p id="lastName-error" className="text-sm text-destructive mt-1" role="alert">{errors.lastName.message}</p>}
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                <select
                  id="department"
                  className="w-full border rounded px-3 py-2 mt-1 pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
                  {...registerField("department", { required: "Department is required" })}
                  disabled={isSubmitting}
                  defaultValue=""
                  aria-invalid={!!errors.department}
                  aria-describedby={errors.department ? "department-error" : undefined}
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
              </div>
              {errors.department && <p id="department-error" className="text-sm text-destructive mt-1" role="alert">{errors.department.message}</p>}
              {department === "Other" && (
                <div className="mt-2 relative">
                  <Label htmlFor="otherDepartment">Specify Department</Label>
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" aria-hidden="true" />
                  <Input
                    id="otherDepartment"
                    type="text"
                    placeholder="Enter department"
                    className="pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
                    {...registerField("otherDepartment", { required: "Please specify your department" })}
                    disabled={isSubmitting}
                    aria-invalid={!!errors.otherDepartment}
                    aria-describedby={errors.otherDepartment ? "otherDepartment-error" : undefined}
                  />
                  {errors.otherDepartment && <p id="otherDepartment-error" className="text-sm text-destructive mt-1" role="alert">{errors.otherDepartment.message}</p>}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
                  {...registerField("email", { required: "Email is required", pattern: { value: /.+@.+\..+/, message: "Invalid email" } })}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && <p id="email-error" className="text-sm text-destructive mt-1" role="alert">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
                  {...registerField("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                  disabled={isSubmitting}
                  aria-describedby="password-requirements password-strength-tips"
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  tabIndex={0}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  aria-controls="password"
                >
                  {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                </button>
              </div>
              {/* Password strength meter */}
              {password && (
                <div className="mt-2">
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div
                      className={`h-2 rounded transition-all duration-300 ${strengthColors[passwordStrength?.score || 0]}`}
                      style={{ width: `${((passwordStrength?.score || 0) + 1) * 20}%` }}
                    ></div>
                  </div>
                  <div className={`text-xs font-medium mt-1 ${strengthColors[passwordStrength?.score || 0]} text-white px-2 py-0.5 rounded inline-block`}>
                    {strengthLabels[passwordStrength?.score || 0]}
                  </div>
                </div>
              )}
              {/* Password requirements checklist */}
              <ul id="password-requirements" className="mt-2 space-y-1 text-xs" aria-live="polite">
                {requirements.map((r, i) => {
                  const met = r.test(password || "");
                  return (
                    <li key={r.label} className="flex items-center gap-2">
                      {met ? (
                        <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      )}
                      <span className={met ? "text-green-600" : "text-gray-600"}>{r.label}</span>
                    </li>
                  );
                })}
              </ul>
              {/* Dynamic tips if not all requirements met or weak password */}
              {password && !allMet && (
                <div id="password-strength-tips" className="mt-2 text-xs text-yellow-700 bg-yellow-50 rounded p-2 flex items-start gap-2" role="alert" aria-live="polite" aria-atomic="true">
                  <Info className="h-4 w-4 mt-0.5 text-yellow-600" aria-hidden="true" />
                  <span>
                    {tips.length > 0 ? (
                      <>
                        <span>For a stronger password, add:</span>
                        <ul className="list-disc ml-5 mt-1">
                          {tips.map(tip => <li key={tip}>{tip}</li>)}
                        </ul>
                      </>
                    ) : (
                      <span>Try making your password longer or more complex for better security.</span>
                    )}
                  </span>
                </div>
              )}
              {allMet && passwordStrength && passwordStrength.score < 3 && (
                <div className="mt-2 text-xs text-yellow-700 bg-yellow-50 rounded p-2 flex items-start gap-2" role="alert" aria-live="polite" aria-atomic="true">
                  <Info className="h-4 w-4 mt-0.5 text-yellow-600" aria-hidden="true" />
                  <span>Even though all requirements are met, consider making your password longer or less predictable for extra security.</span>
                </div>
              )}
              {errors.password && <p className="text-sm text-destructive mt-1" role="alert">{errors.password.message}</p>}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
                  {...registerField("confirmPassword", { required: "Please confirm your password" })}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                />
                <button
                  type="button"
                  tabIndex={0}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  aria-pressed={showConfirmPassword}
                  aria-controls="confirmPassword"
                >
                  {showConfirmPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                </button>
              </div>
              {errors.confirmPassword && <p id="confirmPassword-error" className="text-sm text-destructive mt-1" role="alert">{errors.confirmPassword.message}</p>}
            </div>
            {/* Success Feedback */}
            {registerSuccess && (
              <div
                className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mt-2 animate-fadeIn"
                role="alert"
                aria-live="polite"
                aria-atomic="true"
                tabIndex={-1}
              >
                <SuccessIcon className="h-5 w-5 text-green-500 shrink-0" aria-hidden="true" />
                <span className="font-medium">Registration successful! You can now <a href="/login" className="underline text-primary">login</a>.</span>
              </div>
            )}
            <Button type="submit" className="w-full flex items-center justify-center focus:ring-2 focus:ring-primary focus:ring-offset-2" disabled={isSubmitting} aria-busy={isSubmitting} aria-live="polite">
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" aria-hidden="true" />
                  Registering...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <span className="text-sm text-muted-foreground">Already have an account? <a href="/login" className="text-primary hover:underline">Sign in</a></span>
          </CardFooter>
        </form>
        <style jsx>{`
          @media (max-width: 640px) {
            .max-w-md {
              max-width: 100vw;
              border-radius: 0;
              box-shadow: none;
            }
            .px-2 {
              padding-left: 0.5rem;
              padding-right: 0.5rem;
            }
          }
          @keyframes shake {
            10%, 90% { transform: translateX(-1px); }
            20%, 80% { transform: translateX(2px); }
            30%, 50%, 70% { transform: translateX(-4px); }
            40%, 60% { transform: translateX(4px); }
          }
          .animate-shake {
            animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in;
          }
        `}</style>
      </Card>
    </div>
  );
} 