// src/repositories/blogPosts.ts
import { prisma } from '@/server/lib/prisma';

type CreateBlogPostInput = {
  slug: string;
  title: string;
  author: string;
  date: string;      // ISO string
  imageUrl: string;
  categoryId: number;
  tagIds: number[];     // tag ids
  content: string;
};

export async function createBlogPost(input: CreateBlogPostInput) {
  const { slug, title, author, date, imageUrl, categoryId, tagIds, content } = input;

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    // throw a typed error that the route can map to 400
    const err: any = new Error(`Category ${categoryId} not found`);
    err.status = 400;
    throw err;
  }

  const uniqueTagIds = Array.from(new Set(tagIds ?? []));
  if (uniqueTagIds.length) {
    const foundTags = await prisma.tag.findMany({ where: { id: { in: uniqueTagIds } }, select: { id: true } });
    const foundIds = new Set(foundTags.map(t => t.id));
    const missing = uniqueTagIds.filter(id => !foundIds.has(id));
    if (missing.length) {
      const err: any = new Error(`Tag(s) not found: ${missing.join(', ')}`);
      err.status = 400;
      throw err;
    }
  }

  return prisma.blogPost.create({
    data: {
      slug,
      title,
      author,
      date: new Date(date),
      imageUrl,
      content,
      category: { connect: { id: categoryId } },
      tags: {
        create: tagIds.map((tag) => ({ tag: { connect: { id: tag } } })),
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
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;
  if (!Number.isInteger(numericId)) {
    throw new Error(`Invalid blog post id: ${id}`);
  }
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
      ...(typeof categoryId === 'number'
        ? { category: { connect: { id: categoryId } } } // ✅ only number
        : {}),
        ...(Array.isArray(tagIds)
        ? {
            tags: {
              deleteMany: {}, // clear old relations
              create: tagIds.map(tagId => ({
                tag: { connect: { id: tagId } }, // ✅ only number
              })),
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
