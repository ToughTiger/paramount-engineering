// src/repositories/tags.ts
import { prisma } from '@/lib/prisma';

export async function createTag(name: string) {
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
