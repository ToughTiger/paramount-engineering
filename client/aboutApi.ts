// src/client/aboutApi.ts
const BASE = import.meta.env.VITE_API_BASE || ''; // '' if using Vite proxy

export type AboutDTO = {
  imageUrl: string;
  mission: string;
  bio: string;
};

export async function getAbout() {
  const res = await fetch(`${BASE}/api/about`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch about content');
  return data as AboutDTO;
}

export async function saveAbout(input: AboutDTO) {
  const res = await fetch(`${BASE}/api/about`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    credentials: 'include',
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to save about content');
  return data as AboutDTO;
}
