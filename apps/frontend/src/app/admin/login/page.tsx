'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearAdminToken, getAdminToken, loginAdmin, setAdminToken } from '@/lib/auth';
import { DrmButton, DrmInput } from '@/components/ui';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getAdminToken()) router.replace('/admin/dashboard');
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await loginAdmin(email, password);
      setAdminToken(response.accessToken);
      const returnTo = new URLSearchParams(window.location.search).get('returnTo');
      router.replace(returnTo?.startsWith('/admin/') ? returnTo : '/admin/dashboard');
    } catch (loginError) {
      clearAdminToken();
      setError(loginError instanceof Error ? loginError.message : 'Не удалось войти');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-4xl font-black uppercase">Вход администратора</h1>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block">Email</span>
          <DrmInput
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>
        <label className="block">
          <span className="mb-2 block">Пароль</span>
          <DrmInput
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <DrmButton className="button-red" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Входим…' : 'Войти'}
        </DrmButton>
      </form>
    </main>
  );
}
