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

// In-memory user store (shared)
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

export async function GET(req: NextRequest) {
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const newUser: User = {
    ...data,
    id: `USR${users.length + 1}`,
    lastActive: 'Just now',
    status: 'Active',
  };
  users.push(newUser);
  return NextResponse.json(newUser, { status: 201 });
} 