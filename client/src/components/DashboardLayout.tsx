import { useLocation } from 'wouter';
import { 
  Home,
  MessageSquare,
  FolderOpen,
  ArrowLeftRight,
  Settings,
  LogOut,
  User
} from 'lucide-react';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPath: string;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, path, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
        ${active 
          ? 'bg-[#00E0FF]/10 text-[#00E0FF] border border-[#00E0FF]/20' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
        }
      `}
      data-testid={`nav-${path}`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default function DashboardLayout({ children, currentPath }: DashboardLayoutProps) {
  const [, setLocation] = useLocation();

  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Home', path: '/identity/dashboard' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Messages', path: '/messaging' },
    { icon: <FolderOpen className="w-5 h-5" />, label: 'Drive', path: '/drive' },
    { icon: <ArrowLeftRight className="w-5 h-5" />, label: 'Swap', path: '/swap' },
    { icon: <User className="w-5 h-5" />, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Failed to logout:', err);
    }
    
    localStorage.clear();
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>

      <Header />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-60 bg-black/40 backdrop-blur-sm border-r border-white/10 pt-20 z-40">
        <div className="flex flex-col h-full">
          {/* Logo & Brand */}
          <div className="px-4 py-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-black border border-white/10 flex items-center justify-center">
                <img src={zynLogo} alt="Zynexa Logo" className="w-full h-full object-contain p-1" />
              </div>
              <div>
                <h2 className="text-white font-bold">Zynexa</h2>
                <p className="text-xs text-gray-400 font-mono">Private OS</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                active={currentPath === item.path}
                onClick={() => setLocation(item.path)}
              />
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="px-3 py-4 border-t border-white/10 space-y-2">
            <NavItem
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              path="/settings"
              active={currentPath === '/settings'}
              onClick={() => setLocation('/settings')}
            />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
              data-testid="nav-logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all
                ${currentPath === item.path
                  ? 'text-[#00E0FF]'
                  : 'text-gray-500'
                }
              `}
              data-testid={`bottom-nav-${item.path}`}
            >
              <div className={`
                ${currentPath === item.path ? 'scale-110' : 'scale-100'}
                transition-transform
              `}>
                {item.icon}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="lg:ml-60 min-h-screen pt-16 lg:pt-20 pb-20 lg:pb-0">
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}