// src/repositories/categories.ts
import { prisma } from '@/lib/prisma';

export async function createCategory(name: string) {
  return prisma.category.create({ data: { name } });
}

export async function listCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}

export async function getCategoryById(id: number) {
  return prisma.category.findUnique({ where: { id } });
}

export async function updateCategory(id: number, name: string) {
  return prisma.category.update({ where: { id }, data: { name } });
}

export async function deleteCategory(id: number) {
  return prisma.category.delete({ where: { id } });
}
