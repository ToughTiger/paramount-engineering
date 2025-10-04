// src/repositories/tags.ts
import { prisma } from '@/server/lib/prisma';

export async function createTag(name: string) {
  // make sure name is non-empty
  if (!name?.trim()) {
    const err: any = new Error('Tag name is required');
    err.status = 400;
    throw err;
  }
  // optional: enforce uniqueness by name
  const existing = await prisma.tag.findUnique({ where: { name } });
  return prisma.tag.create({ data: { name } });
}

export async function listTags() {
  
  return prisma.tag.findMany({ orderBy: { name: 'asc' } });
}

export async function getTagById(id: number) {
  return prisma.tag.findUnique({ where: { id } });
}

export async function updateTag(id: number, name: string) {
  return prisma.tag.update({ where: { id }, data: { name } });
}

export async function deleteTag(id: number) {
  return prisma.tag.delete({ where: { id } });
}
