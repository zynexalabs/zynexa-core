import DashboardLayout from '../components/DashboardLayout';
import { Card } from '../components/ui/card';
import { Globe } from 'lucide-react';

export default function BrowserPage() {
  return (
    <DashboardLayout currentPath="/browser">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] via-white to-[#8A2BE2] mb-2">
            Web3 Browser
          </h1>
          <p className="text-gray-400">Browse the decentralized web anonymously</p>
        </div>

        <Card className="bg-black/40 border-[#00E0FF]/20 backdrop-blur-sm p-8 text-center">
          <Globe className="w-16 h-16 text-[#00E0FF] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Access Web3 applications and dApps securely with built-in privacy protection.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
