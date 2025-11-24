import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { getIdentityFromLocalStorage } from '../lib/crypto';
import { Lock, Server, Zap, Globe, MessageSquare, HardDrive, RefreshCw, LogOut, Shield } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Header from '../components/Header';

export default function Dashboard() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const identity = getIdentityFromLocalStorage();
    if (!identity) {
      setLocation('/identity');
    }
  }, [setLocation]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('zk_identity');
      setLocation('/');
    }
  };

  const identity = getIdentityFromLocalStorage();
  if (!identity) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>

      <Header />

      <div className="relative z-10 pt-24">
        {/* Identity Actions */}
        <div className="border-b border-white/10 bg-black/50 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex items-center justify-end gap-3">
            <Button
              onClick={() => setLocation('/identity/dashboard')}
              variant="outline"
              size="sm"
              className="border-cyan-500/20 hover:border-cyan-500/40"
              data-testid="button-view-identity"
            >
              <Shield className="w-4 h-4 mr-2" />
              Identity
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-red-500/20 hover:border-red-500/40 text-red-400"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Your Private Workspace</h2>
            <p className="text-gray-400">
              Access all Zynexa features from one secure dashboard
            </p>
          </div>

          {/* App Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AppCard
              title="Private Messaging"
              description="End-to-end encrypted messaging with on-chain verification"
              icon={MessageSquare}
              href="/messaging"
              color="cyan"
            />
            <AppCard
              title="Encrypted Drive"
              description="Decentralized file storage with zero-knowledge encryption"
              icon={HardDrive}
              href="/drive"
              color="blue"
            />
            <AppCard
              title="Stealth Swap"
              description="MEV-protected token swaps via stealth addresses"
              icon={RefreshCw}
              href="/swap"
              color="purple"
            />
            <AppCard
              title="Anon Browser"
              description="Privacy-first browsing with Tor routing"
              icon={Globe}
              href="/browser"
              color="pink"
            />
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label="Network Status"
              value="ONLINE"
              color="green"
            />
            <StatCard
              label="Encryption"
              value="AES-256-GCM"
              color="cyan"
            />
            <StatCard
              label="Identity"
              value="Verified"
              color="purple"
            />
          </div>
        </main>
      </div>
    </div>
  );
}

interface AppCardProps {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: 'cyan' | 'blue' | 'purple' | 'pink';
}

function AppCard({ title, description, icon: Icon, href, color }: AppCardProps) {
  const colors = {
    cyan: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/20',
    blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:border-blue-500/40 hover:shadow-blue-500/20',
    purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/20',
    pink: 'from-pink-500/10 to-pink-500/5 border-pink-500/20 hover:border-pink-500/40 hover:shadow-pink-500/20',
  };

  const iconColors = {
    cyan: 'text-cyan-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400',
  };

  return (
    <a href={href}>
      <Card className={`bg-gradient-to-br ${colors[color]} backdrop-blur-sm p-6 h-full hover:shadow-xl transition-all cursor-pointer group`}>
        <div className="flex flex-col h-full">
          <div className={`w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center mb-4 ${iconColors[color]} group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 text-sm flex-1">
            {description}
          </p>
          <div className="mt-4 flex items-center text-cyan-400 text-sm font-mono">
            <span>LAUNCH</span>
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </Card>
    </a>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  color: 'green' | 'cyan' | 'purple';
}

function StatCard({ label, value, color }: StatCardProps) {
  const colors = {
    green: 'text-green-400 border-green-500/20',
    cyan: 'text-cyan-400 border-cyan-500/20',
    purple: 'text-purple-400 border-purple-500/20',
  };

  const dotColors = {
    green: 'bg-green-500',
    cyan: 'bg-cyan-500',
    purple: 'bg-purple-500',
  };

  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${dotColors[color]} animate-pulse`}></div>
      </div>
    </Card>
  );
}

// feat: implement dashboard and feature pages
