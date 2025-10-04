const BASE = import.meta.env.VITE_API_BASE || ''; // leave blank if using vite proxy

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data as { id: number; email: string };
}

export async function changePassword(email: string, oldPassword: string, newPassword: string) {
  const res = await fetch(`${BASE}/api/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, oldPassword, newPassword }),
  });
  return (await res.json()) as { success: boolean; message: string };
}
