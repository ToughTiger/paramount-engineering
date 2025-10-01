// src/repositories/users.ts
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function createUser(email: string, password: string | null = null) {
  const passwordHash = password ? await bcrypt.hash(password, 10) : null;
  return prisma.user.create({ data: { email, passwordHash } });
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({ where: { id }, select: { id: true, email: true } });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function listUsers() {
  return prisma.user.findMany({ select: { id: true, email: true }, orderBy: { id: 'asc' } });
}
