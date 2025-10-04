const BASE = import.meta.env.VITE_API_BASE || ''; // leave blank if using vite proxy


export const createCategory = async (name: string) => {
  const res = await fetch(`${BASE}/api/categories`, {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name }), 
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Failed to create category');
    return data;
}

export const listCategories = async () => {
  const res = await fetch(`${BASE}/api/categories`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch categories');
  return data;
}

export const getCategoryById = async (id: number) => {
  const res = await fetch(`${BASE}/api/categories/${id}`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch category');
  return data;
}

export const updateCategory = async (id: number, name: string) => {
  const res = await fetch(`${BASE}/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Failed to update category');
    return data;
}

export const deleteCategory = async (id: number) => {
  const res = await fetch(`${BASE}/api/categories/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Failed to delete category');
    return data;
}