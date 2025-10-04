const BASE = import.meta.env.VITE_API_BASE || ''; // leave blank if using vite proxy

export const createTag = async (name: string) => {
  const res = await fetch(`${BASE}/api/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Failed to create tag');
    return data;
}

export const listTags = async () => {
  const res = await fetch(`${BASE}/api/tags`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch tags');
  return data;
}

export const getTagById = async (id: number) => {
  const res = await fetch(`${BASE}/api/tags/${id}`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch tag');
  return data;
}

export const updateTag = async (id: number, name: string) => {
  const res = await fetch(`${BASE}/api/tags/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Failed to update tag');
    return data;
}

export const deleteTag = async (id: number) => {
  const res = await fetch(`${BASE}/api/tags/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Failed to delete tag');
    return data;
}

