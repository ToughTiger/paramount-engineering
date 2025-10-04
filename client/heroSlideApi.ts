// src/client/heroSlideApi.ts
const BASE = import.meta.env.VITE_API_BASE || ''; // blank if vite proxy

// -------- CREATE --------
export async function createHeroSlide(input: {
  imageUrl: string;
  title: string;
  subtitle: string;
}) {
  const res = await fetch(`${BASE}/api/hero-slides`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to create hero slide');
  return data;
}

// -------- LIST --------
export async function listHeroSlides() {
  const res = await fetch(`${BASE}/api/hero-slides`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch hero slides');
  return data;
}

// -------- UPDATE --------
export async function updateHeroSlide(
  id: number,
  input: Partial<{ imageUrl: string; title: string; subtitle: string }>
) {
  const res = await fetch(`${BASE}/api/hero-slides/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to update hero slide');
  return data;
}

// -------- DELETE --------
export async function deleteHeroSlide(id: number) {
  const res = await fetch(`${BASE}/api/hero-slides/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to delete hero slide');
  return true;
}
