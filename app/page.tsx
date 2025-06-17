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
  PauseCircle,
  UserX,
  UserPlus,
  Trash2,
  Lock,
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, Sector } from 'recharts';
import { Sheet, SheetContent, SheetHeader, SheetFooter, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
config
import * as DialogPrimitive from "@radix-ui/react-dialog";
=======
import RequirementsChecklist from "@/components/ranking/RequirementsChecklist";
import AddStudentModal from "@/components/ranking/AddStudentModal";
main

interface Scholarship {
  id: string;
  name: string;
  amount: string;
  deadline: string;
  applicants: number;
  status: string;
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
};

export default function Component() {
config
  const [activeTab, setActiveTab] = useState<TabName>("dashboard");
  const [activeTab, setActiveTab] = useState("dashboard");
main
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create" | "createApplication" | "reviewApplication" | "sendMessage" | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [scholarships, setScholarships] = useState<Scholarship[]>([
config
    // Mock data
main
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
  ]);

  // Add sort state for scholarships
  const [scholarshipSort, setScholarshipSort] = useState<string>("deadline_oldest");

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
      region: "Palawan",
      email: "sarah.johnson@email.com",
      scholarship: "Merit Excellence Scholarship",
      amount: "$5,000",
      gpa: 3.9,
      status: "pending",
      submittedDate: "2024-01-15",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "APP002",
      name: "Michael Chen",
      region: "Mindoro Occidental",
      email: "michael.chen@email.com",
      scholarship: "STEM Innovation Grant",
      amount: "$7,500",
      gpa: 3.8,
      status: "under_review",
      submittedDate: "2024-01-14",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "APP003",
      name: "Emily Rodriguez",
      region: "Mindoro Oriental",
      email: "emily.rodriguez@email.com",
      scholarship: "Community Leadership Award",
      amount: "$3,000",
      gpa: 3.7,
      status: "approved",
      submittedDate: "2024-01-12",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "APP004",
      name: "David Kim",
      region: "Marinduque",
      email: "david.kim@email.com",
      scholarship: "Athletic Excellence Scholarship",
      amount: "$4,000",
      gpa: 3.6,
      status: "rejected",
      submittedDate: "2024-01-10",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ])

  // Add status filter state
  const [statusFilter, setStatusFilter] = useState<string>("all");
  // Add scholarship filter state
  const [scholarshipFilter, setScholarshipFilter] = useState<string>("all");
  // Add search query state
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [downloadApplication, setDownloadApplication] = useState<Application | null>(null);

  // User management state
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userModal, setUserModal] = useState<null | { mode: 'add' | 'edit' | 'role' | 'reset' | 'deactivate', user?: User }>(null);

