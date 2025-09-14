"use client"

import { useState, useEffect, useMemo, useRef, lazy, Suspense } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  FileText,
  Award,
  TrendingUp,
  Search,
  Eye,
  Edit,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Download,
  Mail,
  GraduationCap,
  DollarSign,
  LogOut,
  Trash2,
  Key,
  User as UserIcon,
  Settings as SettingsIcon,
  MapPin,
  MessageSquare,
  X,
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import { Sheet, SheetContent, SheetHeader, SheetFooter, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ThemeSwitcher, ThemeSwitcherButtonPurple } from "@/components/ui/theme-switcher";
import { Scholarship, Application, User as UserType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useShiftSelect } from "@/hooks/useShiftSelect";
import { format } from "date-fns";
import {
  bulkUpdateApplications,
  bulkDeleteApplications,
  bulkUpdateUsers,
  bulkChangeUserRoles,
  bulkUpdateScholarships,
  bulkDeleteScholarships,
  validateBulkPayload,
  getBulkConfirmationMessage,
  type BulkOperationResult
} from "@/lib/bulk-operations";

// Dynamically import heavy components to improve chunk loading
const ApplicationCreateForm = lazy(() => import("@/components/forms/ApplicationCreateForm"));
const ScholarshipEditForm = lazy(() => import("@/components/forms/ScholarshipEditForm"));
const ScholarshipCreateForm = lazy(() => import("@/components/forms/ScholarshipCreateForm"));
const UserForm = lazy(() => import("@/components/forms/UserForm"));
const ApplicationReviewForm = lazy(() => import("@/components/forms/ApplicationReviewForm"));
const SendMessageForm = lazy(() => import("@/components/forms/SendMessageForm"));
const ChangePasswordForm = lazy(() => import("@/components/forms/ChangePasswordForm"));
const RequirementsChecklist = lazy(() => import("@/components/ranking/RequirementsChecklist"));
const AddStudentModal = lazy(() => import("@/components/ranking/AddStudentModal"));

// Loading component for dynamic imports
const FormLoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    <span className="ml-2 text-sm text-gray-600">Loading form...</span>
  </div>
);

// Add TabName type
type TabName = "dashboard" | "applications" | "scholarships" | "ranking" | "users";

// Safe date formatting to prevent hydration issues
const safeFormatDate = (date: string | Date, formatStr: string = 'yyyy-MM-dd') => {
  try {
    return format(new Date(date), formatStr);
  } catch {
    return 'Invalid Date';
  }
};

