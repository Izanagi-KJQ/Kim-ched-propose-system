"use client"

import { useState, useEffect } from "react"
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
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
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

// Add TabName type
type TabName = "dashboard" | "applications" | "scholarships" | "ranking" | "users";

// Add TabName type at the top
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
<<<<<<< HEAD
      region: "Region A",
=======
      region: "Palawan",
      requirements: {},
>>>>>>> d1d59b93b40851a610fc3b62981d452fcd3fc550
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
<<<<<<< HEAD
      region: "Region B",
=======
      region: "Mindoro Occidental",
      requirements: {},
>>>>>>> d1d59b93b40851a610fc3b62981d452fcd3fc550
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
<<<<<<< HEAD
      region: "Region C",
=======
      region: "Marinduque",
      requirements: {},
>>>>>>> d1d59b93b40851a610fc3b62981d452fcd3fc550
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
<<<<<<< HEAD
      region: "Region D",
=======
      region: "Romblon",
      requirements: {},
>>>>>>> d1d59b93b40851a610fc3b62981d452fcd3fc550
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

  const pieData = [
    { name: 'Total Applications', value: stats.totalApplications },
    { name: 'Pending Review', value: stats.pendingReview },
    { name: 'Approved', value: stats.approved },
    { name: 'Active Scholarships', value: stats.totalScholarships },
  ];
  const pieColors = ['#7C3AED', '#818CF8', '#FBBF24', '#34D399'];
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
<<<<<<< HEAD
        region: data.region || "",
      } as Application,
=======
        region: data.region || '',
        requirements: data.requirements || {},
        score: data.score || null,
        review: data.review || '',
      },
>>>>>>> d1d59b93b40851a610fc3b62981d452fcd3fc550
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

  const filteredApplications = applications
    .filter(app => statusFilter === "all" || app.status === statusFilter)
    .filter(app => scholarshipFilter === "all" || app.scholarship === scholarshipFilter)
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
        (app.review && app.review.toLowerCase().includes(q))
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
    // TODO: Implement delete logic
  }

  const handleStatusUpdate = (appId: string, newStatus: "under_review" | "approved" | "rejected") => {
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, status: newStatus } : app))
    );
    setStatusWorkflowDialog({ open: false, app: null, step: null });
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
            </div>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Applications */}
              <Card
                className="bg-purple-50 border-0 dark:bg-[#23232a] dark:text-gray-100 cursor-pointer transition-colors hover:bg-purple-200 dark:hover:bg-purple-800"
                onClick={() => { setActiveTab('applications'); setStatusFilter('all'); }}
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
                onClick={() => { setActiveTab('applications'); setStatusFilter('under_review'); }}
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
                onClick={() => { setActiveTab('applications'); setStatusFilter('approved'); }}
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
              {/* Active Scholarships */}
              <Card
                className="bg-yellow-50 border-0 dark:bg-[#23232a] dark:text-gray-100 cursor-pointer transition-colors hover:bg-yellow-200 dark:hover:bg-yellow-800"
                onClick={() => { setActiveTab('scholarships'); setScholarshipSort('status_active'); }}
                tabIndex={0}
                role="button"
                aria-label="Go to Active Scholarships"
              >
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Scholarships</CardTitle>
                  <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stats.totalScholarships}</div>
                </CardContent>
              </Card>
            </div>
            {/* Charts and Ranking */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Applications Overview (Pie Chart) */}
              <Card className="bg-card border-0 shadow-md flex flex-col h-full dark:bg-[#23232a] dark:text-gray-100">
                <CardHeader>
                  <CardTitle>Applications Overview</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  <div className="flex-1 min-h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                          </div>
                  {/* Custom Legend - only at the bottom, with numbers */}
                  <div className="flex flex-wrap justify-center gap-6 mt-6 px-2 pb-2">
                    {pieData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center space-x-2">
                        <span className="inline-block w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: pieColors[index % pieColors.length] }}></span>
                        <span className="text-sm font-medium text-muted-foreground">{entry.name}:</span>
                        <span className="text-sm text-foreground font-semibold">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
<<<<<<< HEAD

              {/* Applications Table */}
              <Card>
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
                      <TableRow>
                        {selectionMode && (
                          <TableHead></TableHead>
                        )}
                        <TableHead>Applicant</TableHead>
                        <TableHead>Scholarship</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>GPA</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
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
                            <TableCell>{app.scholarship}</TableCell>
                            <TableCell>{app.amount}</TableCell>
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
                              {app.score !== null && app.score !== undefined ? (
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{app.score}</span>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < Math.floor((app.score || 0) / 20)
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                          }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400">Not scored</span>
                              )}
                            </TableCell>
                            <TableCell>{app.submittedDate}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
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
=======
              {/* Student Ranking Table */}
              <Card className="bg-card border-0 shadow-md flex flex-col h-full dark:bg-[#23232a] dark:text-gray-100">
                <CardHeader>
                  <CardTitle>Student Ranking (by GWA)</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                  <div className={ranking.length >= 8 ? "w-full max-h-[300px] overflow-y-auto" : "w-full"}>
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">#</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="w-24 text-right">GWA</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ranking.map((app, idx) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-bold">{idx + 1}</TableCell>
                            <TableCell>{app.name}</TableCell>
                            <TableCell className="text-right">{app.gpa?.toFixed(2)}</TableCell>
