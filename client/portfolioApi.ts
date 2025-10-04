const BASE = import.meta.env.VITE_API_BASE || ''; // keep '' if using Vite proxy

export type CreatePortfolioDTO = {
  title: string;
  imageUrl: string;
  description: string;
  categoryId: number;
};

export type UpdatePortfolioDTO = Partial<CreatePortfolioDTO>;

// CREATE
export async function createPortfolioItem(input: CreatePortfolioDTO) {
  const res = await fetch(`${BASE}/api/portfolio`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to create portfolio item');
  return data; // includes { category: { id, name, ... } }
}

// LIST
export async function listPortfolioItems(params?: { categoryId?: number; search?: string }) {
  const q = new URLSearchParams();
  if (params) {
    if (params.categoryId !== undefined) q.append('categoryId', String(params.categoryId));
    if (params.search) q.append('search', params.search);
  }
  const res = await fetch(`${BASE}/api/portfolio?${q.toString()}`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch portfolio items');
  return data;
}

// GET BY ID
export async function getPortfolioItemById(id: number) {
  const res = await fetch(`${BASE}/api/portfolio/${id}`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch portfolio item');
  return data;
}

// UPDATE
export async function updatePortfolioItem(id: number, data: UpdatePortfolioDTO) {
  const res = await fetch(`${BASE}/api/portfolio/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Failed to update portfolio item');
  return json;
}

// DELETE
export async function deletePortfolioItem(id: number) {
  const res = await fetch(`${BASE}/api/portfolio/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to delete portfolio item');
  }
  return true;
}
