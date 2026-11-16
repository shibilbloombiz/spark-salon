import type { Metadata } from 'next';
import './admin.css';

export const metadata: Metadata = {
  title: 'Spark Admin Dashboard',
  description: 'Byju Spark Saloon International Administrative Console',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root" data-admin-root="true">
      {children}
    </div>
  );
}

