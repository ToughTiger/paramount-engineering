export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { authService } from '@/services/authService';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await authService.login(email, password);
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, user });
}
