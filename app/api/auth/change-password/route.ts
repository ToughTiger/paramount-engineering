export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { authService } from '@/services/authService';

export async function POST(req: Request) {
  const { email, oldPassword, newPassword } = await req.json();
  const result = await authService.changePassword(email, oldPassword, newPassword);
  const status = result?.success ? 200 : 400;
  return NextResponse.json(result, { status });
}
