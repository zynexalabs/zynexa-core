import DashboardLayout from '../components/DashboardLayout';
import { Card } from '../components/ui/card';
import { ArrowLeftRight } from 'lucide-react';

export default function SwapPage() {
  return (
    <DashboardLayout currentPath="/swap">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] via-white to-[#8A2BE2] mb-2">
            Stealth Swap
          </h1>
          <p className="text-gray-400">Private token exchange with zero traces</p>
        </div>

        <Card className="bg-black/40 border-[#00E0FF]/20 backdrop-blur-sm p-8 text-center">
          <ArrowLeftRight className="w-16 h-16 text-[#00E0FF] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Trade tokens privately without revealing your identity or transaction history.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
