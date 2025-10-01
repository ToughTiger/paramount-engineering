// src/repositories/portfolio.ts
import { prisma } from '@/lib/prisma';

type CreatePortfolioInput = {
  title: string;
  imageUrl: string;
  description: string;
  categoryId: number;
};

export async function createPortfolioItem(input: CreatePortfolioInput) {
  return prisma.portfolioItem.create({
    data: {
      title: input.title,
      imageUrl: input.imageUrl,
      description: input.description,
      category: { connect: { id: input.categoryId } },
    },
    include: { category: true },
  });
}

export async function listPortfolioItems(params?: { categoryId?: number; search?: string }) {
  const { categoryId, search } = params ?? {};
  return prisma.portfolioItem.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(search
        ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] }
        : {}),
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPortfolioItemById(id: number) {
  return prisma.portfolioItem.findUnique({ where: { id }, include: { category: true } });
}

export async function updatePortfolioItem(
  id: number,
  data: Partial<CreatePortfolioInput>
) {
  const { categoryId, ...rest } = data;
  return prisma.portfolioItem.update({
    where: { id },
    data: {
      ...(rest.title ? { title: rest.title } : {}),
      ...(rest.imageUrl ? { imageUrl: rest.imageUrl } : {}),
      ...(rest.description ? { description: rest.description } : {}),
      ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
    },
    include: { category: true },
  });
}

export async function deletePortfolioItem(id: number) {
  return prisma.portfolioItem.delete({ where: { id } });
}
