import { z } from "zod";

// Common validation patterns
const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters long");
const requiredStringSchema = (fieldName: string) => z.string().min(1, `${fieldName} is required`);

// Scholarship validation schema
export const ScholarshipSchema = z.object({
  name: z
    .string()
    .min(1, "Scholarship Name is required")
    .min(3, "Scholarship Name must be at least 3 characters long")
    .max(100, "Scholarship Name is too long"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount format"),
  deadline: z
    .string()
    .min(1, "Deadline is required")
    .refine((date) => {
      const deadlineDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return deadlineDate > today;
    }, "Deadline must be in the future"),
  status: z.enum(["pending", "under_review", "active", "closed"], {
    required_error: "Status is required",
  }),
  applicants: z
    .number()
    .int("Applicants count must be a whole number")
    .nonnegative("Applicants count cannot be negative"),
  type: z.enum(["Full", "Half"]).optional(),
});

// Application validation schema
export const ApplicationSchema = z.object({
  name: z.string().optional(), // For backward compatibility
  firstName: z
    .string()
    .min(1, "First Name is required")
    .max(50, "First Name is too long"),
  middleName: z
    .string()
    .max(50, "Middle Name is too long")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last Name is required")
    .max(50, "Last Name is too long"),
  birthdate: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true; // Optional field
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate < today;
    }, "Birthdate must be in the past"),
  region: z
    .string()
    .min(1, "Province is required")
    .max(100, "Province name is too long"),
  email: emailSchema,
  scholarship: z
    .string()
    .min(1, "Scholarship selection is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"),
  gpa: z
    .number({
      required_error: "GPA is required",
      invalid_type_error: "GPA must be a number",
    })
    .min(0, "GPA must be at least 0")
    .max(5, "GPA must be at most 5"),
  status: z.enum(["pending", "under_review", "approved", "rejected"], {
    required_error: "Status is required",
  }).default("pending"),
  submittedDate: z
    .string()
    .min(1, "Submitted Date is required")
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
  score: z.number().nullable().optional(),
});

// User validation schema
export const UserSchema = z.object({
  firstName: z
    .string()
    .min(1, "First Name is required")
    .max(50, "First Name is too long"),
  middleName: z
    .string()
    .max(50, "Middle Name is too long")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last Name is required")
    .max(50, "Last Name is too long"),
  email: emailSchema,
  role: z
    .string()
    .min(1, "Role is required"),
  department: z
    .string()
    .min(1, "Department is required"),
  status: z.enum(["active", "inactive"], {
    required_error: "Status is required",
  }),
});

// API-specific schemas for server-side validation

// Authentication schemas
export const LoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = z.object({
  firstName: requiredStringSchema("First name"),
  middleName: z.string().optional(),
  lastName: requiredStringSchema("Last name"),
  email: emailSchema,
  password: passwordSchema,
  department: z.string().optional(),
});

export const GoogleAuthSchema = z.object({
  credential: z.string().min(1, "Google credential is required"),
});

// API Application schema (includes scholarshipId for server-side)
export const ApiApplicationCreateSchema = ApplicationSchema.extend({
  scholarshipId: z.string().uuid("Invalid scholarship ID format").optional(),
  userId: z.string().uuid("Invalid user ID format").optional(),
  avatar: z.string().optional(),
  review: z.string().optional(),
}).omit({ scholarship: true }); // Remove scholarship name, use scholarshipId instead

export const ApiApplicationUpdateSchema = ApiApplicationCreateSchema.partial().extend({
  name: z.string().optional(),
  status: z.enum(["pending", "under_review", "approved", "rejected"]).optional(),
});

// API Scholarship schemas
export const ApiScholarshipCreateSchema = ScholarshipSchema;
export const ApiScholarshipUpdateSchema = ScholarshipSchema.partial();

// API User schemas
export const ApiUserCreateSchema = UserSchema.extend({
  password: passwordSchema,
});

export const ApiUserUpdateSchema = UserSchema.partial().extend({
  password: passwordSchema.optional(),
});

// Bulk operations schema
export const BulkUpdateSchema = z.object({
  ids: z.array(z.string().uuid("Invalid ID format")).min(1, "At least one ID is required"),
  status: z.string().min(1, "Status is required"),
});

// File upload schema
export const FileUploadSchema = z.object({
  file: z.any().refine((file) => {
    if (!file) return false;
    const acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 30 * 1024 * 1024; // 30MB
    return acceptedTypes.includes(file.type) && file.size <= maxSize;
  }, "File must be a valid image (JPG, PNG, GIF, WEBP) and less than 30MB"),
});

// Password change schema
export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, "Password confirmation is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match",
  path: ["confirmPassword"],
});

// Application review schema
export const ApplicationReviewSchema = z.object({
  score: z.number().min(0).max(100).nullable().optional(),
  status: z.enum(["pending", "under_review", "approved", "rejected"]),
  review: z.string().optional(),
});

// Infer TypeScript types from Zod schemas
export type ScholarshipFormData = z.infer<typeof ScholarshipSchema>;
export type ApplicationFormData = z.infer<typeof ApplicationSchema>;
export type UserFormData = z.infer<typeof UserSchema>;

// API types
export type LoginData = z.infer<typeof LoginSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
export type GoogleAuthData = z.infer<typeof GoogleAuthSchema>;
export type ApiApplicationCreateData = z.infer<typeof ApiApplicationCreateSchema>;
export type ApiApplicationUpdateData = z.infer<typeof ApiApplicationUpdateSchema>;
export type ApiScholarshipCreateData = z.infer<typeof ApiScholarshipCreateSchema>;
export type ApiScholarshipUpdateData = z.infer<typeof ApiScholarshipUpdateSchema>;
export type ApiUserCreateData = z.infer<typeof ApiUserCreateSchema>;
export type ApiUserUpdateData = z.infer<typeof ApiUserUpdateSchema>;
export type BulkUpdateData = z.infer<typeof BulkUpdateSchema>;
export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;
export type ApplicationReviewData = z.infer<typeof ApplicationReviewSchema>;

// Create form schemas (without ID for creation forms)
export const ScholarshipCreateSchema = ScholarshipSchema;
export const ApplicationCreateSchema = ApplicationSchema;
export const UserCreateSchema = UserSchema;

// Validation helper function for API routes
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string; details: string[] } {
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      const details = result.error.errors.map(err => err.message);
      return {
        success: false,
        error: "Validation failed",
        details
      };
    }
  } catch (error) {
    return {
      success: false,
      error: "Validation error",
      details: ["Invalid request data format"]
    };
  }
}