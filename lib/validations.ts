import { z } from "zod";

// Common validation patterns
const emailSchema = z.string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");
const passwordSchema = z.string()
  .min(6, "Password must be at least 6 characters long");
const requiredStringSchema = (fieldName: string) => z.string()
  .min(1, `${fieldName} is required`);

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
    .min(1, "Birthdate is required")
    .refine((date) => {
      if (!date) return false; // Required field
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate < today;
    }, "Birthdate must be in the past"),
  gender: z
    .enum(["Male", "Female"], {
      required_error: "Gender is required",
      invalid_type_error: "Please select a valid gender",
    }),
  mobileNumber: z
    .string()
    .min(1, "Mobile Number is required")
    .refine((phone) => {
      if (!phone) return false; // Required field
      const phoneRegex = /^(09|\+639)\d{9}$/;
      return phoneRegex.test(phone.replace(/\s/g, ''));
    }, "Please enter a valid Philippine mobile number (e.g., 09270122300)"),
  region: z
    .string()
    .min(1, "Province is required")
    .max(100, "Province name is too long"),
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City name is too long"),
  email: emailSchema,
  schoolSector: z
    .enum(["Public", "Private"], {
      required_error: "School Sector is required",
      invalid_type_error: "Please select a valid school sector",
    }),
  scholarship: z
    .string()
    .min(1, "Scholarship selection is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"),
  gwa: z
    .number({
      required_error: "GWA is required",
      invalid_type_error: "GWA must be a number",
    })
    .min(0, "GWA must be at least 0")
    .max(100, "GWA must be at most 100"),
  status: z.enum(["pending", "under_review", "approved", "rejected"], {
    required_error: "Status is required",
  }).default("pending"),
  submittedDate: z
    .string()
    .min(1, "Submitted Date is required")
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
  documents: z
    .array(z.string().url("Invalid document URL"))
    .min(1, "At least one document is required")
    .max(5, "Maximum 5 documents allowed"),
  score: z.number().nullable().optional(),
});

// User validation schema with enhanced validation
export const UserSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  middleName: z
    .string()
    .max(50, "Middle name must be less than 50 characters")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  email: emailSchema,
  role: z
    .enum(["Administrator", "Staff", "Viewer"], {
      required_error: "Role is required",
      invalid_type_error: "Please select a valid role",
    }),
  department: z
    .string()
    .min(1, "Department is required")
    .max(100, "Department name must be less than 100 characters"),
  status: z.enum(["active", "inactive"], {
    required_error: "Status is required",
  }),
});

// User form schema (for frontend forms, excludes password)
export const UserFormSchema = UserSchema.extend({
  lastActive: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      return !isNaN(Date.parse(date));
    }, "Invalid date format"),
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
  department: z.string().min(1, "Department is required"),
});

export const GoogleAuthSchema = z.object({
  credential: z.string().min(1, "Google credential is required"),
});

