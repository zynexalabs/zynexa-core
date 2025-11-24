import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import Header from "@/components/Header";
import { TrendingUp, Target, DollarSign, Users, Lock, Zap } from "lucide-react";

export default function DocsInvestorPage() {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ 
      theme: 'dark',
      themeVariables: {
        primaryColor: '#00E0FF',
        primaryTextColor: '#fff',
        primaryBorderColor: '#00E0FF',
        lineColor: '#8A2BE2',
        secondaryColor: '#8A2BE2',
        tertiaryColor: '#1a1a1a',
        pieTitleTextColor: '#fff',
        pieSectionTextColor: '#fff',
        pieOuterStrokeWidth: '2px'
      }
    });
    
    if (mermaidRef.current) {
      mermaid.contentLoaded();
    }
  }, []);

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
              INVESTOR DOCUMENTATION
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] via-white to-[#8A2BE2]">
              Investment Thesis
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive overview of Zynexa's market opportunity, business model, and growth strategy.
            </p>
          </div>

          {/* Executive Summary */}
          <div className="bg-gradient-to-br from-[#00E0FF]/10 to-[#8A2BE2]/10 border border-[#00E0FF]/20 rounded-lg p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6">Executive Summary</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                <strong className="text-white">Zynexa</strong> is building the world's first comprehensive privacy-focused 
                operating system for Web3, combining zero-knowledge cryptography, end-to-end encryption, and blockchain 
                technology to deliver true digital sovereignty.
              </p>
              <p>
                With the global privacy software market projected to reach <strong className="text-[#00E0FF]">$8.2B by 2027</strong> 
                (CAGR 12.8%), and increasing regulatory pressure around data privacy (GDPR, CCPA), Zynexa is positioned at 
                the intersection of massive market demand and technological innovation.
              </p>
              <p>
                Our platform serves three high-value customer segments: privacy-conscious individuals (180M+ potential users), 
                crypto traders seeking MEV protection ($2.3B annually lost to MEV), and journalists/activists requiring 
                censorship-resistant communication tools.
              </p>
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-black/40 border border-red-500/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-red-400">The Problem</h2>
              <ul className="space-y-4">
                <ProblemItem text="90% of internet users concerned about online privacy (Pew Research)" />
                <ProblemItem text="$2.3B+ lost annually to MEV extraction in DeFi" />
                <ProblemItem text="Centralized platforms control and monetize user data" />
                <ProblemItem text="Limited privacy tools for Web3 ecosystem" />
                <ProblemItem text="Journalists face increasing surveillance and censorship" />
              </ul>
            </div>
            <div className="bg-black/40 border border-green-500/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-green-400">Our Solution</h2>
              <ul className="space-y-4">
                <SolutionItem text="Zero-knowledge identity system (no central authority)" />
                <SolutionItem text="MEV-protected swaps via stealth addresses" />
                <SolutionItem text="End-to-end encrypted communication & storage" />
                <SolutionItem text="Built on Solana (high-speed, low-cost L1)" />
                <SolutionItem text="Censorship-resistant decentralized architecture" />
              </ul>
            </div>
          </div>

          {/* Market Opportunity */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Market Opportunity</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <MarketCard 
                title="TAM"
                subtitle="Total Addressable Market"
                value="$8.2B"
                description="Global privacy software market by 2027"
              />
              <MarketCard 
                title="SAM"
                subtitle="Serviceable Addressable Market"
                value="$2.1B"
                description="Web3 privacy & DeFi protection market"
              />
              <MarketCard 
                title="SOM"
                subtitle="Serviceable Obtainable Market"
                value="$420M"
                description="Target market share (20%) by 2027"
              />
            </div>
            <div className="bg-black/40 border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Market Drivers</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Driver text="Increasing privacy regulations (GDPR, CCPA, LGPD)" />
                <Driver text="Growing Web3 adoption (420M crypto users globally)" />
                <Driver text="Rising awareness of data breaches & surveillance" />
                <Driver text="Demand for MEV protection in DeFi trading" />
              </div>
            </div>
          </div>

          {/* Business Model */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Business Model</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <RevenueStream 
                title="Transaction Fees"
                percentage="40%"
                description="0.3% fee on all Stealth Swap transactions"
              />
              <RevenueStream 
                title="Premium Storage"
                percentage="30%"
                description="Tiered pricing for encrypted file storage (5GB-1TB)"
              />
              <RevenueStream 
                title="Enterprise Licenses"
                percentage="20%"
                description="White-label solutions for businesses & organizations"
              />
              <RevenueStream 
                title="API Access"
                percentage="10%"
                description="Developer API access for ZK Identity & encryption services"
              />
            </div>
          </div>

          {/* Tokenomics ZYNX */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">ZYNX Tokenomics</h2>
            <div className="bg-black/40 border border-[#00E0FF]/20 rounded-lg p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-[#00E0FF]">Token Utility</h3>
                  <ul className="space-y-3">
                    <TokenUtility text="Governance voting rights (DAO)" />
                    <TokenUtility text="Staking for network security rewards" />
                    <TokenUtility text="Payment for premium features & storage" />
                    <TokenUtility text="Transaction fee discounts (up to 50%)" />
                    <TokenUtility text="Access to exclusive privacy features" />
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 text-[#8A2BE2]">Token Metrics</h3>
                  <div className="space-y-3">
                    <Metric label="Total Supply" value="1,000,000,000 ZYNX" />
                    <Metric label="Initial Circulation" value="150,000,000 (15%)" />
                    <Metric label="Network" value="Solana SPL Token" />
                    <Metric label="Token Type" value="Utility + Governance" />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-4">Token Distribution</h3>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div ref={mermaidRef} className="mermaid">
{`%%{init: {'theme':'dark', 'themeVariables': { 'pieStrokeWidth': '2px'}}}%%
pie title Token Distribution
    "Community & Ecosystem" : 35
    "Team & Advisors" : 20
    "Private Sale" : 15
    "Public Sale" : 10
    "Treasury" : 10
    "Liquidity" : 10`}
                </div>
                <div className="space-y-4">
                  <DistributionItem label="Community & Ecosystem" percentage="35%" vesting="4-year vesting" />
                  <DistributionItem label="Team & Advisors" percentage="20%" vesting="4-year vesting, 1-year cliff" />
                  <DistributionItem label="Private Sale" percentage="15%" vesting="2-year vesting, 6-month cliff" />
                  <DistributionItem label="Public Sale" percentage="10%" vesting="No lock-up" />
                  <DistributionItem label="Treasury" percentage="10%" vesting="Controlled by DAO" />
                  <DistributionItem label="Liquidity" percentage="10%" vesting="Locked for 2 years" />
                </div>
              </div>
            </div>
          </div>

          {/* Financial Projections */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Financial Projections (2026-2028)</h2>
            <div className="bg-black/40 border border-white/10 rounded-lg overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#00E0FF]/10 border-b border-[#00E0FF]/20">
                  <tr>
                    <th className="text-left px-6 py-4 font-mono text-sm text-[#00E0FF]">Metric</th>
                    <th className="text-right px-6 py-4 font-mono text-sm text-[#00E0FF]">2026</th>
                    <th className="text-right px-6 py-4 font-mono text-sm text-[#00E0FF]">2027</th>
                    <th className="text-right px-6 py-4 font-mono text-sm text-[#00E0FF]">2028</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="px-6 py-4 text-gray-300">Active Users</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-400">250,000</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-400">1,200,000</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-400">5,000,000</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-6 py-4 text-gray-300">Monthly Transaction Volume</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-400">$12M</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-400">$85M</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-400">$420M</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-6 py-4 text-gray-300">Annual Revenue</td>
                    <td className="px-6 py-4 text-right font-mono text-[#00E0FF]">$5.2M</td>
                    <td className="px-6 py-4 text-right font-mono text-[#00E0FF]">$32M</td>
                    <td className="px-6 py-4 text-right font-mono text-[#00E0FF]">$180M</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-6 py-4 text-gray-300">Gross Margin</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-400">68%</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-400">75%</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-400">82%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Investment Highlights */}
          <div className="bg-gradient-to-br from-[#00E0FF]/10 to-[#8A2BE2]/10 border border-[#00E0FF]/20 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-6">Investment Highlights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Highlight 
                icon={TrendingUp}
                title="High-Growth Market"
                description="Privacy tech market growing at 12.8% CAGR, driven by regulations and user demand"
              />
              <Highlight 
                icon={Target}
                title="Clear Value Proposition"
                description="Solving real problems: MEV protection, data privacy, censorship resistance"
              />
              <Highlight 
                icon={Lock}
                title="Technical Moat"
                description="Advanced cryptography and ZK-proof implementation creates competitive barrier"
              />
              <Highlight 
                icon={DollarSign}
                title="Multiple Revenue Streams"
                description="Transaction fees, premium storage, enterprise licenses, API access"
              />
              <Highlight 
                icon={Users}
                title="Large TAM"
                description="$8.2B addressable market with 420M+ potential users globally"
              />
              <Highlight 
                icon={Zap}
                title="First-Mover Advantage"
                description="Comprehensive privacy OS for Web3—no direct competitors with full feature set"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-gray-300">
      <span className="text-red-400 mt-1">✗</span>
      <span className="text-sm">{text}</span>
    </li>
  );
}

function SolutionItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-gray-300">
      <span className="text-green-400 mt-1">✓</span>
      <span className="text-sm">{text}</span>
    </li>
  );
}

function MarketCard({ title, subtitle, value, description }: { title: string, subtitle: string, value: string, description: string }) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-6 text-center">
      <div className="text-xs text-gray-500 font-mono mb-1">{title}</div>
      <div className="text-sm text-gray-400 mb-3">{subtitle}</div>
      <div className="text-4xl font-bold text-[#00E0FF] mb-3">{value}</div>
      <div className="text-xs text-gray-400">{description}</div>
    </div>
  );
}

function Driver({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-[#00E0FF] mt-1">›</span>
      <span className="text-sm text-gray-300">{text}</span>
    </div>
  );
}

function RevenueStream({ title, percentage, description }: { title: string, percentage: string, description: string }) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-6">
      <div className="text-3xl font-bold text-[#00E0FF] mb-2">{percentage}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

function TokenUtility({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-gray-300">
      <span className="text-[#00E0FF] mt-1">›</span>
      <span className="text-sm">{text}</span>
    </li>
  );
}

function Metric({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400 text-sm">{label}:</span>
      <span className="font-mono text-sm text-white">{value}</span>
    </div>
  );
}

function DistributionItem({ label, percentage, vesting }: { label: string, percentage: string, vesting: string }) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <div className="font-medium text-white">{label}</div>
        <div className="text-xs text-gray-400 font-mono">{vesting}</div>
      </div>
      <div className="text-lg font-bold text-[#00E0FF]">{percentage}</div>
    </div>
  );
}

function Highlight({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-3 bg-[#00E0FF]/20 rounded-lg flex-shrink-0">
        <Icon className="w-6 h-6 text-[#00E0FF]" />
      </div>
      <div>
        <h3 className="font-bold mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
}
