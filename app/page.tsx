"use client"

import { useState, useEffect, useMemo } from "react"
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
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
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

// Add TabName type
type TabName = "dashboard" | "applications" | "scholarships" | "ranking" | "users";

export default function Component() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabName>("dashboard")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit" | "createApplication" | "reviewApplication" | "sendMessage" | null>(null)
  const [avatarUrl, setAvatarUrl] = useState("/placeholder-user.jpg");
  const [userName, setUserName] = useState("Admin User");
  const [userEmail, setUserEmail] = useState("admin@example.com");
  const [scholarships, setScholarships] = useState<Scholarship[]>([
    {
      id: "SCH001",
      name: "Merit Excellence Scholarship",
      amount: "$5,000",
      deadline: "2024-03-15",
      applicants: 234,
      status: "active",
    },
    {
      id: "SCH002",
      name: "STEM Innovation Grant",
      amount: "$7,500",
      deadline: "2024-04-01",
      applicants: 189,
      status: "active",
    },
    {
      id: "SCH003",
      name: "Community Leadership Award",
      amount: "$3,000",
      deadline: "2024-02-28",
      applicants: 156,
      status: "closed",
    },
  ])

  // Mock data
  const stats = {
    totalApplications: 1247,
    pendingReview: 89,
    approved: 156,
    totalScholarships: 24,
    rejected: 24, // Use this for the new Rejected slice (same value as previous Active Scholarships)
  }

  const [applications, setApplications] = useState<Application[]>([
    {
      id: "APP001",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      scholarship: "Merit Excellence Scholarship",
      amount: "$5,000",
      gpa: 3.9,
      status: "pending",
      submittedDate: "2024-01-15",
      score: null,
      avatar: "/placeholder.svg?height=32&width=32",
      region: "Palawan",
      requirements: {},
    },
    {
      id: "APP002",
      name: "Michael Chen",
      email: "michael.chen@email.com",
      scholarship: "STEM Innovation Grant",
      amount: "$7,500",
      gpa: 3.8,
      status: "under_review",
      submittedDate: "2024-01-14",
      score: 85,
      avatar: "/placeholder.svg?height=32&width=32",
      region: "Mindoro Occidental",
      requirements: {},
    },
    {
      id: "APP003",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      scholarship: "Community Leadership Award",
      amount: "$3,000",
      gpa: 3.7,
      status: "approved",
      submittedDate: "2024-01-12",
      score: 92,
      avatar: "/placeholder.svg?height=32&width=32",
      region: "Marinduque",
      requirements: {},
    },
    {
      id: "APP004",
      name: "David Kim",
      email: "david.kim@email.com",
      scholarship: "Athletic Excellence Scholarship",
      amount: "$4,000",
      gpa: 3.6,
      status: "rejected",
      submittedDate: "2024-01-10",
      score: 68,
      avatar: "/placeholder.svg?height=32&width=32",
      region: "Romblon",
      requirements: {},
    },
    {
      id: "APP005",
      name: "Anna Santos",
      email: "anna.santos@email.com",
      scholarship: "Merit Excellence Scholarship",
      amount: "$4,500",
      gpa: 3.85,
      status: "pending",
      submittedDate: "2024-01-16",
      score: null,
      avatar: "/placeholder.svg?height=32&width=32",
      region: "Mindoro Oriental",
      requirements: {},
    },
  ]);

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
    const savedName = localStorage.getItem('user-name');
    const savedEmail = localStorage.getItem('user-email');
    if (savedAvatar) setAvatarUrl(savedAvatar);
    if (savedName) setUserName(savedName);
    if (savedEmail) setUserEmail(savedEmail);
  }, []);

  // Update getStatusBadge to handle new workflow
  const getStatusBadge = (status: string, onClick?: () => void) => {
    const statusConfig = {
      pending: { label: "Pending", className: "bg-orange-100 text-orange-800 hover:bg-orange-200", clickable: true },
      under_review: { label: "Under Review", className: "bg-blue-500 text-white hover:bg-blue-600", clickable: true },
      approved: { label: "Approved", className: "bg-green-500 text-white", clickable: false },
      rejected: { label: "Rejected", className: "bg-red-500 text-white", clickable: false },
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

  // Pie chart data and colors
  const pieData = [
    { name: 'Total Applications', value: stats.totalApplications },
    { name: 'Approved', value: stats.approved },
    { name: 'Under Review', value: stats.pendingReview },
    { name: 'Rejected', value: stats.rejected },
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

  const ranking = applications
    .filter(app => app.gpa)
    .sort((a, b) => (b.gpa || 0) - (a.gpa || 0));

  const approved = applications.filter(app => app.status === 'approved' || app.status === 'accepted');
  const pending = applications.filter(app => app.status === 'pending' || app.status === 'under_review');
  const rejected = applications.filter(app => app.status === 'rejected');
  const reserve: Application[] = []; // No 'reserve' status for now

  // Handler for saving scholarship edits
  function handleSaveScholarship(data: Scholarship) {
    if (!selectedScholarship) return;
    setScholarships((prev) =>
      prev.map((sch) =>
        sch.id === selectedScholarship.id ? { ...sch, ...data } : sch
      )
    )
    setModalMode(null)
    setSelectedScholarship(null)
    router.push("/");
  }

  const handleLogout = () => {
    router.push('/login');
  };

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Email', 'Scholarship', 'Amount', 'GPA', 'Status', 'Submitted Date', 'Score'];
    const csvData = applications.map(app => [
      app.id,
      app.name,
      app.email,
      app.scholarship,
      app.amount,
      app.gpa,
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
  // Handler for creating new scholarship
  function handleCreateScholarship(data: Omit<Scholarship, 'id'>) {
    const newId = `SCH00${scholarships.length + 1}`; // Simple ID generation
    setScholarships((prev) => [
      ...prev,
      { id: newId, ...data, applicants: parseInt(data.applicants.toString()), amount: `$${data.amount}` },
    ]);
    setModalMode(null);
    setPendingScholarshipType(null);
  }

  // Handler for creating new application
  function handleCreateApplication(data: Omit<Application, 'id' | 'avatar'>) {
    const newId = `APP00${applications.length + 1}`; // Simple ID generation
    setApplications((prev) => [
      ...prev,
      { 
        id: newId, 
        name: data.name,
        email: data.email,
        scholarship: data.scholarship,
        amount: data.amount,
        gpa: parseFloat(data.gpa?.toString() || '0'), 
        status: data.status,
        submittedDate: data.submittedDate,
        avatar: "/placeholder.svg?height=32&width=32",
        region: data.region || "",
        requirements: data.requirements || {},
        score: data.score || null,
        review: data.review || '',
      } as Application,
    ]);
    setModalMode(null);
  }

  // Handler for saving application review
  function handleSaveApplicationReview(data: { score: number | null, status: string, review: string }) {
    if (!selectedApplication) return;
    const updatedApplication = { ...selectedApplication, score: data.score, status: data.status, review: data.review };
    setApplications((prev) =>
      prev.map((app) =>
        app.id === selectedApplication.id ? updatedApplication : app
      )
    );
    setModalMode(null);
    setSelectedApplication(null);
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

  function handleConfirmDeleteApplicant() {
    if (deleteApplication) {
      setApplications(prev => prev.filter(a => a.id !== deleteApplication.id));
      setTrashBin(prev => [...prev, deleteApplication]);
      setDeleteDialogOpen(false);
      setDeleteApplication(null);
    }
  }

  function handleRestoreApplicant(app: Application) {
    setApplications(prev => [...prev, app]);
    setTrashBin(prev => prev.filter(a => a.id !== app.id));
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

  const handleRemoveScholarship = (scholarship: Scholarship) => {
    setScholarships(prev => prev.filter(s => s.id !== scholarship.id));
    setScholarshipTrash(prev => [...prev, scholarship]);
  };

  const handleRestoreScholarship = (scholarship: Scholarship) => {
    setScholarships(prev => [...prev, scholarship]);
    setScholarshipTrash(prev => prev.filter(s => s.id !== scholarship.id));
  };

  const handlePermanentDeleteScholarship = (scholarship: Scholarship) => {
    setScholarshipTrash(prev => prev.filter(s => s.id !== scholarship.id));
  };

  const handlePermanentDeleteAllScholarships = () => {
    setScholarshipTrash([]);
  };

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
  // Range filtering for GPA
  if (gpaRange.min || gpaRange.max) {
    processedApplications = processedApplications.filter(app => {
      const gpa = parseFloat(app.gpa !== null && app.gpa !== undefined ? app.gpa.toString() : '');
      if (gpaRange.min && gpa < parseFloat(gpaRange.min)) return false;
      if (gpaRange.max && gpa > parseFloat(gpaRange.max)) return false;
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
  if (sortOption === 'gpaDesc') processedApplications.sort((a, b) => (b.gpa || 0) - (a.gpa || 0));
  else if (sortOption === 'gpaAsc') processedApplications.sort((a, b) => (a.gpa || 0) - (b.gpa || 0));
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
        (app.gpa !== null && app.gpa.toString().toLowerCase().includes(q)) ||
        app.status.toLowerCase().includes(q) ||
        app.submittedDate.toLowerCase().includes(q) ||
        app.region.toLowerCase().includes(q)
      );
    });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAppIds(filteredApplications.map(app => app.id));
    } else {
      setSelectedAppIds([]);
    }
  };
  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedAppIds(prev => checked ? [...prev, id] : prev.filter(appId => appId !== id));
  };

  const handleBulkDelete = () => {
    if (selectedAppIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedAppIds.length} selected applications?`)) return;
    const toTrash = applications.filter(app => selectedAppIds.includes(app.id));
    setApplications(prev => prev.filter(app => !selectedAppIds.includes(app.id)));
    setTrashBin(prev => [...prev, ...toTrash]);
    setSelectedAppIds([]);
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
      await fetch(`/api/users/${deleteUserDialog.user.id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(u => u.id !== deleteUserDialog.user!.id));
    } catch (err) {
      // Optionally show error toast
    } finally {
      setDeleteUserDialog({ open: false, user: null });
    }
  }

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
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <ThemeSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={avatarUrl} />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
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
                  className="bg-purple-50 border-0 dark:bg-[#23232a] dark:text-gray-100 cursor-pointer transition-colors hover:bg-purple-200 dark:hover:bg-purple-800"
                  onClick={() => {
                    setActiveTab('applications');
                    setFilterStatus({ pending: false, under_review: false, approved: false, rejected: false });
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Go to Applications"
                >
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
                    <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.totalApplications}</div>
                  </CardContent>
                </Card>
                {/* Under Review (was Pending Review) */}
                <Card
                  className="bg-blue-50 border-0 dark:bg-[#23232a] dark:text-gray-100 cursor-pointer transition-colors hover:bg-blue-200 dark:hover:bg-blue-800"
                  onClick={() => {
                    setActiveTab('applications');
                    setFilterStatus({ pending: false, under_review: true, approved: false, rejected: false });
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Go to Under Review Applications"
                >
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Under Review</CardTitle>
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.pendingReview}</div>
                  </CardContent>
                </Card>
                {/* Approved */}
                <Card
                  className="bg-green-50 border-0 dark:bg-[#23232a] dark:text-gray-100 cursor-pointer transition-colors hover:bg-green-200 dark:hover:bg-green-800"
                  onClick={() => {
                    setActiveTab('applications');
                    setFilterStatus({ pending: false, under_review: false, approved: true, rejected: false });
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Go to Approved Applications"
                >
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.approved}</div>
                  </CardContent>
                </Card>
                {/* Rejected (replaces Active Scholarships) */}
                <Card
                  className="bg-red-50 border-0 dark:bg-[#23232a] dark:text-gray-100 cursor-pointer transition-colors hover:bg-red-200 dark:hover:bg-red-800"
                  onClick={() => {
                    setActiveTab('applications');
                    setFilterStatus({ pending: false, under_review: false, approved: false, rejected: true });
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Go to Rejected Applications"
                >
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.rejected}</div>
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
                            "cursor-pointer"
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
                  <div className={`overflow-y-auto ${ranking.length > 8 ? 'max-h-[340px]' : ''}`}>
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
                            <TableRow key={app.id}>
                            <TableCell>{idx + 1}</TableCell>
                              <TableCell>{app.name}</TableCell>
                            <TableCell>{app.gpa?.toFixed(2)}</TableCell>
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
                  <h2 className="text-3xl font-bold text-foreground">Applications</h2>
                  <p className="text-muted-foreground">Manage and review scholarship applications</p>
                </div>
                <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => setTrashBinOpen(true)} aria-label="Open Trash Bin">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Trash Bin {trashBin.length > 0 && <span className="ml-1">({trashBin.length})</span>}
                  </Button>
                <Button variant={selectionMode ? "default" : "outline"} onClick={() => setSelectionMode(m => !m)} aria-label={selectionMode ? "Cancel Selection" : "Select Applications"}>
                    {selectionMode ? "Cancel" : "Select"}
                  </Button>
                <Button onClick={() => setModalMode("createApplication")}
                  className="bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors"
                  aria-label="New Application">
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
                variant="default" 
                onClick={() => setSortModalOpen(true)} 
                aria-label="Sort and filter applications" 
                className="w-48 bg-purple-700 hover:bg-purple-800 text-white border-2 border-purple-700 hover:text-white transition-colors"
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
                        <span>GPA: Highest to Lowest</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="gpaAsc" id="sort-gpaAsc" />
                        <span>GPA: Lowest to Highest</span>
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
                <CardContent className="pt-6 overflow-x-auto" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                  {selectionMode && selectedAppIds.length > 0 && (
                    <div className="mb-2 flex items-center gap-4">
                      <span className="text-sm font-medium">{selectedAppIds.length} selected</span>
                      <Button variant="destructive" size="sm" onClick={handleBulkDelete}>Move to Trash Bin</Button>
                      <Button variant="outline" size="sm" onClick={() => setSelectionMode(false)}>Cancel Selection</Button>
                    </div>
                  )}
                  <Table>
                    <TableHeader>
                      {selectionMode && (
                        <TableHead>
                          <input
                            type="checkbox"
                            ref={el => {
                              if (el) el.indeterminate = selectedAppIds.length > 0 && selectedAppIds.length < filteredApplications.length;
                            }}
                            checked={filteredApplications.length > 0 && selectedAppIds.length === filteredApplications.length}
                            onChange={e => handleSelectAll(e.target.checked)}
                            aria-label="Select all applications"
                          />
                        </TableHead>
                      )}
                        <TableHead>Applicant</TableHead>
                    <TableHead>Region</TableHead>
                        <TableHead>Scholarship</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>GPA</TableHead>
                        <TableHead>Status</TableHead>
                    <TableHead>Comment</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications
                        .map((app) => (
                        <TableRow key={app.id} className="transition-colors duration-300"
                            ref={el => {
                              if (highlightedApplicantId === app.id && el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }}
                          >
                            {selectionMode && (
                              <TableCell>
                                <input
                                  type="checkbox"
                                  checked={selectedAppIds.includes(app.id)}
                                  onChange={e => handleSelectOne(app.id, e.target.checked)}
                                  aria-label={`Select application for ${app.name}`}
                                />
                              </TableCell>
                            )}
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={app.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    {app.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{app.name}</p>
                                  <p className="text-sm text-muted-foreground">{app.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{app.region}</TableCell>
                            <TableCell>{app.scholarship}</TableCell>
                            <TableCell>{app.amount.replace("$", "₱")}</TableCell>
                            <TableCell>{app.gpa}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(app.status)}
                                {app.status === 'pending' ? getStatusBadge(app.status, () => setStatusWorkflowDialog({ open: true, app, step: 'pending' }))
                                  : app.status === 'under_review' ? getStatusBadge(app.status, () => setStatusWorkflowDialog({ open: true, app, step: 'under_review' }))
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
                            <TableCell>{app.submittedDate}</TableCell>
                            <TableCell className="text-right">
                            {/* Modern action button with open/close state using controlled open state */}
                            <DropdownMenu open={actionMenuOpenId === app.id} onOpenChange={open => setActionMenuOpenId(open ? app.id : null)}>
                                <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className={cn(
                                    "h-8 w-8 p-0 flex items-center justify-center rounded-full border transition-colors",
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
                                  <DropdownMenuItem onClick={() => setSelectedApplication(app)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => { setSelectedApplication(app); setModalMode("reviewApplication"); }}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Review & Score
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => { setSelectedApplication(app); setModalMode("sendMessage"); }}>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Message
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDownloadDocuments(app)}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Documents
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600 dark:text-red-500 focus:text-red-600 dark:focus:text-red-500" onClick={() => handleDeleteApplicant(app)}>
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
                </CardContent>
              </Card>
              {/* Application Create Modal */}
              <Dialog open={modalMode === "createApplication"} onOpenChange={() => setModalMode(null)}>
                <DialogContent className="max-w-md w-full p-6 max-h-[80vh] overflow-y-auto rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Create New Application</DialogTitle>
                  </DialogHeader>
                  <ApplicationCreateForm onSave={handleCreateApplication} onCancel={() => setModalMode(null)} scholarships={scholarships} />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Application Details Modal */}
              <Dialog open={!!selectedApplication && modalMode !== "reviewApplication"} onOpenChange={() => setSelectedApplication(null)}>
                <DialogContent className="max-w-md w-full p-6 max-h-[80vh] overflow-y-auto rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Application Details</DialogTitle>
                  </DialogHeader>
                  {selectedApplication && (
                    <div className="space-y-2 text-sm">
                      <p><strong>Applicant Name:</strong> {selectedApplication.name}</p>
                      <p><strong>Email:</strong> {selectedApplication.email}</p>
                      <p><strong>Scholarship:</strong> {selectedApplication.scholarship}</p>
                      <p><strong>Amount:</strong> {selectedApplication.amount}</p>
                      <p><strong>GPA:</strong> {selectedApplication.gpa}</p>
                      <p><strong>Status:</strong> {selectedApplication.status}</p>
                      <p><strong>Submitted Date:</strong> {selectedApplication.submittedDate}</p>
                    </div>
                  )}
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Application Review Modal */}
              <Dialog open={modalMode === "reviewApplication"} onOpenChange={() => { setModalMode(null); setSelectedApplication(null); }}>
                <DialogContent className="max-w-md w-full p-6 max-h-[80vh] overflow-y-auto rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Review Application</DialogTitle>
                  </DialogHeader>
                  {selectedApplication && (
                    <ApplicationReviewForm
                      application={selectedApplication}
                      onSave={handleSaveApplicationReview}
                      onCancel={() => { setModalMode(null); setSelectedApplication(null); }}
                    />
                  )}
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
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
                    <SendMessageForm
                      application={selectedApplication}
                      onSend={handleSendMessage}
                      onCancel={() => { setModalMode(null); setSelectedApplication(null); }}
                    />
                  )}
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
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
                      <p>Are you sure you want to download the details of <span className="font-semibold">{downloadApplication.name}</span>?</p>
                      <p className="text-xs text-muted-foreground">Choose your preferred file format:</p>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDownloadDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDownloadPDF}>Download PDF</Button>
                    <Button onClick={handleConfirmDownloadDOCX} variant="secondary">Download DOCX</Button>
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
                      <p>Are you sure you want to delete the application of <span className="font-semibold">{deleteApplication.name}</span>?</p>
                      <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleConfirmDeleteApplicant}>Delete</Button>
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
                      className="space-y-4"
                      style={trashBin.length >= 5 ? { maxHeight: '320px', overflowY: 'auto' } : {}}
                    >
                      {trashBin.map(app => (
                        <div key={app.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <div className="font-medium">{app.name}</div>
                            <div className="text-xs text-muted-foreground">{app.email} | {app.scholarship} | {app.region}</div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleRestoreApplicant(app)}>Restore</Button>
                            <Button size="sm" variant="destructive" onClick={() => handlePermanentDeleteApplicant(app)}>Delete Permanently</Button>
                          </div>
                        </div>
                      ))}
                      {trashBin.length > 1 && (
                        <div className="flex justify-end mt-4">
                          <Button
                            size="lg"
                            variant="destructive"
                            onClick={handleDeleteAllPermanently}
                          >
                            Delete All Permanently
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setTrashBinOpen(false)}>Close</Button>
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
                      <p>Do you want to change the status for <span className="font-semibold">{statusWorkflowDialog.app.name}</span> to 'Under Review'?</p>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusWorkflowDialog({ open: false, app: null, step: null })}>Cancel</Button>
                        <Button onClick={() => handleStatusUpdate(statusWorkflowDialog.app!.id, 'under_review')}>Confirm</Button>
                      </DialogFooter>
                    </>
                  )}
                  {statusWorkflowDialog.step === 'under_review' && statusWorkflowDialog.app && (
                    <>
                      <DialogHeader>
                        <DialogTitle>Update Application Status</DialogTitle>
                      </DialogHeader>
                      <p>Accept or reject the application for <span className="font-semibold">{statusWorkflowDialog.app.name}</span>?</p>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusWorkflowDialog({ open: false, app: null, step: null })}>Cancel</Button>
                        <Button variant="destructive" onClick={() => handleStatusUpdate(statusWorkflowDialog.app!.id, 'rejected')}>Reject</Button>
                        <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleStatusUpdate(statusWorkflowDialog.app!.id, 'approved')}>Accept</Button>
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
                      <p>Are you sure you want to permanently delete <span className="font-semibold">{permanentDeleteDialog.app.name}</span>?</p>
                      <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPermanentDeleteDialog({ open: false, app: null })}>Cancel</Button>
                    <Button variant="destructive" onClick={confirmPermanentDeleteApplicant}>Delete Permanently</Button>
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
                    <Button variant="outline" onClick={() => setPermanentDeleteAllDialog(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={confirmDeleteAllPermanently}>Delete All Permanently</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === "ranking" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Application Ranking</h2>
                <p className="text-muted-foreground">Review and rank scholarship applications by GWA (GPA)</p>
              </div>
              {/* Status Cards */}
              <div className="flex gap-4 mb-4">
                {/* Approved */}
                <div className="flex-1 text-center cursor-pointer rounded-lg border transition-colors duration-200 shadow-sm hover:bg-green-100 dark:hover:bg-green-900/50 focus:bg-green-200"
                  onClick={() => setRankingStatusModal({ open: true, status: 'approved' })}
                  tabIndex={0}
                  style={{ outline: 'none' }}>
                  <CardContent className="py-2">
                    <div className="font-bold text-lg">{applications.filter(app => app.status === 'approved').length}</div>
                    <div className="text-green-700 dark:text-green-400">Approved</div>
                  </CardContent>
                </div>
                {/* Under Review (replaces Reserve) */}
                <div className="flex-1 text-center cursor-pointer rounded-lg border transition-colors duration-200 shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 focus:bg-blue-200"
                  onClick={() => setRankingStatusModal({ open: true, status: 'under_review' })}
                  tabIndex={0}
                  style={{ outline: 'none' }}>
                  <CardContent className="py-2">
                    <div className="font-bold text-lg">{applications.filter(app => app.status === 'under_review').length}</div>
                    <div className="text-blue-700 dark:text-blue-400">Under Review</div>
                  </CardContent>
                </div>
                {/* Pending */}
                <div className="flex-1 text-center cursor-pointer rounded-lg border transition-colors duration-200 shadow-sm hover:bg-orange-100 dark:hover:bg-orange-900/50 focus:bg-orange-200"
                  onClick={() => setRankingStatusModal({ open: true, status: 'pending' })}
                  tabIndex={0}
                  style={{ outline: 'none' }}>
                  <CardContent className="py-2">
                    <div className="font-bold text-lg">{applications.filter(app => app.status === 'pending').length}</div>
                    <div className="text-orange-700 dark:text-orange-400">Pending</div>
                  </CardContent>
                </div>
                {/* Rejected */}
                <div className="flex-1 text-center cursor-pointer rounded-lg border transition-colors duration-200 shadow-sm hover:bg-red-100 dark:hover:bg-red-900/50 focus:bg-red-200"
                  onClick={() => setRankingStatusModal({ open: true, status: 'rejected' })}
                  tabIndex={0}
                  style={{ outline: 'none' }}>
                  <CardContent className="py-2">
                    <div className="font-bold text-lg">{applications.filter(app => app.status === 'rejected').length}</div>
                    <div className="text-red-700 dark:text-red-400">Rejected</div>
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
                        className={`space-y-2 ${filteredApps.length >= 4 ? 'max-h-[300px] overflow-y-auto' : ''}`}
                        style={{}}
                      >
                        {filteredApps.length === 0 ? (
                          <div className="text-center text-muted-foreground py-4">No applicants with this status.</div>
                        ) : (
                          filteredApps.map(app => (
                            <div
                              key={app.id}
                              className="flex items-center justify-between border-b pb-2 cursor-pointer hover:bg-accent/40 rounded transition"
                              onClick={() => {
                                  setActiveTab('applications');
                                setStatusFilter(app.status);
                                  setHighlightedApplicantId(app.id);
                                setRankingStatusModal({ open: false, status: null });
                              }}
                                      tabIndex={0}
                                      role="button"
                              aria-label={`Go to applicant ${app.name} in Applications`}
                            >
                              <div>
                                <div className="font-medium">{app.name}</div>
                                <div className="text-xs text-muted-foreground">GPA: {app.gpa} | {app.scholarship}</div>
                              </div>
                                </div>
                          ))
                        )}
                                </div>
                    );
                  })()}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setRankingStatusModal({ open: false, status: null })}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Scholarship Ranking Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {scholarships.map((scholarship) => {
                  const rankedApps = applications
                    .filter(app => app.scholarship === scholarship.name)
                    .sort((a, b) => (b.gpa || 0) - (a.gpa || 0));
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
                          <div className={`divide-y ${rankedApps.length >= 4 ? 'max-h-[220px] overflow-y-auto' : ''}`}> {/* Scrollable if 4+ */}
                            {rankedApps.map((app, idx) => (
                              <div key={app.id} className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 flex items-center justify-center rounded-full font-bold bg-gray-200 text-gray-700">{idx + 1}</div>
                      <div>
                                    <div className="font-medium">{app.name}</div>
                                    <div className="text-xs text-muted-foreground">{app.region}</div>
                        </div>
                      </div>
                                <div className="flex items-center gap-4">
                                  <span className="font-semibold">{app.gpa?.toFixed(2)}</span>
                                  {/* Status badge clickable: go to Applications table and highlight applicant */}
                                  <span
                                    className="cursor-pointer"
                                    onClick={() => {
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
                  <h2 className="text-3xl font-bold text-foreground">Scholarships</h2>
                  <p className="text-muted-foreground">Manage scholarship programs and deadlines</p>
                </div>
                <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setScholarshipTrashOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Trash Bin {scholarshipTrash.length > 0 && <span className="ml-1">({scholarshipTrash.length})</span>}
              </Button>
                  <Select value={scholarshipSort} onValueChange={setScholarshipSort}>
                    <SelectTrigger className="w-48">
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
                  <Button onClick={() => setScholarshipTypeDialog(true)}>
                    <Award className="h-4 w-4 mr-2" />
                    Create Scholarship
                  </Button>
                </div>
              </div>
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
                      return a.applicants - b.applicants;
                    } else if (scholarshipSort === "applicants_desc") {
                      return b.applicants - a.applicants;
                    }
                    return 0;
                  })
                  .map((scholarship) => (
                    <Card key={scholarship.id} className="dark:bg-[#23232a] dark:text-gray-100">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{scholarship.name}</CardTitle>
                          <Badge className={cn(
                            scholarship.status === "active"
                              ? "bg-green-500 text-white"
                              : scholarship.status === "closed"
                              ? "bg-red-500 text-white"
                              : "bg-gray-300 text-gray-700"
                          )}>
                            {scholarship.status}
                          </Badge>
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
                            <span className="font-medium">{scholarship.deadline}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Applicants:</span>
                            <span className="font-medium">{scholarship.applicants}</span>
                          </div>
                        <div className="pt-3 border-t flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-1" onClick={() => { setSelectedScholarship(scholarship); setModalMode("view"); }}>
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                              </Button>
                          <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-1" onClick={() => { setSelectedScholarship(scholarship); setModalMode("edit"); }}>
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </Button>
                          <Button variant="destructive" size="sm" className="flex-1 flex items-center justify-center gap-1" onClick={() => setDeleteScholarshipDialog({ open: true, scholarship })}>
                            <Trash2 className="h-4 w-4" />
                            <span>Remove</span>
                              </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              {/* Scholarship Type Prompt Modal */}
              <Dialog open={scholarshipTypeDialog && !pendingScholarshipType} onOpenChange={open => { if (!open) setScholarshipTypeDialog(false); }}>
                <DialogContent className="max-w-xs w-full p-6 rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Choose Scholarship Type</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 mt-4">
                    <Button onClick={() => { setPendingScholarshipType('Full'); }}>Full Scholarship</Button>
                    <Button onClick={() => { setPendingScholarshipType('Half'); }}>Half Scholarship</Button>
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
                    <Button variant="outline" onClick={() => setDeleteScholarshipDialog({ open: false, scholarship: null })}>Cancel</Button>
                    <Button variant="destructive" onClick={() => {
                      if (deleteScholarshipDialog.scholarship) {
                    handleRemoveScholarship(deleteScholarshipDialog.scholarship);
                        setDeleteScholarshipDialog({ open: false, scholarship: null });
                      }
                    }}>Remove</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Scholarship View/Edit Modal */}
              <Dialog open={!!modalMode && (modalMode === 'view' || modalMode === 'edit')} onOpenChange={() => { setModalMode(null); setSelectedScholarship(null); }}>
                <DialogContent className="max-w-md w-full p-6">
                  <DialogHeader>
                    <DialogTitle>{modalMode === "view" ? "View Scholarship" : "Edit Scholarship"}</DialogTitle>
                  </DialogHeader>
                  {selectedScholarship && (
                    <div>
                      {modalMode === "view" ? (
                        <div className="space-y-2">
                          <p><strong>Name:</strong> {selectedScholarship.name}</p>
                          <p><strong>Amount:</strong> ₱ {selectedScholarship.amount.replace(/[$₱]/g, "")}</p>
                          <p><strong>Deadline:</strong> {selectedScholarship.deadline}</p>
                          <p><strong>Status:</strong> {selectedScholarship.status}</p>
                          <p><strong>Applicants:</strong> {selectedScholarship.applicants}</p>
                        </div>
                      ) : (
                        <ScholarshipEditForm scholarship={selectedScholarship} onSave={handleSaveScholarship} onCancel={() => { setModalMode(null); setSelectedScholarship(null); }} />
                      )}
                    </div>
                  )}
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
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
                <div className="space-y-4" style={scholarshipTrash.length >= 5 ? { maxHeight: '320px', overflowY: 'auto' } : {}}>
                  {scholarshipTrash.map(sch => (
                    <div key={sch.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <div className="font-medium">{sch.name}</div>
                        <div className="text-xs text-muted-foreground">Amount: {sch.amount} | Deadline: {sch.deadline}</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleRestoreScholarship(sch)}>Restore</Button>
                        <Button size="sm" variant="destructive" onClick={() => setPermanentDeleteScholarshipDialog({ open: true, scholarship: sch })}>Delete Permanently</Button>
                      </div>
                    </div>
                  ))}
                  {scholarshipTrash.length > 1 && (
                    <div className="flex justify-end mt-4">
                      <Button size="lg" variant="destructive" onClick={() => setPermanentDeleteAllScholarshipsDialog(true)}>
                        Delete All Permanently
                      </Button>
                    </div>
                  )}
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setScholarshipTrashOpen(false)}>Close</Button>
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
                <Button variant="outline" onClick={() => setPermanentDeleteScholarshipDialog({ open: false, scholarship: null })}>Cancel</Button>
                <Button variant="destructive" onClick={() => { if (permanentDeleteScholarshipDialog.scholarship) { handlePermanentDeleteScholarship(permanentDeleteScholarshipDialog.scholarship); setPermanentDeleteScholarshipDialog({ open: false, scholarship: null }); } }}>Delete Permanently</Button>
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
                <Button variant="outline" onClick={() => setPermanentDeleteAllScholarshipsDialog(false)}>Cancel</Button>
                <Button variant="destructive" onClick={() => { handlePermanentDeleteAllScholarships(); setPermanentDeleteAllScholarshipsDialog(false); }}>Delete All Permanently</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">User Management</h2>
                  <p className="text-muted-foreground">Manage system users and permissions</p>
                </div>
            <Button onClick={() => setShowAddUserModal(true)}>
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
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={"/placeholder.svg?height=32&width=32"} />
                              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge>{user.role}</Badge>
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>{user.lastActive}</TableCell>
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setUserModal({ mode: 'edit', user })}>Edit User</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setUserModal({ mode: 'role', user })}>Change Role</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setUserModal({ mode: 'reset', user })}>Reset Password</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user)}>
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
            <DialogContent className="max-w-md w-full p-6 rounded-xl">
              <DialogHeader>
                <DialogTitle>{userModal?.mode === 'edit' ? 'Edit User' : userModal?.mode === 'role' ? 'Change Role' : userModal?.mode === 'reset' ? 'Reset Password' : userModal?.mode === 'deactivate' ? 'Deactivate User' : 'Add User'}</DialogTitle>
              </DialogHeader>
              <UserForm
                user={userModal?.user}
                onSave={user => {
                  setUserModal(null);
                  setShowAddUserModal(false);
                  setActiveTab('users'); // refetch
                }}
                onCancel={() => { setUserModal(null); setShowAddUserModal(false); }}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
            </div>
          )}
        </main>
            </div>
  );
}
