import { toast } from 'sonner';

interface BulkOperationOptions {
  endpoint: string;
  method: 'PATCH' | 'DELETE';
  payload: any;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  onProgress?: (progress: number) => void;
}

interface BulkOperationResult {
  success: boolean;
  summary: {
    total: number;
    successful: number;
    failed: number;
    skipped?: number;
  };
  updated?: string[];
  deleted?: string[];
  failed: Array<{
    id: string;
    error: string;
    code?: string;
  }>;
  metadata: {
    operation: string;
    timestamp: string;
    batchId?: string;
    [key: string]: any;
  };
  error?: string; // Add error field for failed responses
}

/**
 * Enhanced bulk operation handler with comprehensive validation and error handling
 */
export async function performBulkOperation(options: BulkOperationOptions): Promise<BulkOperationResult> {
  const {
    endpoint,
    method,
    payload,
    successMessage,
    errorMessage,
    onSuccess,
    onError,
    onProgress
  } = options;

  try {
    // Validate payload
    if (!payload || !payload.ids || !Array.isArray(payload.ids) || payload.ids.length === 0) {
      throw new Error('No items selected for bulk operation');
    }

    if (payload.ids.length > 100) {
      throw new Error('Too many items selected. Maximum 100 items allowed per operation.');
    }

    // Start progress tracking
    onProgress?.(10);

    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    onProgress?.(70);

    const data: BulkOperationResult = await response.json();

    onProgress?.(90);

    if (!response.ok) {
      throw new Error(data.error || errorMessage || 'Bulk operation failed');
    }

    onProgress?.(100);

    // Handle response
    if (data.success) {
      const message = successMessage || `Successfully processed ${data.summary.successful} item(s)`;
      toast.success(message, {
        description: `Total: ${data.summary.total}, Successful: ${data.summary.successful}, Failed: ${data.summary.failed}`
      });
      onSuccess?.(data);
    } else {
      // Partial success
      if (data.summary.successful > 0) {
        toast.warning(`Partial success: ${data.summary.successful}/${data.summary.total} items processed`, {
          description: data.failed.length > 0 ? `Failed items: ${data.failed.map(f => f.error).join(', ')}` : undefined
        });
      } else {
        // Complete failure
        const failureReasons = data.failed.map(f => f.error).join(', ');
        toast.error(errorMessage || 'Bulk operation failed', {
          description: failureReasons
        });
      }
      onError?.(data);
    }

    return data;
  } catch (error: any) {
    onProgress?.(0);
    
    const errorMsg = error.message || errorMessage || 'Bulk operation failed';
    toast.error(errorMsg);
    
    onError?.(error);
    
    throw error;
  }
}

/**
 * Bulk update applications status
 */
export async function bulkUpdateApplications(
  ids: string[],
  status: string,
  onSuccess?: (result: BulkOperationResult) => void,
  onProgress?: (progress: number) => void
) {
  return performBulkOperation({
    endpoint: '/api/applications/bulk-update',
    method: 'PATCH',
    payload: { ids, status },
    successMessage: `Updated ${ids.length} application(s) to '${status}'`,
    errorMessage: 'Failed to update applications',
    onSuccess,
    onProgress
  });
}

/**
 * Bulk delete applications
 */
export async function bulkDeleteApplications(
  ids: string[],
  permanent: boolean = false,
  onSuccess?: (result: BulkOperationResult) => void,
  onProgress?: (progress: number) => void
) {
  return performBulkOperation({
    endpoint: '/api/applications/bulk-delete',
    method: 'DELETE',
    payload: { ids, permanent },
    successMessage: `${permanent ? 'Permanently deleted' : 'Moved to trash'} ${ids.length} application(s)`,
    errorMessage: 'Failed to delete applications',
    onSuccess,
    onProgress
  });
}

/**
 * Bulk update users
 */
export async function bulkUpdateUsers(
  ids: string[],
  operation: 'activate' | 'deactivate' | 'delete',
  onSuccess?: (result: BulkOperationResult) => void,
  onProgress?: (progress: number) => void
) {
  return performBulkOperation({
    endpoint: '/api/users/bulk-update',
    method: 'PATCH',
    payload: { ids, operation },
    successMessage: `Successfully ${operation}d ${ids.length} user(s)`,
    errorMessage: `Failed to ${operation} users`,
    onSuccess,
    onProgress
  });
}

/**
 * Bulk change user roles
 */
export async function bulkChangeUserRoles(
  ids: string[],
  role: string,
  onSuccess?: (result: BulkOperationResult) => void,
  onProgress?: (progress: number) => void
) {
  return performBulkOperation({
    endpoint: '/api/users/bulk-role-change',
    method: 'PATCH',
    payload: { ids, role },
    successMessage: `Changed role to '${role}' for ${ids.length} user(s)`,
    errorMessage: 'Failed to change user roles',
    onSuccess,
    onProgress
  });
}

/**
 * Bulk update scholarships
 */
export async function bulkUpdateScholarships(
  ids: string[],
  status: string,
  onSuccess?: (result: BulkOperationResult) => void,
  onProgress?: (progress: number) => void
) {
  return performBulkOperation({
    endpoint: '/api/scholarships/bulk-update',
    method: 'PATCH',
    payload: { ids, status },
    successMessage: `Updated ${ids.length} scholarship(s) to '${status}'`,
    errorMessage: 'Failed to update scholarships',
    onSuccess,
    onProgress
  });
}

/**
 * Bulk delete scholarships
 */
export async function bulkDeleteScholarships(
  ids: string[],
  permanent: boolean = false,
  onSuccess?: (result: BulkOperationResult) => void,
  onProgress?: (progress: number) => void
) {
  return performBulkOperation({
    endpoint: '/api/scholarships/bulk-delete',
    method: 'DELETE',
    payload: { ids, permanent },
    successMessage: `${permanent ? 'Permanently deleted' : 'Moved to trash'} ${ids.length} scholarship(s)`,
    errorMessage: 'Failed to delete scholarships',
    onSuccess,
    onProgress
  });
}

/**
 * Validate bulk operation payload
 */
export function validateBulkPayload(ids: string[], maxItems: number = 100): string[] {
  const errors: string[] = [];
  
  if (!ids || !Array.isArray(ids)) {
    errors.push('Invalid selection: expected array of IDs');
  } else if (ids.length === 0) {
    errors.push('No items selected');
  } else if (ids.length > maxItems) {
    errors.push(`Too many items selected. Maximum ${maxItems} items allowed.`);
  }
  
  return errors;
}

/**
 * Generate confirmation message for bulk operations
 */
export function getBulkConfirmationMessage(
  operation: string,
  itemCount: number,
  itemType: string = 'item'
): string {
  const plural = itemCount === 1 ? itemType : `${itemType}s`;
  
  switch (operation) {
    case 'delete':
      return `Are you sure you want to delete ${itemCount} ${plural}? This action cannot be undone.`;
    case 'permanent_delete':
      return `Are you sure you want to permanently delete ${itemCount} ${plural}? This action cannot be undone.`;
    case 'deactivate':
      return `Are you sure you want to deactivate ${itemCount} ${plural}?`;
    case 'activate':
      return `Are you sure you want to activate ${itemCount} ${plural}?`;
    default:
      return `Are you sure you want to ${operation} ${itemCount} ${plural}?`;
  }
}

export type { BulkOperationResult, BulkOperationOptions };