>>>>>>> d1d59b93b40851a610fc3b62981d452fcd3fc550
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
<<<<<<< HEAD
              {/* Slot Summary */}
              <div className="flex gap-4 mb-4">
                <div
                  className="flex-1 text-center cursor-pointer rounded-lg border transition-colors duration-200 shadow-sm hover:bg-green-100 dark:hover:bg-green-900/50 focus:bg-green-200"
                  onClick={() => setRankingStatusModal({ open: true, status: 'approved' })}
                  tabIndex={0}
                  style={{ outline: 'none' }}
                >
                  <CardContent className="py-2">
                    <div className="font-bold text-lg">{approved.length} / 102</div>
                    <div className="text-green-700 dark:text-green-400">Approved</div>
                  </CardContent>
                </div>
                <div
                  className="flex-1 text-center cursor-pointer rounded-lg border transition-colors duration-200 shadow-sm hover:bg-yellow-100 dark:hover:bg-yellow-900/50 focus:bg-yellow-200"
                  onClick={() => setRankingStatusModal({ open: true, status: 'reserve' })}
                  tabIndex={0}
                  style={{ outline: 'none' }}
                >
                  <CardContent className="py-2">
                    <div className="font-bold text-lg">{reserve.length} / 48</div>
                    <div className="text-yellow-700 dark:text-yellow-400">Reserve</div>
                  </CardContent>
                </div>
                <div
                  className="flex-1 text-center cursor-pointer rounded-lg border transition-colors duration-200 shadow-sm hover:bg-orange-100 dark:hover:bg-orange-900/50 focus:bg-orange-200"
                  onClick={() => setRankingStatusModal({ open: true, status: 'pending' })}
                  tabIndex={0}
                  style={{ outline: 'none' }}
                >
                  <CardContent className="py-2">
                    <div className="font-bold text-lg">{pending.length}</div>
                    <div className="text-orange-700 dark:text-orange-400">Pending</div>
                  </CardContent>
                </div>
                <div
                  className="flex-1 text-center cursor-pointer rounded-lg border transition-colors duration-200 shadow-sm hover:bg-red-100 dark:hover:bg-red-900/50 focus:bg-red-200"
                  onClick={() => setRankingStatusModal({ open: true, status: 'rejected' })}
                  tabIndex={0}
                  style={{ outline: 'none' }}
                >
                  <CardContent className="py-2">
                    <div className="font-bold text-lg">{rejected.length}</div>
                    <div className="text-red-700 dark:text-red-400">Rejected</div>
                  </CardContent>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ranking List */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Merit Excellence Scholarship Rankings</CardTitle>
                      <CardDescription>Applications ranked by overall score</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[...approved, ...reserve].map((app, index) => (
                          <div
                            key={app.id}
                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/50 ${selectedStudentId === app.id ? 'ring-2 ring-purple-400 dark:ring-purple-500' : ''}`}
                            onClick={() => setSelectedStudentId(app.id)}
                          >
                              <div className="flex items-center space-x-4">
                              <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${index === 0 ? 'bg-amber-400 text-white' : index === 1 ? 'bg-gray-400 text-white' : index === 2 ? 'bg-yellow-800 text-white' : 'bg-green-100 text-green-600 dark:bg-green-900/80 dark:text-green-300'}`}
                              >
                        {applications
                          .filter((app) => app.score)
                          .sort((a, b) => (b.score || 0) - (a.score || 0))
                          .map((app, index) => (
                            <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                                  {index + 1}
                                </div>
                                <Avatar>
                                  <AvatarImage src={app.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{app.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{app.name}</p>
                                  <p className="text-sm text-muted-foreground">GPA: {app.gpa}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                              {(() => {
                                const status = app.status;
                                const clickHandler = (e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    setActiveTab('applications');
                                    setStatusFilter(status);
                                    setHighlightedApplicantId(app.id);
                                };

                                const clickableBadges: { [key: string]: { variant: any; label: string; className: string } } = {
                                    pending: { variant: 'pending', label: 'Pending', className: 'cursor-pointer hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 transition' },
                                    accepted: { variant: 'approved', label: 'Accepted', className: 'cursor-pointer hover:bg-green-600 focus:ring-2 focus:ring-green-400 transition' },
                                    approved: { variant: 'approved', label: 'Approved', className: 'cursor-pointer hover:bg-green-600 focus:ring-2 focus:ring-green-400 transition' },
                                    rejected: { variant: 'destructive', label: 'Rejected', className: 'cursor-pointer hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition' },
                                    under_review: { variant: 'underReview', label: 'Under Review', className: 'cursor-pointer hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition' },
                                };

                                if (clickableBadges[status]) {
                                    const { variant, label, className } = clickableBadges[status];
                                    return (
                                        <Badge
                                          variant={variant}
                                          className={className}
                                          onClick={clickHandler}
                                          tabIndex={0}
                                          role="button"
                                          aria-label="Go to applicant in Applications"
                                        >
                                          {label}
                                        </Badge>
                                    );
                                }

                                return getStatusBadge(status);
                              })()}
                              <Button size="sm" variant="destructive" onClick={e => { e.stopPropagation(); handleRemoveStudent(app.id); }}>Remove</Button>
                              </div>
                                  <AvatarFallback>
                                    {app.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                            </div>
                                          ))}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <p className="font-bold text-lg">{app.score}</p>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < Math.floor((app.score || 0) / 20)
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                          }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                {getStatusBadge(app.status)}
                              </div>
                            </div>
                          ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Scoring Panel */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Score</CardTitle>
                      <CardDescription>Score applications quickly</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {selectedStudentId ? (
                        <p className="text-muted-foreground text-sm">Requirements checklist not implemented.</p>
                      ) : (
                        <p className="text-muted-foreground text-sm">Select a student to view their requirements.</p>
                      )}

                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="academic">Academic Performance (40%)</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            type="number"
                            min="0"
                            max="40"
                            placeholder="0-40"
                            value={academic}
                            onChange={e => setAcademic(Number(e.target.value))}
                          />
                          <span className="text-sm text-gray-500">/40</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="extracurricular">Extracurricular (30%)</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            type="number"
                            min="0"
                            max="30"
                            placeholder="0-30"
                            value={extracurricular}
                            onChange={e => setExtracurricular(Number(e.target.value))}
                          />
                          <span className="text-sm text-gray-500">/30</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="essay">Essay Quality (20%)</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            placeholder="0-20"
                            value={essay}
                            onChange={e => setEssay(Number(e.target.value))}
                          />
                          <span className="text-sm text-gray-500">/20</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="financial">Financial Need (10%)</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            placeholder="0-10"
                            value={financial}
                            onChange={e => setFinancial(Number(e.target.value))}
                          />
                          <span className="text-sm text-gray-500">/10</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Total Score</span>
                          <span className="text-2xl font-bold">{totalScore}</span>
                        </div>
                        <Progress value={totalScore} className="mb-4" />
                        <Textarea
                          placeholder="Add review comments..."
                          className="mb-4"
                          value={review}
                          onChange={e => setReview(e.target.value)}
                        />
                        <Button className="w-full" onClick={handleSaveScore}>
                          Save Score & Review
                        </Button>
                      </div>
                              </CardContent>
                    </CardContent>
                  </Card>
                </div>
=======
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => setTrashBinOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Trash Bin {trashBin.length > 0 && <span className="ml-1">({trashBin.length})</span>}
                </Button>
                <Button variant={selectionMode ? "default" : "outline"} onClick={() => setSelectionMode(m => !m)}>
                  {selectionMode ? "Cancel" : "Select"}
                </Button>
                <Button onClick={() => setModalMode("createApplication")}>
                  <FileText className="h-4 w-4 mr-2" />
                  New Application
                </Button>
>>>>>>> d1d59b93b40851a610fc3b62981d452fcd3fc550
              </div>
            </div>

            {/* Filters */}
            <Card className="dark:bg-[#23232a] dark:text-gray-100">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search applications..."
                        className="pl-10 border border-gray-300 hover:border-purple-500 focus:border-purple-600 focus:border-2 hover:border focus:outline-none transition-colors dark:hover:border-purple-400 dark:focus:border-purple-500"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={scholarshipFilter} onValueChange={setScholarshipFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by scholarship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Scholarships</SelectItem>
                      {scholarships.map((scholarship) => (
                        <SelectItem key={scholarship.id} value={scholarship.name}>
                          {scholarship.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

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
                    <TableHead>Province</TableHead>
                      <TableHead>Scholarship</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>GPA</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications
                      .map((app) => (
                        <TableRow key={app.id} className={`transition-colors duration-300`}
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
                          <TableCell>{app.submittedDate}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
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
<<<<<<< HEAD

              <Card>
                <CardContent className="pt-6">
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
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-500">No users found.</TableCell>
                        </TableRow>
                      ) : (
                        users.map((user, idx) => (
                          <TableRow key={user.email || idx}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarImage src={typeof user.avatar === 'string' ? user.avatar : "/placeholder.svg?height=32&width=32"} />
                                  <AvatarFallback>{user.name ? user.name.split(" ").map((n: string) => n[0]).join("") : "U"}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge>{user.role || "N/A"}</Badge>
                            </TableCell>
                            <TableCell>{user.department || "N/A"}</TableCell>
                            <TableCell>{user.lastActive || "N/A"}</TableCell>
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
                                  <DropdownMenuItem>Edit User</DropdownMenuItem>
                                  <DropdownMenuItem>Change Role</DropdownMenuItem>
                                  <DropdownMenuItem>Reset Password</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {/* Stubs for deactivate/reactivate/delete actions */}
                                  <DropdownMenuItem className="text-red-600 dark:text-red-500">Deactivate</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600 dark:text-red-500">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
=======
              <Button
                onClick={() => setShowAddUserModal(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                Add User
              </Button>
>>>>>>> d1d59b93b40851a610fc3b62981d452fcd3fc550
            </div>

            <Card className="dark:bg-[#23232a] dark:text-gray-100">
              <CardContent className="pt-6">
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
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">No users found.</TableCell>
                      </TableRow>
                    ) : (
                      users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
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
                              {getStatusIcon(user.status)}
                          <Badge variant="default">{user.status}</Badge>
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
                                <DropdownMenuItem>Edit User</DropdownMenuItem>
                                <DropdownMenuItem>Change Role</DropdownMenuItem>
                                <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDeactivateUser(user)}>Deactivate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                      ))
                    )}
                </TableBody>
              </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