config
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteApplication, setDeleteApplication] = useState<Application | null>(null);
  const [trashBin, setTrashBin] = useState<Application[]>([]);
  const [trashBinOpen, setTrashBinOpen] = useState(false);

  const [rankingDialogOpen, setRankingDialogOpen] = useState(false);
  // Add requirements per scholarship (customizable)
  const scholarshipRequirements: Record<string, string[]> = {
    "Merit Excellence Scholarship": [
      "Birth Certificate",
      "Transcript",
      "Recommendation Letter",
      "Essay",
    ],
    "STEM Innovation Grant": [
      "Transcript",
      "STEM Project Portfolio",
      "Essay",
    ],
    "Community Leadership Award": [
      "Birth Certificate",
      "Community Service Proof",
      "Essay",
    ],
  };

  // Add requirements state to each application
  const [requirementsMap, setRequirementsMap] = useState<Record<string, Record<string, { valid: boolean, falseDoc: boolean }>>>({});
  const [showAddModal, setShowAddModal] = useState(false);

  // Helper to get requirements for a scholarship
  const getRequirements = (scholarship: string) => scholarshipRequirements[scholarship] || [];

  // Add/Remove student handlers
  const handleAddStudent = (student: any) => {
    // If approved slots are full, add as reserve
    if (approved.length >= 102) {
      setApplications((prev) => [...prev, {
        ...student,
        email: "",
        amount: "",
        submittedDate: new Date().toISOString().slice(0, 10),
        status: 'reserve',
      }]);
      setRequirementsMap((prev) => ({ ...prev, [student.id]: student.requirements || {} }));
    } else {
      setApplications((prev) => [...prev, {
        ...student,
        email: "",
        amount: "",
        submittedDate: new Date().toISOString().slice(0, 10),
        status: 'approved',
      }]);
      setRequirementsMap((prev) => ({ ...prev, [student.id]: student.requirements || {} }));
    }
  };
  const handleRemoveStudent = (id: string) => {
    setApplications((prev) => prev.filter((s) => s.id !== id));
    setRequirementsMap((prev) => { const copy = { ...prev }; delete copy[id]; return copy; });
  };
  const handleValidateRequirement = (studentId: string, req: string, value: { valid: boolean; falseDoc: boolean }) => {
    setRequirementsMap((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [req]: value },
    }));
  };

  // Ranking logic: sort by requirements status, then by GPA
  function getRequirementsStatus(studentId: string, requirements: string[]) {
    const reqs = requirementsMap[studentId] || {};
    if (requirements.some(req => reqs[req]?.falseDoc)) return 'Disqualified';
    if (requirements.some(req => !reqs[req]?.valid)) return 'Incomplete';
    return 'Complete';
  }

  const ranked = applications.filter(app => app.gpa !== null && app.gpa !== undefined)
    .map(app => {
      const reqs = getRequirements(app.scholarship);
      const status = getRequirementsStatus(app.id, reqs);
      return { ...app, requirementsStatus: status };
    })
    .sort((a, b) => {
      // Disqualified at the bottom
      if (a.requirementsStatus === 'Disqualified' && b.requirementsStatus !== 'Disqualified') return 1;
      if (a.requirementsStatus !== 'Disqualified' && b.requirementsStatus === 'Disqualified') return -1;
      // Incomplete below complete
      if (a.requirementsStatus === 'Incomplete' && b.requirementsStatus === 'Complete') return 1;
      if (a.requirementsStatus === 'Complete' && b.requirementsStatus === 'Incomplete') return -1;
      // Otherwise, sort by GPA descending
      return (b.gpa || 0) - (a.gpa || 0);
    });

  const approved = ranked.slice(0, 102);
  const reserve = ranked.slice(102, 150);
  const pending = applications.filter(app => app.status === 'pending');
  const rejected = applications.filter(app => app.status === 'rejected');
