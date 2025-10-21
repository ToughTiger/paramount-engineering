// src/repositories/heroSlides.ts
import 'server-only';

import { prisma } from '@/lib/prisma';

type HeroSlideInput = { imageUrl: string; title: string; subtitle: string };

export async function createHeroSlide(input: HeroSlideInput) {
  return prisma.heroSlide.create({ data: input });
}

export async function listHeroSlides() {
  return prisma.heroSlide.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function updateHeroSlide(id: number, data: Partial<HeroSlideInput>) {
  return prisma.heroSlide.update({ where: { id }, data });
}

export async function deleteHeroSlide(id: number) {
  return prisma.heroSlide.delete({ where: { id } });
}
