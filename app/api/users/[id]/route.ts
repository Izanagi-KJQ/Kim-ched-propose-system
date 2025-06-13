import { NextRequest, NextResponse } from 'next/server';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  lastActive: string;
  status: string;
};

// Import users array from the root users route (simulate shared memory)
// In a real app, use a database or a shared module
if (!(globalThis as any).__users) {
  (globalThis as any).__users = [
    {
      id: 'USR001',
      name: 'John Doe',
      email: 'john.doe@university.edu',
      role: 'Administrator',
      department: 'Financial Aid',
      lastActive: '2 hours ago',
      status: 'Active',
    },
  ];
}
let users: User[] = (globalThis as any).__users;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();
  const idx = users.findIndex((u: User) => u.id === id);
  if (idx === -1) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  users[idx] = { ...users[idx], ...data };
  return NextResponse.json(users[idx]);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();
  const idx = users.findIndex((u: User) => u.id === id);
  if (idx === -1) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  // PATCH for role or deactivate
  if (data.role) users[idx].role = data.role;
  if (data.status) users[idx].status = data.status;
  return NextResponse.json(users[idx]);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  // For reset password
  const { id } = params;
  const idx = users.findIndex((u: User) => u.id === id);
  if (idx === -1) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  // Simulate password reset
  return NextResponse.json({ message: `Password reset for ${users[idx].name}` });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const idx = users.findIndex((u: User) => u.id === id);
  if (idx === -1) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  users.splice(idx, 1);
  return NextResponse.json({ message: 'User deleted' });
} 