main

  // Fetch users from API on mount
  useEffect(() => {
    setLoadingUsers(true);
    fetch("/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .finally(() => setLoadingUsers(false));
  }, []);

  // Handlers for user actions
  const handleOpenAddUser = () => setUserModal({ mode: 'add' });
  const handleOpenEditUser = (user: User) => setUserModal({ mode: 'edit', user });
  const handleOpenChangeRole = (user: User) => setUserModal({ mode: 'role', user });
  const handleOpenResetPassword = (user: User) => setUserModal({ mode: 'reset', user });
  const handleOpenDeactivate = (user: User) => setUserModal({ mode: 'deactivate', user });
  const handleCloseUserModal = () => setUserModal(null);

  // Add or edit user
  const handleSaveUser = async (user: User) => {
    if (userModal?.mode === 'add') {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const newUser = await res.json();
      setUsers(prev => [...prev, newUser]);
    } else if (userModal?.mode === 'edit' && userModal.user) {
      const res = await fetch(`/api/users/${userModal.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const updatedUser = await res.json();
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    }
    setUserModal(null);
  };
  // Change role
  const handleChangeRole = async (user: User, newRole: string) => {
    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    const updatedUser = await res.json();
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setUserModal(null);
  };
  // Reset password
  const handleResetPassword = async (user: User) => {
    await fetch(`/api/users/${user.id}`, { method: 'POST' });
    alert(`Password reset for ${user.name}`);
    setUserModal(null);
  };
  // Deactivate
  const handleDeactivate = async (user: User) => {
    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Inactive' }),
    });
    const updatedUser = await res.json();
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setUserModal(null);
  };
  // Reactivate user
  const handleReactivate = async (user: User) => {
    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Active' }),
    });
    const updatedUser = await res.json();
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setUserModal(null);
  };
  // Delete user
  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete ${user.name}? This cannot be undone.`)) return;
    await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
    setUsers(prev => prev.filter(u => u.id !== user.id));
    setUserModal(null);
  };

  const [academic, setAcademic] = useState(0);
  const [extracurricular, setExtracurricular] = useState(0);
  const [essay, setEssay] = useState(0);
  const [financial, setFinancial] = useState(0);
  const [review, setReview] = useState("");

  const totalScore = academic + extracurricular + essay + financial;

  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "pending" as const },
      under_review: { label: "Under Review", variant: "underReview" as const },
      approved: { label: "Approved", variant: "approved" as const },
      rejected: { label: "Rejected", variant: "destructive" as const },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "under_review":
        return <Eye className="h-4 w-4 text-blue-500" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const pieData = [
    { name: 'Total Applications', value: stats.totalApplications },
    { name: 'Pending Review', value: stats.pendingReview },
    { name: 'Approved', value: stats.approved },
    { name: 'Active Scholarships', value: stats.totalScholarships },
  ];
  const pieColors = ['#7C3AED', '#F59E0B', '#10B981', '#EF4444'];
  const ranking = applications
    .filter(app => app.gpa)
    .sort((a, b) => (b.gpa || 0) - (a.gpa || 0));

  // Calculate total value for percentage in center label
  const totalPieValue = pieData.reduce((sum, entry) => sum + entry.value, 0);
  const totalApplicationsPercentage = ((stats.totalApplications / totalPieValue) * 100).toFixed(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1); // Reset active index when mouse leaves
  };

  // Custom center label for the pie chart
  const renderCenterLabel = () => {
    if (activeIndex === -1) {
      // Show only the number, centered
      return (
        <g>
          <text x="50%" y="54%" textAnchor="middle" dominantBaseline="central" fontSize="32" fontWeight="700" fill="#6D28D9" style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.08))' }}>
            {stats.totalApplications}
          </text>
        </g>
      );
    }
    // Show active slice info: value and percent, both centered
    const entry = pieData[activeIndex];
    const percent = ((entry.value / totalPieValue) * 100).toFixed(1);
    return (
      <g>
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontSize="22" fontWeight="600" fill={pieColors[activeIndex]} style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.10))' }}>
          {entry.value}
        </text>
        <text x="50%" y="64%" textAnchor="middle" dominantBaseline="central" fontSize="15" fontWeight="500" fill={pieColors[activeIndex]} style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.10))' }}>
          {percent}%
        </text>
      </g>
    );
  };

  // Animated pop-out effect for active slice
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    const RADIAN = Math.PI / 180;
    // Pop out effect
    const midAngle = (startAngle + endAngle) / 2;
    const offset = 12;
    const x = cx + Math.cos(-midAngle * RADIAN) * offset;
    const y = cy + Math.sin(-midAngle * RADIAN) * offset;
    return (
      <g>
        <Sector
          cx={x}
          cy={y}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  // Handler for saving scholarship edits
  function handleSaveScholarship(data: Scholarship) {
    if (!selectedScholarship) return;
    const currentScholarship = selectedScholarship; // Introduce a local variable to narrow the type
    setScholarships((prev) =>
      prev.map((sch) =>
        sch.id === currentScholarship.id ? { ...sch, ...data } : sch
      )
    )
    setModalMode(null)
    setSelectedScholarship(null)
  }

  // --- Cleaned Export Handler ---
  const handleExport = () => {
    const headers = ['ID', 'Name', 'Email', 'Scholarship', 'Amount', 'GPA', 'Status', 'Submitted Date'];
    const csvData = applications.map(app => [
      app.id,
      app.name,
      app.email,
      app.scholarship,
      app.amount,
      app.gpa,
      app.status,
      app.submittedDate
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
  // Handler for creating new scholarship
  function handleCreateScholarship(data: Omit<Scholarship, 'id'>) {
    const newId = `SCH00${scholarships.length + 1}`; // Simple ID generation
    setScholarships((prev) => [
      ...prev,
      { id: newId, ...data, applicants: parseInt(data.applicants.toString()), amount: `$${data.amount}` },
    ]);
    setModalMode(null);
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

config
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed top-0 w-full z-10">
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
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex mt-[64px] min-h-[calc(100vh-64px)] bg-[#F4F0FA] overflow-y-auto">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 fixed top-[64px] left-0 h-[calc(100vh-64px)] overflow-y-auto z-30 shadow-lg">
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
        <main className="flex-1 p-8 ml-64 overflow-x-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-purple-700">Admin Dashboard</h2>
              </div>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-700">Total Applications</CardTitle>
                    <FileText className="h-6 w-6 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalApplications}</div>
                  </CardContent>
                </Card>
                <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-700">Pending Review</CardTitle>
                    <Clock className="h-6 w-6 text-indigo-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.pendingReview}</div>
                  </CardContent>
                </Card>
                <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-700">Approved</CardTitle>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.approved}</div>
                  </CardContent>
                </Card>
                <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-700">Active Scholarships</CardTitle>
                    <Award className="h-6 w-6 text-teal-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalScholarships}</div>
                  </CardContent>
                </Card>
              </div>
              {/* Charts and Ranking */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <Card className="lg:col-span-1 bg-white border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Applications Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[450px] relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={130}
                            paddingAngle={3}
                            cornerRadius={8}
                            labelLine={false}
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            onMouseEnter={onPieEnter}
                            onMouseLeave={onPieLeave}
                            isAnimationActive={true}
                            animationDuration={900}
                            animationEasing="ease-out"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} stroke="#fff" strokeWidth={2} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Floating card/tooltip for hovered slice */}
                      {activeIndex !== -1 && (() => {
                        // Calculate the position for the floating card
                        const entry = pieData[activeIndex];
                        const chartWidth = 650; // Approximate width of ResponsiveContainer
                        const chartHeight = 450; // Height of chart
                        const cx = chartWidth / 2;
                        const cy = chartHeight / 2;
                        const outerRadius = 130;
                        const total = pieData.reduce((sum, e) => sum + e.value, 0);
                        const percent = ((entry.value / total) * 100).toFixed(1);
                        // Calculate midAngle for the hovered slice
                        let startAngle = 0;
                        for (let i = 0; i < activeIndex; i++) {
                          startAngle += (pieData[i].value / total) * 360;
                        }
                        const sliceAngle = (entry.value / total) * 360;
                        const midAngle = startAngle + sliceAngle / 2;
                        const RADIAN = Math.PI / 180;
                        // Place tooltip just outside the arc, offset for better visibility
                        const r = outerRadius + 36;
                        let x = cx + Math.cos(-midAngle * RADIAN) * r;
                        let y = cy + Math.sin(-midAngle * RADIAN) * r;
                        // Clamp x to avoid overflow
                        const minX = 80, maxX = chartWidth - 80;
                        x = Math.max(minX, Math.min(x, maxX));
                        // Tooltip styling
                        return (
                          <div
                            style={{
                              position: 'absolute',
                              left: x,
                              top: y,
                              transform: 'translate(-50%, -10px)',
                              zIndex: 10,
                              pointerEvents: 'none',
                              minWidth: 90,
                            }}
                          >
                            <div
                              className="rounded-xl shadow-xl px-5 py-3 border border-gray-200 text-center animate-fade-in"
                              style={{
                                background: 'white',
                                boxShadow: '0 6px 24px 0 rgba(80, 80, 80, 0.13)',
                                borderTop: `4px solid ${pieColors[activeIndex]}`,
                                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))',
                              }}
                            >
                              <div className="text-lg font-bold mb-1" style={{ color: pieColors[activeIndex] }}>{entry.value}</div>
                              <div className="text-xs font-semibold text-gray-700">{percent}%</div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    {/* Custom Legend - inside the Card, below the chart */}
                    <div className="flex flex-wrap justify-center gap-6 mt-6 px-2 pb-2">
                      {pieData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center space-x-2">
                          <span className="inline-block w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: pieColors[index % pieColors.length] }}></span>
                          <span className="text-sm font-medium text-gray-700">{entry.name}:</span>
                          <span className="text-sm text-gray-900 font-semibold">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                {/* Ranking Table (replace with BarChart) */}
                <Card className="lg:col-span-1 bg-white border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Student Ranking (by GWA)</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                          {ranking.slice(0, 7).map((app, idx) => (
                            <TableRow key={app.id}>
                              <TableCell className="font-bold">{idx + 1}</TableCell>
                              <TableCell>{app.name}</TableCell>
                              <TableCell className="text-right">{app.gpa?.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <Button className="mt-4 w-full max-w-xs" variant="outline" onClick={() => setActiveTab("ranking")}>
                        See more
                      </Button>
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
                <div className="flex items-center space-x-4"> {/* Added a div to group buttons */}
                  <Button variant="outline" onClick={() => setTrashBinOpen(true)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Trash Bin {trashBin.length > 0 && <span className="ml-1">({trashBin.length})</span>}
                  </Button>
                  <Button onClick={() => setModalMode("createApplication")}>
                    <FileText className="h-4 w-4 mr-2" />
                    New Application
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="pt-6 overflow-x-auto">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search applications..."
                          className="pl-10 border border-gray-300 hover:border-purple-500 focus:border-purple-600 focus:border-2 hover:border focus:outline-none transition-colors"
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
              <Card>
                <CardContent className="pt-6 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Scholarship</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>GPA</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
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
                          <TableRow key={app.id} className="focus:outline-none">
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
                              </div>
                            </TableCell>
                            <TableCell>{app.region}</TableCell>
                            <TableCell>{app.scholarship}</TableCell>
                            <TableCell>{app.amount}</TableCell>
                            <TableCell>{app.gpa}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(app.status)}
                                {getStatusBadge(app.status)}
                              </div>
config
                            </TableCell>
                            <TableCell>
                              {app.score !== null && app.score !== undefined ? (
                                <div className="flex flex-col items-start gap-1">
                                  <span className="font-medium">{app.score}</span>
                                  <Progress value={app.score} className="h-2 w-24" indicatorClassName={getScoreColor(app.score || 0)} />
                                </div>
                              ) : (
                                <span className="text-gray-400">Not scored</span>
                              )}
main
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
                    <div className="space-y-2 text-sm mb-4">
                      <p><strong>Applicant Name:</strong> {selectedApplication.name}</p>
                      <p><strong>Region:</strong> {selectedApplication.region}</p>
                      <p><strong>Email:</strong> {selectedApplication.email}</p>
                      <p><strong>Scholarship:</strong> {selectedApplication.scholarship}</p>
                      <p><strong>Amount:</strong> {selectedApplication.amount}</p>
                      <p><strong>GPA:</strong> {selectedApplication.gpa}</p>
                      <p><strong>Status:</strong> {selectedApplication.status}</p>
                      <p><strong>Score:</strong> {selectedApplication.score ?? "N/A"}</p>
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
                    <div className="space-y-4">
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
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setTrashBinOpen(false)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === "ranking" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Application Ranking</h2>
                <p className="text-gray-600">Review and rank scholarship applications by GWA (GPA)</p>
              </div>
              {/* Slot Summary */}
              <div className="flex gap-4 mb-4">
                <Card className="flex-1 text-center"><CardContent className="py-2"><div className="font-bold text-lg">{approved.length} / 102</div><div className="text-green-700">Approved</div></CardContent></Card>
                <Card className="flex-1 text-center"><CardContent className="py-2"><div className="font-bold text-lg">{reserve.length} / 48</div><div className="text-yellow-700">Reserve</div></CardContent></Card>
                <Card className="flex-1 text-center"><CardContent className="py-2"><div className="font-bold text-lg">{pending.length}</div><div className="text-orange-700">Pending</div></CardContent></Card>
                <Card className="flex-1 text-center"><CardContent className="py-2"><div className="font-bold text-lg">{rejected.length}</div><div className="text-red-700">Rejected</div></CardContent></Card>
              </div>
              <Button className="mb-4" onClick={() => setShowAddModal(true)}>Reserve Slot</Button>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ranking List */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Merit Excellence Scholarship Rankings</CardTitle>
                      <CardDescription>Applications ranked by GWA (GPA)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[...approved, ...reserve].map((app, index) => (
                          <div
                            key={app.id}
                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-purple-50 ${selectedStudentId === app.id ? 'ring-2 ring-purple-400' : ''}`}
                            onClick={() => setSelectedStudentId(app.id)}
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${index < 102 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{index + 1}</div>
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
                              {getStatusBadge(app.status)}
                              <Button size="sm" variant="destructive" onClick={e => { e.stopPropagation(); handleRemoveStudent(app.id); }}>Remove</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {/* Requirements Panel shows for selected student only */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Requirements Info</CardTitle>
                      <CardDescription>View and validate required documents for the selected student</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {selectedStudentId ? (
                        <RequirementsChecklist
                          requirements={getRequirements(applications.find(a => a.id === selectedStudentId)?.scholarship || '')}
                          validated={requirementsMap[selectedStudentId] || {}}
                          onValidate={(req, value) => handleValidateRequirement(selectedStudentId, req, value)}
                        />
                      ) : (
                        <p className="text-gray-600 text-sm">Select a student to view their requirements.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              <AddStudentModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={student => {
                  handleAddStudent(student);
                  setSelectedStudentId(student.id);
                }}
                scholarships={Object.entries(scholarshipRequirements).map(([id, reqs], idx) => ({ id: `SCH${idx + 1}`, name: id, requirements: reqs }))}
              />
            </div>
          )}

          {activeTab === "scholarships" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Scholarships</h2>
                  <p className="text-gray-600">Manage scholarship programs and deadlines</p>
                </div>
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
                  <Button onClick={() => setModalMode("create")}> 
                    <Award className="h-4 w-4 mr-2" />
                    Create Scholarship
                  </Button>
                </div>
              </div>
              {/* Sort scholarships according to selected sort */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scholarships
                  .slice()
                  // Filter for status if needed
                  .filter(sch => {
                    if (scholarshipSort === "status_active") {
                      return sch.status === "active";
                    } else if (scholarshipSort === "status_closed") {
                      return sch.status === "closed";
                    }
                    return true;
                  })
                  // Sort for other options
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
                    <Card key={scholarship.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{scholarship.name}</CardTitle>
                          {scholarship.status === "active" ? (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700"><CheckCircle className="h-4 w-4 mr-1 text-green-500" /> Active</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-700"><Lock className="h-4 w-4 mr-1 text-red-500" /> Closed</span>
                          )}
                        </div>
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
                            <Button variant="destructive" size="sm" className="flex-1 flex items-center justify-center gap-1" onClick={() => handleRemoveScholarship(scholarship.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span>Remove</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              {/* Scholarship View/Edit Modal */}
              <Dialog open={!!modalMode && modalMode !== "createApplication"} onOpenChange={() => { setModalMode(null); setSelectedScholarship(null); }}>
                <DialogContent className="max-w-md w-full p-6 max-h-[80vh] overflow-y-auto rounded-xl">
                  <DialogHeader>
                    <DialogTitle>{modalMode === "view" ? "View Scholarship" : modalMode === "edit" ? "Edit Scholarship" : "Create New Scholarship"}</DialogTitle>
                  </DialogHeader>
                  {selectedScholarship && modalMode !== "create" ? (
                    <div>
                      {modalMode === "view" && selectedScholarship ? (
                        <div className="space-y-2">
                          <p><strong>Name:</strong> {selectedScholarship.name}</p>
                          <p><strong>Amount:</strong> {formatPeso(selectedScholarship.amount)}</p>
                          <p><strong>Deadline:</strong> {selectedScholarship.deadline}</p>
                          <p><strong>Status:</strong> {selectedScholarship.status}</p>
                          <p><strong>Applicants:</strong> {selectedScholarship.applicants}</p>
                        </div>
                      ) : (
                        <ScholarshipEditForm scholarship={selectedScholarship} onSave={handleSaveScholarship} onCancel={() => { setModalMode(null); setSelectedScholarship(null); }} />
                      )}
                    </div>
                  ) : modalMode === "create" ? (
                    <ScholarshipCreateForm onSave={handleCreateScholarship} onCancel={() => setModalMode(null)} />
                  ) : null}
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
                <Button onClick={handleOpenAddUser}>
                  <Users className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>

              <Card>
                {loadingUsers ? (
                  <div className="text-center py-8">Loading users...</div>
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
                            {user.status === 'Active' && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {user.status === 'Inactive' && <PauseCircle className="h-4 w-4 text-gray-400" />}
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
                              <DropdownMenuItem onClick={() => handleOpenEditUser(user)}>Edit User</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenChangeRole(user)}>Change Role</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenResetPassword(user)}>Reset Password</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === 'Active' ? (
                                <DropdownMenuItem className="text-red-600" onClick={() => handleOpenDeactivate(user)}>
                                  <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                  Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-600" onClick={() => handleReactivate(user)}>
                                  <UserPlus className="h-4 w-4 mr-2 text-green-600" />
                                  Reactivate
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user)}>
                                <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                )}
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
    </div>
  )
}

// ScholarshipEditForm component
function ScholarshipEditForm({ scholarship, onSave, onCancel }: { scholarship: Scholarship, onSave: (data: Scholarship) => void, onCancel: () => void }) {
  const form = useForm<Omit<Scholarship, 'id'>>({
    defaultValues: {
      name: scholarship.name,
config
      amount: scholarship.amount.replace('$', ''),
=======
      amount: scholarship.amount.replace(/[^\d.,₱]/g, ''), // Remove all except digits, dot, comma, peso
main
      deadline: scholarship.deadline,
      status: scholarship.status,
      applicants: scholarship.applicants,
    },
  })

  function onSubmit(values: Omit<Scholarship, 'id'>) {
config
    onSave({ ...scholarship, ...values, amount: `$${values.amount}` }) // Add '$' back on save
=======
    onSave({ ...scholarship, ...values, amount: values.amount })
main
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
function ScholarshipCreateForm({ onSave, onCancel }: { onSave: (data: Omit<Scholarship, 'id'>) => void, onCancel: () => void }) {
  const form = useForm<Omit<Scholarship, 'id'>>({
    defaultValues: {
      name: "",
      amount: "",
      deadline: "",
      status: "active", // Default status
      applicants: 0,
    },
  })

  function onSubmit(values: Omit<Scholarship, 'id'>) {
    onSave(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
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
              <Input {...field} type="number" />
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
          <Button type="submit" className="flex-1">Create</Button>
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Form>
  )
}

// UserForm component
function UserForm({ user, onSave, onCancel }: { user?: User, onSave: (user: User) => void, onCancel: () => void }) {
  const form = useForm<User>({
    defaultValues: user || { name: '', email: '', role: 'Staff', department: '', lastActive: 'Just now', status: 'Active', id: '' },
  });
  function onSubmit(values: User) {
    onSave({ ...user, ...values, id: user?.id || '' });
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
        <FormField name="email" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="role" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <FormControl>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="department" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Department</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="lastActive" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Last Active</FormLabel>
            <FormControl>
              <Input {...field} type="datetime-local" />
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
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
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
config
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
main
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
config
              <Input {...field} type="number" step="0.01" value={field.value !== null ? field.value : ''} />
              <Input {...field} type="number" step="0.01" value={field.value !== null ? field.value : ''} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} />
main
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
config
        <FormField name="score" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Score</FormLabel>
            <FormControl>
              <ProgressBarInput
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
main
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
  const form = useForm<{ score: number | null, status: string, review: string }>({ // Update type
    defaultValues: {
      review: application.review || "", // Initialize with existing review
      status: application.status, // Initialize with existing status
    },
  })

  function onSubmit(values: { score: number | null, status: string, review: string }) {
    onSave(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full"> {/* Added w-full for full width */}
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
config
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
        <input type="password" className="w-full border rounded p-2" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
      </div>
      <div>
        <label className="block font-medium mb-1">New Password</label>
        <input type="password" className="w-full border rounded p-2" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
      </div>
      <div>
        <label className="block font-medium mb-1">Re-type Password</label>
        <input type="password" className="w-full border rounded p-2" value={retypePassword} onChange={e => setRetypePassword(e.target.value)} required />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <div className="flex gap-2 mt-2">
        <button type="submit" className="flex-1 bg-black text-white rounded p-2" disabled={!oldPassword || !newPassword || !retypePassword || newPassword !== retypePassword}>Confirm</button>
        <button type="button" className="flex-1 border rounded p-2" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
main
}
