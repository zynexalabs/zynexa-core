import DashboardLayout from '../components/DashboardLayout';
import { Card } from '../components/ui/card';
import { FolderOpen } from 'lucide-react';

export default function DrivePage() {
  return (
    <DashboardLayout currentPath="/drive">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] via-white to-[#8A2BE2] mb-2">
            Encrypted Drive
          </h1>
          <p className="text-gray-400">Secure file storage on the blockchain</p>
        </div>

        <Card className="bg-black/40 border-[#00E0FF]/20 backdrop-blur-sm p-8 text-center">
          <FolderOpen className="w-16 h-16 text-[#00E0FF] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Store and share encrypted files using decentralized storage. Only you can access your data.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
