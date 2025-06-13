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
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Sheet, SheetContent, SheetHeader, SheetFooter, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from "@/components/ui/dialog";

type Scholarship = {
  id: string;
  name: string;
  amount: string;
  deadline: string;
  applicants: number;
  status: string;
};

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
  const [activeTab, setActiveTab] = useState<string>("dashboard")
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit" | null>(null)
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

  const applications = [
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

  // User management state
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userModal, setUserModal] = useState<null | { mode: 'add' | 'edit' | 'role' | 'reset' | 'deactivate', user?: User }>(null);

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" as const },
      under_review: { label: "Under Review", variant: "default" as const },
      approved: { label: "Approved", variant: "default" as const },
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
  }

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
            <Button variant="outline" size="sm" className="flex items-center border-purple-200 text-purple-700">
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
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  New Application
                </Button>
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
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
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
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "ranking" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Application Ranking</h2>
                <p className="text-gray-600">Review and rank scholarship applications by score</p>
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
                          <Input type="number" min="0" max="40" placeholder="0-40" />
                          <span className="text-sm text-gray-500">/40</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="extracurricular">Extracurricular (30%)</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input type="number" min="0" max="30" placeholder="0-30" />
                          <span className="text-sm text-gray-500">/30</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="essay">Essay Quality (20%)</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input type="number" min="0" max="20" placeholder="0-20" />
                          <span className="text-sm text-gray-500">/20</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="financial">Financial Need (10%)</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input type="number" min="0" max="10" placeholder="0-10" />
                          <span className="text-sm text-gray-500">/10</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Total Score</span>
                          <span className="text-2xl font-bold">85</span>
                        </div>
                        <Progress value={85} className="mb-4" />
                        <Textarea placeholder="Add review comments..." className="mb-4" />
                        <Button className="w-full">Save Score & Review</Button>
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
                <Button>
                  <Award className="h-4 w-4 mr-2" />
                  Create Scholarship
                </Button>
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
                  )}
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
                <CardContent className="pt-6">
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
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
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
          {userModal?.mode === 'add' || userModal?.mode === 'edit' ? (
            <UserForm
              user={userModal.mode === 'edit' ? userModal.user : undefined}
              onSave={handleSaveUser}
              onCancel={handleCloseUserModal}
            />
          ) : null}
          {userModal?.mode === 'role' && userModal.user ? (
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
          ) : null}
          {userModal?.mode === 'reset' && userModal.user ? (
            <div>
              <p>Are you sure you want to reset the password for <b>{userModal.user.name}</b>?</p>
              <div className="flex space-x-2 mt-4">
                <Button onClick={() => handleResetPassword(userModal.user!)}>Reset</Button>
                <Button variant="outline" onClick={handleCloseUserModal}>Cancel</Button>
              </div>
            </div>
          ) : null}
          {userModal?.mode === 'deactivate' && userModal.user ? (
            <div>
              <p>Are you sure you want to deactivate <b>{userModal.user.name}</b>?</p>
              <div className="flex space-x-2 mt-4">
                <Button variant="destructive" onClick={() => handleDeactivate(userModal.user!)}>Deactivate</Button>
                <Button variant="outline" onClick={handleCloseUserModal}>Cancel</Button>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
              <Input type="email" {...field} />
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
        <div className="flex space-x-2">
          <Button type="submit" className="flex-1">Save</Button>
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Form>
  );
}
