// src/repositories/categories.ts
import { prisma } from '@/server/lib/prisma';

export async function createCategory(name: string) {
  // make sure name is non-empty
  if (!name?.trim()) {
    const err: any = new Error('Category name is required');
    err.status = 400;
    throw err;
  }

  // optional: enforce uniqueness by name
  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) {
    const err: any = new Error('Category already exists');
    err.status = 409;
    throw err;
  }

  return prisma.category.create({ data: { name } });
}

export async function listCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}

export async function getCategoryById(id: number) {
  return prisma.category.findUnique({ where: { id } });
}

export async function updateCategory(id: number, name: string) {
  if (!name?.trim()) {
    const err: any = new Error('Category name is required');
    err.status = 400;
    throw err;
  }
  return prisma.category.update({ where: { id }, data: { name } });
}

export async function deleteCategory(id: number) {
  return prisma.category.delete({ where: { id } });
}
