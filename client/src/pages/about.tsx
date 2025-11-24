import Header from "@/components/Header";
import { Shield, Zap, Users, Award, Code, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
      
      <Header />
      
      <div className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-[#00E0FF]/5 border border-[#00E0FF]/20 rounded-full px-4 py-2 text-xs font-mono text-[#00E0FF] mb-6">
              ABOUT ZYNEXA
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] via-white to-[#8A2BE2]">
              Building the Future of Privacy
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Zynexa is pioneering a new era of digital privacy through advanced cryptography, 
              blockchain technology, and user-centric design.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="bg-gradient-to-br from-[#00E0FF]/10 to-transparent border border-[#00E0FF]/20 rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-4 text-[#00E0FF]">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                To empower individuals with complete control over their digital identity and data through 
                cutting-edge privacy technology. We believe privacy is a fundamental human right, and we're 
                building the infrastructure to make it accessible to everyone.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#8A2BE2]/10 to-transparent border border-[#8A2BE2]/20 rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-4 text-[#8A2BE2]">Our Vision</h2>
              <p className="text-gray-300 leading-relaxed">
                A world where individuals can communicate, transact, and store data without sacrificing privacy. 
                We envision a decentralized internet where users, not corporations, control their information 
                and digital sovereignty is the default.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            <StatCard number="128-bit" label="Entropy Standard (BIP-39)" />
            <StatCard number="100%" label="Client-Side Key Generation" />
            <StatCard number="< 100ms" label="Average Response Time" />
            <StatCard number="99.9%" label="Uptime SLA" />
          </div>

          {/* Technology Stack */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Technology Stack</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <TechCategory 
                title="Cryptography"
                items={[
                  "Ed25519 (Curve25519)",
                  "BIP-39 Mnemonic (12 words)",
                  "NaCl Box (Curve25519 E2E)",
                  "ZK-SNARKs",
                  "X3DH Key Exchange",
                  "Double Ratchet Protocol"
                ]}
              />
              <TechCategory 
                title="Blockchain & Web3"
                items={[
                  "Solana (Layer 1)",
                  "Solana Web3.js",
                  "Smart Contracts (Rust)",
                  "IPFS Storage",
                  "Stealth Addresses",
                  "MEV Protection"
                ]}
              />
              <TechCategory 
                title="Backend & Infrastructure"
                items={[
                  "Node.js + TypeScript",
                  "Express.js API",
                  "PostgreSQL (Neon)",
                  "Drizzle ORM",
                  "React 18",
                  "Tailwind CSS"
                ]}
              />
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Core Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <ValueCard 
                icon={Shield}
                title="Privacy First"
                description="Privacy is not a feature—it's our foundation. Every decision we make prioritizes user privacy and security."
              />
              <ValueCard 
                icon={Code}
                title="Open & Transparent"
                description="We believe in transparency. Our protocols and architecture are documented and auditable."
              />
              <ValueCard 
                icon={Users}
                title="User Sovereignty"
                description="Users own their data, identities, and private keys. We're just the infrastructure."
              />
              <ValueCard 
                icon={Globe}
                title="Decentralized"
                description="Built on blockchain technology to ensure no single point of failure or control."
              />
              <ValueCard 
                icon={Zap}
                title="Innovation"
                description="Continuously pushing boundaries with cutting-edge cryptography and blockchain technology."
              />
              <ValueCard 
                icon={Award}
                title="Excellence"
                description="Committed to delivering world-class security, performance, and user experience."
              />
            </div>
          </div>

          {/* Security & Audits */}
          <div className="bg-black/40 border border-white/10 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-6">Security & Compliance</h2>
            <div className="space-y-6">
              <SecurityItem 
                title="Smart Contract Audits"
                status="Scheduled Q1 2026"
                description="Third-party security audit by leading blockchain security firm"
              />
              <SecurityItem 
                title="Cryptographic Review"
                status="In Progress"
                description="Independent cryptography review of ZK Identity implementation"
              />
              <SecurityItem 
                title="Penetration Testing"
                status="Quarterly"
                description="Regular penetration testing and vulnerability assessments"
              />
              <SecurityItem 
                title="Bug Bounty Program"
                status="Coming Soon"
                description="Community-driven bug bounty program launching Q2 2026"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ number, label }: { number: string, label: string }) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-6 text-center backdrop-blur-sm">
      <div className="text-3xl md:text-4xl font-bold text-[#00E0FF] mb-2">{number}</div>
      <div className="text-sm text-gray-400 font-mono">{label}</div>
    </div>
  );
}

function TechCategory({ title, items }: { title: string, items: string[] }) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-[#00E0FF]">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-gray-300 text-sm font-mono flex items-center gap-2">
            <span className="text-[#8A2BE2]">›</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ValueCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-6 hover:border-[#00E0FF]/40 transition-all">
      <Icon className="w-10 h-10 text-[#00E0FF] mb-4" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function SecurityItem({ title, status, description }: { title: string, status: string, description: string }) {
  return (
    <div className="flex items-start gap-4 pb-6 border-b border-white/10 last:border-0 last:pb-0">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <span className="text-xs font-mono px-3 py-1 bg-[#00E0FF]/20 text-[#00E0FF] rounded-full">
            {status}
          </span>
        </div>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
}
