import Header from "@/components/Header";
import { CheckCircle2, Circle, Loader2, Rocket, Shield, Zap, Globe, Users, Code } from "lucide-react";

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
      
      <Header />
      
      <div className="relative z-10 pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#00E0FF]/5 border border-[#00E0FF]/20 rounded-full px-4 py-2 text-xs font-mono text-[#00E0FF] mb-6">
              PRODUCT ROADMAP
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] via-white to-[#8A2BE2]">
              Development Milestones
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our journey from core privacy infrastructure to full-scale Web3 operating system.
            </p>
          </div>

          {/* Progress Overview */}
          <div className="mb-16">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <StatCard value="8" label="Completed" color="green" />
              <StatCard value="1" label="In Progress" color="cyan" />
              <StatCard value="15" label="Planned" color="purple" />
            </div>
            <div className="bg-black/40 border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Overall Progress</span>
                <span className="text-sm font-mono text-[#00E0FF]">35%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2] h-full rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>

          {/* Milestone Phases */}
          <div className="space-y-8">
            <MilestonePhase 
              icon={Shield}
              phase="Foundation"
              status="completed"
              progress={100}
              description="Core privacy infrastructure and identity system"
              milestones={[
                { title: "Zero-Knowledge Identity System", status: "completed", description: "Browser-generated Ed25519 keypairs with password encryption" },
                { title: "PostgreSQL Database Infrastructure", status: "completed", description: "Serverless database with Drizzle ORM" },
                { title: "Landing Pages & Branding", status: "completed", description: "Multi-subdomain architecture with cyberpunk design" },
                { title: "Solana Blockchain Integration", status: "completed", description: "On-chain identity verification on Solana Mainnet" }
              ]}
            />

            <MilestonePhase 
              icon={Rocket}
              phase="Core Features"
              status="completed"
              progress={100}
              description="Privacy-focused communication and storage modules"
              milestones={[
                { title: "End-to-End Encrypted Messaging", status: "completed", description: "Signal Protocol with perfect forward secrecy" },
                { title: "Private Drive Storage", status: "completed", description: "Client-side encrypted IPFS file storage" },
                { title: "Stealth Swap Integration", status: "completed", description: "MEV-protected DEX swaps with stealth addresses" },
                { title: "User Dashboard Enhancement", status: "completed", description: "Comprehensive feature management interface" }
              ]}
            />

            <MilestonePhase 
              icon={Zap}
              phase="Platform Expansion"
              status="planned"
              progress={0}
              description="Multi-platform support and enhanced accessibility"
              milestones={[
                { title: "Mobile Applications", status: "planned", description: "Native iOS & Android apps with biometric auth" },
                { title: "Browser Extension", status: "planned", description: "Chrome/Firefox extension for seamless Web3" },
                { title: "Progressive Web App", status: "planned", description: "Offline-capable PWA for desktop & mobile" },
                { title: "Security Audit", status: "planned", description: "Third-party cryptography & smart contract audit" }
              ]}
            />

            <MilestonePhase 
              icon={Code}
              phase="Developer Ecosystem"
              status="planned"
              progress={0}
              description="APIs, SDKs, and tools for developers"
              milestones={[
                { title: "Public API Release", status: "planned", description: "RESTful API for ZK Identity & encryption services" },
                { title: "JavaScript SDK", status: "planned", description: "NPM package for easy integration" },
                { title: "Developer Documentation", status: "planned", description: "Comprehensive guides, examples, and references" },
                { title: "Webhook System", status: "planned", description: "Real-time event notifications for integrations" }
              ]}
            />

            <MilestonePhase 
              icon={Users}
              phase="Mainnet & Governance"
              status="in-progress"
              progress={25}
              description="Production launch and community governance"
              milestones={[
                { title: "Solana Mainnet Deployment", status: "completed", description: "Full production launch on Solana mainnet" },
                { title: "ZYNX Token Launch", status: "planned", description: "Fair launch on Pump.fun with burned liquidity" },
                { title: "DAO Governance", status: "planned", description: "Community-driven protocol governance" },
                { title: "Enterprise Solutions", status: "planned", description: "White-label privacy infrastructure for businesses" }
              ]}
            />

            <MilestonePhase 
              icon={Globe}
              phase="Multi-Chain & Scale"
              status="planned"
              progress={0}
              description="Cross-chain support and ecosystem growth"
              milestones={[
                { title: "Ethereum Integration", status: "planned", description: "Support for Ethereum & EVM-compatible chains" },
                { title: "Multi-Chain Identity", status: "planned", description: "Unified identity across multiple blockchains" },
                { title: "Advanced DeFi Features", status: "planned", description: "Private lending, yield farming, derivatives" },
                { title: "Global Partnerships", status: "planned", description: "Strategic partnerships with Web3 projects" }
              ]}
            />
          </div>

          {/* Vision Statement */}
          <div className="mt-16 bg-gradient-to-br from-[#00E0FF]/10 to-[#8A2BE2]/10 border border-[#00E0FF]/20 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Long-Term Vision</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Become the de facto privacy infrastructure for Web3, empowering millions with self-sovereign identity 
              and zero-knowledge tools while maintaining the highest standards of security and decentralization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  const colors = {
    green: "border-green-500/20 bg-green-500/5",
    cyan: "border-[#00E0FF]/20 bg-[#00E0FF]/5",
    purple: "border-[#8A2BE2]/20 bg-[#8A2BE2]/5"
  };

  const textColors = {
    green: "text-green-400",
    cyan: "text-[#00E0FF]",
    purple: "text-[#8A2BE2]"
  };

  return (
    <div className={`border ${colors[color as keyof typeof colors]} rounded-lg p-4 text-center`}>
      <div className={`text-3xl font-bold ${textColors[color as keyof typeof textColors]} mb-1`}>{value}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function MilestonePhase({ 
  icon: Icon, 
  phase, 
  status, 
  progress, 
  description, 
  milestones 
}: { 
  icon: any; 
  phase: string; 
  status: string; 
  progress: number; 
  description: string; 
  milestones: Array<{ title: string; status: string; description: string }>;
}) {
  const getStatusColor = () => {
    if (status === "completed") return "border-green-500/20 bg-green-500/5";
    if (status === "in-progress") return "border-[#00E0FF]/20 bg-[#00E0FF]/5";
    return "border-white/10 bg-black/20";
  };

  const getStatusBadge = () => {
    if (status === "completed") return <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/20 rounded-full text-xs font-mono">COMPLETED</span>;
    if (status === "in-progress") return <span className="px-3 py-1 bg-[#00E0FF]/20 text-[#00E0FF] border border-[#00E0FF]/20 rounded-full text-xs font-mono">IN PROGRESS</span>;
    return <span className="px-3 py-1 bg-white/5 text-gray-400 border border-white/10 rounded-full text-xs font-mono">PLANNED</span>;
  };

  const getProgressColor = () => {
    if (status === "completed") return "from-green-400 to-green-500";
    if (status === "in-progress") return "from-[#00E0FF] to-[#8A2BE2]";
    return "from-gray-600 to-gray-700";
  };

  return (
    <div className={`border ${getStatusColor()} rounded-lg p-6 backdrop-blur-sm transition-all hover:border-[#00E0FF]/40`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#00E0FF]/20 rounded-lg">
            <Icon className="w-6 h-6 text-[#00E0FF]" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-1">{phase}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Phase Progress</span>
          <span className="text-xs font-mono text-gray-400">{progress}%</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`bg-gradient-to-r ${getProgressColor()} h-full rounded-full transition-all duration-500`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-3">
        {milestones.map((milestone, idx) => (
          <MilestoneItem key={idx} {...milestone} />
        ))}
      </div>
    </div>
  );
}

function MilestoneItem({ title, status, description }: { title: string; status: string; description: string }) {
  const getIcon = () => {
    if (status === "completed") return <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />;
    if (status === "in-progress") return <Loader2 className="w-5 h-5 text-[#00E0FF] flex-shrink-0 animate-spin" />;
    return <Circle className="w-5 h-5 text-gray-600 flex-shrink-0" />;
  };

  const getTextColor = () => {
    if (status === "completed") return "text-white";
    if (status === "in-progress") return "text-white";
    return "text-gray-400";
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-black/20 border border-white/5 rounded-lg hover:bg-white/5 transition-all">
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <h4 className={`font-medium mb-1 ${getTextColor()}`}>{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}