// API Application schema (includes scholarshipId for server-side)
export const ApiApplicationCreateSchema = ApplicationSchema.extend({
  scholarshipId: z.string().uuid("Invalid scholarship ID format"),
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

// API User schemas with enhanced validation
export const ApiUserCreateSchema = UserSchema.extend({
  password: passwordSchema,
});

export const ApiUserUpdateSchema = UserSchema.partial().extend({
  password: passwordSchema.optional(),
});

// Role change schema (admin-only operation)
export const UserRoleChangeSchema = z.object({
  role: z.enum(["Administrator", "Staff", "Viewer"], {
    required_error: "Role is required",
    invalid_type_error: "Please select a valid role",
  }),
});

// User status change schema
export const UserStatusChangeSchema = z.object({
  status: z.enum(["active", "inactive"], {
    required_error: "Status is required",
  }),
});

// Password reset schema (admin-only operation)
export const UserPasswordResetSchema = z.object({
  password: passwordSchema,
});

// Enhanced bulk operations schemas
export const BulkUpdateSchema = z.object({
  ids: z.array(z.string().uuid("Invalid ID format")).min(1, "At least one ID is required").max(100, "Maximum 100 items allowed per bulk operation"),
  status: z.enum(["pending", "under_review", "approved", "rejected"], {
    required_error: "Status is required",
    invalid_type_error: "Invalid status value",
  }),
});

// Bulk delete schema for applications
export const BulkDeleteSchema = z.object({
  ids: z.array(z.string().uuid("Invalid ID format")).min(1, "At least one ID is required").max(100, "Maximum 100 items allowed per bulk operation"),
  permanent: z.boolean().default(false),
});

// Bulk user operations schemas
export const BulkUserUpdateSchema = z.object({
  ids: z.array(z.string().uuid("Invalid user ID format")).min(1, "At least one user ID is required").max(50, "Maximum 50 users allowed per bulk operation"),
  operation: z.enum(["activate", "deactivate", "delete"], {
    required_error: "Operation is required",
    invalid_type_error: "Invalid operation type",
  }),
});

export const BulkUserRoleChangeSchema = z.object({
  ids: z.array(z.string().uuid("Invalid user ID format")).min(1, "At least one user ID is required").max(50, "Maximum 50 users allowed per bulk operation"),
  role: z.enum(["Administrator", "Staff", "Viewer"], {
    required_error: "Role is required",
    invalid_type_error: "Invalid role value",
  }),
});

// Bulk scholarship operations schemas
export const BulkScholarshipUpdateSchema = z.object({
  ids: z.array(z.string().uuid("Invalid scholarship ID format")).min(1, "At least one scholarship ID is required").max(50, "Maximum 50 scholarships allowed per bulk operation"),
  status: z.enum(["pending", "under_review", "active", "closed"], {
    required_error: "Status is required",
    invalid_type_error: "Invalid status value",
  }),
});

export const BulkScholarshipDeleteSchema = z.object({
  ids: z.array(z.string().uuid("Invalid scholarship ID format")).min(1, "At least one scholarship ID is required").max(50, "Maximum 50 scholarships allowed per bulk operation"),
  permanent: z.boolean().default(false),
});

// Enhanced bulk response schema
export const BulkOperationResponseSchema = z.object({
  success: z.boolean(),
  summary: z.object({
    total: z.number().int().nonnegative(),
    successful: z.number().int().nonnegative(),
    failed: z.number().int().nonnegative(),
    skipped: z.number().int().nonnegative().optional(),
  }),
  updated: z.array(z.string().uuid()).optional(),
  deleted: z.array(z.string().uuid()).optional(),
  failed: z.array(z.object({
    id: z.string().uuid(),
    error: z.string(),
    code: z.string().optional(),
  })),
  metadata: z.object({
    operation: z.string(),
    timestamp: z.date().default(() => new Date()),
    batchId: z.string().optional(),
  }),
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

// Enhanced file upload validation schemas
export const AvatarUploadSchema = z.object({
  file: z.any()
    .refine((file) => file instanceof File, "Please select a file")
    .refine((file) => {
      const acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      return acceptedTypes.includes(file.type);
    }, "Only JPG, PNG, GIF, or WEBP images are allowed")
    .refine((file) => {
      const maxSize = 30 * 1024 * 1024; // 30MB
      return file.size <= maxSize;
    }, "File size must be less than 30MB")
    .refine((file) => {
      const minSize = 1024; // 1KB minimum
      return file.size >= minSize;
    }, "File is too small. Minimum size is 1KB"),
});

// Document upload schema for application documents
export const ApplicationDocumentUploadSchema = z.object({
  files: z.array(z.any())
    .min(1, "At least one document is required")
    .max(5, "Maximum 5 documents allowed")
    .refine((files) => {
      return files.every(file => file instanceof File);
    }, "All items must be valid files")
    .refine((files) => {
      const acceptedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.oasis.opendocument.text"
      ];
      return files.every(file => acceptedTypes.includes(file.type));
    }, "Only PDF, DOCX, DOC, and ODT files are allowed")
    .refine((files) => {
      const maxSize = 30 * 1024 * 1024; // 30MB total
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      return totalSize <= maxSize;
    }, "Total file size must be less than 30MB"),
});

// Document upload schema for general documents
export const DocumentUploadSchema = z.object({
  file: z.any()
    .refine((file) => file instanceof File, "Please select a file")
    .refine((file) => {
      const acceptedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp"
      ];
      return acceptedTypes.includes(file.type);
    }, "Only PDF, DOC, DOCX, TXT, and image files are allowed")
    .refine((file) => {
      const maxSize = 50 * 1024 * 1024; // 50MB for documents
      return file.size <= maxSize;
    }, "File size must be less than 50MB"),
  description: z.string().min(1, "File description is required").max(255, "Description must be less than 255 characters").optional(),
});

// Bulk file upload schema
export const BulkFileUploadSchema = z.object({
  files: z.array(z.any())
    .min(1, "At least one file is required")
    .max(10, "Maximum 10 files allowed at once")
    .refine((files) => {
      return files.every(file => file instanceof File);
    }, "All items must be valid files")
    .refine((files) => {
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      const maxTotalSize = 100 * 1024 * 1024; // 100MB total
      return totalSize <= maxTotalSize;
    }, "Total file size must be less than 100MB"),
});

// CSV import schema
export const CsvImportSchema = z.object({
  file: z.any()
    .refine((file) => file instanceof File, "Please select a CSV file")
    .refine((file) => {
      const acceptedTypes = ["text/csv", "application/vnd.ms-excel"];
      return acceptedTypes.includes(file.type) || file.name.endsWith('.csv');
    }, "Only CSV files are allowed")
    .refine((file) => {
      const maxSize = 10 * 1024 * 1024; // 10MB for CSV
      return file.size <= maxSize;
    }, "CSV file size must be less than 10MB"),
  hasHeaders: z.boolean().default(true),
  delimiter: z.enum([",", ";", "\t", "|"], {
    required_error: "Delimiter is required",
  }).default(","),
});

// File validation helper functions
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function validateFileSize(file: File, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes;
}

export function validateFileName(fileName: string): boolean {
  // Check for valid file name (no special characters that could be harmful)
  const validNamePattern = /^[\w\-. ]+$/;
  return validNamePattern.test(fileName) && fileName.length <= 255;
}

export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// File upload response schema
export const FileUploadResponseSchema = z.object({
  url: z.string().url("Invalid file URL"),
  filename: z.string().min(1, "Filename is required"),
  originalName: z.string().min(1, "Original filename is required"),
  size: z.number().positive("File size must be positive"),
  mimeType: z.string().min(1, "MIME type is required"),
  uploadedAt: z.date().default(() => new Date()),
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
export type UserFormData = z.infer<typeof UserFormSchema>;
export type UserData = z.infer<typeof UserSchema>;

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
export type UserRoleChangeData = z.infer<typeof UserRoleChangeSchema>;
export type UserStatusChangeData = z.infer<typeof UserStatusChangeSchema>;
export type UserPasswordResetData = z.infer<typeof UserPasswordResetSchema>;
export type BulkUpdateData = z.infer<typeof BulkUpdateSchema>;
export type BulkDeleteData = z.infer<typeof BulkDeleteSchema>;
export type BulkUserUpdateData = z.infer<typeof BulkUserUpdateSchema>;
export type BulkUserRoleChangeData = z.infer<typeof BulkUserRoleChangeSchema>;
export type BulkScholarshipUpdateData = z.infer<typeof BulkScholarshipUpdateSchema>;
export type BulkScholarshipDeleteData = z.infer<typeof BulkScholarshipDeleteSchema>;
export type BulkOperationResponseData = z.infer<typeof BulkOperationResponseSchema>;
export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;
export type ApplicationReviewData = z.infer<typeof ApplicationReviewSchema>;
export type FileUploadData = z.infer<typeof FileUploadSchema>;
export type AvatarUploadData = z.infer<typeof AvatarUploadSchema>;
export type DocumentUploadData = z.infer<typeof DocumentUploadSchema>;
export type BulkFileUploadData = z.infer<typeof BulkFileUploadSchema>;
export type CsvImportData = z.infer<typeof CsvImportSchema>;
export type FileUploadResponseData = z.infer<typeof FileUploadResponseSchema>;

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

// Role-based access helper
export function isAdministrator(userRole: string): boolean {
  return userRole === "Administrator";
}

export function canAccessUserManagement(userRole: string): boolean {
  return isAdministrator(userRole);
}

export function canModifyUserRole(userRole: string): boolean {
  return isAdministrator(userRole);
}