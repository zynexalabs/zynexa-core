import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { getIdentityFromLocalStorage } from '../lib/crypto';
import DashboardLayout from '../components/DashboardLayout';
import DashboardHome from '../components/dashboard/DashboardHome';

export default function IdentityDashboard() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Simple check - detailed auth check is in root-router
    const storedIdentity = getIdentityFromLocalStorage();
    if (!storedIdentity) {
      setLocation('/identity/login');
    }
  }, [setLocation]);

  return (
    <DashboardLayout currentPath="/identity/dashboard">
      <DashboardHome />
    </DashboardLayout>
  );
}
