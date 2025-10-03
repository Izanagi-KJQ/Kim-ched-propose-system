"use client"

import { useState, useEffect, useMemo, useRef } from "react"
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
  Upload,
  Filter,
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import { Sheet, SheetContent, SheetHeader, SheetFooter, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import RequirementsChecklist from "@/components/ranking/RequirementsChecklist";
import AddStudentModal from "@/components/ranking/AddStudentModal";
import { ThemeSwitcher, ThemeSwitcherButtonPurple } from "@/components/ui/theme-switcher";
import { Scholarship, Application, User } from "@/lib/types";
import ApplicationCreateForm from "@/components/forms/ApplicationCreateForm";
import ScholarshipEditForm from "@/components/forms/ScholarshipEditForm";
import ScholarshipCreateForm from "@/components/forms/ScholarshipCreateForm";
import UserForm from "@/components/forms/UserForm";
import ApplicationReviewForm from "@/components/forms/ApplicationReviewForm";
import SendMessageForm from "@/components/forms/SendMessageForm";
import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import { cn } from "@/lib/utils";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useShiftSelect } from "@/hooks/useShiftSelect";
import { format } from "date-fns";
import * as XLSX from 'xlsx';

// Add TabName type
type TabName = "dashboard" | "applications" | "scholarships" | "ranking" | "users";

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

  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userModal, setUserModal] = useState<null | { mode: 'add' | 'edit' | 'role' | 'reset' | 'deactivate', user?: User }>(null);

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

  // --- FIXED: Sort from lowest to highest GWA (GPA) ---
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
    const headers = ['ID', 'Name', 'Email', 'Scholarship', 'GPA', 'Status', 'Submitted Date', 'Score'];
    const csvData = applications.map(app => [
      app.id,
      app.name,
      app.email,
      app.scholarship,
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
      if (!res.ok) throw new Error('Failed to create scholarship');
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
  async function handleCreateApplication(data: Omit<Application, 'id' | 'avatar'>) {
    try {
      // Map scholarship name to scholarshipId
      const selectedScholarship = scholarships.find(s => s.name === data.scholarship);
      if (!selectedScholarship) {
        toast.error('Please select a valid scholarship.');
        return;
      }
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
        scholarship: selectedScholarship.name, // for frontend display
        gwa,
        submittedDate,
        avatar: "/placeholder.svg?height=32&width=32",
      };
      delete (payload as any).scholarship;
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create application');
      }
      let newApp = await res.json();
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
        (app.gwa !== null && app.gwa.toString().toLowerCase().includes(q)) ||
        app.status.toLowerCase().includes(q) ||
        app.submittedDate.toLowerCase().includes(q) ||
        app.region.toLowerCase().includes(q)
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
    if (!window.confirm(`Are you sure you want to delete ${selectedAppIds.length} selected applications?`)) return;
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
  function handleDeactivateUser(user: User) {
    // TODO: Implement deactivate logic
  }
  function handleReactivateUser(user: User) {
    // TODO: Implement reactivate logic
  }
  function handleDeleteUser(user: User) {
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

  // Add after the useState for users
  useEffect(() => {
    async function fetchUsers() {
      setLoadingUsers(true);
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    }
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // 1. Add state for delete user dialog
  const [deleteUserDialog, setDeleteUserDialog] = useState<{ open: boolean, user: User | null }>({ open: false, user: null });

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

  const [roleDialog, setRoleDialog] = useState<{ open: boolean, user: User | null }>({ open: false, user: null });
  const [resetDialog, setResetDialog] = useState<{ open: boolean, user: User | null }>({ open: false, user: null });
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
        if (prev < 90) return prev + Math.floor(10 + Math.random() * 10);
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
        const toastId = `undo-bulk-${Date.now()}`;
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
  const [deptDialog, setDeptDialog] = useState<{ open: boolean, user: User | null }>({ open: false, user: null });
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
        const el = document.getElementById(`ranking-row-${dashboardRankingHighlightId}`);
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

  // Add state for Excel import
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Add Excel import handler
  const handleExcelImport = async (file: File) => {
    setImportLoading(true);
    setImportError(null);
    
    try {
      // Read the Excel file
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Process the imported data
      const importedApplications = jsonData.map((row: any, index: number) => ({
        id: `imported-${Date.now()}-${index}`,
        name: row.Name || row.name || row['Full Name'] || 'Unknown',
        email: row.Email || row.email || row['Email Address'] || '',
        region: row.Region || row.region || row.Province || row.province || 'Unknown',
        scholarship: row.Scholarship || row.scholarship || row['Scholarship Name'] || 'Unknown',
        amount: row.Amount || row.amount || '0',
        gwa: parseFloat(row.GWA || row.gwa || row.GPA || row.gpa || '0') || 0,
        status: row.Status || row.status || 'pending',
        submittedDate: row['Submitted Date'] || row['Submission Date'] || row.submittedDate || new Date().toISOString(),
        avatar: "/placeholder.svg?height=32&width=32",
        review: row.Remarks || row.remarks || row.Comment || row.comment || '',
        requirements: {
          eligibility: { valid: true, falseDoc: false },
          documents: { valid: true, falseDoc: false },
          gpa: { valid: true, falseDoc: false }
        }
      }));
      
      // Sort by GWA (GPA) - lowest to highest (best GWA first)
      importedApplications.sort((a: any, b: any) => (a.gwa || 0) - (b.gwa || 0));
      
      // Add to existing applications
      setApplications(prev => [...prev, ...importedApplications]);
      
      toast.success(`Successfully imported ${importedApplications.length} applications!`);
      setImportModalOpen(false);
      setImportFile(null);
      
    } catch (error: any) {
      setImportError(error.message || 'Failed to import Excel file');
      toast.error('Failed to import Excel file');
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grid grid-cols-[16rem_1fr] grid-rows-[64px_1fr]" style={{ gridTemplateAreas: `'sidebar header' 'sidebar main'` }}>
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
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === 'users' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : ''}`}
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </Button>
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
                              <TableCell>{app.name}</TableCell>
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
              {/* Action buttons group */}
              <div className="flex items-center space-x-2">
                <Button 
                  variant="altAction" 
                  onClick={() => setImportModalOpen(true)} 
                  aria-label="Import Excel file"
                  className="hover:scale-110 hover:shadow-lg transition-shadow duration-200"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button 
                  variant="altAction" 
                  onClick={() => setTrashBinOpen(true)} 
                  aria-label="Open Trash Bin"
                  className="hover:scale-110 hover:shadow-lg transition-shadow duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                  {trashBin.length > 0 && <span className="ml-1">({trashBin.length})</span>}
                </Button>
                <Button 
                  variant="altAction" 
                  onClick={() => setSortModalOpen(true)} 
                  aria-label="Sort and filter applications" 
                  className="hover:scale-110 hover:shadow-lg transition-shadow duration-200"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
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
                        <span>GPA: Highest to Lowest</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="gpaAsc" id="sort-gpaAsc" />
                        <span>GPA: Lowest to Highest</span>
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
                    <div className="font-semibold mb-2">GPA Range</div>
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
                        aria-label="Minimum GPA"
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
                        aria-label="Maximum GPA"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Submitted Date Range</div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="date"
                        className="border rounded px-3 py-2"
                        value={dateRange.min}
                        onChange={e => setDateRange(r => ({ ...r, min: e.target.value }))}
                        aria-label="Submitted Date From"
                      />
                      <span>-</span>
                      <input
                        type="date"
                        className="border rounded px-3 py-2"
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
                      <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-center">GPA</TableHead>
                      <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-center">Status</TableHead>
                      <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-center">Remarks</TableHead>
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
                                <p className="font-medium">{app.name}</p>
                                <p className="text-sm text-muted-foreground">{app.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{app.region}</TableCell>
                        <TableCell>{typeof app.scholarship === 'object' && app.scholarship !== null ? (app.scholarship as any).name : app.scholarship}</TableCell>
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
                        <TableCell>{format(new Date(app.submittedDate), 'yyyy-MM-dd')}</TableCell>
                          <TableCell className="text-right">
                          {/* Modern action button with open/close state using controlled open state */}
                          <DropdownMenu open={actionMenuOpenId === app.id} onOpenChange={open => setActionMenuOpenId(open ? app.id : null)}>
                              <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className={cn(
                                  "h-8 w-8 p-0 flex items-center justify-center rounded-full border transition-colors hover:scale-110 hover:shadow-lg transition-shadow duration-200",
                                  actionMenuOpenId === app.id ? "bg-purple-100 text-purple-700 border-purple-300 shadow-md" : "hover:bg-gray-100 dark:hover:bg-zinc-800"
                                )}
                                aria-label="Application Actions"
                              >
                                <span className="sr-only">Open actions</span>
                                <span className={cn("transition-transform duration-200", actionMenuOpenId === app.id ? "rotate-90 text-purple-700" : "") }>
                                  <MoreHorizontal className="h-5 w-5" />
                                </span>
                                </Button>
                              </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              {/* Removed View Details option */}
                              <DropdownMenuItem className="hover:scale-105 hover:shadow-lg transition-shadow duration-200" onClick={() => { setSelectedApplication(app); setModalMode("reviewApplication"); }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Review & Score
                                </DropdownMenuItem>
                              <DropdownMenuItem className="hover:scale-105 hover:shadow-lg transition-shadow duration-200" onClick={() => { setSelectedApplication(app); setModalMode("sendMessage"); }}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                              <DropdownMenuItem className="hover:scale-105 hover:shadow-lg transition-shadow duration-200" onClick={() => handleDownloadDocuments(app)}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download Documents
                                </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 dark:text-red-500 focus:text-red-600 dark:focus:text-red-500 hover:scale-105 hover:shadow-lg transition-shadow duration-200" onClick={() => handleDeleteApplicant(app)}>
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
              </CardContent>
            </Card>
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
                <DialogTitle>Create {pendingScholarshipType} Scholarship</DialogTitle>
              </DialogHeader>
              {pendingScholarshipType && (
                <ScholarshipCreateForm
                  onSave={data => { handleCreateScholarship({ ...data, type: pendingScholarshipType }); setPendingScholarshipType(null); setScholarshipTypeDialog(false); }}
                  onCancel={() => { setPendingScholarshipType(null); setScholarshipTypeDialog(false); }}
                  type={pendingScholarshipType}
                />
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" onClick={() => { setPendingScholarshipType(null); setScholarshipTypeDialog(false); }}>Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        )}

        {activeTab === "ranking" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-300">Student Ranking</h2>
                <p className="text-muted-foreground">Rank students by their General Weighted Average (GWA)</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => setModalMode("createApplication")}
                  variant="purple"
                  className="hover:scale-110 hover:shadow-lg transition-shadow duration-200"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </div>
            
            <Card className="dark:bg-[#23232a] dark:text-gray-100">
              <CardContent className="pt-6">
                <div className="relative overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-center">Rank</TableHead>
                        <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-center">Name</TableHead>
                        <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-center">GWA</TableHead>
                        <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-center">Scholarship</TableHead>
                        <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-center">Status</TableHead>
                        <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-center">Requirements</TableHead>
                        <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ranking.map((app, idx) => (
                        <TableRow
                          key={app.id}
                          id={`ranking-row-${app.id}`}
                          className={cn(
                            "transition-all duration-200",
                            dashboardRankingHighlightId === app.id
                              ? "ring-2 ring-purple-400 bg-purple-100 dark:bg-purple-900/40 scale-[1.03] shadow-xl"
                              : "hover:scale-105 hover:shadow-lg hover:bg-purple-50 dark:hover:bg-purple-900/40"
                          )}
                        >
                          <TableCell className="text-center font-bold">{idx + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={app.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {app.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{app.name}</p>
                                <p className="text-sm text-muted-foreground">{app.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-bold">{app.gwa?.toFixed(2)}</TableCell>
                          <TableCell className="text-center">{app.scholarship}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center space-x-2">
                              {getStatusIcon(app.status)}
                              {getStatusBadge(app.status)}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {Object.values(app.requirements || {}).filter(req => req.valid).length}/{Object.keys(app.requirements || {}).length} Complete
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => { setSelectedApplication(app); setModalMode("reviewApplication"); }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Review & Score
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setSelectedApplication(app); setModalMode("sendMessage"); }}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteApplicant(app)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-300">Users</h2>
                <p className="text-muted-foreground">Manage system users and their permissions</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => setUserModal({ mode: 'add' })}
                  variant="purple"
                  className="hover:scale-110 hover:shadow-lg transition-shadow duration-200"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
            
            <Card className="dark:bg-[#23232a] dark:text-gray-100">
              <CardContent className="pt-6">
                {loadingUsers ? (
                  <div className="text-center text-muted-foreground py-8">Loading users...</div>
                ) : (
                  <div className="relative overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-bold text-gray-600 dark:text-gray-300">Name</TableHead>
                          <TableHead className="font-bold text-gray-600 dark:text-gray-300">Email</TableHead>
                          <TableHead className="font-bold text-gray-600 dark:text-gray-300">Role</TableHead>
                          <TableHead className="font-bold text-gray-600 dark:text-gray-300">Department</TableHead>
                          <TableHead className="font-bold text-gray-600 dark:text-gray-300">Status</TableHead>
                          <TableHead className="font-bold text-gray-600 dark:text-gray-300">Last Active</TableHead>
                          <TableHead className="font-bold text-gray-600 dark:text-gray-300 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    {getUserInitials(user)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{getUserFullName(user)}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.role}</Badge>
                            </TableCell>
                            <TableCell>{user.department}</TableCell>
                            <TableCell>
                              <Badge 
                                className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                              >
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{format(new Date(user.lastActive), 'MMM dd, yyyy')}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => setUserModal({ mode: 'edit', user })}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setUserModal({ mode: 'role', user })}>
                                    <Key className="h-4 w-4 mr-2" />
                                    Change Role
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setUserModal({ mode: 'reset', user })}>
                                    <Key className="h-4 w-4 mr-2" />
                                    Reset Password
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600" 
                                    onClick={() => handleDeleteUser(user)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
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
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Modals */}
      {modalMode === "createApplication" && (
        <Dialog open={modalMode === "createApplication"} onOpenChange={() => setModalMode(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Application</DialogTitle>
            </DialogHeader>
            <ApplicationCreateForm
              onSave={handleCreateApplication}
              onCancel={() => setModalMode(null)}
              scholarships={scholarships}
            />
          </DialogContent>
        </Dialog>
      )}

      {modalMode === "reviewApplication" && selectedApplication && (
        <Dialog open={modalMode === "reviewApplication"} onOpenChange={() => setModalMode(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Application</DialogTitle>
            </DialogHeader>
            <ApplicationReviewForm
              application={selectedApplication}
              onSave={handleSaveApplicationReview}
              onCancel={() => setModalMode(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {modalMode === "sendMessage" && selectedApplication && (
        <Dialog open={modalMode === "sendMessage"} onOpenChange={() => setModalMode(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Send Message</DialogTitle>
            </DialogHeader>
            <SendMessageForm
              application={selectedApplication}
              onSend={handleSendMessage}
              onCancel={() => setModalMode(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {modalMode === "view" && selectedScholarship && (
        <Dialog open={modalMode === "view"} onOpenChange={() => setModalMode(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedScholarship.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <p className="text-lg font-semibold">{formatPeso(selectedScholarship.amount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Deadline</label>
                  <p className="text-lg font-semibold">{format(new Date(selectedScholarship.deadline), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(displayStatus(selectedScholarship))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Applicants</label>
                  <p className="text-lg font-semibold">
                    {applications.filter(app => app.scholarship === selectedScholarship.name).length}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalMode(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {modalMode === "edit" && selectedScholarship && (
        <Dialog open={modalMode === "edit"} onOpenChange={() => setModalMode(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Scholarship</DialogTitle>
            </DialogHeader>
            <ScholarshipEditForm
              scholarship={selectedScholarship}
              onSave={handleSaveScholarship}
              onCancel={() => setModalMode(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* User Modal */}
      {userModal && (
        <Dialog open={!!userModal} onOpenChange={() => setUserModal(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {userModal.mode === 'add' ? 'Add User' : 
                 userModal.mode === 'edit' ? 'Edit User' :
                 userModal.mode === 'role' ? 'Change Role' :
                 userModal.mode === 'reset' ? 'Reset Password' : 'Deactivate User'}
              </DialogTitle>
            </DialogHeader>
            <UserForm
              user={userModal.user}
              onSave={(data) => {
                // Handle user save logic here
                console.log('User data:', data);
                setUserModal(null);
              }}
              onCancel={() => setUserModal(null)}
              currentUserRole={user?.role}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Application Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Application</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this application? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDeleteApplicant}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteUserDialog.open} onOpenChange={(open) => setDeleteUserDialog({ open, user: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this user? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUserDialog({ open: false, user: null })}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Scholarship Dialog */}
      <Dialog open={deleteScholarshipDialog.open} onOpenChange={(open) => setDeleteScholarshipDialog({ open, scholarship: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Scholarship</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this scholarship? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteScholarshipDialog({ open: false, scholarship: null })}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              if (deleteScholarshipDialog.scholarship) {
                handleRemoveScholarship(deleteScholarshipDialog.scholarship);
                setDeleteScholarshipDialog({ open: false, scholarship: null });
              }
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Download Documents Dialog */}
      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Documents</DialogTitle>
          </DialogHeader>
          <p>Choose the format for downloading {downloadApplication?.name}'s documents:</p>
          <div className="flex space-x-4">
            <Button onClick={handleConfirmDownloadPDF} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button onClick={handleConfirmDownloadDOCX} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              DOCX
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDownloadDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Excel Import Modal */}
      <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Applications from Excel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Excel File</label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImportFile(file);
                    handleExcelImport(file);
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>
            {importError && (
              <div className="text-red-500 text-sm">{importError}</div>
            )}
            {importLoading && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span>Importing...</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
