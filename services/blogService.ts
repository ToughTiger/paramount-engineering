// src/repositories/blogPosts.ts
import 'server-only';
import { prisma } from '@/lib/prisma';

type CreateBlogPostInput = {
  slug: string;
  title: string;
  author: string;
  dateISO: string;      // ISO string
  imageUrl: string;
  categoryId: number;
  tagIds: number[];     // tag ids
  content: string;
};

export async function createBlogPost(input: CreateBlogPostInput) {
  const { slug, title, author, dateISO, imageUrl, categoryId, tagIds, content } = input;

  return prisma.blogPost.create({
    data: {
      slug,
      title,
      author,
      date: new Date(dateISO),
      imageUrl,
      content,
      category: { connect: { id: categoryId } },
      tags: {
        create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
      },
    },
    include: { category: true, tags: { include: { tag: true } } },
  });
}

export async function listBlogPosts(params?: {
  take?: number;
  skip?: number;
  tagId?: number;
  categoryId?: number;
  search?: string;
  orderByDate?: 'asc' | 'desc';
}) {
  const { take, skip, tagId, categoryId, search, orderByDate = 'desc' } = params ?? {};

  return prisma.blogPost.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(tagId ? { tags: { some: { tagId } } } : {}),
      ...(search
        ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { content: { contains: search, mode: 'insensitive' } }] }
        : {}),
    },
    include: { category: true, tags: { include: { tag: true } } },
    orderBy: { date: orderByDate },
    take,
    skip,
  });
}

export async function getBlogPostById(id: number) {
  return prisma.blogPost.findUnique({
    where: { id },
    include: { category: true, tags: { include: { tag: true } } },
  });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true, tags: { include: { tag: true } } },
  });
}

export async function updateBlogPost(
  id: number,
  data: Partial<Omit<CreateBlogPostInput, 'tagIds' | 'dateISO'>> & { tagIds?: number[]; dateISO?: string }
) {
  const { tagIds, dateISO, categoryId, ...rest } = data;

  return prisma.blogPost.update({
    where: { id },
    data: {
      ...(rest.slug ? { slug: rest.slug } : {}),
      ...(rest.title ? { title: rest.title } : {}),
      ...(rest.author ? { author: rest.author } : {}),
      ...(dateISO ? { date: new Date(dateISO) } : {}),
      ...(rest.imageUrl ? { imageUrl: rest.imageUrl } : {}),
      ...(rest.content ? { content: rest.content } : {}),
      ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
      ...(tagIds
        ? {
            tags: {
              deleteMany: {}, // remove all and re-add (simple approach)
              create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
            },
          }
        : {}),
    },
    include: { category: true, tags: { include: { tag: true } } },
  });
}

export async function deleteBlogPost(id: number) {
  return prisma.blogPost.delete({ where: { id } });
}
