import { AdminAuthGuard } from '@/components/admin';

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
