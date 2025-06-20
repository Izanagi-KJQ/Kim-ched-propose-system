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
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Sheet, SheetContent, SheetHeader, SheetFooter, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

type Scholarship = {
  id: string;
  name: string;
  amount: string;
  deadline: string;
  applicants: number;
  status: string;
 exportfile
  type?: 'Full' | 'Half';
}

interface Application {
  id: string;
  name: string;
  region: string;
  email: string;
  scholarship: string;
  amount: string;
  gpa: number | null;
  status: string;
  submittedDate: string;
  avatar: string;
  review?: string;
  requirements?: Record<string, boolean>;
  score?: number | null;
}

type TabName = "dashboard" | "applications" | "scholarships" | "ranking" | "users";

type ProgressBarInputProps = {
  value: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

// Utility to get color class based on score
function getScoreColor(score: number) {
  if (score <= 65) return "bg-red-500";
  if (score <= 75) return "bg-orange-400";
  if (score <= 85) return "bg-yellow-300";
  if (score <= 95) return "bg-lime-400";
  return "bg-green-500";
}

// Enhanced ProgressBarInput component for interactive score selection with color
function ProgressBarInput({ value, onChange, min = 0, max = 100, step = 1 }: ProgressBarInputProps) {
  const colorClass = getScoreColor(value || 0);
  return (
    <div className="flex flex-col gap-2 w-full">
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value || 0]}
        onValueChange={([v]) => onChange(v)}
        className="mb-2"
      />
      <Progress value={value || 0} className="h-4" indicatorClassName={colorClass} />
      <div className="text-xs text-center text-gray-500">{value || 0} / {max}</div>
    </div>
  );
}

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  lastActive: string;
  status: string;
main
};

export default function Component() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("dashboard")
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit" | null>(null)
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

