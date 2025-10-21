export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { listUsers, createUser } from '@/services/userService';

export async function GET() {
  const users = await listUsers();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;
  const user = await createUser(email, password ?? null);
  return NextResponse.json(user, { status: 201 });
}
