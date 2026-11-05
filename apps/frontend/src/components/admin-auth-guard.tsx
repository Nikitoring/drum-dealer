'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearAdminToken, getAdminToken, validateAdminToken } from '@/lib/auth';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const [authorized, setAuthorized] = useState(isLoginPage);

  useEffect(() => {
    const hasToken = Boolean(getAdminToken());

    if (isLoginPage) {
      setAuthorized(true);
      return;
    }

    if (!hasToken) {
      router.replace(`/admin/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }

    let active = true;
    void validateAdminToken()
      .then(() => {
        if (active) setAuthorized(true);
      })
      .catch(() => {
        clearAdminToken();
        if (active) router.replace(`/admin/login?returnTo=${encodeURIComponent(pathname)}`);
      });

    return () => {
      active = false;
    };
  }, [isLoginPage, pathname, router]);

  if (!authorized) return null;
  return children;
}
