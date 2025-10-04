const BASE = import.meta.env.VITE_API_BASE || ''; // leave blank if using vite proxy

// -------- CREATE --------
export async function createBlogPost(input: {
  slug: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  categoryId: number;
  tagIds: number[];
  content: string;
}) {
  const res = await fetch(`${BASE}/api/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to create blog post');
  return data;
}

// -------- LIST --------
export async function listBlogPosts(params?: {
  take?: number;
  skip?: number;
  tagId?: number;
  categoryId?: number;
  search?: string;
  orderByDate?: 'asc' | 'desc';
}) {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) query.append(key, String(val));
    });
  }

  const res = await fetch(`${BASE}/api/blogs?${query.toString()}`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch blog posts');
  return data;
}

// -------- GET BY ID --------
export async function getBlogPostById(id: number) {
  const res = await fetch(`${BASE}/api/blogs/${id}`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch blog post');
  return data;
}

// -------- GET BY SLUG --------
export async function getBlogPostBySlug(slug: string) {
  const res = await fetch(`${BASE}/api/blogs/slug/${encodeURIComponent(slug)}`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch blog post by slug');
  return data;
}

// -------- UPDATE --------
export async function updateBlogPost(
  id: number,  data: any) {
 
  const res = await fetch(`${BASE}/api/blogs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  console.log("Response from backend:", json);
  if (!res.ok) throw new Error(json.error || 'Failed to update blog post');
  return json;
}

// -------- DELETE --------
export async function deleteBlogPost(id: number) {
  const res = await fetch(`${BASE}/api/blogs/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to delete blog post');
  }
  return true;
}