// Add after imports:
function getUserFullName(user: any) {
  if (user.firstName || user.lastName) {
    return [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ');
  }
  return user.name || '';
}
function getUserInitials(user: any) {
  if (user.firstName || user.lastName) {
    return [user.firstName, user.middleName, user.lastName].filter(Boolean).map((n: string) => n?.[0] || '').join('').toUpperCase();
  }
  return (user.name || 'AD').split(' ').map((n: string) => n[0]).join('').toUpperCase();
}

function DashboardPage() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabName>("dashboard")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit" | "createApplication" | "reviewApplication" | "sendMessage" | null>(null)
  const [avatarUrl, setAvatarUrl] = useState("/placeholder-user.jpg");
  const [isClient, setIsClient] = useState(false);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loadingScholarships, setLoadingScholarships] = useState(true);
  const [scholarshipsError, setScholarshipsError] = useState<string | null>(null);

  // Remove the mock applications state and add loading/error state
  // const [applications, setApplications] = useState<Application[]>([ ... ]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [applicationsError, setApplicationsError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplications() {
      setLoadingApplications(true);
      setApplicationsError(null);
      try {
        const res = await fetch('/api/applications');
        if (!res.ok) throw new Error('Failed to fetch applications');
        const data = await res.json();
        // Normalize scholarship to always be the name string
        setApplications(data.map((app: any) => ({
          ...app,
          scholarship: typeof app.scholarship === 'object' && app.scholarship !== null
            ? app.scholarship.name
            : app.scholarship
        })));
      } catch (err: any) {
        setApplicationsError(err.message || 'Failed to fetch applications');
        setApplications([]);
      } finally {
        setLoadingApplications(false);
      }
    }
    fetchApplications();
  }, []);

  const [academic, setAcademic] = useState(0);
  const [extracurricular, setExtracurricular] = useState(0);
  const [essay, setEssay] = useState(0);
  const [financial, setFinancial] = useState(0);
  const [review, setReview] = useState("");

  const totalScore = academic + extracurricular + essay + financial;
  const [scholarshipSort, setScholarshipSort] = useState<string>("deadline_oldest");

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [scholarshipFilter, setScholarshipFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [trashBin, setTrashBin] = useState<Application[]>([]);
  const [trashBinOpen, setTrashBinOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [downloadApplication, setDownloadApplication] = useState<Application | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteApplication, setDeleteApplication] = useState<Application | null>(null);
  const [rankingDialogOpen, setRankingDialogOpen] = useState(false);
  const [statusWorkflowDialog, setStatusWorkflowDialog] = useState<{ open: boolean, app: Application | null, step: 'pending' | 'under_review' | null }>({ open: false, app: null, step: null });

  const [users, setUsers] = useState<UserType[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userModal, setUserModal] = useState<null | { mode: 'add' | 'edit' | 'role' | 'reset' | 'deactivate', user?: UserType }>(null);

  const [activeIndex, setActiveIndex] = useState(-1);

  // Add state for permanent delete confirmation
  const [permanentDeleteDialog, setPermanentDeleteDialog] = useState<{ open: boolean, app: Application | null }>({ open: false, app: null });
  const [permanentDeleteAllDialog, setPermanentDeleteAllDialog] = useState(false);

  // Add state for status card modal in Ranking section
  const [rankingStatusModal, setRankingStatusModal] = useState<{ open: boolean, status: string | null }>({ open: false, status: null });

  // Add state for Full/Half scholarship prompt
  const [scholarshipTypeDialog, setScholarshipTypeDialog] = useState(false);
  const [pendingScholarshipType, setPendingScholarshipType] = useState<'Full' | 'Half' | null>(null);
  const [deleteScholarshipDialog, setDeleteScholarshipDialog] = useState<{ open: boolean, scholarship: Scholarship | null }>({ open: false, scholarship: null });

  const [scholarshipTrash, setScholarshipTrash] = useState<Scholarship[]>([]);
  const [scholarshipTrashOpen, setScholarshipTrashOpen] = useState(false);
  const [permanentDeleteScholarshipDialog, setPermanentDeleteScholarshipDialog] = useState<{ open: boolean, scholarship: Scholarship | null }>({ open: false, scholarship: null });
  const [permanentDeleteAllScholarshipsDialog, setPermanentDeleteAllScholarshipsDialog] = useState(false);

  // Add state for sort modal and sort option
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>("all");

  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);

  // Exclusive sort option (radio)
  const [filterStatus, setFilterStatus] = useState<{ pending: boolean; under_review: boolean; approved: boolean; rejected: boolean }>({ pending: false, under_review: false, approved: false, rejected: false });
  // Dynamically get all regions from applications
  const allProvinces = useMemo(() => Array.from(new Set(applications.map(a => a.region))).filter(Boolean), [applications]);
  const [filterProvinces, setFilterProvinces] = useState<{ [province: string]: boolean }>({});
  // Ensure filterProvinces always has all provinces as keys
  useEffect(() => {
    setFilterProvinces(prev => {
      const next = { ...prev };
      let changed = false;
      for (const province of allProvinces) {
        if (!(province in next)) {
          next[province] = false;
          changed = true;
        }
      }
      // Remove provinces that no longer exist
      for (const province in next) {
        if (!allProvinces.includes(province)) {
          delete next[province];
          changed = true;
        }
      }
      return changed ? { ...next } : next;
    });
  }, [allProvinces]);
  // Scholarships filter
  const allScholarships = useMemo(() => scholarships.map(s => s.name), [scholarships]);
  const [filterScholarships, setFilterScholarships] = useState<{ [scholarship: string]: boolean }>({});
  useEffect(() => {
    setFilterScholarships(prev => {
      const next = { ...prev };
      let changed = false;
      for (const sch of allScholarships) {
        if (!(sch in next)) {
          next[sch] = false;
          changed = true;
        }
      }
      // Remove scholarships that no longer exist
      for (const sch in next) {
        if (!allScholarships.includes(sch)) {
          delete next[sch];
          changed = true;
        }
      }
      return changed ? { ...next } : next;
    });
  }, [allScholarships]);

  useEffect(() => {
    setIsClient(true);
    const savedAvatar = localStorage.getItem('user-avatar');
    if (savedAvatar) setAvatarUrl(savedAvatar);
  }, []);

  // Update getStatusBadge to accept event and stop propagation if needed
  const getStatusBadge = (status: string, onClick?: (e?: React.MouseEvent) => void) => {
    const statusConfig = {
      pending: { label: "Pending", className: "bg-orange-100 text-orange-800 hover:bg-orange-200", clickable: true },
      under_review: { label: "Under Review", className: "bg-blue-500 text-white hover:bg-blue-600", clickable: true },
      approved: { label: "Approved", className: "bg-green-500 text-white", clickable: false },
      rejected: { label: "Rejected", className: "bg-red-500 text-white", clickable: false },
      active: { label: "Active", className: "bg-green-600 text-white", clickable: false },
      closed: { label: "Closed", className: "bg-gray-500 text-white", clickable: false },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge
        className={cn("border-transparent", config.className, { "cursor-pointer": config.clickable })}
        onClick={onClick}
      >
        {config.label}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "under_review":
        return <Eye className="h-4 w-4 text-blue-500" />;
      case "approved":
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Compute dynamic stats from applications
  const totalApplications = applications.length;
  const underReviewCount = applications.filter(app => app.status === 'under_review').length;
  const approvedCount = applications.filter(app => app.status === 'approved' || app.status === 'accepted').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;

  // Pie chart data and colors (now dynamic)
  const pieData = [
    { name: 'Total Applications', value: totalApplications },
    { name: 'Approved', value: approvedCount },
    { name: 'Under Review', value: underReviewCount },
    { name: 'Rejected', value: rejectedCount },
  ].sort((a, b) => b.value - a.value); // Descending order
  const pieColors = ['#7C3AED', '#22C55E', '#2563EB', '#EF4444']; // Purple, Green, Blue, Red
  // Lighter and darker variants for tooltips
  const pieTooltipBg = [
    'rgba(124,58,237,0.85)', // more opaque purple
    'rgba(34,197,94,0.85)',  // more opaque green
    'rgba(37,99,235,0.85)',  // more opaque blue
    'rgba(239,68,68,0.85)',  // more opaque red
  ];
  const pieTooltipBorder = [
    '#7C3AED', '#22C55E', '#2563EB', '#EF4444'
  ];
  const pieTooltipDarkBg = [
    '#5B21B6', // darker purple
    '#15803D', // darker green
    '#1E40AF', // darker blue
    '#B91C1C', // darker red
  ];

  // Calculate total for percentage
  const pieTotal = pieData.reduce((sum, d) => sum + d.value, 0);

  // Custom Tooltip for PieChart
  const CustomPieTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      const idx = pieData.findIndex(d => d.name === name);
      const percent = ((value / pieTotal) * 100).toFixed(1);
      return (
        <div
          className="rounded-lg shadow-lg px-4 py-2 border text-sm"
          style={{
            background: pieTooltipBg[idx] || '#fff',
            borderColor: pieTooltipBorder[idx] || '#7C3AED',
            color: '#fff',
            borderLeftWidth: 6,
            borderLeftStyle: 'solid',
            minWidth: 170,
            fontWeight: 500,
            boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
          }}
        >
          <div className="font-semibold" style={{ color: '#fff', fontSize: '1.08em' }}>{name}</div>
          <div>Value: <span className="font-bold">{value}</span></div>
          <div>Percent: <span className="font-bold">{percent}%</span></div>
        </div>
      );
    }
    return null;
  };

  // --- FIXED: Sort from lowest to highest GWA ---
  const ranking = applications
    .filter(app => app.gwa !== null && app.gwa !== undefined)
    .sort((a, b) => (a.gwa || 0) - (b.gwa || 0));

  const approved = applications.filter(app => app.status === 'approved' || app.status === 'accepted');
  const pending = applications.filter(app => app.status === 'pending' || app.status === 'under_review');
  const rejected = applications.filter(app => app.status === 'rejected');
  const reserve: Application[] = []; // No 'reserve' status for now

  // Handler for saving scholarship edits
  async function handleSaveScholarship(data: Scholarship) {
    if (!selectedScholarship) return;
    try {
      const res = await fetch(`/api/scholarships/${selectedScholarship.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update scholarship');
      const updatedScholarship = await res.json();
      setScholarships(prev => prev.map(sch => sch.id === updatedScholarship.id ? updatedScholarship : sch));
      // Update selectedScholarship with the latest object for real-time UI update
      setSelectedScholarship(updatedScholarship);
      toast.success('Scholarship updated successfully!');
      setModalMode(null);
      setSelectedScholarship(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update scholarship');
    }
  }

  // Replace handleLogout with context-based logout
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleExport = () => {
    if (!isClient) return; // Prevent SSR execution
    
    const headers = ['ID', 'Name', 'Email', 'Birthdate', 'Scholarship', 'Amount', 'GWA', 'Status', 'Submitted Date', 'Score'];
    const csvData = applications.map(app => [
      app.id,
      app.name,
      app.email,
      app.birthdate ? safeFormatDate(app.birthdate, 'MMM dd, yyyy') : 'Not specified',
      app.scholarship,
      app.amount,
      app.gwa,
      app.status,
      app.submittedDate,
      app.score || 'Not scored'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `scholarship_applications_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveScore = () => {
    alert(
      `Score saved!\nAcademic: ${academic}\nExtracurricular: ${extracurricular}\nEssay: ${essay}\nFinancial: ${financial}\nTotal: ${totalScore}\nReview: ${review}`
    );
  };
  // Handler for creating new scholarship (POST to API)
  async function handleCreateScholarship(data: Omit<Scholarship, 'id'>) {
    try {
      const res = await fetch('/api/scholarships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (errorData.error === 'Validation failed' && errorData.details) {
          // Display validation errors in a more user-friendly way
          const errorMessage = errorData.details.length === 1 
            ? errorData.details[0] 
            : `Please fix the following errors:\n• ${errorData.details.join('\n• ')}`;
          
          toast.error(errorMessage);
          return; // Don't close modal, let user fix errors
        }
        throw new Error(errorData.error || 'Failed to create scholarship');
      }
      const newScholarship = await res.json();
      setScholarships(prev => [...prev, newScholarship]);
      toast.success('Scholarship created successfully!');
      setPendingScholarshipType(null);
      setScholarshipTypeDialog(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create scholarship');
    }
  }

  // Handler for creating new application
  async function handleCreateApplication(data: Omit<Application, 'id'>) {
    console.log('handleCreateApplication called with:', data);
    try {
      // Map scholarship name to scholarshipId
      const selectedScholarship = scholarships.find(s => s.name === data.scholarship);
      if (!selectedScholarship) {
        console.error('Scholarship not found:', data.scholarship);
        toast.error('Please select a valid scholarship.');
        return;
      }
      
      console.log('Selected scholarship:', selectedScholarship);
      
      // Clean amount (remove currency symbols, ensure string)
      const cleanedAmount = typeof data.amount === 'string' ? data.amount.replace(/[^\d.]/g, '') : String(data.amount);
      // Ensure GWA is a number
      const gwa = typeof data.gwa === 'string' ? parseFloat(data.gwa) : data.gwa;
      // Convert submittedDate to ISO string (or Date object)
      let submittedDate: string | Date = data.submittedDate;
      if (submittedDate) {
        submittedDate = new Date(submittedDate).toISOString();
      } else {
        submittedDate = new Date().toISOString();
      }
      
      const payload = {
        ...data,
        scholarshipId: selectedScholarship.id,
        amount: cleanedAmount,
        gwa,
        submittedDate,
        avatar: data.avatar || "/placeholder.svg?height=32&width=32",
      };
      
      // Remove scholarship field as the API schema omits it
      delete (payload as any).scholarship;
      
      // Ensure legacy name populated if user entered split fields
      if (!payload.name && (payload as any).firstName) {
        (payload as any).name = [
          (payload as any).firstName,
          (payload as any).middleName,
          (payload as any).lastName,
        ].filter(Boolean).join(' ');
      }
      
      // Handle birthdate - convert to ISO string if present
      if ((payload as any).birthdate) {
        (payload as any).birthdate = new Date((payload as any).birthdate).toISOString();
      }
      
      console.log('Payload to send:', payload);
      
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      console.log('API response status:', res.status);
      console.log('API response headers:', res.headers);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API error response text:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          console.error('Failed to parse error response as JSON:', e);
          errorData = { error: `HTTP ${res.status}: ${errorText}` };
        }
        
        console.error('API error data:', errorData);
        
        if (errorData.error === 'Validation failed' && errorData.details) {
          // Display validation errors in a more user-friendly way
          const errorMessage = errorData.details.length === 1 
            ? errorData.details[0] 
            : `Please fix the following errors:\n• ${errorData.details.join('\n• ')}`;
          
          toast.error(errorMessage);
          return; // Don't close modal, let user fix errors
        }
        throw new Error(errorData.error || `Failed to create application (HTTP ${res.status})`);
      }
      
      let newApp = await res.json();
      console.log('New application created:', newApp);
      
      // Normalize scholarship to always be the name string
      newApp = {
        ...newApp,
        scholarship: typeof newApp.scholarship === 'object' && newApp.scholarship !== null
          ? newApp.scholarship.name
          : newApp.scholarship
      };
      
      setApplications(prev => [...prev, newApp]);
      toast.success('Application created successfully!');
      setModalMode(null);
      
    } catch (err: any) {
      console.error('Application creation failed:', err);
      toast.error(err.message || 'Failed to create application');
    }
  }

  // Handler for saving application review
  async function handleSaveApplicationReview(data: { score: number | null, status: string, review: string }) {
    if (!selectedApplication) return;
    try {
      const res = await fetch(`/api/applications/${selectedApplication.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedApplication,
          score: data.score,
          status: data.status,
          review: data.review,
        }),
      });
      if (!res.ok) throw new Error('Failed to update application');
      const updatedApp = await res.json();
      setApplications(prev => prev.map(app => app.id === updatedApp.id ? updatedApp : app));
      toast.success('Application updated successfully!');
    setModalMode(null);
    setSelectedApplication(null);
      if (data.status === "approved") {
        toast.success("Application approved! Redirecting to Ranking...");
        setActiveTab("ranking");
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update application');
    }
  }

  // Handler for sending a message
  function handleSendMessage(data: { recipientEmail: string, subject: string, message: string }) {
    console.log("Sending message to:", data.recipientEmail);
    console.log("Subject:", data.subject);
    console.log("Message:", data.message);
    setModalMode(null);
    setSelectedApplication(null);
  }

  function handleDownloadDocuments(app: Application) {
    setDownloadApplication(app);
    setDownloadDialogOpen(true);
  }

  function handleConfirmDownloadPDF() {
    if (downloadApplication) {
      setDownloadDialogOpen(false);
      setDownloadApplication(null);
    }
  }

  function handleConfirmDownloadDOCX() {
    if (downloadApplication) {
      setDownloadDialogOpen(false);
      setDownloadApplication(null);
    }
  }

  function handleDeleteApplicant(app: Application) {
    setDeleteApplication(app);
    setDeleteDialogOpen(true);
  }

  async function handleConfirmDeleteApplicant() {
    if (!deleteApplication) return;
    // Always remove from UI and show success toast
      setApplications(prev => prev.filter(a => a.id !== deleteApplication.id));
      setTrashBin(prev => [...prev, deleteApplication]);
    toast.success('Application deleted.');
    try {
      const res = await fetch(`/api/applications/${deleteApplication.id}`, { method: 'DELETE' });
      if (!res.ok) {
        // Optionally show a warning if backend fails, but do not block UI
        toast.warning('Could not delete from server, but removed from your view.');
      }
    } catch (err: any) {
      // Optionally show a warning if network error
      toast.warning('Network error: deleted locally, but not on server.');
    } finally {
      setDeleteDialogOpen(false);
      setDeleteApplication(null);
    }
  }

  async function handleRestoreApplicant(app: Application) {
    try {
      // Find the scholarship by name
      const selectedScholarship = scholarships.find(s => s.name === app.scholarship);
      if (!selectedScholarship) {
        toast.error('Scholarship not found for this application.');
        return;
      }
      // Remove id to let backend create a new one
      const { id, ...rest } = app;
      // Prepare payload with scholarshipId
      const payload = {
        ...rest,
        scholarshipId: selectedScholarship.id,
        submittedDate: rest.submittedDate || new Date().toISOString(),
        avatar: app.avatar || "/placeholder.svg?height=32&width=32",
      };
      delete (payload as any).scholarship; // Remove scholarship name field
      // Handle birthdate - convert to ISO string if present
      if ((payload as any).birthdate) {
        (payload as any).birthdate = new Date((payload as any).birthdate).toISOString();
      }
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to restore application');
      let restoredApp = await res.json();
      // Normalize scholarship for frontend
      restoredApp = {
        ...restoredApp,
        scholarship: selectedScholarship.name,
      };
      setApplications(prev => [...prev, restoredApp]);
    setTrashBin(prev => prev.filter(a => a.id !== app.id));
      toast.success('Application restored.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to restore application');
    }
  }

  function handlePermanentDeleteApplicant(app: Application) {
    setPermanentDeleteDialog({ open: true, app });
  }

  function confirmPermanentDeleteApplicant() {
    if (permanentDeleteDialog.app) {
      setTrashBin(prev => prev.filter(a => a.id !== permanentDeleteDialog.app!.id));
      setPermanentDeleteDialog({ open: false, app: null });
    }
  }

  function handleDeleteAllPermanently() {
    setPermanentDeleteAllDialog(true);
  }

  function confirmDeleteAllPermanently() {
    setTrashBin([]);
    setPermanentDeleteAllDialog(false);
  }

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Handler for removing scholarship (DELETE to API, move to trash)
  async function handleRemoveScholarship(scholarship: Scholarship) {
    try {
      const res = await fetch(`/api/scholarships/${scholarship.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete scholarship');
    setScholarships(prev => prev.filter(s => s.id !== scholarship.id));
    setScholarshipTrash(prev => [...prev, scholarship]);
      toast.success('Scholarship deleted.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete scholarship');
    }
  }

  // Handler for restoring scholarship (POST to API, remove from trash)
  async function handleRestoreScholarship(scholarship: Scholarship) {
    try {
      const { id, ...rest } = scholarship;
      const res = await fetch('/api/scholarships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest),
      });
      if (!res.ok) throw new Error('Failed to restore scholarship');
      const restored = await res.json();
      setScholarships(prev => [...prev, restored]);
    setScholarshipTrash(prev => prev.filter(s => s.id !== scholarship.id));
      toast.success('Scholarship restored.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to restore scholarship');
    }
  }

  // Handler for permanently deleting scholarship from trash (local only)
  function handlePermanentDeleteScholarship(scholarship: Scholarship) {
    setScholarshipTrash(prev => prev.filter(s => s.id !== scholarship.id));
  }

  // Handler for permanently deleting all scholarships from trash (local only)
  function handlePermanentDeleteAllScholarships() {
    setScholarshipTrash([]);
  }

  const formatPeso = (amount: string) => {
    const num = parseFloat(amount.replace(/[^\d.]/g, ""));
    if (isNaN(num)) return "₱ 0";
    return `₱ ${num.toLocaleString()}`;
  };

  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [statusActionDialog, setStatusActionDialog] = useState<{ open: boolean, app: Application | null }>({ open: false, app: null });
  const [highlightedApplicantId, setHighlightedApplicantId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab !== 'applications' && highlightedApplicantId) {
      setHighlightedApplicantId(null);
    }
  }, [activeTab]);

  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    if (!selectionMode) setSelectedAppIds([]);
  }, [selectionMode]);

  // Range filter state
  const [gpaRange, setGpaRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [amountRange, setAmountRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [dateRange, setDateRange] = useState<{ min: string; max: string }>({ min: '', max: '' }); // YYYY-MM-DD

  // Multi-criteria sorting/filtering logic
  let processedApplications = [...applications];
  // Filtering by status
  const statusFilters = Object.entries(filterStatus).filter(([_, v]) => v).map(([k]) => k);
  if (statusFilters.length > 0) {
    processedApplications = processedApplications.filter(app => statusFilters.includes(app.status));
  }
  // Filtering by province (was region)
  const provinceFilters = Object.entries(filterProvinces).filter(([_, v]) => v).map(([k]) => k);
  if (provinceFilters.length > 0) {
    processedApplications = processedApplications.filter(app => provinceFilters.includes(app.region));
  }
  // Filtering by scholarship
  const scholarshipFilters = Object.entries(filterScholarships).filter(([_, v]) => v).map(([k]) => k);
  if (scholarshipFilters.length > 0) {
    processedApplications = processedApplications.filter(app => scholarshipFilters.includes(app.scholarship));
  }
  // Range filtering for GWA
  if (gpaRange.min || gpaRange.max) {
    processedApplications = processedApplications.filter(app => {
      const gwa = parseFloat(app.gwa !== null && app.gwa !== undefined ? app.gwa.toString() : '');
      if (gpaRange.min && gwa < parseFloat(gpaRange.min)) return false;
      if (gpaRange.max && gwa > parseFloat(gpaRange.max)) return false;
      return true;
    });
  }
  // Range filtering for Amount
  if (amountRange.min || amountRange.max) {
    processedApplications = processedApplications.filter(app => {
      const amt = parseFloat((app.amount || '').replace(/[^\d.]/g, ''));
      if (amountRange.min && amt < parseFloat(amountRange.min)) return false;
      if (amountRange.max && amt > parseFloat(amountRange.max)) return false;
      return true;
    });
  }
  // Date filtering (Submitted Date)
  if (dateRange.min || dateRange.max) {
    processedApplications = processedApplications.filter(app => {
      const date = app.submittedDate;
      if (dateRange.min && date < dateRange.min) return false;
      if (dateRange.max && date > dateRange.max) return false;
      return true;
    });
  }
  // Exclusive sorting logic
  if (sortOption === 'gpaDesc') processedApplications.sort((a, b) => (b.gwa || 0) - (a.gwa || 0));
  else if (sortOption === 'gpaAsc') processedApplications.sort((a, b) => (a.gwa || 0) - (b.gwa || 0));
  else if (sortOption === 'amountDesc') processedApplications.sort((a, b) => {
    const aNum = parseFloat((a.amount || '').replace(/[^\d.]/g, ''));
    const bNum = parseFloat((b.amount || '').replace(/[^\d.]/g, ''));
    return bNum - aNum;
  });
  else if (sortOption === 'amountAsc') processedApplications.sort((a, b) => {
    const aNum = parseFloat((a.amount || '').replace(/[^\d.]/g, ''));
    const bNum = parseFloat((b.amount || '').replace(/[^\d.]/g, ''));
    return aNum - bNum;
  });
  else if (sortOption === 'provinceAsc') processedApplications.sort((a, b) => a.region.localeCompare(b.region));
  else if (sortOption === 'provinceDesc') processedApplications.sort((a, b) => b.region.localeCompare(a.region));
  else if (sortOption === 'dateNewest') processedApplications.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());
  else if (sortOption === 'dateOldest') processedApplications.sort((a, b) => new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime());

  // Search filter (no longer filter by scholarship here)
  const filteredApplications = processedApplications
    .filter(app => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
  return (
        app.name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.scholarship.toLowerCase().includes(q) ||
        app.amount.toLowerCase().includes(q) ||
        (app.gwa !== null && app.gwa.toString().toLowerCase().includes(q)) ||
        app.status.toLowerCase().includes(q) ||
        app.submittedDate.toLowerCase().includes(q) ||
        app.region.toLowerCase().includes(q) ||
        (app.birthdate && safeFormatDate(app.birthdate, 'MMM dd, yyyy').toLowerCase().includes(q))
      );
    });

  // Replace handleSelectAll and handleSelectOne with useShiftSelect
  const {
    onCheckboxChange: handleAppCheckboxChange,
    onSelectAll: handleAppSelectAll,
    selectedIds: _selectedAppIds
  } = useShiftSelect({
    items: filteredApplications,
    selectedIds: selectedAppIds,
    setSelectedIds: setSelectedAppIds,
    getId: (app) => app.id,
  });

  const handleBulkDelete = async () => {
    if (selectedAppIds.length === 0) return;
    if (!isClient || !window.confirm(`Are you sure you want to delete ${selectedAppIds.length} selected applications?`)) return;
    const toTrash: Application[] = [];
    for (const id of selectedAppIds) {
      const app = applications.find(a => a.id === id);
      if (!app) continue;
      try {
        const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toTrash.push(app);
        }
      } catch {}
    }
    setApplications(prev => prev.filter(app => !selectedAppIds.includes(app.id)));
    setTrashBin(prev => [...prev, ...toTrash]);
    setSelectedAppIds([]);
    toast.success('Selected applications deleted.');
  };

  // Add handleValidateRequirement function to update requirements for a student
  function handleValidateRequirement(studentId: string, req: string, value: { valid: boolean; falseDoc: boolean }) {
    setApplications(prev => prev.map(app =>
      app.id === studentId
        ? { ...app, requirements: { ...app.requirements, [req]: value } }
        : app
    ));
  }

  // Add handler stubs for user actions
  function handleDeactivateUser(user: UserType) {
    // TODO: Implement deactivate logic
  }
  function handleReactivateUser(user: UserType) {
    // TODO: Implement reactivate logic
  }
  function handleDeleteUser(user: UserType) {
    setDeleteUserDialog({ open: true, user });
  }

  const handleStatusUpdate = (appId: string, newStatus: "under_review" | "approved" | "rejected") => {
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, status: newStatus } : app))
    );
    setStatusWorkflowDialog({ open: false, app: null, step: null });
    if (newStatus === "approved") {
      toast.success("Application approved! Redirecting to Ranking...");
      setActiveTab("ranking");
    }
  };

  // Redirect non-administrators away from users tab
  useEffect(() => {
    if (activeTab === "users" && user?.role !== "Administrator") {
      setActiveTab("dashboard");
      toast.error("Access denied. Administrator privileges required for User Management.");
    }
  }, [activeTab, user?.role]);

  // Fetch users when users tab is accessed (admin only)
  useEffect(() => {
    async function fetchUsers() {
      if (user?.role !== "Administrator") {
        setUsers([]);
        setLoadingUsers(false);
        return;
      }
      
      setLoadingUsers(true);
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setUsers([]);
        toast.error('Failed to load users. Please try again.');
      } finally {
        setLoadingUsers(false);
      }
    }
    
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, user?.role]);

  // 1. Add state for delete user dialog
  const [deleteUserDialog, setDeleteUserDialog] = useState<{ open: boolean, user: UserType | null }>({ open: false, user: null });

  async function confirmDeleteUser() {
    if (!deleteUserDialog.user) return;
    try {
      const res = await fetch(`/api/users/${deleteUserDialog.user.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(prev => prev.filter(u => u.id !== deleteUserDialog.user!.id));
      toast.success('User deleted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setDeleteUserDialog({ open: false, user: null });
    }
  }

  const [roleDialog, setRoleDialog] = useState<{ open: boolean, user: UserType | null }>({ open: false, user: null });
  const [resetDialog, setResetDialog] = useState<{ open: boolean, user: UserType | null }>({ open: false, user: null });
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Add state for bulk status update dialog
  const [bulkStatusDialog, setBulkStatusDialog] = useState<{ open: boolean, status: string }>({ open: false, status: "under_review" });
  const [bulkUpdating, setBulkUpdating] = useState(false);
  // Add state for bulk progress
  const [bulkProgress, setBulkProgress] = useState(0);

  // Replace lastBulkUpdateRef with a stack for multiple undos
  const [bulkUndoStack, setBulkUndoStack] = useState<Array<{ ids: string[]; prevStatuses: Record<string, string>; newStatus: string }>>([]);
  const undoToastIdRef = useRef<string | null>(null);

  // Bulk status update handler
  async function handleBulkStatusUpdate() {
    if (selectedAppIds.length === 0) return;
    setBulkUpdating(true);
    setBulkProgress(0);
    const newStatus = bulkStatusDialog.status;
    // Simulate progress for user feedback
    const total = selectedAppIds.length;
    let completed = 0;
    const progressInterval = setInterval(() => {
      setBulkProgress((prev) => {
        if (prev < 90) return prev + Math.floor(12 + (Math.sin(prev / 100) * 5)); // Use deterministic progress based on current value
        return prev;
      });
    }, 200);
    // Store previous statuses for undo
    const prevStatuses: Record<string, string> = {};
    applications.forEach(app => {
      if (selectedAppIds.includes(app.id)) {
        prevStatuses[app.id] = app.status;
      }
    });
    try {
      const res = await fetch('/api/applications/bulk-update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedAppIds, status: newStatus }),
      });
      const data = await res.json();
      clearInterval(progressInterval);
      setBulkProgress(100);
      setTimeout(() => setBulkProgress(0), 500);
      if (!res.ok) throw new Error(data.error || 'Bulk update failed');
      setApplications(prev => prev.map(app =>
        data.updated.includes(app.id)
          ? { ...app, status: newStatus }
          : app
      ));
      setBulkStatusDialog({ open: false, status: 'under_review' });
      setSelectedAppIds([]);
      setSelectionMode(false);
      setBulkUpdating(false);
      if (data.success) {
        // Push to undo stack
        setBulkUndoStack(stack => [...stack, { ids: data.updated, prevStatuses, newStatus }]);
        // Show undo toast (with unique id to prevent duplicate toasts)
        const toastId = `undo-bulk-${Math.random().toString(36).substr(2, 9)}`;
        undoToastIdRef.current = toastId;
        toast.success(`${data.updated.length} application(s) updated to '${newStatus}'.`, {
          id: toastId,
          action: {
            label: 'Undo',
            onClick: () => {
              setBulkUndoStack(stack => {
                if (stack.length === 0) return stack;
                const last = stack[stack.length - 1];
                setApplications(prev => prev.map(app =>
                  last.ids.includes(app.id)
                    ? { ...app, status: last.prevStatuses[app.id] || app.status }
                    : app
                ));
                toast.success('Bulk update undone.');
                return stack.slice(0, -1);
              });
            },
          },
          duration: 7000,
          onAutoClose: () => {
            // Remove the last undo if not undone
            setBulkUndoStack(stack => stack.slice(0, -1));
          },
        });
      } else {
        if (data.updated.length > 0) {
          toast.success(`${data.updated.length} application(s) updated to '${newStatus}'.`);
        }
        if (data.failed.length > 0) {
          toast.error(`${data.failed.length} application(s) failed to update.`, {
            description: data.failed.map((f: any) => `${f.id}: ${f.error}`).join('\n'),
          });
        }
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      setBulkProgress(0);
      toast.error(err.message || 'Bulk update failed');
      setBulkUpdating(false);
    }
  }

  useEffect(() => {
    async function fetchScholarships() {
      setLoadingScholarships(true);
      setScholarshipsError(null);
      try {
        const res = await fetch('/api/scholarships');
        if (!res.ok) throw new Error('Failed to fetch scholarships');
        const data = await res.json();
        setScholarships(data);
      } catch (err: any) {
        setScholarshipsError(err.message || 'Failed to fetch scholarships');
        setScholarships([]);
      } finally {
        setLoadingScholarships(false);
      }
    }
    fetchScholarships();
  }, []);

  // 1. Add state for department change dialog
  const [deptDialog, setDeptDialog] = useState<{ open: boolean, user: UserType | null }>({ open: false, user: null });
  const [deptValue, setDeptValue] = useState<string>("");
  const [deptOther, setDeptOther] = useState<string>("");

  const [userActionMenuOpenId, setUserActionMenuOpenId] = useState<string | null>(null);

  // Add state for dashboard ranking highlight
  const [dashboardRankingHighlightId, setDashboardRankingHighlightId] = useState<string | null>(null);
  // ... existing code ...
  // Add effect to clear dashboard highlight after a short delay
  useEffect(() => {
    if (dashboardRankingHighlightId) {
      const timeout = setTimeout(() => setDashboardRankingHighlightId(null), 1800);
      return () => clearTimeout(timeout);
    }
  }, [dashboardRankingHighlightId]);
  // ... existing code ...
  // Add effect to scroll and highlight in Ranking tab when set from Dashboard
  useEffect(() => {
    if (activeTab === 'ranking' && dashboardRankingHighlightId) {
      setTimeout(() => {
        const el = isClient ? document.getElementById(`ranking-row-${dashboardRankingHighlightId}`) : null;
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200); // Wait for DOM to update
    }
  }, [activeTab, dashboardRankingHighlightId]);

  // In the scholarships card rendering, add this helper:
  const now = new Date();
  const displayStatus = (scholarship: Scholarship) => {
    if (new Date(scholarship.deadline) < now && scholarship.status !== "closed") {
      return "closed";
    }
    return scholarship.status;
  };

  // 1. Confirmation dialog state
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);
  const [pendingCloseModal, setPendingCloseModal] = useState<null | (() => void)>(null);
  const applicationFormRef = useRef<any>(null);

  // ... existing code ...
  // 2. Add Restore All logic
  function handleRestoreAllApplicants() {
    setApplications(prev => [...prev, ...trashBin]);
    setTrashBin([]);
    toast.success('All applicants have been restored.');
  }

  return (
    <div className="min-h-screen bg-background grid grid-cols-[16rem_1fr] grid-rows-[64px_1fr]" style={{ gridTemplateAreas: `'sidebar header' 'sidebar main'` }}>
      {/* Render loading state until client hydration is complete to prevent hydration mismatch */}
      {!isClient && (
        <div className="col-span-2 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      )}
      {/* Main content - only render after client hydration */}
      {isClient && (
        <>
      {/* Header */}
      <header className="bg-card border-b border-border fixed top-0 left-0 w-full z-30 col-span-2" style={{ gridArea: 'header' }}>
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-300">SAMRS</h1>
            </div>
            <span className="text-sm text-muted-foreground hidden md:block">Scholarship Application Management & Ranking System</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="action"
              size="sm"
              className="flex items-center border-2 border-purple-600 text-purple-700 hover:bg-purple-600 hover:text-white hover:border-purple-600 dark:border-purple-400 dark:text-purple-300 dark:hover:bg-purple-500 dark:hover:text-white dark:hover:border-purple-400 transition-colors hover:scale-110 hover:shadow-lg transition-shadow duration-200"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            {/* ThemeSwitcher with purple border and text */}
            <div className="relative">
              <ThemeSwitcherButtonPurple />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer hover:scale-110 hover:shadow-lg transition-shadow duration-200">
                  <AvatarImage src={avatarUrl} />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "Admin User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "admin@example.com"}
                    </p>
                    {user?.role && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                        {user.role}
                      </span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:scale-105 hover:shadow-lg transition-shadow duration-200" onClick={() => router.push('/profile')}>
                  <UserIcon className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:scale-105 hover:shadow-lg transition-shadow duration-200" onClick={() => router.push('/settings')}>
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:scale-105 hover:shadow-lg transition-shadow duration-200" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      {/* Sidebar - fixed, not scrollable */}
      <aside className="bg-white border-r border-gray-200 dark:bg-[#18181b] dark:border-gray-800 h-[calc(100vh-64px)] sticky top-[64px] flex-shrink-0 z-20 col-start-1 row-start-2" style={{ gridArea: 'sidebar' }}>
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === 'dashboard' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : ''}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "applications" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === 'applications' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : ''}`}
              onClick={() => setActiveTab("applications")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Applications
            </Button>
            <Button
              variant={activeTab === "scholarships" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === 'scholarships' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : ''}`}
              onClick={() => setActiveTab("scholarships")}
            >
              <Award className="h-4 w-4 mr-2" />
              Scholarships
            </Button>
            <Button
              variant={activeTab === "ranking" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === 'ranking' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : ''}`}
              onClick={() => setActiveTab("ranking")}
            >
              <Star className="h-4 w-4 mr-2" />
              Ranking
            </Button>
            {/* Only show Users tab to Administrators */}
            {user?.role === "Administrator" && (
              <Button
                variant={activeTab === "users" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === 'users' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : ''}`}
                onClick={() => setActiveTab("users")}
              >
                <Users className="h-4 w-4 mr-2" />
                Users
              </Button>
            )}
          </nav>
        </aside>
      {/* Main Content - only this scrolls */}
      <main className="p-8 bg-[#F4F0FA] dark:bg-[#18181b] overflow-y-auto h-[calc(100vh-64px)] z-10 col-start-2 row-start-2" style={{ gridArea: 'main' }}>
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-300">Admin Dashboard</h2>
              <p className="text-muted-foreground text-base mt-1">Overview of key statistics and application activity for administrators.</p>
              </div>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Applications */}
                <Card
                  className={cn(
                    "cursor-pointer transition-all duration-200 rounded-lg border shadow-sm text-white",
                    "bg-purple-500 hover:bg-purple-100 hover:text-purple-800 hover:scale-[1.04] hover:shadow-lg",
                    "focus:outline-none focus:ring-2 focus:ring-purple-400",
                    "dark:bg-purple-600 dark:text-white dark:hover:bg-purple-400/30 dark:hover:text-purple-200"
                  )}
                  onClick={() => {
                    setActiveTab('applications');
                    setFilterStatus({ pending: false, under_review: false, approved: false, rejected: false });
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Go to Applications"
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveTab('applications');
                      setFilterStatus({ pending: false, under_review: false, approved: false, rejected: false });
                    }
                  }}
                >
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                    <FileText className="h-6 w-6" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalApplications}</div>
                  </CardContent>
                </Card>
                {/* Under Review */}
                <Card
                  className={cn(
                    "cursor-pointer transition-all duration-200 rounded-lg border shadow-sm text-white",
                    "bg-blue-500 hover:bg-blue-100 hover:text-blue-800 hover:scale-[1.04] hover:shadow-lg",
                    "focus:outline-none focus:ring-2 focus:ring-blue-400",
                    "dark:bg-blue-600 dark:text-white dark:hover:bg-blue-400/30 dark:hover:text-blue-200"
                  )}
                  onClick={() => {
                    setActiveTab('applications');
                    setFilterStatus({ pending: false, under_review: true, approved: false, rejected: false });
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Go to Under Review Applications"
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveTab('applications');
                      setFilterStatus({ pending: false, under_review: true, approved: false, rejected: false });
                    }
                  }}
                >
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                    <Clock className="h-6 w-6" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{underReviewCount}</div>
                  </CardContent>
                </Card>
                {/* Approved */}
                <Card
                  className={cn(
                    "cursor-pointer transition-all duration-200 rounded-lg border shadow-sm text-white",
                    "bg-green-500 hover:bg-green-100 hover:text-green-800 hover:scale-[1.04] hover:shadow-lg",
                    "focus:outline-none focus:ring-2 focus:ring-green-400",
                    "dark:bg-green-600 dark:text-white dark:hover:bg-green-400/30 dark:hover:text-green-200"
                  )}
                  onClick={() => {
                    setActiveTab('applications');
                    setFilterStatus({ pending: false, under_review: false, approved: true, rejected: false });
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Go to Approved Applications"
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveTab('applications');
                      setFilterStatus({ pending: false, under_review: false, approved: true, rejected: false });
                    }
                  }}
                >
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    <CheckCircle className="h-6 w-6" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{approvedCount}</div>
                  </CardContent>
                </Card>
                {/* Rejected */}
                <Card
                  className={cn(
                    "cursor-pointer transition-all duration-200 rounded-lg border shadow-sm text-white",
                    "bg-red-500 hover:bg-red-100 hover:text-red-800 hover:scale-[1.04] hover:shadow-lg",
                    "focus:outline-none focus:ring-2 focus:ring-red-400",
                    "dark:bg-red-600 dark:text-white dark:hover:bg-red-400/30 dark:hover:text-red-200"
                  )}
                  onClick={() => {
                    setActiveTab('applications');
                    setFilterStatus({ pending: false, under_review: false, approved: false, rejected: true });
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Go to Rejected Applications"
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveTab('applications');
                      setFilterStatus({ pending: false, under_review: false, approved: false, rejected: true });
                    }
                  }}
                >
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                    <XCircle className="h-6 w-6" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{rejectedCount}</div>
                  </CardContent>
                </Card>
              </div>
              {/* Charts and Ranking */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Applications Overview (Pie Chart) */}
                <Card className="bg-card border-0 shadow-md flex flex-col h-full dark:bg-[#23232a] dark:text-gray-100">
                  <CardHeader>
                    <CardTitle>Applications Overview</CardTitle>
                  <CardDescription>This chart shows the distribution of application statuses and active scholarships in the system.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full">
                    <div className="flex-1 min-h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={65}
                        >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                            ))}
                          </Pie>
                        <RechartsTooltip content={<CustomPieTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                            </div>
                  {/* Custom Legend - only at the bottom, with numbers and percentage tooltips */}
                    <div className="flex flex-wrap justify-center gap-6 mt-6 px-2 pb-2">
                    {pieData.map((entry, index) => {
                      const percent = ((entry.value / pieTotal) * 100).toFixed(1);
                      // Map legend to filter
                      let filter = null;
                      if (entry.name === "Total Applications") {
                        filter = { pending: false, under_review: false, approved: false, rejected: false };
                      } else if (entry.name === "Approved") {
                        filter = { pending: false, under_review: false, approved: true, rejected: false };
                      } else if (entry.name === "Under Review") {
                        filter = { pending: false, under_review: true, approved: false, rejected: false };
                      } else if (entry.name === "Rejected") {
                        filter = { pending: false, under_review: false, approved: false, rejected: true };
                      }
                      return (
                        <button
                          key={entry.name}
                          type="button"
                          className={cn(
                            "flex items-center space-x-2 rounded px-2 py-1 transition-colors",
                            "focus:outline-none focus:ring-2 focus:ring-purple-400",
                            "hover:bg-purple-100 dark:hover:bg-purple-900/40",
                            "active:scale-95",
                            "cursor-pointer",
                            "hover:scale-110 hover:shadow-lg transition-shadow duration-200"
                          )}
                          style={{ minWidth: 0, border: "none", background: "none" }}
                          onClick={() => {
                            setActiveTab('applications');
                            if (filter) setFilterStatus(filter);
                          }}
                          tabIndex={0}
                          aria-label={`Show ${entry.name} applications`}
                        >
                          <span
                            className="inline-block w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: pieColors[index % pieColors.length] }}
                            data-tooltip-id={`legend-tooltip-${index}`}
                            data-tooltip-content={`${percent}%`}
                            data-tooltip-place="top"
                            data-tooltip-style={`background: ${pieTooltipDarkBg[index % pieTooltipDarkBg.length]}; color: #fff; border: 2px solid ${pieTooltipBorder[index % pieTooltipBorder.length]}; font-weight: 500; box-shadow: 0 2px 8px 0 rgba(0,0,0,0.12);`}
                          ></span>
                          <ReactTooltip id={`legend-tooltip-${index}`} place="top" />
                          <span className="text-sm font-medium text-muted-foreground">{entry.name}:</span>
                          <span className="text-sm text-foreground font-semibold">{entry.value}</span>
                        </button>
                      );
                    })}
                    </div>
                  </CardContent>
                </Card>

              {/* Student Ranking (by GWA) */}
                <Card className="bg-card border-0 shadow-md flex flex-col h-full dark:bg-[#23232a] dark:text-gray-100">
                  <CardHeader>
                    <CardTitle>Student Ranking (by GWA)</CardTitle>
                  <CardDescription>Top students ranked by their General Weighted Average (GWA).</CardDescription>
                  </CardHeader>
                <CardContent className="flex-1 overflow-x-auto">
                  <div className={`overflow-y-auto scrollbar-hover ${ranking.length > 8 ? 'max-h-[340px]' : ''}`}> 
                    <Table>
                        <TableHeader>
                          <TableRow>
                          <TableHead>#</TableHead>
                            <TableHead>Name</TableHead>
                          <TableHead>GWA</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ranking.slice(0, 8).map((app, idx) => (
                            <TableRow
                              key={app.id}
                              tabIndex={0}
                              id={`dashboard-ranking-row-${app.id}`}
                              className={cn(
                                "cursor-pointer transition-all duration-200",
                                dashboardRankingHighlightId === app.id
                                  ? "ring-2 ring-purple-400 bg-purple-100 dark:bg-purple-900/40 scale-[1.03] shadow-xl"
                                  : "hover:scale-[1.03] hover:shadow-lg hover:bg-purple-50 dark:hover:bg-purple-900/40"
                              )}
                              onClick={() => {
                                setActiveTab('ranking');
                                setDashboardRankingHighlightId(app.id);
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  setActiveTab('ranking');
                                  setDashboardRankingHighlightId(app.id);
                                }
                              }}
                              aria-label={`View ${app.name} in Ranking`}
                            >
                              <TableCell>{idx + 1}</TableCell>
                              <TableCell>
                                {app.firstName && app.lastName ? (
                                  <>
                                    {app.firstName} {app.middleName ? `${app.middleName.charAt(0)}.` : ''} {app.lastName}
                                  </>
                                ) : (
                                  app.name
                                )}
                              </TableCell>
                              <TableCell>{app.gwa?.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "applications" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-300">Applications</h2>
                  <p className="text-muted-foreground">Manage and review scholarship applications</p>
                </div>
                <div className="flex items-center space-x-4">
                <Button 
                  variant="altAction" 
                  onClick={() => setTrashBinOpen(true)} 
                  aria-label="Open Trash Bin"
                  className="hover:scale-110 hover:shadow-lg transition-shadow duration-200"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Trash Bin {trashBin.length > 0 && <span className="ml-1">({trashBin.length})</span>}
                  </Button>
                <Button 
                  variant={selectionMode ? "altAction" : "altAction"} 
                  onClick={() => setSelectionMode(m => !m)} 
                  aria-label={selectionMode ? "Cancel Selection" : "Select Applications"}
                  className="hover:scale-110 hover:shadow-lg transition-shadow duration-200"
                >
                    {selectionMode ? "Cancel" : "Select"}
                  </Button>
                <Button 
                  onClick={() => setModalMode("createApplication")}
                  variant="purple"
                  aria-label="New Application"
                  className="hover:scale-110 hover:shadow-lg transition-shadow duration-200"
                >
                    <FileText className="h-4 w-4 mr-2" />
                    New Application
                  </Button>
                </div>
              </div>
              {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[220px]">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search applications..."
                          className="pl-10 border border-gray-300 hover:border-purple-500 focus:border-purple-600 focus:border-2 hover:border focus:outline-none transition-colors dark:hover:border-purple-400 dark:focus:border-purple-500"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                    aria-label="Search applications"
                        />
                      </div>
                    </div>
              {/* Only show Sort + Filter button here, dropdown removed */}
              <Button 
                variant="altAction" 
                onClick={() => setSortModalOpen(true)} 
                aria-label="Sort and filter applications" 
                className="w-48 hover:scale-110 hover:shadow-lg transition-shadow duration-200"
              >
                Sort & Filter
              </Button>
              </div>
            {/* Sort Modal */}
            <Dialog open={sortModalOpen} onOpenChange={setSortModalOpen}>
              <DialogContent className="max-w-md w-full p-6 rounded-xl">
                <DialogHeader>
                  <DialogTitle>Sort & Filter Applications</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  <div>
                    <div className="font-semibold mb-2">Sort By</div>
                    <RadioGroup value={sortOption} onValueChange={setSortOption} className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="default" id="sort-default" />
                        <span>Default / Normal Arrangement</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="gpaDesc" id="sort-gpaDesc" />
                        <span>GWA: Highest to Lowest</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="gpaAsc" id="sort-gpaAsc" />
                        <span>GWA: Lowest to Highest</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="amountDesc" id="sort-amountDesc" />
                        <span>Amount: Highest to Lowest</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="amountAsc" id="sort-amountAsc" />
                        <span>Amount: Lowest to Highest</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="provinceAsc" id="sort-provinceAsc" />
                        <span>Province: A to Z</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="provinceDesc" id="sort-provinceDesc" />
                        <span>Province: Z to A</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="dateNewest" id="sort-dateNewest" />
                        <span>Submission Date: Newest to Oldest</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="dateOldest" id="sort-dateOldest" />
                        <span>Submission Date: Oldest to Newest</span>
                      </label>
                    </RadioGroup>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Filter By Status</div>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={filterStatus.pending} onCheckedChange={v => setFilterStatus(s => ({ ...s, pending: !!v }))} />
                        <span>Pending</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={filterStatus.under_review} onCheckedChange={v => setFilterStatus(s => ({ ...s, under_review: !!v }))} />
                        <span>Under Review</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={filterStatus.approved} onCheckedChange={v => setFilterStatus(s => ({ ...s, approved: !!v }))} />
                        <span>Approved</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={filterStatus.rejected} onCheckedChange={v => setFilterStatus(s => ({ ...s, rejected: !!v }))} />
                        <span>Rejected</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Filter By Scholarship</div>
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                      {allScholarships.map(sch => (
                        <label key={sch} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox checked={filterScholarships[sch]} onCheckedChange={v => setFilterScholarships(s => ({ ...s, [sch]: !!v }))} />
                          <span>{sch}</span>
                        </label>
                      ))}
                  </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Filter By Province</div>
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                      {allProvinces.map(province => (
                        <label key={province} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox checked={filterProvinces[province]} onCheckedChange={v => setFilterProvinces(s => ({ ...s, [province]: !!v }))} />
                          <span>{province}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">GWA Range</div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="5"
                        placeholder="Min"
                        className="border rounded px-2 py-1 w-20"
                        value={gpaRange.min}
                        onChange={e => setGpaRange(r => ({ ...r, min: e.target.value }))}
                        aria-label="Minimum GWA"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="5"
                        placeholder="Max"
                        className="border rounded px-2 py-1 w-20"
                        value={gpaRange.max}
                        onChange={e => setGpaRange(r => ({ ...r, max: e.target.value }))}
                        aria-label="Maximum GWA"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Amount Range</div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Min"
                        className="border rounded px-2 py-1 w-24"
                        value={amountRange.min}
                        onChange={e => setAmountRange(r => ({ ...r, min: e.target.value }))}
                        aria-label="Minimum Amount"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Max"
                        className="border rounded px-2 py-1 w-24"
                        value={amountRange.max}
                        onChange={e => setAmountRange(r => ({ ...r, max: e.target.value }))}
                        aria-label="Maximum Amount"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Submitted Date Range</div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="date"
                        className="border rounded px-2 py-1"
                        value={dateRange.min}
                        onChange={e => setDateRange(r => ({ ...r, min: e.target.value }))}
                        aria-label="Submitted Date From"
                      />
                      <span>-</span>
                      <input
                        type="date"
                        className="border rounded px-2 py-1"
                        value={dateRange.max}
                        onChange={e => setDateRange(r => ({ ...r, max: e.target.value }))}
                        aria-label="Submitted Date To"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    className="bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors" 
                    variant="default" 
                    onClick={() => {
                      setSortOption('default');
                      setFilterStatus({ pending: false, under_review: false, approved: false, rejected: false });
                      setFilterProvinces(Object.fromEntries(allProvinces.map(r => [r, false])));
                      setFilterScholarships(Object.fromEntries(allScholarships.map(s => [s, false])));
                      setGpaRange({ min: '', max: '' });
                      setAmountRange({ min: '', max: '' });
                      setDateRange({ min: '', max: '' });
                    }}
                  >Reset</Button>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
              {/* Applications Table */}
              <Card className="dark:bg-[#23232a] dark:text-gray-100">
                <CardContent className="pt-6">
                  {loadingApplications ? (
                    <div className="text-center text-muted-foreground py-8">Loading applications...</div>
                  ) : applicationsError ? (
                    <div className="text-center text-red-500 py-8">{applicationsError}</div>
                  ) : selectionMode && selectedAppIds.length > 0 && (
                    <div className="mb-2 flex items-center gap-4">
                      <span className="text-sm font-medium">{selectedAppIds.length} selected</span>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleBulkDelete}
                        className="hover:scale-110 hover:shadow-lg transition-shadow duration-200"
                      >
                        Move to Trash Bin
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectionMode(false)}
                        className="hover:scale-110 hover:shadow-lg transition-shadow duration-200"
                      >
                        Cancel Selection
                      </Button>
                    </div>
                  )}
                  {!loadingApplications && !applicationsError && (
                    <>
                      {filteredApplications.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="flex flex-col items-center space-y-4">
                            <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                            <div className="text-center">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Applications Found</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {searchQuery.trim() || Object.values(filterStatus).some(Boolean) || Object.values(filterProvinces).some(Boolean) || Object.values(filterScholarships).some(Boolean) || gpaRange.min || gpaRange.max || amountRange.min || amountRange.max || dateRange.min || dateRange.max
                                  ? "No applications match your current filters. Try adjusting your search criteria."
                                  : "Get started by creating your first scholarship application."}
                              </p>
                            </div>
                            {!searchQuery.trim() && !Object.values(filterStatus).some(Boolean) && !Object.values(filterProvinces).some(Boolean) && !Object.values(filterScholarships).some(Boolean) && !gpaRange.min && !gpaRange.max && !amountRange.min && !amountRange.max && !dateRange.min && !dateRange.max && (
                              <Button 
                                onClick={() => setModalMode("createApplication")}
                                variant="purple"
                                className="mt-4 hover:scale-110 hover:shadow-lg transition-shadow duration-200"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Create First Application
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="relative overflow-x-auto overflow-y-auto scrollbar-hover scrollbar-hover-mask max-w-full max-h-[420px] pb-2">
                        <Table>
                          <TableHeader>
                              <TableRow>
                            {selectionMode && (
                              <TableHead className="text-center font-bold text-gray-600 dark:text-gray-300">
                                <input
                                  type="checkbox"
                                  ref={el => {
                                    if (el) el.indeterminate = selectedAppIds.length > 0 && selectedAppIds.length < filteredApplications.length;
                                  }}
                                  checked={filteredApplications.length > 0 && selectedAppIds.length === filteredApplications.length}
                                  onChange={e => handleAppSelectAll(e.target.checked)}
                                  aria-label="Select all applications"
                                />
                              </TableHead>
                            )}
                              <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-center">Applicant</TableHead>
                              <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-center">Region</TableHead>
                              <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-center">Scholarship</TableHead>
                              <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-center">Amount</TableHead>
                              <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-center">GWA</TableHead>
                              <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-center">Status</TableHead>
                              <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-center">Comment</TableHead>
                              <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-center">Submitted</TableHead>
                              <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-right">Actions</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {filteredApplications.map((app) => (
                              <TableRow
                                key={app.id}
                                className={cn(
                                  "transition-all duration-200 cursor-pointer",
                                  highlightedApplicantId === app.id
                                    ? "ring-2 ring-purple-400 bg-purple-100 dark:bg-purple-900/40 scale-[1.03] shadow-xl"
                                    : "hover:scale-105 hover:shadow-lg hover:bg-purple-50 dark:hover:bg-purple-900/40"
                                )}
                                tabIndex={0}
                                  ref={el => {
                                    if (highlightedApplicantId === app.id && el) {
                                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }
                                  }}
                                onClick={() => setSelectedApplication(app)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    setSelectedApplication(app);
                                  }
                                }}
                                aria-label={`Show details for ${app.name}`}
                                >
                                  {selectionMode && (
                                    <TableCell>
                                      <input
                                        type="checkbox"
                                        checked={selectedAppIds.includes(app.id)}
                                      onChange={e => handleAppCheckboxChange(e, app)}
                                        aria-label={`Select application for ${app.name}`}
                                      />
                                    </TableCell>
                                  )}
                                  <TableCell>
                                    <div className="flex items-center space-x-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={app.avatar || "/placeholder.svg"} />
                                        <AvatarFallback>
                                        {app.name.split(" ").map((n) => n[0]).join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">
                                          {app.firstName && app.lastName ? (
                                            <>
                                              {app.firstName} {app.middleName ? `${app.middleName.charAt(0)}.` : ''} {app.lastName}
                                            </>
                                          ) : (
                                            app.name
                                          )}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{app.email}</p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>{app.region}</TableCell>
                                <TableCell>{typeof app.scholarship === 'object' && app.scholarship !== null ? (app.scholarship as any).name : app.scholarship}</TableCell>
                                <TableCell>{typeof app.amount === 'object' ? JSON.stringify(app.amount) : app.amount.replace("$", "₱")}</TableCell>
                                  <TableCell>{app.gwa}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      {getStatusIcon(app.status)}
                                      {app.status === 'pending'
                                        ? getStatusBadge(app.status, (e) => { e?.stopPropagation(); setStatusWorkflowDialog({ open: true, app, step: 'pending' }); })
                                        : app.status === 'under_review'
                                          ? getStatusBadge(app.status, (e) => { e?.stopPropagation(); setStatusWorkflowDialog({ open: true, app, step: 'under_review' }); })
                                        : getStatusBadge(app.status)}
                                    </div>
                                  </TableCell>
                                <TableCell>
                                  {app.review && app.review.trim() !== '' ? (
                                    <span>{app.review}</span>
                                  ) : (
                                    <span className="text-gray-400">None</span>
                                  )}
                                </TableCell>
                                <TableCell>{safeFormatDate(app.submittedDate)}</TableCell>
                                  <TableCell className="text-right">
                                  {/* Modern action button with open/close state using controlled open state */}
                                  <DropdownMenu open={actionMenuOpenId === app.id} onOpenChange={open => setActionMenuOpenId(open ? app.id : null)}>
                                      <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className={cn(
                                          "h-8 w-8 p-0 flex items-center justify-center rounded-full border transition-colors hover:scale-110 hover:shadow-lg transition-shadow duration-200",
                                          actionMenuOpenId === app.id ? "bg-accent" : ""
                                        )}
                                        aria-haspopup="menu"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Open menu</span>
                                      </Button>
                                      </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" sideOffset={4} onClick={(e)=>{e.stopPropagation();}}>
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem className="hover:scale-105 hover:shadow-lg transition-shadow duration-200" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActionMenuOpenId(null); setSelectedApplication(app); setModalMode("reviewApplication"); }}>
                                          <Edit className="h-4 w-4 mr-2" />
                                          Review & Score
                                        </DropdownMenuItem>
                                      <DropdownMenuItem className="hover:scale-105 hover:shadow-lg transition-shadow duration-200" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActionMenuOpenId(null); setSelectedApplication(app); setModalMode("sendMessage"); }}>
                                          <Mail className="h-4 w-4 mr-2" />
                                          Send Message
                                        </DropdownMenuItem>
                                      <DropdownMenuItem className="hover:scale-105 hover:shadow-lg transition-shadow duration-200" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActionMenuOpenId(null); handleDownloadDocuments(app); }}>
                                          <Download className="h-4 w-4 mr-2" />
                                          Download Documents
                                        </DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-600 dark:text-red-500 focus:text-red-600 dark:focus:text-red-500 hover:scale-105 hover:shadow-lg transition-shadow duration-200" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActionMenuOpenId(null); handleDeleteApplicant(app); }}>
                                          <Trash2 className="h-4 w-4 mr-2 text-red-600 dark:text-red-500" />
                                          Delete Applicant
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
              {/* Application Create Modal */}
              <Dialog open={modalMode === "createApplication"} onOpenChange={open => {
                if (!open && applicationFormRef.current && applicationFormRef.current.isDirty()) {
                  setShowUnsavedConfirm(true);
                  setPendingCloseModal(() => () => setModalMode(null));
                } else if (!open) {
                  setModalMode(null);
                }
              }}>
                <DialogContent className="max-w-md w-full p-6 max-h-[80vh] overflow-y-auto rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Create New Application</DialogTitle>
                  </DialogHeader>
                  <Suspense fallback={<FormLoadingSpinner />}>
                    <ApplicationCreateForm
                      ref={applicationFormRef}
                      onSave={handleCreateApplication}
                      onCancel={() => {
                        if (applicationFormRef.current && applicationFormRef.current.isDirty()) {
                          setShowUnsavedConfirm(true);
                          setPendingCloseModal(() => () => setModalMode(null));
                        } else {
                          setModalMode(null);
                        }
                      }}
                      scholarships={scholarships}
                    />
                  </Suspense>
                </DialogContent>
              </Dialog>
              {/* Application Details Modal */}
              <Dialog open={!!selectedApplication && modalMode !== "reviewApplication"} onOpenChange={() => setSelectedApplication(null)}>
                <DialogContent className="max-w-2xl w-full p-0 max-h-[85vh] overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border-2 border-purple-200 dark:border-purple-800">
                  {selectedApplication && (
                    <>
                      {/* Header with gradient background */}
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 text-white" style={{
                        background: `linear-gradient(to right, #7C3AED, #6366F1)` // Use fixed colors instead of computed styles
                      }}>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16 border-4 border-white/20">
                            <AvatarImage src={selectedApplication.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-white/20 text-white text-lg font-bold">
                              {selectedApplication.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h2 className="text-2xl font-bold">
                              {selectedApplication.firstName && selectedApplication.lastName ? (
                                <>
                                  {selectedApplication.firstName} {selectedApplication.middleName ? `${selectedApplication.middleName.charAt(0)}.` : ''} {selectedApplication.lastName}
                                </>
                              ) : (
                                selectedApplication.name
                              )}
                            </h2>
                            <p className="text-purple-100">{selectedApplication.email}</p>
                            <div className="mt-2">
                              {getStatusBadge(selectedApplication.status)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Scrollable content area */}
                      <div className="overflow-y-auto max-h-[60vh] px-8 py-6">
                        {/* Documents Section - At the top */}
                        {selectedApplication.documents && selectedApplication.documents.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                              <FileText className="h-5 w-5 text-purple-600" />
                              Uploaded Documents
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {selectedApplication.documents.map((docUrl, index) => {
                                const fileName = docUrl.split('/').pop() || `Document ${index + 1}`;
                                const fileExt = fileName.split('.').pop()?.toUpperCase() || 'FILE';
                                return (
                                  <div
                                    key={index}
                                    onClick={() => isClient && window.open(docUrl, '_blank')}
                                    className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all duration-200 cursor-pointer group"
                                  >
                                    <div className="flex-shrink-0">
                                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                                        <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                      </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{fileName}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{fileExt} Document</p>
                                    </div>
                                    <Download className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Application Information */}
                        <div className="space-y-6">
                          {/* Personal Information */}
                          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                              <UserIcon className="h-5 w-5 text-purple-600" />
                              Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedApplication.firstName && selectedApplication.lastName && (
                                <>
                                  <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">First Name</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{selectedApplication.firstName}</p>
                                  </div>
                                  {selectedApplication.middleName && (
                                    <div>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">Middle Name</p>
                                      <p className="font-medium text-gray-900 dark:text-gray-100">{selectedApplication.middleName}</p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Name</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{selectedApplication.lastName}</p>
                                  </div>
                                </>
                              )}
                              {selectedApplication.birthdate && (
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Birthdate</p>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">{safeFormatDate(selectedApplication.birthdate, 'MMM dd, yyyy')}</p>
                                </div>
                              )}
                              {selectedApplication.gender && (
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">{selectedApplication.gender}</p>
                                </div>
                              )}
                              {selectedApplication.mobileNumber && (
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Mobile Number</p>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">{selectedApplication.mobileNumber}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Location Information */}
                          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-purple-600" />
                              Location & School
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Province</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{selectedApplication.region}</p>
                              </div>
                              {selectedApplication.city && (
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">{selectedApplication.city}</p>
                                </div>
                              )}
                              {selectedApplication.schoolSector && (
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">School Sector</p>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">{selectedApplication.schoolSector}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Academic Information */}
                          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                              <GraduationCap className="h-5 w-5 text-purple-600" />
                              Academic & Scholarship Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Scholarship</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{selectedApplication.scholarship}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{selectedApplication.amount}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">GWA</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{selectedApplication.gwa}%</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Submitted Date</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{safeFormatDate(selectedApplication.submittedDate, 'MMM dd, yyyy')}</p>
                              </div>
                            </div>
                          </div>

                          {/* Review Information */}
                          {selectedApplication.review && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-purple-600" />
                                Review Comments
                              </h3>
                              <p className="text-gray-700 dark:text-gray-300">{selectedApplication.review}</p>
                              {selectedApplication.score && (
                                <div className="mt-3 flex items-center gap-2">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <span className="text-sm font-medium">Score: {selectedApplication.score}/100</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="border-t border-gray-200 dark:border-gray-700 px-8 py-4 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex justify-end">
                          <DialogClose asChild>
                            <Button variant="outline" className="hover:scale-105 transition-transform">
                              Close
                            </Button>
                          </DialogClose>
                        </div>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
              {/* Application Review Modal */}
              <Dialog open={modalMode === "reviewApplication"} onOpenChange={() => { setModalMode(null); setSelectedApplication(null); }}>
                <DialogContent className="max-w-md w-full p-6 max-h-[80vh] overflow-y-auto rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Review Application</DialogTitle>
                  </DialogHeader>
                  {selectedApplication && (
                    <Suspense fallback={<FormLoadingSpinner />}>
                      <ApplicationReviewForm
                        application={selectedApplication}
                        onSave={handleSaveApplicationReview}
                        onCancel={() => { setModalMode(null); setSelectedApplication(null); }}
                      />
                    </Suspense>
                  )}
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" onClick={(e) => { e.stopPropagation(); }}>Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Send Message Modal */}
              <Dialog open={modalMode === "sendMessage"} onOpenChange={() => { setModalMode(null); setSelectedApplication(null); }}>
                <DialogContent className="max-w-md w-full p-6 max-h-[80vh] overflow-y-auto rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Send Message</DialogTitle>
                  </DialogHeader>
                  {selectedApplication && (
                    <Suspense fallback={<FormLoadingSpinner />}>
                      <SendMessageForm
                        application={selectedApplication}
                        onSend={handleSendMessage}
                        onCancel={() => { setModalMode(null); setSelectedApplication(null); }}
                      />
                    </Suspense>
                  )}
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" onClick={(e) => { e.stopPropagation(); }}>Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Download Confirmation Modal */}
              <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
                <DialogContent className="max-w-md w-full p-6 rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Download Application</DialogTitle>
                  </DialogHeader>
                  {downloadApplication && (
                    <div className="space-y-2 text-sm">
                      <p>Are you sure you want to download the details of <span className="font-semibold">
                        {downloadApplication.firstName && downloadApplication.lastName ? (
                          <>
                            {downloadApplication.firstName} {downloadApplication.middleName ? `${downloadApplication.middleName.charAt(0)}.` : ''} {downloadApplication.lastName}
                          </>
                        ) : (
                          downloadApplication.name
                        )}
                      </span>?</p>
                      {downloadApplication.birthdate && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Birthdate:</strong> {format(new Date(downloadApplication.birthdate), 'MMM dd, yyyy')}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">Choose your preferred file format:</p>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDownloadDialogOpen(false)} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Cancel</Button>
                    <Button onClick={handleConfirmDownloadPDF} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Download PDF</Button>
                    <Button onClick={handleConfirmDownloadDOCX} variant="secondary" className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Download DOCX</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Delete Applicant Confirmation Modal */}
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="max-w-md w-full p-6 rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Delete Applicant</DialogTitle>
                  </DialogHeader>
                  {deleteApplication && (
                    <div className="space-y-2 text-sm">
                      <p>Are you sure you want to delete the application of <span className="font-semibold">
                        {deleteApplication.firstName && deleteApplication.lastName ? (
                          <>
                            {deleteApplication.firstName} {deleteApplication.middleName ? `${deleteApplication.middleName.charAt(0)}.` : ''} {deleteApplication.lastName}
                          </>
                        ) : (
                          deleteApplication.name
                        )}
                      </span>?</p>
                      {deleteApplication.birthdate && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Birthdate:</strong> {format(new Date(deleteApplication.birthdate), 'MMM dd, yyyy')}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Cancel</Button>
                    <Button variant="destructive" onClick={handleConfirmDeleteApplicant} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Trash Bin Modal */}
              <Dialog open={trashBinOpen} onOpenChange={setTrashBinOpen}>
                <DialogContent className="max-w-lg w-full p-6 rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Trash Bin</DialogTitle>
                  </DialogHeader>
                  {trashBin.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No deleted applicants.</div>
                  ) : (
                    <div
                      className={`space-y-4${trashBin.length >= 5 ? ' max-h-[320px] overflow-y-auto scrollbar-hover' : ''}`}
                    >
                      {trashBin.map(app => (
                        <div key={app.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <div className="font-medium">
                              {app.firstName && app.lastName ? (
                                <>
                                  {app.firstName} {app.middleName ? `${app.middleName.charAt(0)}.` : ''} {app.lastName}
                                </>
                              ) : (
                                app.name
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {app.email} | {app.scholarship} | {app.region}
                              {app.birthdate && ` | ${format(new Date(app.birthdate), 'MMM dd, yyyy')}`}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleRestoreApplicant(app)} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Restore</Button>
                            <Button size="sm" variant="destructive" onClick={() => handlePermanentDeleteApplicant(app)} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Delete Permanently</Button>
                          </div>
                        </div>
                      ))}
                      {trashBin.length > 1 && (
                        <div className="flex justify-end mt-4">
                          <Button
                            size="lg"
                            variant="destructive"
                            onClick={handleDeleteAllPermanently}
                            className="hover:scale-110 hover:shadow-lg transition-shadow duration-200"
                          >
                            Delete All Permanently
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setTrashBinOpen(false)} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Status Workflow Dialog */}
              <Dialog open={statusWorkflowDialog.open} onOpenChange={() => setStatusWorkflowDialog({ open: false, app: null, step: null })}>
                <DialogContent className="max-w-md w-full p-6 rounded-xl">
                  {statusWorkflowDialog.step === 'pending' && statusWorkflowDialog.app && (
                    <>
                      <DialogHeader>
                        <DialogTitle>Move to Under Review</DialogTitle>
                      </DialogHeader>
                      <p>Do you want to change the status for <span className="font-semibold">
                        {statusWorkflowDialog.app.firstName && statusWorkflowDialog.app.lastName ? (
                          <>
                            {statusWorkflowDialog.app.firstName} {statusWorkflowDialog.app.middleName ? `${statusWorkflowDialog.app.middleName.charAt(0)}.` : ''} {statusWorkflowDialog.app.lastName}
                          </>
                        ) : (
                          statusWorkflowDialog.app.name
                        )}
                      </span> to 'Under Review'?</p>
                      {statusWorkflowDialog.app.birthdate && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Birthdate:</strong> {format(new Date(statusWorkflowDialog.app.birthdate), 'MMM dd, yyyy')}
                        </p>
                      )}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusWorkflowDialog({ open: false, app: null, step: null })} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Cancel</Button>
                        <Button onClick={() => handleStatusUpdate(statusWorkflowDialog.app!.id, 'under_review')} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Confirm</Button>
                      </DialogFooter>
                    </>
                  )}
                  {statusWorkflowDialog.step === 'under_review' && statusWorkflowDialog.app && (
                    <>
                      <DialogHeader>
                        <DialogTitle>Update Application Status</DialogTitle>
                      </DialogHeader>
                      <p>Accept or reject the application for <span className="font-semibold">
                        {statusWorkflowDialog.app.firstName && statusWorkflowDialog.app.lastName ? (
                          <>
                            {statusWorkflowDialog.app.firstName} {statusWorkflowDialog.app.middleName ? `${statusWorkflowDialog.app.middleName.charAt(0)}.` : ''} {statusWorkflowDialog.app.lastName}
                          </>
                        ) : (
                          statusWorkflowDialog.app.name
                        )}
                      </span>?</p>
                      {statusWorkflowDialog.app.birthdate && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Birthdate:</strong> {format(new Date(statusWorkflowDialog.app.birthdate), 'MMM dd, yyyy')}
                        </p>
                      )}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusWorkflowDialog({ open: false, app: null, step: null })} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Cancel</Button>
                        <Button variant="destructive" onClick={() => handleStatusUpdate(statusWorkflowDialog.app!.id, 'rejected')} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Reject</Button>
                        <Button className="bg-green-500 hover:bg-green-600 text-white hover:scale-110 hover:shadow-lg transition-shadow duration-200" onClick={() => handleStatusUpdate(statusWorkflowDialog.app!.id, 'approved')}>Accept</Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
              {/* Permanent Delete Applicant Dialog */}
              <Dialog open={permanentDeleteDialog.open} onOpenChange={open => setPermanentDeleteDialog(d => ({ ...d, open }))}>
                <DialogContent className="max-w-md w-full p-6 rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Delete Applicant Permanently</DialogTitle>
                  </DialogHeader>
                  {permanentDeleteDialog.app && (
                    <div className="space-y-2 text-sm">
                      <p>Are you sure you want to permanently delete <span className="font-semibold">
                        {permanentDeleteDialog.app.firstName && permanentDeleteDialog.app.lastName ? (
                          <>
                            {permanentDeleteDialog.app.firstName} {permanentDeleteDialog.app.middleName ? `${permanentDeleteDialog.app.middleName.charAt(0)}.` : ''} {permanentDeleteDialog.app.lastName}
                          </>
                        ) : (
                          permanentDeleteDialog.app.name
                        )}
                      </span>?</p>
                      {permanentDeleteDialog.app.birthdate && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Birthdate:</strong> {format(new Date(permanentDeleteDialog.app.birthdate), 'MMM dd, yyyy')}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPermanentDeleteDialog({ open: false, app: null })} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Cancel</Button>
                    <Button variant="destructive" onClick={confirmPermanentDeleteApplicant} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Delete Permanently</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Permanent Delete All Applicants Dialog */}
              <Dialog open={permanentDeleteAllDialog} onOpenChange={setPermanentDeleteAllDialog}>
                <DialogContent className="max-w-md w-full p-6 rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Delete All Applicants Permanently</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2 text-sm">
                    <p>Are you sure you want to permanently delete <span className="font-semibold">all applicants</span> in the Trash Bin?</p>
                    <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPermanentDeleteAllDialog(false)} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Cancel</Button>
                    <Button variant="destructive" onClick={confirmDeleteAllPermanently} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Delete All Permanently</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === "ranking" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-300">Application Ranking</h2>
                <p className="text-muted-foreground">Review and rank scholarship applications by GWA (GPA)</p>
              </div>
              {/* Status Cards */}
              <div className="flex gap-4 mb-4">
                {/* Approved */}
                <div
                  className={cn(
                    "flex-1 text-center cursor-pointer rounded-lg border transition-all duration-200 shadow-sm",
                    "focus:outline-none focus:ring-2 focus:ring-green-400",
                    "bg-green-500 text-white",
                    "hover:bg-green-100 hover:text-green-800 hover:scale-[1.04] hover:shadow-lg",
                    "dark:bg-green-600 dark:text-white dark:hover:bg-green-400/30 dark:hover:text-green-200"
                  )}
                  onClick={() => setRankingStatusModal({ open: true, status: 'approved' })}
                  tabIndex={0}
                  style={{ outline: 'none' }}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setRankingStatusModal({ open: true, status: 'approved' }); }}
                  aria-label="Show Approved Applicants"
                >
                  <CardContent className="py-2">
                    <div className="font-bold text-lg">{applications.filter(app => app.status === 'approved').length}</div>
                    <div className="font-semibold">Approved</div>
                  </CardContent>
                </div>
                {/* Under Review */}
                <div
                  className={cn(
                    "flex-1 text-center cursor-pointer rounded-lg border transition-all duration-200 shadow-sm",
                    "focus:outline-none focus:ring-2 focus:ring-blue-400",
                    "bg-blue-500 text-white",
                    "hover:bg-blue-100 hover:text-blue-800 hover:scale-[1.04] hover:shadow-lg",
                    "dark:bg-blue-600 dark:text-white dark:hover:bg-blue-400/30 dark:hover:text-blue-200"
                  )}
                  onClick={() => setRankingStatusModal({ open: true, status: 'under_review' })}
                  tabIndex={0}
                  style={{ outline: 'none' }}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setRankingStatusModal({ open: true, status: 'under_review' }); }}
                  aria-label="Show Under Review Applicants"
                >
                  <CardContent className="py-2">
                    <div className="font-bold text-lg">{applications.filter(app => app.status === 'under_review').length}</div>
                    <div className="font-semibold">Under Review</div>
                  </CardContent>
                </div>
                {/* Pending */}
                <div
                  className={cn(
                    "flex-1 text-center cursor-pointer rounded-lg border transition-all duration-200 shadow-sm",
                    "focus:outline-none focus:ring-2 focus:ring-orange-400",
                    "bg-orange-500 text-white",
                    "hover:bg-orange-100 hover:text-orange-800 hover:scale-[1.04] hover:shadow-lg",
                    "dark:bg-orange-600 dark:text-white dark:hover:bg-orange-400/30 dark:hover:text-orange-200"
                  )}
                  onClick={() => setRankingStatusModal({ open: true, status: 'pending' })}
                  tabIndex={0}
                  style={{ outline: 'none' }}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setRankingStatusModal({ open: true, status: 'pending' }); }}
                  aria-label="Show Pending Applicants"
                >
                  <CardContent className="py-2">
                    <div className="font-bold text-lg">{applications.filter(app => app.status === 'pending').length}</div>
                    <div className="font-semibold">Pending</div>
                  </CardContent>
                </div>
                {/* Rejected */}
                <div
                  className={cn(
                    "flex-1 text-center cursor-pointer rounded-lg border transition-all duration-200 shadow-sm",
                    "focus:outline-none focus:ring-2 focus:ring-red-400",
                    "bg-red-500 text-white",
                    "hover:bg-red-100 hover:text-red-800 hover:scale-[1.04] hover:shadow-lg",
                    "dark:bg-red-600 dark:text-white dark:hover:bg-red-400/30 dark:hover:text-red-200"
                  )}
                  onClick={() => setRankingStatusModal({ open: true, status: 'rejected' })}
                  tabIndex={0}
                  style={{ outline: 'none' }}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setRankingStatusModal({ open: true, status: 'rejected' }); }}
                  aria-label="Show Rejected Applicants"
                >
                  <CardContent className="py-2">
                    <div className="font-bold text-lg">{applications.filter(app => app.status === 'rejected').length}</div>
                    <div className="font-semibold">Rejected</div>
                  </CardContent>
                </div>
              </div>
              {/* Status Card Modal */}
              <Dialog open={rankingStatusModal.open} onOpenChange={open => setRankingStatusModal(s => ({ ...s, open }))}>
                <DialogContent className="max-w-lg w-full p-6 rounded-xl dark:bg-[#23232a] dark:text-gray-100">
                  <DialogHeader>
                    <DialogTitle>
                      {rankingStatusModal.status === 'approved' ? 'Approved Applicants'
                        : rankingStatusModal.status === 'under_review' ? 'Under Review Applicants'
                        : rankingStatusModal.status === 'pending' ? 'Pending Applicants'
                        : rankingStatusModal.status === 'rejected' ? 'Rejected Applicants'
                        : ''}
                    </DialogTitle>
                  </DialogHeader>
                  {/* Make the list scrollable if 4 or more applicants */}
                  {(() => {
                    const filteredApps = applications.filter(app => {
                      if (rankingStatusModal.status === 'approved') return app.status === 'approved';
                      return app.status === rankingStatusModal.status;
                    });
                    return (
                      <div
                        className={`space-y-2${filteredApps.length >= 4 ? ' max-h-[300px] overflow-y-auto scrollbar-hover' : ''}`}
                        style={{}}
                      >
                        {filteredApps.length === 0 ? (
                          <div className="text-center text-muted-foreground py-4">No applicants with this status.</div>
                        ) : (
                          filteredApps.map(app => (
                            <div
                              key={app.id}
                              className={cn(
                                "flex items-center justify-between border-b pb-2 cursor-pointer rounded transition-all duration-200",
                                "hover:scale-105 hover:shadow-lg hover:bg-accent/40 focus:scale-105 focus:shadow-lg"
                              )}
                              onClick={() => {
                                  setActiveTab('applications');
                                setStatusFilter(app.status);
                                  setHighlightedApplicantId(app.id);
                                setRankingStatusModal({ open: false, status: null });
                              }}
                                      tabIndex={0}
                                      role="button"
                              aria-label={`Go to applicant ${app.name} in Applications`}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  setActiveTab('applications');
                                  setStatusFilter(app.status);
                                  setHighlightedApplicantId(app.id);
                                  setRankingStatusModal({ open: false, status: null });
                                }
                              }}
                            >
                              <div>
                                <div className="font-medium">
                                  {app.firstName && app.lastName ? (
                                    <>
                                      {app.firstName} {app.middleName ? `${app.middleName.charAt(0)}.` : ''} {app.lastName}
                                    </>
                                  ) : (
                                    app.name
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  GWA: {app.gwa} | {app.scholarship}
                                  {app.birthdate && ` | ${format(new Date(app.birthdate), 'MMM dd, yyyy')}`}
                                </div>
                              </div>
                                </div>
                          ))
                        )}
                                </div>
                    );
                  })()}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setRankingStatusModal({ open: false, status: null })} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Scholarship Ranking Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {scholarships.map((scholarship) => {
                  // Sort applicants by GPA ascending (lowest to highest)
                  const rankedApps = applications
                    .filter(app => app.scholarship === scholarship.name)
                    .sort((a, b) => (a.gwa || 0) - (b.gwa || 0));
                  return (
                    <Card key={scholarship.id} className="dark:bg-[#23232a] dark:text-gray-100">
                    <CardHeader>
                        <CardTitle>{scholarship.name} Rankings</CardTitle>
                        <CardDescription>Ranked by GPA</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {rankedApps.length === 0 ? (
                          <div className="text-center text-muted-foreground py-4">No applicants for this scholarship.</div>
                        ) : (
                          <div className={`divide-y${rankedApps.length >= 4 ? ' max-h-[220px] overflow-y-auto scrollbar-hover' : ''}`}> {/* Scrollable if 4+ */}
                            {rankedApps.map((app, idx) => (
                              <div
                                key={app.id}
                                id={`ranking-row-${app.id}`}
                                className={cn(
                                  "flex items-center justify-between py-3 transition-all duration-200",
                                  dashboardRankingHighlightId === app.id
                                    ? "ring-2 ring-purple-400 bg-purple-100 dark:bg-purple-900/40 scale-[1.03] shadow-xl"
                                    : "hover:scale-[1.03] hover:shadow-lg hover:bg-purple-50 dark:hover:bg-purple-900/40 cursor-pointer"
                                )}
                                tabIndex={0}
                                onClick={() => {
                                  setActiveTab('applications');
                                  setStatusFilter(app.status);
                                  setHighlightedApplicantId(app.id);
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    setActiveTab('applications');
                                    setStatusFilter(app.status);
                                    setHighlightedApplicantId(app.id);
                                  }
                                }}
                                aria-label={`Go to applicant ${app.name} in Applications`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 flex items-center justify-center rounded-full font-bold bg-gray-200 text-gray-700">{idx + 1}</div>
                      <div>
                                    <div className="font-medium">
                                      {app.firstName && app.lastName ? (
                                        <>
                                          {app.firstName} {app.middleName ? `${app.middleName.charAt(0)}.` : ''} {app.lastName}
                                        </>
                                      ) : (
                                        app.name
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                  {app.region}
                                  {app.birthdate && ` | ${format(new Date(app.birthdate), 'MMM dd, yyyy')}`}
                                </div>
                        </div>
                      </div>
                                <div className="flex items-center gap-4">
                                  <span className="font-semibold">{app.gwa?.toFixed(2)}</span>
                                  {/* Status badge clickable: go to Applications table and highlight applicant */}
                                  <span
                                    className="cursor-pointer"
                                    onClick={e => {
                                      e.stopPropagation();
                                  setActiveTab('applications');
                                      setStatusFilter(app.status);
                                  setHighlightedApplicantId(app.id);
                                    }}
                                      tabIndex={0}
                                      role="button"
                                      aria-label="Go to applicant in Applications"
                                    >
                                {getStatusBadge(app.status)}
                                  </span>
                        </div>
                      </div>
                          ))}
                        </div>
                        )}
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "scholarships" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-300">Scholarships</h2>
                  <p className="text-muted-foreground">Manage scholarship programs and deadlines</p>
                </div>
                <div className="flex items-center space-x-4">
              <Button variant="altAction" onClick={() => setScholarshipTrashOpen(true)} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">
                <Trash2 className="h-4 w-4 mr-2" />
                Trash Bin {scholarshipTrash.length > 0 && <span className="ml-1">({scholarshipTrash.length})</span>}
              </Button>
                  <Select value={scholarshipSort} onValueChange={setScholarshipSort}>
                    <SelectTrigger className="w-48 bg-black text-white border-2 border-black hover:bg-white hover:text-black dark:bg-white dark:text-black dark:border-white dark:hover:bg-black dark:hover:text-white transition-colors">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deadline_oldest">Deadline: Oldest First</SelectItem>
                      <SelectItem value="deadline_newest">Deadline: Newest First</SelectItem>
                      <SelectItem value="applicants_asc">Applicants: Ascending</SelectItem>
                      <SelectItem value="applicants_desc">Applicants: Descending</SelectItem>
                      <SelectItem value="status_active">Status: Active</SelectItem>
                      <SelectItem value="status_closed">Status: Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="purple" onClick={() => setScholarshipTypeDialog(true)} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">
                    <Award className="h-4 w-4 mr-2" />
                    Create Scholarship
                  </Button>
                </div>
              </div>
              {/* Scholarships Loading/Error State */}
              {loadingScholarships ? (
                <div className="text-center text-muted-foreground py-8">Loading scholarships...</div>
              ) : scholarshipsError ? (
                <div className="text-center text-red-500 py-8">{scholarshipsError}</div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scholarships
                  .slice()
                  .filter(sch => {
                    if (scholarshipSort === "status_active") {
                      return sch.status === "active";
                    } else if (scholarshipSort === "status_closed") {
                      return sch.status === "closed";
                    }
                    return true;
                  })
                  .sort((a, b) => {
                    if (scholarshipSort === "deadline_oldest") {
                      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                    } else if (scholarshipSort === "deadline_newest") {
                      return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
                    } else if (scholarshipSort === "applicants_asc") {
                      const aCount = applications.filter(app => app.scholarship === a.name).length;
                      const bCount = applications.filter(app => app.scholarship === b.name).length;
                      return aCount - bCount;
                    } else if (scholarshipSort === "applicants_desc") {
                      const aCount = applications.filter(app => app.scholarship === a.name).length;
                      const bCount = applications.filter(app => app.scholarship === b.name).length;
                      return bCount - aCount;
                    }
                    return 0;
                  })
                  .map((scholarship) => (
                    <Card
                      key={scholarship.id}
                      className={cn(
                        "dark:bg-[#23232a] dark:text-gray-100 cursor-pointer transition-all duration-200",
                        "hover:scale-105 hover:shadow-lg hover:bg-purple-50 dark:hover:bg-purple-900/40"
                      )}
                      tabIndex={0}
                      onClick={() => { setSelectedScholarship(scholarship); setModalMode("view"); }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedScholarship(scholarship); setModalMode("view");
                        }
                      }}
                      aria-label={`Show details for ${scholarship.name}`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{scholarship.name}</CardTitle>
                          {getStatusBadge(displayStatus(scholarship))}
                        </div>
                        <CardDescription>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg text-green-700">₱</span>
                            <span>{scholarship.amount.replace(/[$₱]/g, "")}</span>
                          </div>
                        {scholarship.type && (
                          <div className="mt-1 text-xs font-bold text-purple-700 dark:text-purple-400">{scholarship.type} Scholarship</div>
                        )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Deadline:</span>
                            <span className="font-medium">{format(new Date(scholarship.deadline), 'yyyy-MM-dd')}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Applicants:</span>
                            <span className="font-medium">{applications.filter(app => app.scholarship === scholarship.name).length}</span>
                          </div>
                        <div className="pt-3 border-t flex space-x-2">
                            {/* Removed View button */}
                            <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-1 hover:scale-110 hover:shadow-lg transition-shadow duration-200" onClick={e => { e.stopPropagation(); setSelectedScholarship(scholarship); setModalMode("edit"); }}>
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </Button>
                            <Button variant="destructive" size="sm" className="flex-1 flex items-center justify-center gap-1 hover:scale-110 hover:shadow-lg transition-shadow duration-200" onClick={e => { e.stopPropagation(); setDeleteScholarshipDialog({ open: true, scholarship }); }}>
                            <Trash2 className="h-4 w-4" />
                            <span>Remove</span>
                              </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              )}
              {/* Scholarship Type Prompt Modal */}
              <Dialog open={scholarshipTypeDialog && !pendingScholarshipType} onOpenChange={open => { if (!open) setScholarshipTypeDialog(false); }}>
                <DialogContent className="max-w-xs w-full p-6 rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Choose Scholarship Type</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 mt-4">
                    <Button onClick={() => { setPendingScholarshipType('Full'); }} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Full Scholarship</Button>
                    <Button onClick={() => { setPendingScholarshipType('Half'); }} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Half Scholarship</Button>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" onClick={() => setScholarshipTypeDialog(false)}>Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
          {/* Scholarship Create Modal (floating window) */}
          <Dialog open={!!pendingScholarshipType} onOpenChange={open => { if (!open) { setPendingScholarshipType(null); setScholarshipTypeDialog(false); } }}>
            <DialogContent className="max-w-md w-full p-6 max-h-[80vh] overflow-y-auto rounded-xl">
              <DialogHeader>
                <DialogTitle>
                  <span>Create {pendingScholarshipType} Scholarship</span>
                </DialogTitle>
              </DialogHeader>
              {pendingScholarshipType && (
                <Suspense fallback={<FormLoadingSpinner />}>
                  <ScholarshipCreateForm
                    onSave={data => { handleCreateScholarship({ ...data, type: pendingScholarshipType }); setPendingScholarshipType(null); setScholarshipTypeDialog(false); }}
                    onCancel={() => { setPendingScholarshipType(null); setScholarshipTypeDialog(false); }}
                    type={pendingScholarshipType}
                  />
                </Suspense>
              )}
            </DialogContent>
          </Dialog>
              {/* Scholarship Remove Confirmation Modal */}
              <Dialog open={deleteScholarshipDialog.open} onOpenChange={open => setDeleteScholarshipDialog(d => ({ ...d, open }))}>
                <DialogContent className="max-w-md w-full p-6 rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Remove Scholarship</DialogTitle>
                  </DialogHeader>
                  {deleteScholarshipDialog.scholarship && (
                    <div className="space-y-2 text-sm">
                      <p>Are you sure you want to remove <span className="font-semibold">{deleteScholarshipDialog.scholarship.name}</span>?</p>
                  <p className="text-xs text-muted-foreground">This will move the scholarship to the Trash Bin. All related rankings will also be removed.</p>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteScholarshipDialog({ open: false, scholarship: null })} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Cancel</Button>
                    <Button variant="destructive" onClick={() => {
                      if (deleteScholarshipDialog.scholarship) {
                    handleRemoveScholarship(deleteScholarshipDialog.scholarship);
                        setDeleteScholarshipDialog({ open: false, scholarship: null });
                      }
                    }} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Remove</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Scholarship View/Edit Modal */}
              <Dialog open={!!modalMode && (modalMode === 'view' || modalMode === 'edit')} onOpenChange={() => { setModalMode(null); setSelectedScholarship(null); }}>
                <DialogContent className="max-w-2xl w-full p-0 max-h-[85vh] overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border-2 border-indigo-200 dark:border-indigo-800">
                  {selectedScholarship && (() => {
                    // Always get the latest scholarship object from state by id
                    const latestScholarship = scholarships.find(s => s.id === selectedScholarship.id) || selectedScholarship;
                    const applicantsCount = applications.filter(app => app.scholarship === latestScholarship.name).length;
                    return (
                      <>
                        {modalMode === "view" ? (
                          <>
                            {/* Header with gradient background */}
                            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6 text-white" style={{
                              background: `linear-gradient(to right, ${getComputedStyle(document.documentElement).getPropertyValue('--scholarship-theme-color') || '#6366F1'}, ${getComputedStyle(document.documentElement).getPropertyValue('--scholarship-theme-color') || '#3B82F6'})`
                            }}>
                              <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                  <Award className="h-8 w-8 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h2 className="text-2xl font-bold text-white mb-1">{latestScholarship.name}</h2>
                                  <div className="flex items-center gap-2">
                                    {getStatusBadge(latestScholarship.status)}
                                    {latestScholarship.type && (
                                      <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                        {latestScholarship.type} Scholarship
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Content sections */}
                            <div className="px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto">
                              <div className="space-y-6">
                                {/* Scholarship Information Section */}
                                <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Award className="h-5 w-5 text-indigo-600" />
                                    Scholarship Information
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</label>
                                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">₱ {latestScholarship.amount.replace(/[$₱]/g, "")}</div>
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Deadline</label>
                                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{format(new Date(latestScholarship.deadline), 'MMM dd, yyyy')}</div>
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Applicants</label>
                                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{applicantsCount}</div>
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                                      <div>{getStatusBadge(latestScholarship.status)}</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Statistics Section */}
                                <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                                    Application Statistics
                                  </h3>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/30">
                                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                        {applications.filter(app => app.scholarship === latestScholarship.name && app.status === 'pending').length}
                                      </div>
                                      <div className="text-sm text-orange-700 dark:text-orange-300 font-medium">Pending</div>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {applications.filter(app => app.scholarship === latestScholarship.name && app.status === 'under_review').length}
                                      </div>
                                      <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Under Review</div>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/30">
                                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {applications.filter(app => app.scholarship === latestScholarship.name && (app.status === 'approved' || app.status === 'accepted')).length}
                                      </div>
                                      <div className="text-sm text-green-700 dark:text-green-300 font-medium">Approved</div>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/30">
                                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                        {applications.filter(app => app.scholarship === latestScholarship.name && app.status === 'rejected').length}
                                      </div>
                                      <div className="text-sm text-red-700 dark:text-red-300 font-medium">Rejected</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Recent Applications Section */}
                                {applicantsCount > 0 && (
                                  <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                      <Users className="h-5 w-5 text-indigo-600" />
                                      Recent Applications
                                    </h3>
                                    <div className="space-y-3">
                                      {applications
                                        .filter(app => app.scholarship === latestScholarship.name)
                                        .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
                                        .slice(0, 5)
                                        .map((app, index) => (
                                          <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                              <Avatar className="h-8 w-8">
                                                <AvatarImage src={app.avatar} />
                                                <AvatarFallback className="text-xs">
                                                  {app.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </AvatarFallback>
                                              </Avatar>
                                              <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{app.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                  GWA: {app.gwa}% • {format(new Date(app.submittedDate), 'MMM dd, yyyy')}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              {getStatusBadge(app.status)}
                                              <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => {
                                                  setSelectedApplication(app);
                                                  setModalMode(null);
                                                  setSelectedScholarship(null);
                                                }}
                                                className="h-8 w-8 p-0 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                                              >
                                                <Eye className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                    {applicantsCount > 5 && (
                                      <div className="mt-4 text-center">
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => {
                                            setActiveTab('applications');
                                            setScholarshipFilter(latestScholarship.name);
                                            setModalMode(null);
                                            setSelectedScholarship(null);
                                          }}
                                          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/50"
                                        >
                                          View All {applicantsCount} Applications
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="px-8 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                              <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setModalMode('edit')}
                                    className="hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-indigo-900/50"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Scholarship
                                  </Button>
                                </div>
                                <Button 
                                  variant="outline" 
                                  onClick={() => { setModalMode(null); setSelectedScholarship(null); }}
                                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  Close
                                </Button>
                              </div>
                            </div>
                          </>
                        ) : (
                          // Edit mode with enhanced container
                          <div className="p-8">
                            <div className="mb-6">
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Edit Scholarship</h2>
                              <p className="text-gray-600 dark:text-gray-400">Update scholarship information and settings</p>
                            </div>
                            <Suspense fallback={<FormLoadingSpinner />}>
                              <ScholarshipEditForm scholarship={latestScholarship} onSave={handleSaveScholarship} onCancel={() => { setModalMode(null); setSelectedScholarship(null); }} />
                            </Suspense>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </DialogContent>
              </Dialog>
          {/* Scholarship Trash Bin Modal */}
          <Dialog open={scholarshipTrashOpen} onOpenChange={setScholarshipTrashOpen}>
            <DialogContent className="max-w-lg w-full p-6 rounded-xl">
              <DialogHeader>
                <DialogTitle>Scholarship Trash Bin</DialogTitle>
              </DialogHeader>
              {scholarshipTrash.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No deleted scholarships.</div>
              ) : (
                <div className={`space-y-4${scholarshipTrash.length >= 5 ? ' max-h-[320px] overflow-y-auto scrollbar-hover' : ''}`}>
                  {scholarshipTrash.map(sch => (
                    <div key={sch.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <div className="font-medium">{sch.name}</div>
                        <div className="text-xs text-muted-foreground">Amount: {sch.amount} | Deadline: {format(new Date(sch.deadline), 'yyyy-MM-dd')}</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleRestoreScholarship(sch)} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Restore</Button>
                        <Button size="sm" variant="destructive" onClick={() => setPermanentDeleteScholarshipDialog({ open: true, scholarship: sch })} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Delete Permanently</Button>
                      </div>
                    </div>
                  ))}
                  {scholarshipTrash.length > 1 && (
                    <div className="flex justify-end mt-4">
                      <Button size="lg" variant="destructive" onClick={() => setPermanentDeleteAllScholarshipsDialog(true)} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Delete All Permanently</Button>
                    </div>
                  )}
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setScholarshipTrashOpen(false)} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Permanent Delete Scholarship Dialog */}
          <Dialog open={permanentDeleteScholarshipDialog.open} onOpenChange={open => setPermanentDeleteScholarshipDialog(d => ({ ...d, open }))}>
            <DialogContent className="max-w-md w-full p-6 rounded-xl">
              <DialogHeader>
                <DialogTitle>Delete Scholarship Permanently</DialogTitle>
              </DialogHeader>
              {permanentDeleteScholarshipDialog.scholarship && (
                <div className="space-y-2 text-sm">
                  <p>Are you sure you want to permanently delete <span className="font-semibold">{permanentDeleteScholarshipDialog.scholarship.name}</span>?</p>
                  <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setPermanentDeleteScholarshipDialog({ open: false, scholarship: null })} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Cancel</Button>
                <Button variant="destructive" onClick={() => { if (permanentDeleteScholarshipDialog.scholarship) { handlePermanentDeleteScholarship(permanentDeleteScholarshipDialog.scholarship); setPermanentDeleteScholarshipDialog({ open: false, scholarship: null }); } }} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Delete Permanently</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Permanent Delete All Scholarships Dialog */}
          <Dialog open={permanentDeleteAllScholarshipsDialog} onOpenChange={setPermanentDeleteAllScholarshipsDialog}>
            <DialogContent className="max-w-md w-full p-6 rounded-xl">
              <DialogHeader>
                <DialogTitle>Delete All Scholarships Permanently</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <p>Are you sure you want to permanently delete <span className="font-semibold">all scholarships</span> in the Trash Bin?</p>
                <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPermanentDeleteAllScholarshipsDialog(false)} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Cancel</Button>
                <Button variant="destructive" onClick={() => { handlePermanentDeleteAllScholarships(); setPermanentDeleteAllScholarshipsDialog(false); }} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Delete All Permanently</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === "users" && user?.role === "Administrator" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-300">User Management</h2>
                  <p className="text-muted-foreground">Manage system users and permissions (Administrator Only)</p>
                </div>
            <Button variant="purple" onClick={() => setShowAddUserModal(true)}>
                  <Users className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
              <Card className="dark:bg-[#23232a] dark:text-gray-100">
                <CardContent className="pt-6">
              {loadingUsers ? (
                <div className="text-center text-muted-foreground py-8">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No users found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold text-gray-600 dark:text-gray-300">User</TableHead>
                      <TableHead className="font-bold text-gray-600 dark:text-gray-300">Role</TableHead>
                      <TableHead className="font-bold text-gray-600 dark:text-gray-300">Department</TableHead>
                      <TableHead className="font-bold text-gray-600 dark:text-gray-300">Last Active</TableHead>
                      <TableHead className="font-bold text-gray-600 dark:text-gray-300">Status</TableHead>
                      <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={"/placeholder.svg?height=32&width=32"} />
                              <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{getUserFullName(user)}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge>{user.role}</Badge>
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>{user.lastActive ? format(new Date(user.lastActive), 'yyyy-MM-dd') : ''}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-2">
                            {user.status === 'Active' && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {user.status === 'Inactive' && <XCircle className="h-4 w-4 text-muted-foreground" />}
                            <Badge variant={user.status === 'Active' ? 'default' : 'destructive'} className={user.status === 'Active' ? 'bg-green-600 hover:bg-green-600/80 dark:bg-green-700 dark:text-white' : ''}>
                              {user.status}
                            </Badge>
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu open={userActionMenuOpenId === user.id} onOpenChange={open => setUserActionMenuOpenId(open ? user.id : null)}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className={cn(
                                  "h-8 w-8 p-0 flex items-center justify-center rounded-full border transition-colors hover:scale-110 hover:shadow-lg transition-shadow duration-200",
                                  userActionMenuOpenId === user.id ? "bg-purple-100 text-purple-700 border-purple-300 shadow-md" : "hover:bg-gray-100 dark:hover:bg-zinc-800"
                                )}
                                aria-label="User Actions"
                              >
                                <span className="sr-only">Open actions</span>
                                <span className={cn("transition-transform duration-200", userActionMenuOpenId === user.id ? "rotate-90 text-purple-700" : "") }>
                                  <MoreHorizontal className="h-5 w-5" />
                                </span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700">
                              <DropdownMenuItem className="hover:scale-105 hover:shadow-lg transition-shadow duration-200" onClick={() => setUserModal({ mode: 'edit', user })}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:scale-105 hover:shadow-lg transition-shadow duration-200" onClick={() => {
                                setDeptDialog({ open: true, user });
                                setDeptValue(user.department || "");
                                setDeptOther("");
                              }}>
                                <UserIcon className="h-4 w-4 mr-2" />
                                Change Dept.
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:scale-105 hover:shadow-lg transition-shadow duration-200" onClick={() => setRoleDialog({ open: true, user })}>
                                <Star className="h-4 w-4 mr-2" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:scale-105 hover:shadow-lg transition-shadow duration-200" onClick={() => setResetDialog({ open: true, user })}>
                                <Key className="h-4 w-4 mr-2" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 hover:scale-105 hover:shadow-lg transition-shadow duration-200" onClick={() => handleDeleteUser(user)}>
                                <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
                </CardContent>
              </Card>
          {/* Add/Edit User Modal */}
          <Dialog open={!!userModal || showAddUserModal} onOpenChange={() => { setUserModal(null); setShowAddUserModal(false); }}>
            <DialogContent className="max-w-md w-full p-6 max-h-[80vh] overflow-y-auto rounded-xl">
              <DialogHeader>
                <DialogTitle>{userModal?.mode === 'edit' ? 'Edit User' : userModal?.mode === 'role' ? 'Change Role' : userModal?.mode === 'reset' ? 'Reset Password' : userModal?.mode === 'deactivate' ? 'Deactivate User' : 'Add User'}</DialogTitle>
              </DialogHeader>
              <Suspense fallback={<FormLoadingSpinner />}>
                <UserForm
                  user={userModal?.user}
                  currentUserRole={user?.role}
                  onSave={async (userData) => {
                    if (userModal?.user?.id) {
                      // Edit existing user
                      try {
                        const res = await fetch(`/api/users/${userModal.user.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ ...userData, id: userModal.user.id }),
                        });
                        if (!res.ok) {
                          const error = await res.json();
                          throw new Error(error.error || 'Failed to update user');
                        }
                        const updatedUser = await res.json();
                        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
                        toast.success('User updated successfully!');
                      } catch (err: any) {
                        toast.error(err.message || 'Failed to update user');
                      }
                    } else {
                      // Add new user (requires password for creation)
                      const createUserData = {
                        ...userData,
                        password: 'temp123456' // Default password for admin-created users
                      };
                      
                      try {
                        const res = await fetch('/api/users', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(createUserData),
                        });
                        if (!res.ok) {
                          const error = await res.json();
                          throw new Error(error.error || 'Failed to create user');
                        }
                        const newUser = await res.json();
                        setUsers(prev => [...prev, newUser]);
                        toast.success('User created successfully! Default password: temp123456');
                      } catch (err: any) {
                        toast.error(err.message || 'Failed to create user');
                      }
                    }
                    setUserModal(null);
                    setShowAddUserModal(false);
                  }}
                  onCancel={() => { setUserModal(null); setShowAddUserModal(false); }}
                />
              </Suspense>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Role Change Dialog */}
          <Dialog open={roleDialog.open} onOpenChange={open => setRoleDialog(d => ({ ...d, open }))}>
            <DialogContent className="max-w-md w-full p-6 rounded-xl">
              <DialogHeader>
                <DialogTitle>Change Role</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Label htmlFor="role-select">Select new role:</Label>
                <Select value={selectedRole || roleDialog.user?.role || ""} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role-select">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrator">Administrator</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRoleDialog({ open: false, user: null })} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Cancel</Button>
                <Button onClick={async () => {
                  if (!roleDialog.user || !selectedRole) return;
                  try {
                  const res = await fetch(`/api/users/${roleDialog.user.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role: selectedRole }),
                  });
                    if (!res.ok) throw new Error('Failed to update role');
                    const updatedUser = await res.json();
                    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
                    toast.success('Role updated successfully!');
                  } catch (err: any) {
                    toast.error(err.message || 'Failed to update role.');
                  }
                  setRoleDialog({ open: false, user: null });
                  setSelectedRole("");
                }} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Reset Password Dialog */}
          <Dialog open={resetDialog.open} onOpenChange={open => setResetDialog(d => ({ ...d, open }))}>
            <DialogContent className="max-w-md w-full p-6 rounded-xl">
              <DialogHeader>
                <DialogTitle>Reset Password</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p>Are you sure you want to reset the password for <span className="font-semibold">{getUserFullName(resetDialog.user || {})}</span>?</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setResetDialog({ open: false, user: null })} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Cancel</Button>
                <Button variant="destructive" onClick={async () => {
                  if (!resetDialog.user) return;
                  try {
                  const res = await fetch(`/api/users/${resetDialog.user.id}`, { method: 'POST' });
                    if (!res.ok) throw new Error('Failed to reset password');
                    const data = await res.json();
                    toast.success(data.message || 'Password reset successfully!');
                  } catch (err: any) {
                    toast.error(err.message || 'Failed to reset password.');
                  }
                  setResetDialog({ open: false, user: null });
                }} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Department Change Dialog */}
          <Dialog open={deptDialog.open} onOpenChange={open => setDeptDialog(d => ({ ...d, open }))}>
            <DialogContent className="max-w-md w-full p-6 rounded-xl">
              <DialogHeader>
                <DialogTitle>Change Department</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Label htmlFor="dept-select">Select new department:</Label>
                <select
                  id="dept-select"
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={deptValue}
                  onChange={e => setDeptValue(e.target.value)}
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
                {deptValue === "Other" && (
                  <div className="mt-2">
                    <Label htmlFor="dept-other">Specify Department</Label>
                    <input
                      id="dept-other"
                      type="text"
                      className="w-full border rounded px-3 py-2 mt-1"
                      placeholder="Enter department"
                      value={deptOther}
                      onChange={e => setDeptOther(e.target.value)}
                    />
            </div>
          )}
      </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeptDialog({ open: false, user: null })} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Cancel</Button>
                <Button onClick={async () => {
                  if (!deptDialog.user) return;
                  let newDept = deptValue === "Other" ? deptOther : deptValue;
                  if (!newDept) return;
                  try {
                    const res = await fetch(`/api/users/${deptDialog.user.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ department: newDept }),
                    });
                    if (!res.ok) throw new Error('Failed to update department');
                    const updatedUser = await res.json();
                    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
                    toast.success('Department updated successfully!');
                  } catch (err: any) {
                    toast.error(err.message || 'Failed to update department.');
                  }
                  setDeptDialog({ open: false, user: null });
                }} className="hover:scale-110 hover:shadow-lg transition-shadow duration-200">Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
            </div>
          )}
        </main>
        </>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}
