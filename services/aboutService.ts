// src/repositories/about.ts
import { prisma } from '@/lib/prisma';

type AboutInput = { imageUrl: string; mission: string; bio: string };

export async function upsertAboutContent(input: AboutInput) {
  return prisma.aboutContent.upsert({
    where: { singleton: 1 },
    update: { ...input },
    create: { singleton: 1, ...input },
  });
}

export async function getAboutContent() {
  return prisma.aboutContent.findUnique({ where: { singleton: 1 } });
}