exportfile
  const applications = [

  //Mock data for applications
  const [applications, setApplications] = useState<Application[]>([
main
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
    },
  ]

  const [academic, setAcademic] = useState(0);
  const [extracurricular, setExtracurricular] = useState(0);
  const [essay, setEssay] = useState(0);
  const [financial, setFinancial] = useState(0);
  const [review, setReview] = useState("");

  const totalScore = academic + extracurricular + essay + financial;

  const [showAddUserModal, setShowAddUserModal] = useState(false);

 exportfile
  useEffect(() => {
    const savedAvatar = localStorage.getItem('user-avatar');
    const savedName = localStorage.getItem('user-name');
    const savedEmail = localStorage.getItem('user-email');
    if (savedAvatar) setAvatarUrl(savedAvatar);
    if (savedName) setUserName(savedName);
    if (savedEmail) setUserEmail(savedEmail);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" as const },
      under_review: { label: "Under Review", variant: "default" as const },
      approved: { label: "Approved", variant: "default" as const },
      rejected: { label: "Rejected", variant: "destructive" as const },
    }
  // Add state for status workflow dialog
  const [statusWorkflowDialog, setStatusWorkflowDialog] = useState<{ open: boolean, app: Application | null, step: 'pending' | 'under_review' | null }>({ open: false, app: null, step: null });
 main

  // Update getStatusBadge to handle new workflow
  const getStatusBadge = (status: string, onClick?: () => void) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "pending" as const, clickable: true },
      under_review: { label: "Under Review", variant: "underReview" as const, clickable: true },
      approved: { label: "Approved", variant: "approved" as const, clickable: false },
      accepted: { label: "Accepted", variant: "approved" as const, clickable: false },
      rejected: { label: "Rejected", variant: "destructive" as const, clickable: false },
    } as const;
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge
        variant={config.variant}
        style={config.clickable ? { cursor: 'pointer' } : {}}
        onClick={config.clickable && onClick ? onClick : undefined}
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
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-700" />;
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
    // Example data, replace with your actual data source
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
    // Example: Save to state, send to API, etc.
    alert(
      `Score saved!\nAcademic: ${academic}\nExtracurricular: ${extracurricular}\nEssay: ${essay}\nFinancial: ${financial}\nTotal: ${totalScore}\nReview: ${review}`
    );
    // You can update your application data here or send to a backend
  };
 exportfile
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
        region: data.region,
        email: data.email,
        scholarship: data.scholarship,
        amount: data.amount,
        gpa: parseFloat(data.gpa?.toString() || '0'), 
        status: data.status,
        submittedDate: data.submittedDate,
        avatar: "/placeholder.svg?height=32&width=32" 
      },
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
    // Implementation of sending a message
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
      // TODO: Implement actual PDF generation and download logic here
      setDownloadDialogOpen(false);
      setDownloadApplication(null);
      // Example: downloadApplicationAsPDF(downloadApplication);
    }
  }

  function handleConfirmDownloadDOCX() {
    if (downloadApplication) {
      // TODO: Implement actual DOCX generation and download logic here
      setDownloadDialogOpen(false);
      setDownloadApplication(null);
      // Example: downloadApplicationAsDOCX(downloadApplication);
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
    setTrashBin(prev => prev.filter(a => a.id !== app.id));
  }

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Add a handler to remove a scholarship
  const handleRemoveScholarship = (id: string) => {
    setScholarships((prev) => prev.filter((s) => s.id !== id));
  };

  // Helper to format amount as peso with commas
  const formatPeso = (amount: string) => {
    // Remove any non-digit except dot and comma, then format
    const num = parseFloat(amount.replace(/[^\d.]/g, ""));
    if (isNaN(num)) return "₱ 0";
    return `₱ ${num.toLocaleString()}`;
  };
 main

  // Add state for the custom delete-all confirmation dialog
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);

  // Add state for status action dialog
  const [statusActionDialog, setStatusActionDialog] = useState<{ open: boolean, app: Application | null }>({ open: false, app: null });

  // Add state for scholarship type selection dialog
  const [scholarshipTypeDialog, setScholarshipTypeDialog] = useState(false);
  const [pendingScholarshipType, setPendingScholarshipType] = useState<'Full' | 'Half' | null>(null);

  // Add state for scholarship delete confirmation
  const [deleteScholarshipDialog, setDeleteScholarshipDialog] = useState<{ open: boolean, scholarship: Scholarship | null }>({ open: false, scholarship: null });

  // Add state for status modal in ranking section
  const [rankingStatusModal, setRankingStatusModal] = useState<{ open: boolean, status: string | null }>({ open: false, status: null });

  // Add state for highlighted applicant
  const [highlightedApplicantId, setHighlightedApplicantId] = useState<string | null>(null);

  // When switching away from Applications tab, clear highlightedApplicantId
  useEffect(() => {
    if (activeTab !== 'applications' && highlightedApplicantId) {
      setHighlightedApplicantId(null);
    }
  }, [activeTab]);

  // Add state for selected applications
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);

  // Add state for selection mode
  const [selectionMode, setSelectionMode] = useState(false);

  // When selectionMode is turned off, clear selectedAppIds
  useEffect(() => {
    if (!selectionMode) setSelectedAppIds([]);
  }, [selectionMode]);

  // Helper to get filtered applications (for select all)
  const filteredApplications = applications
    .filter(app => statusFilter === "all" || app.status === statusFilter)
    .filter(app => scholarshipFilter === "all" || app.scholarship === scholarshipFilter)
    .filter(app => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        app.name.toLowerCase().includes(q) ||
        app.region?.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.scholarship.toLowerCase().includes(q) ||
        app.amount.toLowerCase().includes(q) ||
        (app.gpa !== null && app.gpa.toString().toLowerCase().includes(q)) ||
        app.status.toLowerCase().includes(q) ||
        app.submittedDate.toLowerCase().includes(q) ||
        (app.review && app.review.toLowerCase().includes(q))
      );
    });

  // Handler for select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAppIds(filteredApplications.map(app => app.id));
    } else {
      setSelectedAppIds([]);
    }
  };

  // Handler for select one
  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedAppIds(prev => checked ? [...prev, id] : prev.filter(appId => appId !== id));
  };

  // Handler for bulk delete
  const handleBulkDelete = () => {
    if (selectedAppIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedAppIds.length} selected applications?`)) return;
    const toTrash = applications.filter(app => selectedAppIds.includes(app.id));
    setApplications(prev => prev.filter(app => !selectedAppIds.includes(app.id)));
    setTrashBin(prev => [...prev, ...toTrash]);
    setSelectedAppIds([]);
  };

  return (
    <div className="min-h-screen bg-[#F4F0FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-purple-700">SAMRS</h1>
            </div>
            <span className="text-sm text-gray-500 hidden md:block">Scholarship Application Management & Ranking System</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center border-purple-200 text-purple-700"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
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

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === 'dashboard' ? 'bg-purple-100 text-purple-700' : ''}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "applications" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === 'applications' ? 'bg-purple-100 text-purple-700' : ''}`}
              onClick={() => setActiveTab("applications")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Applications
            </Button>
            <Button
              variant={activeTab === "scholarships" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === 'scholarships' ? 'bg-purple-100 text-purple-700' : ''}`}
              onClick={() => setActiveTab("scholarships")}
            >
              <Award className="h-4 w-4 mr-2" />
              Scholarships
            </Button>
            <Button
              variant={activeTab === "ranking" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === 'ranking' ? 'bg-purple-100 text-purple-700' : ''}`}
              onClick={() => setActiveTab("ranking")}
            >
              <Star className="h-4 w-4 mr-2" />
              Ranking
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === 'users' ? 'bg-purple-100 text-purple-700' : ''}`}
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-[#F4F0FA]">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-purple-700">Admin Dashboard</h2>
              </div>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-purple-50 border-0">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-purple-700">Total Applications</CardTitle>
                    <FileText className="h-6 w-6 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-700">{stats.totalApplications}</div>
                  </CardContent>
                </Card>
                <Card className="bg-indigo-50 border-0">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-indigo-700">Pending Review</CardTitle>
                    <Clock className="h-6 w-6 text-indigo-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-indigo-700">{stats.pendingReview}</div>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-50 border-0">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-yellow-700">Approved</CardTitle>
                    <CheckCircle className="h-6 w-6 text-yellow-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-700">{stats.approved}</div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-0">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-green-700">Active Scholarships</CardTitle>
                    <Award className="h-6 w-6 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-700">{stats.totalScholarships}</div>
                  </CardContent>
                </Card>
              </div>
              {/* Charts and Ranking */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pie Chart */}
                <Card className="col-span-1 bg-white border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Applications Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                {/* Ranking Table */}
                <Card className="col-span-2 bg-white border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Student Ranking (by GWA)</CardTitle>
                  </CardHeader>
                  <CardContent>
exportfile
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GWA</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {ranking.map((app, idx) => (
                            <tr key={app.id}>
                              <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{app.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{app.gpa}</td>
                            </tr>
                    <div className="w-full h-[450px] flex flex-col items-center justify-center">
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16">#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="w-24 text-right">GWA</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ranking.slice(0, 8).map((app, idx) => (
                            <TableRow key={app.id}>
                              <TableCell className="font-bold">{idx + 1}</TableCell>
                              <TableCell>{app.name}</TableCell>
                              <TableCell className="text-right">{app.gpa?.toFixed(2)}</TableCell>
                            </TableRow>
main
                          ))}
                        </tbody>
                      </table>
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
                  <h2 className="text-3xl font-bold text-gray-900">Applications</h2>
                  <p className="text-gray-600">Manage and review scholarship applications</p>
                </div>
exportfile
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  New Application
                </Button>
                <div className="flex items-center space-x-4"> {/* Added a div to group buttons */}
                  <Button variant="outline" onClick={() => setTrashBinOpen(true)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Trash Bin {trashBin.length > 0 && <span className="ml-1">({trashBin.length})</span>}
                  </Button>
                  <Button variant={selectionMode ? "default" : "outline"} onClick={() => setSelectionMode(m => !m)}>
                    Select
                  </Button>
                  <Button onClick={() => setModalMode("createApplication")}> 
                    <FileText className="h-4 w-4 mr-2" />
                    New Application
                  </Button>
                </div>
main
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input placeholder="Search applications..." className="pl-10" />
                      </div>
                    </div>
                    <Select>
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
                    <Select>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by scholarship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Scholarships</SelectItem>
                        {scholarships.map((scholarship) => (
                          <SelectItem key={scholarship.id} value={scholarship.id}>
                            {scholarship.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Applications Table */}
              <Card>
exportfile
                <CardContent className="pt-6">
                <CardContent className="pt-6 overflow-x-auto" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                  {selectionMode && selectedAppIds.length > 0 && (
                    <div className="mb-2 flex items-center gap-4">
                      <span className="text-sm font-medium">{selectedAppIds.length} selected</span>
                      <Button variant="destructive" size="sm" onClick={handleBulkDelete}>Move to Trash Bin</Button>
                      <Button variant="outline" size="sm" onClick={() => setSelectionMode(false)}>Cancel Selection</Button>
                    </div>
                  )}
main
                  <Table>
                    <TableHeader>
                      <TableRow>
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
                        <TableHead>Scholarship</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>GPA</TableHead>
                        <TableHead>Status</TableHead>
 exportfile
                        <TableHead>Score</TableHead>

 main
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
 exportfile
                      {applications.map((app) => (
                        <TableRow key={app.id}>
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
                                <p className="text-sm text-gray-500">{app.email}</p>
                      {applications
                        .filter(app => statusFilter === "all" || app.status === statusFilter)
                        .filter(app => scholarshipFilter === "all" || app.scholarship === scholarshipFilter)
                        .filter(app => {
                          if (!searchQuery.trim()) return true;
                          const q = searchQuery.toLowerCase();
                          return (
                            app.name.toLowerCase().includes(q) ||
                            app.region?.toLowerCase().includes(q) ||
                            app.email.toLowerCase().includes(q) ||
                            app.scholarship.toLowerCase().includes(q) ||
                            app.amount.toLowerCase().includes(q) ||
                            (app.gpa !== null && app.gpa.toString().toLowerCase().includes(q)) ||
                            app.status.toLowerCase().includes(q) ||
                            app.submittedDate.toLowerCase().includes(q) ||
                            (app.review && app.review.toLowerCase().includes(q))
                          );
                        })
                        .map((app) => (
                          <TableRow key={app.id} className={`focus:outline-none ${highlightedApplicantId === app.id ? 'ring-2 ring-orange-400 bg-orange-50 animate-pulse' : ''}`}
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
                                  <p className="text-sm text-gray-500">{app.email}</p>
                                </div>
 main
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{app.scholarship}</TableCell>
                          <TableCell>{app.amount}</TableCell>
                          <TableCell>{app.gpa}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(app.status)}
                              {getStatusBadge(app.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {app.score ? (
                              <div className="flex items-center space-x-2">
exportfile
                                <span className="font-medium">{app.score}</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < Math.floor(app.score / 20)
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
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Review & Score
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download Documents
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
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
                                  <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteApplicant(app)}>
                                    <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                                    Delete Applicant
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
 main
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
 exportfile
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
                      <p><strong>Region:</strong> {selectedApplication.region}</p>
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
                            <div className="text-xs text-gray-500">{app.email} | {app.scholarship}</div>
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
                            onClick={() => setDeleteAllDialogOpen(true)}
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
 main
            </div>
          )}

          {activeTab === "ranking" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Application Ranking</h2>
 exportfile
                <p className="text-gray-600">Review and rank scholarship applications by score</p>
                <p className="text-gray-600">Review and rank scholarship applications by GWA (GPA)</p>
              </div>
              {/* Slot Summary */}
              <div className="flex gap-4 mb-4">
                <div
                  className="flex-1 text-center cursor-pointer rounded-lg border transition-colors duration-200 shadow-sm hover:bg-green-100 focus:bg-green-200"
                  onClick={() => setRankingStatusModal({ open: true, status: 'approved' })}
                  tabIndex={0}
                  style={{ outline: 'none' }}
                >
                  <CardContent className="py-2">
                    <div className="font-bold text-lg">{approved.length} / 102</div>
                    <div className="text-green-700">Approved</div>
                  </CardContent>
                </div>
                <div
                  className="flex-1 text-center cursor-pointer rounded-lg border transition-colors duration-200 shadow-sm hover:bg-yellow-100 focus:bg-yellow-200"
                  onClick={() => setRankingStatusModal({ open: true, status: 'reserve' })}
                  tabIndex={0}
                  style={{ outline: 'none' }}
                >
                  <CardContent className="py-2">
                    <div className="font-bold text-lg">{reserve.length} / 48</div>
                    <div className="text-yellow-700">Reserve</div>
                  </CardContent>
                </div>
                <div
                  className="flex-1 text-center cursor-pointer rounded-lg border transition-colors duration-200 shadow-sm hover:bg-orange-100 focus:bg-orange-200"
                  onClick={() => setRankingStatusModal({ open: true, status: 'pending' })}
                  tabIndex={0}
                  style={{ outline: 'none' }}
                >
                  <CardContent className="py-2">
                    <div className="font-bold text-lg">{pending.length}</div>
                    <div className="text-orange-700">Pending</div>
                  </CardContent>
                </div>
                <div
                  className="flex-1 text-center cursor-pointer rounded-lg border transition-colors duration-200 shadow-sm hover:bg-red-100 focus:bg-red-200"
                  onClick={() => setRankingStatusModal({ open: true, status: 'rejected' })}
                  tabIndex={0}
                  style={{ outline: 'none' }}
                >
                  <CardContent className="py-2">
                    <div className="font-bold text-lg">{rejected.length}</div>
                    <div className="text-red-700">Rejected</div>
                  </CardContent>
                </div>
 main
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
 exportfile
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
                                  <AvatarFallback>
                                    {app.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{app.name}</p>
                                  <p className="text-sm text-gray-500">GPA: {app.gpa}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <p className="font-bold text-lg">{app.score}</p>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < Math.floor((app.score || 0) / 20)
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
                        {[...approved, ...reserve].map((app, index) => (
                          <div
                            key={app.id}
                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-purple-50 ${selectedStudentId === app.id ? 'ring-2 ring-purple-400' : ''}`}
                            onClick={() => setSelectedStudentId(app.id)}
                          >
                            <div className="flex items-center space-x-4">
                              <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${index === 0 ? 'bg-amber-400 text-white' : index === 1 ? 'bg-gray-400 text-white' : index === 2 ? 'bg-yellow-800 text-white' : 'bg-green-100 text-green-600'}`}
                              >
                                {index + 1}
                              </div>
                              <Avatar>
                                <AvatarImage src={app.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{app.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{app.name}</p>
                                <p className="text-sm text-gray-500">GPA: {app.gpa}</p>
                                <span className={`text-xs font-bold ${app.requirementsStatus === 'Disqualified' ? 'text-red-600' : app.requirementsStatus === 'Incomplete' ? 'text-yellow-600' : 'text-green-600'}`}>{app.requirementsStatus}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              {app.status === 'pending' ? (
                                <Badge
                                  variant="pending"
                                  className="cursor-pointer hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 transition"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setActiveTab('applications');
                                    setStatusFilter('pending');
                                    setHighlightedApplicantId(app.id);
                                  }}
                                  tabIndex={0}
                                  role="button"
                                  aria-label="Go to applicant in Applications"
                                >
                                  Pending
                                </Badge>
                              ) : getStatusBadge(app.status)}
                              <Button size="sm" variant="destructive" onClick={e => { e.stopPropagation(); handleRemoveStudent(app.id); }}>Remove</Button>
                            </div>
                          </div>
                        ))}
 main
                      </div>
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
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "scholarships" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Scholarships</h2>
                  <p className="text-gray-600">Manage scholarship programs and deadlines</p>
                </div>
 exportfile
                <Button>
                  <Award className="h-4 w-4 mr-2" />
                  Create Scholarship
                </Button>
                <div className="flex items-center space-x-4">
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
 main
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scholarships.map((scholarship) => (
                  <Card key={scholarship.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{scholarship.name}</CardTitle>
                        <Badge variant={scholarship.status === "active" ? "default" : "secondary"}>
                          {scholarship.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>{scholarship.amount}</span>
                        </div>
 exportfile
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Deadline:</span>
                          <span className="font-medium">{scholarship.deadline}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Applicants:</span>
                          <span className="font-medium">{scholarship.applicants}</span>
                        </div>
                        <div className="pt-3 border-t">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => { setSelectedScholarship(scholarship); setModalMode("view"); }}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => { setSelectedScholarship(scholarship); setModalMode("edit"); }}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                        {scholarship.type && (
                          <div className="mt-1 text-xs font-bold text-purple-700">{scholarship.type} Scholarship</div>
                        )}
                        <CardDescription>
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">₱</span>
                            <span>{formatPeso(scholarship.amount)}</span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Deadline:</span>
                            <span className="font-medium">{scholarship.deadline}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Applicants:</span>
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
 main
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Scholarship View/Edit Modal */}
              <Dialog open={!!modalMode} onOpenChange={() => { setModalMode(null); setSelectedScholarship(null); }}>
                <DialogContent className="max-w-md w-full p-6">
                  <DialogHeader>
                    <DialogTitle>{modalMode === "view" ? "View Scholarship" : "Edit Scholarship"}</DialogTitle>
                  </DialogHeader>
                  {selectedScholarship && (
                    <div>
                      {modalMode === "view" ? (
                        <div className="space-y-2">
                          <p><strong>Name:</strong> {selectedScholarship.name}</p>
                          <p><strong>Amount:</strong> {selectedScholarship.amount}</p>
                          <p><strong>Deadline:</strong> {selectedScholarship.deadline}</p>
                          <p><strong>Status:</strong> {selectedScholarship.status}</p>
                          <p><strong>Applicants:</strong> {selectedScholarship.applicants}</p>
                        </div>
                      ) : (
                        <ScholarshipEditForm scholarship={selectedScholarship} onSave={handleSaveScholarship} onCancel={() => { setModalMode(null); setSelectedScholarship(null); }} />
                      )}
                    </div>
 exportfile
                  )}
                  ) : modalMode === "create" ? (
                    <ScholarshipCreateForm onSave={handleCreateScholarship} onCancel={() => { setModalMode(null); setPendingScholarshipType(null); }} type={pendingScholarshipType || undefined} />
                  ) : null}
 main
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
                  <p className="text-gray-600">Manage system users and permissions</p>
                </div>
                <Button
                  onClick={() => setShowAddUserModal(true)}
                  className="..." // your existing classes
                >
                  <Users className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>

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
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">John Doe</p>
                              <p className="text-sm text-gray-500">john.doe@university.edu</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge>Administrator</Badge>
                        </TableCell>
                        <TableCell>Financial Aid</TableCell>
                        <TableCell>2 hours ago</TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
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
                              <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          {/* User form goes here */}
          <form
            onSubmit={e => {
              e.preventDefault();
              // handle user creation here
              setShowAddUserModal(false);
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" required />
            </div>
            <Button type="submit" className="w-full">Add User</Button>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
 exportfile

      {/* User Modals */}
      <Dialog open={!!userModal} onOpenChange={handleCloseUserModal}>
        <DialogContent className="max-w-md w-full p-6">
          <DialogHeader>
            <DialogTitle>
              {userModal?.mode === 'add' && 'Add User'}
              {userModal?.mode === 'edit' && 'Edit User'}
              {userModal?.mode === 'role' && 'Change Role'}
              {userModal?.mode === 'reset' && 'Reset Password'}
              {userModal?.mode === 'deactivate' && 'Deactivate User'}
            </DialogTitle>
          </DialogHeader>
          {/* Modal Content */}
          {userModal && userModal.mode === 'add' && (
            <UserForm onSave={handleSaveUser} onCancel={handleCloseUserModal} />
          )}
          {userModal && userModal.mode === 'edit' && userModal.user && (
            <UserForm user={userModal.user} onSave={handleSaveUser} onCancel={handleCloseUserModal} />
          )}
          {userModal && userModal.mode === 'role' && userModal.user && (
            <div>
              <Label>Role</Label>
              <Select defaultValue={userModal.user.role} onValueChange={role => handleChangeRole(userModal.user!, role)}>
                <SelectTrigger className="w-full mt-2 mb-4">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleCloseUserModal}>Cancel</Button>
            </div>
          )}
          {userModal && userModal.mode === 'reset' && userModal.user && (
            <ChangePasswordForm user={userModal.user} onCancel={handleCloseUserModal} />
          )}
          {userModal && userModal.mode === 'deactivate' && userModal.user && (
            <div>
              <p>Are you sure you want to deactivate <b>{userModal.user.name}</b>?</p>
              <div className="flex space-x-2 mt-4">
                <Button variant="destructive" onClick={() => handleDeactivate(userModal.user!)}>Deactivate</Button>
                <Button variant="outline" onClick={handleCloseUserModal}>Cancel</Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student Ranking Dialog */}
      <Dialog open={rankingDialogOpen} onOpenChange={setRankingDialogOpen}>
        <>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay />
            <DialogPrimitive.Content
              className="fixed left-1/2 top-1/2 z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] rounded-2xl overflow-hidden bg-background border p-0 shadow-lg"
            >
              <div className="flex flex-col w-full h-[500px]"> {/* Adjusted height to match other modal */}
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b bg-white">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold">Student Ranking (by GWA)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="font-semibold px-4 py-2">Manage</Button>
                    <DialogClose asChild>
                      <button title="Close" className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <XCircle className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogClose>
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1 flex flex-row bg-white">
                  {/* Bar Chart */}
                  <div className="flex-1 flex items-center justify-center min-w-[320px] max-w-[420px] border-r">
                    <ResponsiveContainer width="100%" height={340}>
                      <BarChart
                        data={ranking.slice(0, 5).map((app, idx) => ({
                          rank: idx + 1,
                          name: app.name,
                          gwa: app.gpa,
                        }))}
                        layout="vertical"
                        margin={{ top: 30, right: 30, left: 40, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 4]} tick={{ fontSize: 12 }} />
                        <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 14 }} />
                        <Tooltip formatter={(value) => value} labelFormatter={(label) => `Name: ${label}`} />
                        <Bar dataKey="gwa" fill="#7C3AED" radius={[0, 8, 8, 0]} isAnimationActive={true}>
                          <LabelList dataKey="gwa" position="right" formatter={(v: number) => v?.toFixed(2)} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Scrollable Table */}
                  <div className="flex-1 flex flex-col p-8 min-w-[320px] max-w-[520px]">
                    <div className="flex-1 overflow-y-auto" style={{ maxHeight: 340 }}>
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16">Rank</TableHead>
                            <TableHead>Applicant Name</TableHead>
                            <TableHead className="w-24 text-right">GWA</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ranking.map((app, idx) => (
                            <TableRow key={app.id}>
                              <TableCell className="font-bold">{idx + 1}</TableCell>
                              <TableCell>{app.name}</TableCell>
                              <TableCell className="text-right">{app.gpa?.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </>
      </Dialog>

      {/* Delete All Permanently Confirmation Dialog */}
      <Dialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <DialogContent className="max-w-md w-full p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle>Delete All Permanently</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center text-lg text-red-700 font-semibold">
            Are you sure you want to permanently delete <b>ALL</b> records in the trash bin? This action cannot be undone.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAllDialogOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                trashBin.forEach(app => handlePermanentDeleteApplicant(app));
                setDeleteAllDialogOpen(false);
              }}
            >
              Delete All Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Action Dialog */}
      <Dialog open={statusActionDialog.open} onOpenChange={open => setStatusActionDialog({ open, app: open ? statusActionDialog.app : null })}>
        <DialogContent className="max-w-md w-full p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center text-lg font-semibold">
            Do you want to Accept or Reject this application?
          </div>
          <DialogFooter>
            <Button
              variant="default"
              onClick={() => {
                if (statusActionDialog.app) {
                  setApplications(prev => prev.map(a => a.id === statusActionDialog.app!.id ? { ...a, status: 'accepted' } : a));
                }
                setStatusActionDialog({ open: false, app: null });
              }}
            >
              Accept
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (statusActionDialog.app) {
                  setApplications(prev => prev.map(a => a.id === statusActionDialog.app!.id ? { ...a, status: 'rejected' } : a));
                }
                setStatusActionDialog({ open: false, app: null });
              }}
            >
              Reject
            </Button>
            <Button variant="outline" onClick={() => setStatusActionDialog({ open: false, app: null })}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Scholarship Type Selection Dialog */}
      <Dialog open={scholarshipTypeDialog} onOpenChange={setScholarshipTypeDialog}>
        <DialogContent className="max-w-md w-full p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle>Select Scholarship Type</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center text-lg font-semibold">
            Is this a Full Scholarship or a Half Scholarship?
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setPendingScholarshipType('Full');
                setScholarshipTypeDialog(false);
                setModalMode('create');
              }}
            >
              Full Scholarship
            </Button>
            <Button
              onClick={() => {
                setPendingScholarshipType('Half');
                setScholarshipTypeDialog(false);
                setModalMode('create');
              }}
              variant="secondary"
            >
              Half Scholarship
            </Button>
            <Button variant="outline" onClick={() => setScholarshipTypeDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Scholarship Delete Confirmation Dialog */}
      <Dialog open={deleteScholarshipDialog.open} onOpenChange={open => setDeleteScholarshipDialog({ open, scholarship: open ? deleteScholarshipDialog.scholarship : null })}>
        <DialogContent className="max-w-md w-full p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle>Remove Scholarship</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center text-lg font-semibold">
            Are you sure you want to remove the scholarship <b>{deleteScholarshipDialog.scholarship?.name}</b>? This action cannot be undone.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteScholarshipDialog({ open: false, scholarship: null })}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              if (deleteScholarshipDialog.scholarship) handleRemoveScholarship(deleteScholarshipDialog.scholarship.id);
              setDeleteScholarshipDialog({ open: false, scholarship: null });
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Modal */}
      <Dialog open={rankingStatusModal.open} onOpenChange={open => setRankingStatusModal({ open, status: open ? rankingStatusModal.status : null })}>
        <DialogContent className="max-w-lg w-full p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle>{rankingStatusModal.status ? `${rankingStatusModal.status.charAt(0).toUpperCase() + rankingStatusModal.status.slice(1)} Applicants` : ''}</DialogTitle>
          </DialogHeader>
          <div
            className="overflow-y-auto"
            style={(() => {
              const currentApplicants = (
                rankingStatusModal.status === 'approved' ? approved :
                rankingStatusModal.status === 'reserve' ? reserve :
                rankingStatusModal.status === 'pending' ? pending :
                rankingStatusModal.status === 'rejected' ? rejected :
                []
              );
              return currentApplicants.length >= 5 ? { maxHeight: '320px' } : {};
            })()}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Scholarship</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(rankingStatusModal.status === 'approved' ? approved :
                  rankingStatusModal.status === 'reserve' ? reserve :
                  rankingStatusModal.status === 'pending' ? pending :
                  rankingStatusModal.status === 'rejected' ? rejected :
                  []).map(app => (
                  <TableRow key={app.id}>
                    <TableCell>{app.name}</TableCell>
                    <TableCell>{app.gpa}</TableCell>
                    <TableCell>{app.scholarship}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {((rankingStatusModal.status === 'approved' && approved.length === 0) ||
              (rankingStatusModal.status === 'reserve' && reserve.length === 0) ||
              (rankingStatusModal.status === 'pending' && pending.length === 0) ||
              (rankingStatusModal.status === 'rejected' && rejected.length === 0)) && (
              <div className="text-center text-gray-500 py-8">No applicants found.</div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRankingStatusModal({ open: false, status: null })}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Workflow Dialog */}
      <Dialog open={statusWorkflowDialog.open} onOpenChange={open => setStatusWorkflowDialog({ open, app: open ? statusWorkflowDialog.app : null, step: open ? statusWorkflowDialog.step : null })}>
        <DialogContent className="max-w-md w-full p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
          </DialogHeader>
          {statusWorkflowDialog.step === 'pending' && statusWorkflowDialog.app && (
            <div className="py-4 text-center text-lg font-semibold">
              Move this application to <span className="text-blue-600 font-bold">Under Review</span>?
            </div>
          )}
          {statusWorkflowDialog.step === 'under_review' && statusWorkflowDialog.app && (
            <div className="py-4 text-center text-lg font-semibold">
              Do you want to <span className="text-green-600 font-bold">Accept</span> or <span className="text-red-600 font-bold">Reject</span> this application?
            </div>
          )}
          <DialogFooter>
            {statusWorkflowDialog.step === 'pending' && statusWorkflowDialog.app && (
              <>
                <Button
                  variant="default"
                  onClick={() => {
                    setApplications(prev => prev.map(a => a.id === statusWorkflowDialog.app!.id ? { ...a, status: 'under_review' } : a));
                    setStatusWorkflowDialog({ open: false, app: null, step: null });
                  }}
                >
                  Move to Under Review
                </Button>
                <Button variant="outline" onClick={() => setStatusWorkflowDialog({ open: false, app: null, step: null })}>Cancel</Button>
              </>
            )}
            {statusWorkflowDialog.step === 'under_review' && statusWorkflowDialog.app && (
              <>
                <Button
                  variant="default"
                  onClick={() => {
                    setApplications(prev => prev.map(a => a.id === statusWorkflowDialog.app!.id ? { ...a, status: 'accepted' } : a));
                    setStatusWorkflowDialog({ open: false, app: null, step: null });
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setApplications(prev => prev.map(a => a.id === statusWorkflowDialog.app!.id ? { ...a, status: 'rejected' } : a));
                    setStatusWorkflowDialog({ open: false, app: null, step: null });
                  }}
                >
                  Reject
                </Button>
                <Button variant="outline" onClick={() => setStatusWorkflowDialog({ open: false, app: null, step: null })}>Cancel</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
 main
    </div>
  )
}

// ScholarshipEditForm component
function ScholarshipEditForm({
  scholarship,
  onSave,
  onCancel,
}: {
  scholarship: Scholarship;
  onSave: (data: Scholarship) => void;
  onCancel: () => void;
}) {
  const form = useForm<Scholarship>({
    defaultValues: {
      name: scholarship.name,
      amount: scholarship.amount,
      deadline: scholarship.deadline,
      status: scholarship.status,
      applicants: scholarship.applicants,
      id: scholarship.id,
    },
  })

  function onSubmit(values: Scholarship) {
    onSave({ ...scholarship, ...values })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField name="name" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="amount" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Amount</FormLabel>
            <FormControl>
 exportfile
              <Input {...field} type="text" inputMode="decimal" pattern="[₱0-9,. ]*" placeholder="₱ 5,000" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="deadline" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Deadline</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="status" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="applicants" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Applicants</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex space-x-2">
          <Button type="submit" className="flex-1">Save</Button>
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Form>
  )
}

// ScholarshipCreateForm component
function ScholarshipCreateForm({ onSave, onCancel, type }: { onSave: (data: Omit<Scholarship, 'id'>) => void, onCancel: () => void, type?: 'Full' | 'Half' }) {
  const form = useForm<Omit<Scholarship, 'id'>>({
    defaultValues: {
      name: "",
      amount: "",
      deadline: "",
      status: "active", // Default status
      applicants: 0,
      type: type || 'Full',
    },
  })

  function onSubmit(values: Omit<Scholarship, 'id'>) {
    onSave({ ...values, type: type || 'Full' })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField name="name" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
 main
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="deadline" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Deadline</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="status" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="applicants" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Applicants</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex space-x-2">
          <Button type="submit" className="flex-1">Save</Button>
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Form>
  )
}
 exportfile

// ApplicationCreateForm component
function ApplicationCreateForm({ onSave, onCancel, scholarships }: { onSave: (data: Omit<Application, 'id' | 'avatar'>) => void, onCancel: () => void, scholarships: Scholarship[] }) {
  const form = useForm<Omit<Application, 'id' | 'avatar'>>({
    defaultValues: {
      name: "",
      region: "",
      email: "",
      scholarship: "",
      amount: "",
      gpa: 0,
      status: "pending",
      submittedDate: "",
      score: null,
    },
  })

  function onSubmit(values: Omit<Application, 'id' | 'avatar'>) {
    onSave(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField name="name" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Applicant Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        {/* Region Dropdown */}
        <FormField name="region" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Region</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Palawan">Palawan</SelectItem>
                  <SelectItem value="Mindoro Occidental">Mindoro Occidental</SelectItem>
                  <SelectItem value="Mindoro Oriental">Mindoro Oriental</SelectItem>
                  <SelectItem value="Marinduque">Marinduque</SelectItem>
                  <SelectItem value="Romblon">Romblon</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="email" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="scholarship" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Scholarship</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a scholarship" />
                </SelectTrigger>
                <SelectContent>
                  {scholarships.map((sch) => (
                    <SelectItem key={sch.id} value={sch.name}>
                      {sch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="amount" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Amount</FormLabel>
            <FormControl>
              <Input {...field} type="number" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="gpa" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>GPA</FormLabel>
            <FormControl>
              <Input {...field} type="number" step="0.01" value={field.value !== null ? field.value : ''} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="status" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="submittedDate" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Submitted Date</FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex space-x-2">
          <Button type="submit" className="flex-1">Create Application</Button>
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Form>
  )
}

// ApplicationReviewForm component
function ApplicationReviewForm({ application, onSave, onCancel }: { application: Application, onSave: (data: { score: number | null, status: string, review: string }) => void, onCancel: () => void }) {
  const form = useForm<{ score: number | null, status: string, review: string }>({
    defaultValues: {
      score: application.score ?? null,
      review: application.review || "",
      status: application.status,
    },
  })

  function onSubmit(values: { score: number | null, status: string, review: string }) {
    onSave(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField name="status" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="review" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Review Comments</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex space-x-2">
          <Button type="submit" className="flex-1">Save Review</Button>
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Form>
  )
}

// SendMessageForm component
function SendMessageForm({ application, onSend, onCancel }: { application: Application, onSend: (data: { recipientEmail: string, subject: string, message: string }) => void, onCancel: () => void }) {
  const form = useForm<{ recipientEmail: string, subject: string, message: string }>({ // Update type
    defaultValues: {
      recipientEmail: application.email,
      subject: "",
      message: "",
    },
  })

  function onSubmit(values: { recipientEmail: string, subject: string, message: string }) {
    onSend(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full"> {/* Added w-full for full width */}
        <FormField name="recipientEmail" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Recipient Email</FormLabel>
            <FormControl>
              <Input {...field} readOnly />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="subject" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Subject</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="message" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Message</FormLabel>
            <FormControl>
              <Textarea {...field} rows={5} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex space-x-2">
          <Button type="submit" className="flex-1">Send Message</Button>
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Form>
  )
}

// ChangePasswordForm component
function ChangePasswordForm({ user, onCancel }: { user: User, onCancel: () => void }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!oldPassword || !newPassword || !retypePassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== retypePassword) {
      setError('New passwords do not match.');
      return;
    }
    // Simulate password change
    setSuccess('Password changed successfully!');
    setTimeout(onCancel, 1200);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Old Password</label>
        <input type="password" className="w-full border rounded p-2" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required placeholder="Enter old password" />
      </div>
      <div>
        <label className="block font-medium mb-1">New Password</label>
        <input type="password" className="w-full border rounded p-2" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Enter new password" />
      </div>
      <div>
        <label className="block font-medium mb-1">Re-type Password</label>
        <input type="password" className="w-full border rounded p-2" value={retypePassword} onChange={e => setRetypePassword(e.target.value)} required placeholder="Re-type new password" />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <div className="flex gap-2 mt-2">
        <button type="submit" className="flex-1 bg-black text-white rounded p-2" disabled={!oldPassword || !newPassword || !retypePassword || newPassword !== retypePassword}>Confirm</button>
        <button type="button" className="flex-1 border rounded p-2" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
 main
