import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import mermaid from "mermaid";
import Header from "@/components/Header";
import { 
  BookOpen, 
  Rocket, 
  Shield, 
  BookText, 
  Coins, 
  Map, 
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Home,
  Key,
  MessageSquare,
  HardDrive,
  Repeat,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from "lucide-react";

interface DocSection {
  id: string;
  title: string;
  icon: any;
  items?: { id: string; title: string; icon?: any }[];
}

const sections: DocSection[] = [
  {
    id: "overview",
    title: "Overview",
    icon: Home,
    items: [
      { id: "what-is-zynexa", title: "What is Zynexa" },
      { id: "key-features", title: "Key Features" },
      { id: "architecture", title: "System Architecture" }
    ]
  },
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Rocket,
    items: [
      { id: "create-identity", title: "Create Your Identity" },
      { id: "backup-seed", title: "Backup Your Seed Phrase" },
      { id: "login-dashboard", title: "Login to Dashboard" },
      { id: "security-practices", title: "Security Best Practices" }
    ]
  },
  {
    id: "core-concepts",
    title: "Core Concepts",
    icon: Shield,
    items: [
      { id: "zk-identity", title: "Zero-Knowledge Identity" },
      { id: "mnemonic-auth", title: "Mnemonic-Only Authentication" },
      { id: "onchain-verification", title: "On-Chain Verification" },
      { id: "privacy-guarantees", title: "Privacy Guarantees" }
    ]
  },
  {
    id: "user-guides",
    title: "User Guides",
    icon: BookText,
    items: [
      { id: "identity-management", title: "Identity Management", icon: Key },
      { id: "encrypted-messaging", title: "Encrypted Messaging", icon: MessageSquare },
      { id: "private-drive", title: "Private Drive", icon: HardDrive },
      { id: "stealth-swap", title: "Stealth Swap", icon: Repeat }
    ]
  },
  {
    id: "tokenomics",
    title: "Tokenomics",
    icon: Coins
  },
  {
    id: "roadmap",
    title: "Roadmap",
    icon: Map
  },
  {
    id: "faq",
    title: "FAQ & Troubleshooting",
    icon: HelpCircle
  }
];

export default function DocsPage() {
  const [location, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("overview");
  const [activeSubsection, setActiveSubsection] = useState("what-is-zynexa");
  const [expandedSections, setExpandedSections] = useState<string[]>(["overview", "user-guides"]);

  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  const handleNavigate = (sectionId: string, subsectionId?: string) => {
    setActiveSection(sectionId);
    if (subsectionId) {
      setActiveSubsection(subsectionId);
      if (!expandedSections.includes(sectionId)) {
        setExpandedSections([...expandedSections, sectionId]);
      }
    } else if (sectionId === "roadmap") {
      setLocation("/docs/roadmap");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
      
      <Header />
      
      <div className="relative z-10 pt-20 flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 xl:w-72 fixed left-0 top-20 h-[calc(100vh-5rem)] overflow-y-auto border-r border-white/10 bg-black/40 backdrop-blur-sm px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-[#00E0FF]" />
              <h2 className="text-lg font-bold">Documentation</h2>
            </div>
            <p className="text-xs text-gray-500">Comprehensive user guide</p>
          </div>

          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSections.includes(section.id);
              const hasItems = section.items && section.items.length > 0;

              return (
                <div key={section.id}>
                  <button
                    onClick={() => hasItems ? toggleSection(section.id) : handleNavigate(section.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === section.id && !activeSubsection
                        ? 'bg-[#00E0FF]/20 text-[#00E0FF]'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{section.title}</span>
                    </div>
                    {hasItems && (
                      isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {hasItems && isExpanded && section.items && (
                    <div className="ml-6 mt-1 space-y-1 border-l border-white/10 pl-3">
                      {section.items.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavigate(section.id, item.id)}
                            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all flex items-center gap-2 ${
                              activeSubsection === item.id
                                ? 'text-[#00E0FF] bg-[#00E0FF]/10'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            }`}
                          >
                            {ItemIcon && <ItemIcon className="w-3 h-3" />}
                            {item.title}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 xl:ml-72 px-6 md:px-12 py-12 max-w-4xl">
          <DocContent section={activeSection} subsection={activeSubsection} />
        </main>
      </div>
    </div>
  );
}

function DocContent({ section, subsection }: { section: string; subsection: string }) {
  // Overview sections
  if (section === "overview" && subsection === "what-is-zynexa") {
    return <WhatIsZynexa />;
  }
  if (section === "overview" && subsection === "key-features") {
    return <KeyFeatures />;
  }
  if (section === "overview" && subsection === "architecture") {
    return <Architecture />;
  }

  // Getting Started
  if (section === "getting-started" && subsection === "create-identity") {
    return <CreateIdentity />;
  }
  if (section === "getting-started" && subsection === "backup-seed") {
    return <BackupSeed />;
  }
  if (section === "getting-started" && subsection === "login-dashboard") {
    return <LoginDashboard />;
  }
  if (section === "getting-started" && subsection === "security-practices") {
    return <SecurityPractices />;
  }

  // Core Concepts
  if (section === "core-concepts" && subsection === "zk-identity") {
    return <ZKIdentity />;
  }
  if (section === "core-concepts" && subsection === "mnemonic-auth") {
    return <MnemonicOnlyAuth />;
  }
  if (section === "core-concepts" && subsection === "onchain-verification") {
    return <OnChainVerification />;
  }
  if (section === "core-concepts" && subsection === "privacy-guarantees") {
    return <PrivacyGuarantees />;
  }

  // User Guides
  if (section === "user-guides" && subsection === "identity-management") {
    return <IdentityManagementGuide />;
  }
  if (section === "user-guides" && subsection === "encrypted-messaging") {
    return <MessagingGuide />;
  }
  if (section === "user-guides" && subsection === "private-drive") {
    return <DriveGuide />;
  }
  if (section === "user-guides" && subsection === "stealth-swap") {
    return <SwapGuide />;
  }

  // Tokenomics
  if (section === "tokenomics") {
    return <Tokenomics />;
  }

  // FAQ
  if (section === "faq") {
    return <FAQ />;
  }

  return <WhatIsZynexa />;
}

// Content Components
function WhatIsZynexa() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]">
        What is Zynexa?
      </h1>
      
      <p className="text-lg text-gray-300 leading-relaxed mb-6">
        Zynexa is a <strong className="text-white">privacy-first operating system for Web3</strong>, built to give you complete control over your digital identity, communications, and data.
      </p>

      <div className="bg-gradient-to-br from-[#00E0FF]/10 to-[#8A2BE2]/10 border border-[#00E0FF]/20 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-3 text-[#00E0FF]">Core Mission</h3>
        <p className="text-gray-300">
          To empower individuals with self-sovereign identity and privacy tools without relying on centralized authorities or compromising security.
        </p>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Why Zynexa Exists</h2>
      <p className="text-gray-300 mb-4">
        In today's digital world, privacy is constantly under threat:
      </p>
      <ul className="space-y-2 text-gray-300">
        <li className="flex items-start gap-2">
          <span className="text-red-400 mt-1">•</span>
          <span>Centralized platforms control and monetize your personal data</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-400 mt-1">•</span>
          <span>Your online activities are tracked and sold to advertisers</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-400 mt-1">•</span>
          <span>Crypto traders lose billions to MEV extraction and front-running</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-400 mt-1">•</span>
          <span>Journalists and activists face surveillance and censorship</span>
        </li>
      </ul>

      <p className="text-gray-300 mt-6">
        Zynexa solves these problems with <strong className="text-[#00E0FF]">cutting-edge cryptography</strong> and <strong className="text-[#00E0FF]">blockchain technology</strong>, giving you:
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-green-400">✓ Self-Sovereign Identity</h4>
          <p className="text-sm text-gray-400">You control your identity—no middlemen, no central authority</p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-green-400">✓ True Privacy</h4>
          <p className="text-sm text-gray-400">End-to-end encryption ensures only you can access your data</p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-green-400">✓ MEV Protection</h4>
          <p className="text-sm text-gray-400">Stealth addresses protect your trades from front-running</p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-green-400">✓ Censorship Resistance</h4>
          <p className="text-sm text-gray-400">Decentralized architecture prevents any single point of control</p>
        </div>
      </div>
    </div>
  );
}

function KeyFeatures() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]">
        Key Features
      </h1>

      <p className="text-lg text-gray-300 mb-8">
        Zynexa provides four core privacy modules, each designed to protect different aspects of your digital life.
      </p>

      <div className="space-y-8">
        <FeatureCard 
          icon={Key}
          title="Zero-Knowledge Identity"
          status="Live"
          description="Create a self-sovereign digital identity using Ed25519 cryptography. Your private keys never leave your device, and you control who can verify your identity."
          features={[
            "Browser-generated keypairs (Ed25519)",
            "BIP-39 seed phrase backup",
            "Password-encrypted storage",
            "Optional on-chain verification (Solana)"
          ]}
        />

        <FeatureCard 
          icon={MessageSquare}
          title="Encrypted Messaging"
          status="Coming Q2 2025"
          description="Send private messages with end-to-end encryption. Perfect forward secrecy ensures past messages remain secure even if keys are compromised."
          features={[
            "Signal Protocol (Double Ratchet)",
            "Perfect forward secrecy",
            "Metadata protection",
            "Self-destructing messages"
          ]}
        />

        <FeatureCard 
          icon={HardDrive}
          title="Private Drive"
          status="Coming Q3 2025"
          description="Store files with client-side encryption on distributed IPFS network. Only you hold the decryption keys."
          features={[
            "AES-256-GCM encryption",
            "IPFS distributed storage",
            "File sharing with access control",
            "Up to 5GB per file"
          ]}
        />

        <FeatureCard 
          icon={Repeat}
          title="Stealth Swap"
          status="Coming Q3 2025"
          description="Execute token swaps without revealing your wallet balance or trading patterns. Protection against MEV extraction and front-running."
          features={[
            "Stealth address generation",
            "Private RPC endpoints",
            "MEV protection",
            "Raydium, Orca, Jupiter support"
          ]}
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, status, description, features }: any) {
  const statusColors = status === "Live" 
    ? "bg-green-500/20 text-green-400 border-green-500/20"
    : "bg-orange-500/20 text-orange-400 border-orange-500/20";

  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00E0FF]/20 rounded-lg">
            <Icon className="w-6 h-6 text-[#00E0FF]" />
          </div>
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-mono border ${statusColors}`}>
          {status}
        </span>
      </div>
      <p className="text-gray-300 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
            <span className="text-[#8A2BE2] mt-0.5">›</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Architecture() {
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
        tertiaryColor: '#1a1a1a'
      }
    });
    
    if (mermaidRef.current) {
      mermaid.contentLoaded();
    }
  }, []);

  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]">
        System Architecture
      </h1>

      <p className="text-lg text-gray-300 mb-8">
        Zynexa is built on a modern, privacy-first architecture that separates client-side cryptography from server-side data persistence.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">High-Level Architecture</h2>
      <div className="bg-black/40 border border-[#00E0FF]/20 rounded-lg p-6 mb-8">
        <div ref={mermaidRef} className="mermaid">
{`graph TB
    subgraph Client["Client Layer (Browser)"]
        UI[React UI]
        Crypto[Cryptography Engine]
        Storage[Local Storage]
    end
    
    subgraph Server["Server Layer"]
        API[Express API]
        DB[(PostgreSQL)]
    end
    
    subgraph Blockchain["Blockchain Layer"]
        Solana[Solana Network]
        Programs[Smart Programs]
    end
    
    UI -->|User Actions| Crypto
    Crypto -->|Encrypted Data| Storage
    Crypto -->|API Requests| API
    API -->|Store Metadata| DB
    Crypto -->|Sign Transactions| Solana
    Solana -->|Verification| Programs
    Programs -->|Callback| API
    
    style Client fill:#00E0FF15,stroke:#00E0FF,stroke-width:2px
    style Server fill:#8A2BE215,stroke:#8A2BE2,stroke-width:2px
    style Blockchain fill:#00FF0015,stroke:#00FF00,stroke-width:2px`}
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Technology Stack</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-3 text-[#00E0FF]">Frontend</h4>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-2 text-gray-500">Framework</td>
                <td className="py-2 text-right">React 18 + TypeScript</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-500">Build Tool</td>
                <td className="py-2 text-right">Vite</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-500">Routing</td>
                <td className="py-2 text-right">Wouter</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-500">UI Library</td>
                <td className="py-2 text-right">Radix UI + Tailwind</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-500">State</td>
                <td className="py-2 text-right">TanStack Query</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-3 text-[#8A2BE2]">Backend</h4>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-2 text-gray-500">Runtime</td>
                <td className="py-2 text-right">Node.js + Express</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-500">Database</td>
                <td className="py-2 text-right">PostgreSQL (Neon)</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-500">ORM</td>
                <td className="py-2 text-right">Drizzle</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-500">Blockchain</td>
                <td className="py-2 text-right">Solana Web3.js</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-500">Crypto</td>
                <td className="py-2 text-right">TweetNaCl + CryptoJS</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Data Flow</h2>
      <div className="bg-black/40 border border-[#00E0FF]/20 rounded-lg p-6 mb-8">
        <div className="mermaid">
{`sequenceDiagram
    participant U as User
    participant B as Browser
    participant S as Server
    participant BC as Blockchain
    
    U->>B: Create Identity
    B->>B: Generate Keypair (Ed25519)
    B->>B: Encrypt Private Key (AES-256)
    B->>B: Store in LocalStorage
    
    U->>B: Publish Identity
    B->>B: Sign Message
    B->>S: POST /api/identity/publish
    S->>S: Verify Signature
    S->>BC: Submit Transaction
    BC-->>S: TX Hash
    S->>S: Store in DB
    S-->>B: Success Response
    
    style B fill:#00E0FF15,stroke:#00E0FF
    style S fill:#8A2BE215,stroke:#8A2BE2
    style BC fill:#00FF0015,stroke:#00FF00`}
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Privacy Principles</h2>
      <div className="space-y-3">
        <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-green-400 mb-1">Zero Server Trust</h4>
            <p className="text-sm text-gray-400">Private keys never leave your device. All encryption happens client-side.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-green-400 mb-1">Minimal Metadata</h4>
            <p className="text-sm text-gray-400">Server only stores public keys and verification status—no personal information.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-green-400 mb-1">Open Source</h4>
            <p className="text-sm text-gray-400">All cryptographic implementations are auditable and transparent.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateIdentity() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]">
        Create Your Identity
      </h1>

      <p className="text-lg text-gray-300 mb-8">
        Creating your Zynexa identity takes just a few minutes. Your identity is generated entirely in your browser—no personal information required.
      </p>

      <div className="bg-gradient-to-br from-[#00E0FF]/10 to-[#8A2BE2]/10 border border-[#00E0FF]/20 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-[#00E0FF] flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold mb-2 text-[#00E0FF]">Before You Start</h3>
            <p className="text-gray-300 text-sm">
              Make sure you're on a trusted device and have a safe place to store your seed phrase. Once created, there's no way to recover your identity without the seed phrase.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Step-by-Step Guide</h2>

      <div className="space-y-6">
        <div className="bg-black/40 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#00E0FF]/20 rounded-full flex items-center justify-center">
              <span className="text-[#00E0FF] font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold">Navigate to Identity Page</h3>
          </div>
          <p className="text-gray-300 mb-3">
            Go to <code className="bg-white/10 px-2 py-1 rounded text-[#00E0FF]">app.zynexa.io</code> or click "Launch App" from the homepage.
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#00E0FF]/20 rounded-full flex items-center justify-center">
              <span className="text-[#00E0FF] font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold">Click "Create New Identity"</h3>
          </div>
          <p className="text-gray-300 mb-3">
            Your browser will generate a unique Ed25519 keypair and a 12-word BIP-39 seed phrase.
          </p>
          <div className="bg-[#00E0FF]/5 border border-[#00E0FF]/20 rounded p-3">
            <p className="text-xs text-gray-400">
              ℹ️ This happens entirely in your browser. No data is sent to any server during key generation.
            </p>
          </div>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#00E0FF]/20 rounded-full flex items-center justify-center">
              <span className="text-[#00E0FF] font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold">Write Down Your Seed Phrase</h3>
          </div>
          <p className="text-gray-300 mb-3">
            You'll see 12 words displayed on screen. Write them down on paper in the exact order shown.
          </p>
          <div className="bg-red-500/10 border border-red-500/20 rounded p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-300">
              <strong>Critical:</strong> Never take a screenshot or save digitally. Anyone with these words controls your identity.
            </p>
          </div>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#00E0FF]/20 rounded-full flex items-center justify-center">
              <span className="text-[#00E0FF] font-bold">4</span>
            </div>
            <h3 className="text-xl font-bold">Set a Strong Password</h3>
          </div>
          <p className="text-gray-300 mb-3">
            Choose a password to encrypt your private key in browser storage. This password:
          </p>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[#8A2BE2]">•</span>
              <span>Must be at least 12 characters</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#8A2BE2]">•</span>
              <span>Should include uppercase, lowercase, numbers, and symbols</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#8A2BE2]">•</span>
              <span>Is used to unlock your identity on this device</span>
            </li>
          </ul>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#00E0FF]/20 rounded-full flex items-center justify-center">
              <span className="text-[#00E0FF] font-bold">5</span>
            </div>
            <h3 className="text-xl font-bold">Confirm & Create</h3>
          </div>
          <p className="text-gray-300 mb-3">
            Verify your seed phrase by selecting the words in correct order, then click "Create Identity".
          </p>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-2 text-green-400">✓ Success!</h3>
        <p className="text-gray-300">
          Your Zynexa identity is now created. Your public key serves as your unique identifier, and you can optionally publish it on-chain for verification.
        </p>
      </div>
    </div>
  );
}

function BackupSeed() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]">
        Backup Your Seed Phrase
      </h1>

      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold mb-2 text-red-400">Critical: This Cannot Be Recovered</h3>
            <p className="text-gray-300">
              Your 12-word seed phrase is the ONLY way to recover your identity. If you lose it, your identity and all associated data are permanently lost. There is no "forgot password" option.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Why Backup Matters</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-green-400">✓ With Seed Phrase</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Recover on any device</li>
            <li>• Access from multiple devices</li>
            <li>• Restore if device lost/stolen</li>
            <li>• Maintain control forever</li>
          </ul>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-red-400">✗ Without Seed Phrase</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Lose all data if device fails</li>
            <li>• Cannot access from other devices</li>
            <li>• No recovery options</li>
            <li>• Permanent identity loss</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">How to Store Safely</h2>
      <div className="space-y-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-green-400 mb-1">✓ Recommended Methods</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Write on paper and store in a safe</li>
              <li>• Use a hardware wallet (Ledger, Trezor)</li>
              <li>• Steel backup plate (fireproof/waterproof)</li>
              <li>• Multiple copies in different secure locations</li>
            </ul>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-400 mb-1">✗ Never Do This</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Screenshot or photo</li>
              <li>• Email or cloud storage (Google Drive, iCloud, Dropbox)</li>
              <li>• Notes app on phone/computer</li>
              <li>• Password manager (unless encrypted)</li>
              <li>• Printed on printer with memory</li>
            </ul>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Best Practices</h2>
      <table className="w-full bg-black/40 border border-white/10 rounded-lg overflow-hidden">
        <thead className="bg-white/5">
          <tr>
            <th className="text-left p-4 font-bold">Practice</th>
            <th className="text-left p-4 font-bold">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <tr>
            <td className="p-4 text-gray-300">Verify Before Deleting</td>
            <td className="p-4 text-sm text-gray-400">Test recovery on another device before deleting the original</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">Multiple Copies</td>
            <td className="p-4 text-sm text-gray-400">Store 2-3 copies in different physical locations</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">Check Periodically</td>
            <td className="p-4 text-sm text-gray-400">Verify your backup is still accessible every 6 months</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">Consider Inheritance</td>
            <td className="p-4 text-sm text-gray-400">Plan for trusted person to access in emergency</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function LoginDashboard() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]">
        Login to Dashboard
      </h1>

      <p className="text-lg text-gray-300 mb-8">
        Access your Zynexa dashboard from any device using either your password (if previously used on that device) or your seed phrase.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Login Methods</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-black/40 border border-[#00E0FF]/20 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-[#00E0FF]" />
            <h3 className="text-xl font-bold">Password Login</h3>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            Use this method on devices where you've previously created or restored your identity.
          </p>
          <div className="bg-white/5 rounded p-3 mb-3">
            <p className="text-xs text-gray-400">
              Your encrypted private key is stored in browser LocalStorage and unlocked with your password.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Quick and convenient</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>No need to enter seed phrase</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <span>Only works on this device</span>
            </li>
          </ul>
        </div>

        <div className="bg-black/40 border border-[#8A2BE2]/20 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-6 h-6 text-[#8A2BE2]" />
            <h3 className="text-xl font-bold">Seed Phrase Login</h3>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            Use this method on new devices or if you've cleared browser data.
          </p>
          <div className="bg-white/5 rounded p-3 mb-3">
            <p className="text-xs text-gray-400">
              Your keypair is regenerated from the seed phrase and encrypted with a new password.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Works on any device</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Recovers full access</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <span>Requires entering 12 words</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Step-by-Step: Password Login</h2>
      <div className="bg-black/40 border border-white/10 rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#00E0FF]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#00E0FF] text-sm">1</span>
          </div>
          <div>
            <h4 className="font-bold mb-1">Navigate to app.zynexa.io</h4>
            <p className="text-sm text-gray-400">Go to the app subdomain</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#00E0FF]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#00E0FF] text-sm">2</span>
          </div>
          <div>
            <h4 className="font-bold mb-1">Enter Your Password</h4>
            <p className="text-sm text-gray-400">Type the password you set when creating your identity</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#00E0FF]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#00E0FF] text-sm">3</span>
          </div>
          <div>
            <h4 className="font-bold mb-1">Click "Unlock"</h4>
            <p className="text-sm text-gray-400">Your identity is decrypted and you're logged in</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Step-by-Step: Seed Phrase Login</h2>
      <div className="bg-black/40 border border-white/10 rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#8A2BE2]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#8A2BE2] text-sm">1</span>
          </div>
          <div>
            <h4 className="font-bold mb-1">Click "Restore from Seed"</h4>
            <p className="text-sm text-gray-400">Choose the seed phrase recovery option</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#8A2BE2]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#8A2BE2] text-sm">2</span>
          </div>
          <div>
            <h4 className="font-bold mb-1">Enter 12 Words</h4>
            <p className="text-sm text-gray-400">Type your seed phrase in the correct order</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#8A2BE2]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#8A2BE2] text-sm">3</span>
          </div>
          <div>
            <h4 className="font-bold mb-1">Set New Password</h4>
            <p className="text-sm text-gray-400">Choose a password for this device</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#8A2BE2]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#8A2BE2] text-sm">4</span>
          </div>
          <div>
            <h4 className="font-bold mb-1">Click "Restore"</h4>
            <p className="text-sm text-gray-400">Your identity is regenerated and saved to this device</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityPractices() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]">
        Security Best Practices
      </h1>

      <p className="text-lg text-gray-300 mb-8">
        Zynexa gives you complete control over your identity and data. With great power comes great responsibility. Follow these best practices to stay secure.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Password Security</h2>
      <table className="w-full bg-black/40 border border-white/10 rounded-lg overflow-hidden mb-8">
        <thead className="bg-white/5">
          <tr>
            <th className="text-left p-4 font-bold">Requirement</th>
            <th className="text-left p-4 font-bold">Why It Matters</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <tr>
            <td className="p-4 text-gray-300">Minimum 12 characters</td>
            <td className="p-4 text-sm text-gray-400">Harder to brute force</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">Mix uppercase & lowercase</td>
            <td className="p-4 text-sm text-gray-400">Exponentially more combinations</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">Include numbers & symbols</td>
            <td className="p-4 text-sm text-gray-400">Prevents dictionary attacks</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">Unique to Zynexa</td>
            <td className="p-4 text-sm text-gray-400">If leaked elsewhere, your identity is safe</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">Use password manager</td>
            <td className="p-4 text-sm text-gray-400">Generate & store complex passwords securely</td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-2xl font-bold mt-8 mb-4">Device Security</h2>
      <div className="space-y-4">
        <div className="bg-black/40 border border-white/10 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold mb-1">Keep Software Updated</h4>
            <p className="text-sm text-gray-400">OS, browser, and security patches protect against known vulnerabilities</p>
          </div>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold mb-1">Use Antivirus Software</h4>
            <p className="text-sm text-gray-400">Prevents keyloggers and malware from stealing credentials</p>
          </div>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold mb-1">Avoid Public Wi-Fi</h4>
            <p className="text-sm text-gray-400">Use VPN when accessing Zynexa on public networks</p>
          </div>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold mb-1">Lock Your Device</h4>
            <p className="text-sm text-gray-400">Use PIN/password/biometric lock when away</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Phishing Protection</h2>
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold mb-3 text-red-400">⚠️ Common Phishing Tactics</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">✗</span>
            <span>Fake websites with similar URLs (zynexa.com instead of zynexa.io)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">✗</span>
            <span>Emails claiming to be from Zynexa asking for seed phrase</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">✗</span>
            <span>Pop-ups requesting password or private keys</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">✗</span>
            <span>"Customer support" asking for credentials</span>
          </li>
        </ul>
      </div>

      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-3 text-green-400">✓ Stay Safe</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Always check URL: <code className="bg-white/10 px-2 py-0.5 rounded">zynexa.io</code></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Bookmark official site</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Never share seed phrase with anyone</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Zynexa will NEVER ask for your password or seed phrase</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function ZKIdentity() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]">
        Zero-Knowledge Identity
      </h1>

      <p className="text-lg text-gray-300 mb-8">
        Zynexa uses zero-knowledge identity based on Ed25519 cryptography, allowing you to prove who you are without revealing unnecessary information.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">What is Zero-Knowledge Identity?</h2>
      <div className="bg-gradient-to-br from-[#00E0FF]/10 to-[#8A2BE2]/10 border border-[#00E0FF]/20 rounded-lg p-6 mb-8">
        <p className="text-gray-300">
          A zero-knowledge identity lets you prove ownership of an identity without revealing your private key or personal information. You can sign messages to prove "I control this identity" without exposing any secrets.
        </p>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Key Components</h2>
      <table className="w-full bg-black/40 border border-white/10 rounded-lg overflow-hidden mb-8">
        <thead className="bg-white/5">
          <tr>
            <th className="text-left p-4 font-bold">Component</th>
            <th className="text-left p-4 font-bold">Description</th>
            <th className="text-left p-4 font-bold">Shared?</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <tr>
            <td className="p-4 text-gray-300 font-mono text-sm">Public Key</td>
            <td className="p-4 text-sm text-gray-400">Your identity address (like username)</td>
            <td className="p-4"><span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">YES</span></td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300 font-mono text-sm">Private Key</td>
            <td className="p-4 text-sm text-gray-400">Secret key for signing (like password)</td>
            <td className="p-4"><span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">NO</span></td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300 font-mono text-sm">Seed Phrase</td>
            <td className="p-4 text-sm text-gray-400">12 words to regenerate keypair</td>
            <td className="p-4"><span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">NO</span></td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300 font-mono text-sm">Signature</td>
            <td className="p-4 text-sm text-gray-400">Proof you control the private key</td>
            <td className="p-4"><span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">YES</span></td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-2xl font-bold mt-8 mb-4">How It Works</h2>
      <div className="space-y-4">
        <div className="bg-black/40 border border-white/10 rounded-lg p-6">
          <h4 className="font-bold mb-3 text-[#00E0FF]">1. Key Generation (Ed25519)</h4>
          <p className="text-sm text-gray-300 mb-3">
            When you create an identity, your browser generates a cryptographically secure Ed25519 keypair using BIP-39 standard:
          </p>
          <div className="bg-white/5 rounded p-4 font-mono text-xs text-gray-400">
            <div>Seed Phrase (12 words) →</div>
            <div className="ml-4">→ Private Key (64 bytes)</div>
            <div className="ml-4">→ Public Key (32 bytes)</div>
          </div>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-lg p-6">
          <h4 className="font-bold mb-3 text-[#00E0FF]">2. Digital Signatures</h4>
          <p className="text-sm text-gray-300 mb-3">
            To prove you control an identity, you sign a message with your private key:
          </p>
          <div className="bg-white/5 rounded p-4 font-mono text-xs text-gray-400">
            <div>Message + Private Key → Signature</div>
            <div className="mt-2 text-green-400">Anyone can verify: Message + Signature + Public Key = Valid ✓</div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            The signature proves you have the private key without revealing it.
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-lg p-6">
          <h4 className="font-bold mb-3 text-[#00E0FF]">3. Self-Sovereign Control</h4>
          <p className="text-sm text-gray-300">
            Unlike traditional accounts (email, username), your ZK identity:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Cannot be censored or banned</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Doesn't require approval from any authority</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Works across all compatible platforms</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>You own it forever</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Comparison with Traditional Identity</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-black/40 border border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-4 font-bold">Feature</th>
              <th className="text-left p-4 font-bold">Traditional (Email/Username)</th>
              <th className="text-left p-4 font-bold">Zero-Knowledge (Zynexa)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="p-4 text-gray-300">Creation</td>
              <td className="p-4 text-sm text-gray-400">Requires permission from service</td>
              <td className="p-4 text-sm text-green-400">Create instantly, no permission</td>
            </tr>
            <tr>
              <td className="p-4 text-gray-300">Control</td>
              <td className="p-4 text-sm text-gray-400">Service owns your account</td>
              <td className="p-4 text-sm text-green-400">You own your identity</td>
            </tr>
            <tr>
              <td className="p-4 text-gray-300">Privacy</td>
              <td className="p-4 text-sm text-gray-400">Personal info required (name, email)</td>
              <td className="p-4 text-sm text-green-400">No personal info needed</td>
            </tr>
            <tr>
              <td className="p-4 text-gray-300">Portability</td>
              <td className="p-4 text-sm text-gray-400">Locked to one service</td>
              <td className="p-4 text-sm text-green-400">Works everywhere</td>
            </tr>
            <tr>
              <td className="p-4 text-gray-300">Censorship</td>
              <td className="p-4 text-sm text-gray-400">Can be banned/suspended</td>
              <td className="p-4 text-sm text-green-400">Censorship-resistant</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MnemonicOnlyAuth() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]">
        Mnemonic-Only Authentication
      </h1>

      <p className="text-lg text-gray-300 mb-8">
        Zynexa uses <strong className="text-white">mnemonic-only authentication</strong> following Web3 wallet standards (MetaMask, Phantom). Your 12-word seed phrase is the master key—enter it once, stay logged in until explicit logout.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">How It Works</h2>
      <div className="bg-black/40 border border-[#00E0FF]/20 rounded-lg p-6 mb-8">
        <div className="space-y-4 font-mono text-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#00E0FF]/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-[#00E0FF]">1</span>
            </div>
            <div>
              <div className="text-white mb-1">Generate 12-Word Mnemonic</div>
              <div className="text-gray-500 text-xs">→ BIP-39 standard (128-bit entropy)</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#00E0FF]/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-[#00E0FF]">2</span>
            </div>
            <div>
              <div className="text-white mb-1">Derive Ed25519 Keypair</div>
              <div className="text-gray-500 text-xs">→ Deterministic (same mnemonic = same keys)</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#00E0FF]/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-[#00E0FF]">3</span>
            </div>
            <div>
              <div className="text-white mb-1">Store in Browser LocalStorage</div>
              <div className="text-gray-500 text-xs">→ Plaintext (browser-sandboxed, per-origin)</div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Technical Specifications</h2>
      <table className="w-full bg-black/40 border border-white/10 rounded-lg overflow-hidden mb-8">
        <thead className="bg-white/5">
          <tr>
            <th className="text-left p-4 font-bold">Component</th>
            <th className="text-left p-4 font-bold">Value</th>
            <th className="text-left p-4 font-bold">Benefit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <tr>
            <td className="p-4 text-gray-300 font-mono text-sm">Mnemonic Standard</td>
            <td className="p-4 text-sm text-gray-400">BIP-39</td>
            <td className="p-4 text-sm text-gray-400">Industry standard</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300 font-mono text-sm">Word Count</td>
            <td className="p-4 text-sm text-gray-400">12 words</td>
            <td className="p-4 text-sm text-gray-400">128-bit entropy</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300 font-mono text-sm">Key Derivation</td>
            <td className="p-4 text-sm text-gray-400">Deterministic Ed25519</td>
            <td className="p-4 text-sm text-gray-400">Cross-device support</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300 font-mono text-sm">Storage</td>
            <td className="p-4 text-sm text-gray-400">Browser LocalStorage</td>
            <td className="p-4 text-sm text-gray-400">Per-origin sandboxed</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300 font-mono text-sm">Encryption</td>
            <td className="p-4 text-sm text-gray-400">None (plaintext)</td>
            <td className="p-4 text-sm text-gray-400">Simpler UX, same security</td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-2xl font-bold mt-8 mb-4">Security Model</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-green-400">✓ Benefits</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• No password to remember</li>
            <li>• Cross-device: Same 12 words = same account</li>
            <li>• Web3 standard (like MetaMask)</li>
            <li>• Export mnemonic anytime from settings</li>
          </ul>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-amber-400">⚠️ Important Notes</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Mnemonic is your master key</li>
            <li>• Write it down offline immediately</li>
            <li>• Never share with anyone</li>
            <li>• Lost mnemonic = lost identity (unrecoverable)</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-br from-[#00E0FF]/10 to-transparent border border-[#00E0FF]/20 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-2 text-[#00E0FF]">Key Takeaway</h3>
        <p className="text-gray-300 text-sm">
          Your 12-word seed phrase is the ONLY way to recover your identity. Browser localStorage is sandboxed per-origin—same security model as password-based encryption, but simpler UX. Import the same 12 words on any device to access your Zynexa account.
        </p>
      </div>
    </div>
  );
}

function OnChainVerification() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]">
        On-Chain Verification
      </h1>

      <p className="text-lg text-gray-300 mb-8">
        Optionally publish your identity on Solana blockchain for permanent, public verification. This creates an immutable record that you control a specific public key.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Why Verify On-Chain?</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-[#00E0FF]">Permanence</h4>
          <p className="text-sm text-gray-400">Once published, your identity exists forever on Solana blockchain</p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-[#00E0FF]">Trust</h4>
          <p className="text-sm text-gray-400">Anyone can verify you control the identity without trusting Zynexa</p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-[#00E0FF]">Interoperability</h4>
          <p className="text-sm text-gray-400">Works with other Solana apps and services</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Verification Process</h2>
      <div className="space-y-4 mb-8">
        <div className="bg-black/40 border border-white/10 rounded-lg p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-[#00E0FF]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#00E0FF] text-sm">1</span>
          </div>
          <div>
            <h4 className="font-bold mb-1">Sign Verification Message</h4>
            <p className="text-sm text-gray-400">Your browser signs a message proving you control the private key</p>
          </div>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-[#00E0FF]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#00E0FF] text-sm">2</span>
          </div>
          <div>
            <h4 className="font-bold mb-1">Server Verifies Signature</h4>
            <p className="text-sm text-gray-400">Zynexa server checks the signature is valid before submitting to blockchain</p>
          </div>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-[#00E0FF]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#00E0FF] text-sm">3</span>
          </div>
          <div>
            <h4 className="font-bold mb-1">Blockchain Transaction (Mainnet)</h4>
            <p className="text-sm text-gray-400">Zynexa's fee payer wallet submits a transaction to Solana Mainnet with your public key and a memo instruction containing your identity marker</p>
          </div>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-[#00E0FF]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#00E0FF] text-sm">4</span>
          </div>
          <div>
            <h4 className="font-bold mb-1">Confirmation</h4>
            <p className="text-sm text-gray-400">Transaction hash is stored in database, marking your identity as verified</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Verification vs No Verification</h2>
      <table className="w-full bg-black/40 border border-white/10 rounded-lg overflow-hidden mb-8">
        <thead className="bg-white/5">
          <tr>
            <th className="text-left p-4 font-bold">Feature</th>
            <th className="text-left p-4 font-bold">Without Verification</th>
            <th className="text-left p-4 font-bold">With Verification</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <tr>
            <td className="p-4 text-gray-300">Cost</td>
            <td className="p-4 text-sm text-green-400">Free</td>
            <td className="p-4 text-sm text-green-400">Free (sponsored by Zynexa)</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">Privacy</td>
            <td className="p-4 text-sm text-green-400">Fully private</td>
            <td className="p-4 text-sm text-gray-400">Public key visible on-chain</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">Trust</td>
            <td className="p-4 text-sm text-gray-400">Relies on Zynexa database</td>
            <td className="p-4 text-sm text-green-400">Verified by blockchain</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">Permanence</td>
            <td className="p-4 text-sm text-gray-400">Depends on Zynexa</td>
            <td className="p-4 text-sm text-green-400">Permanent on Solana</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">Use Cases</td>
            <td className="p-4 text-sm text-gray-400">Personal use, testing</td>
            <td className="p-4 text-sm text-gray-400">Public profiles, businesses</td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-2xl font-bold mt-8 mb-4">Fee Mechanism</h2>
      <p className="text-gray-300 mb-4">
        On-chain verification is <strong className="text-[#00E0FF]">completely free</strong> for users. Zynexa sponsors all blockchain transaction fees using a system fee payer wallet.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-green-400">✓ What You Get</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Free on-chain verification</li>
            <li>• Transaction hash for proof</li>
            <li>• Viewable on Solana Explorer</li>
            <li>• Permanent blockchain record</li>
          </ul>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-[#00E0FF]">How It Works</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• System wallet pays ~0.001 SOL per verification</li>
            <li>• You receive 0.001 SOL (for rent-exempt account)</li>
            <li>• You sign proof of ownership (free)</li>
            <li>• Transaction includes identity memo</li>
            <li>• No SOL needed in your wallet initially</li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#00E0FF]/10 to-transparent border border-[#00E0FF]/20 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-bold mb-2 text-[#00E0FF]">Important: You Keep Full Control</h3>
        <p className="text-gray-300 text-sm mb-3">
          The fee payer wallet <strong>only pays transaction costs</strong>. It cannot:
        </p>
        <ul className="space-y-1 text-sm text-gray-300">
          <li>• Access your private key (always stays in your browser)</li>
          <li>• Control your identity or assets</li>
          <li>• Sign transactions on your behalf</li>
          <li>• Transfer funds from your wallet</li>
        </ul>
      </div>

      <div className="bg-gradient-to-br from-[#8A2BE2]/10 to-transparent border border-[#8A2BE2]/20 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-2 text-[#8A2BE2]">Recommendation</h3>
        <p className="text-gray-300 text-sm">
          Verification is optional and recommended for: public-facing identities, business accounts, or when maximum trust is needed. For personal, private use, verification is unnecessary.
        </p>
      </div>
    </div>
  );
}

function PrivacyGuarantees() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]">
        Privacy Guarantees
      </h1>

      <p className="text-lg text-gray-300 mb-8">
        Zynexa is designed with privacy as the foundation. Here's exactly what we can and cannot see, and how your data is protected.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">What Zynexa Cannot See</h2>
      <div className="space-y-3 mb-8">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-green-400 mb-1">Your Private Keys</h4>
            <p className="text-sm text-gray-400">Generated in your browser, never transmitted to servers</p>
          </div>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-green-400 mb-1">Your Seed Phrase</h4>
            <p className="text-sm text-gray-400">Only exists in your backup, never seen by Zynexa</p>
          </div>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-green-400 mb-1">Your Password</h4>
            <p className="text-sm text-gray-400">Used locally for encryption, never sent to servers</p>
          </div>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-green-400 mb-1">Message Content (Coming Soon)</h4>
            <p className="text-sm text-gray-400">End-to-end encrypted, only sender and recipient can read</p>
          </div>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-green-400 mb-1">File Content (Coming Soon)</h4>
            <p className="text-sm text-gray-400">Encrypted before upload to IPFS, we only see encrypted blobs</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">What Zynexa Can See</h2>
      <table className="w-full bg-black/40 border border-white/10 rounded-lg overflow-hidden mb-8">
        <thead className="bg-white/5">
          <tr>
            <th className="text-left p-4 font-bold">Data</th>
            <th className="text-left p-4 font-bold">Why Visible</th>
            <th className="text-left p-4 font-bold">Sensitivity</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <tr>
            <td className="p-4 text-gray-300">Public Key</td>
            <td className="p-4 text-sm text-gray-400">Sent during registration</td>
            <td className="p-4"><span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">PUBLIC</span></td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">Display Name (optional)</td>
            <td className="p-4 text-sm text-gray-400">You choose to share</td>
            <td className="p-4"><span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">PUBLIC</span></td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">Verification Status</td>
            <td className="p-4 text-sm text-gray-400">Stored in database</td>
            <td className="p-4"><span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">METADATA</span></td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">Transaction Hash</td>
            <td className="p-4 text-sm text-gray-400">On-chain verification record</td>
            <td className="p-4"><span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">PUBLIC</span></td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">IP Address (temporary)</td>
            <td className="p-4 text-sm text-gray-400">Server logs (not stored)</td>
            <td className="p-4"><span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">TECHNICAL</span></td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-2xl font-bold mt-8 mb-4">Privacy by Design Principles</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-black/40 border border-white/10 rounded-lg p-6">
          <h4 className="font-bold mb-4 text-[#00E0FF]">Client-Side First</h4>
          <p className="text-sm text-gray-300 mb-3">
            All sensitive operations happen in your browser:
          </p>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Key generation</li>
            <li>• Encryption/decryption</li>
            <li>• Message signing</li>
            <li>• Password hashing</li>
          </ul>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-lg p-6">
          <h4 className="font-bold mb-4 text-[#8A2BE2]">Minimal Server Data</h4>
          <p className="text-sm text-gray-300 mb-3">
            We only store what's absolutely necessary:
          </p>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Public keys (already public)</li>
            <li>• Display names (user-chosen)</li>
            <li>• Verification status</li>
            <li>• TX hashes (on-chain anyway)</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-br from-[#00E0FF]/10 to-[#8A2BE2]/10 border border-[#00E0FF]/20 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-3 text-[#00E0FF]">Our Privacy Promise</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>We cannot access your private keys or decrypt your data</span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>We never sell or share your data with third parties</span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Our code is open-source and auditable</span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>You can export and delete your data anytime</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function IdentityManagementGuide() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]">
        Identity Management
      </h1>

      <p className="text-lg text-gray-300 mb-8">
        Complete guide to managing your Zynexa identity: creating, backing up, recovering, and verifying.
      </p>

      <div className="bg-gradient-to-br from-[#00E0FF]/10 to-[#8A2BE2]/10 border border-[#00E0FF]/20 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-2 text-[#00E0FF]">Quick Start Checklist</h3>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors">
            <input type="checkbox" className="w-4 h-4" />
            <span>Create identity with strong password</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors">
            <input type="checkbox" className="w-4 h-4" />
            <span>Write down 12-word seed phrase</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors">
            <input type="checkbox" className="w-4 h-4" />
            <span>Test recovery on another device</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors">
            <input type="checkbox" className="w-4 h-4" />
            <span>Store backup in secure location</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors">
            <input type="checkbox" className="w-4 h-4" />
            <span>(Optional) Verify identity on-chain</span>
          </label>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Managing Multiple Identities</h2>
      <p className="text-gray-300 mb-4">
        You can create multiple identities for different purposes:
      </p>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-[#00E0FF]">Personal</h4>
          <p className="text-xs text-gray-400">
            For private communications and personal files
          </p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-[#8A2BE2]">Professional</h4>
          <p className="text-xs text-gray-400">
            For work-related identity and documents
          </p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-green-400">Public</h4>
          <p className="text-xs text-gray-400">
            For public-facing content and verification
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Common Tasks</h2>
      <div className="space-y-4">
        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer">How to export my identity?</summary>
          <p className="mt-3 text-sm text-gray-400">
            Your identity is your seed phrase. Simply write down your 12 words and you have exported it. You can then import on any device.
          </p>
        </details>

        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer">How to delete my identity?</summary>
          <p className="mt-3 text-sm text-gray-400">
            In Dashboard settings, click "Delete Identity". This removes encrypted keys from browser storage. Note: on-chain verified identities remain on blockchain forever (immutable).
          </p>
        </details>

        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer">Can I change my public key?</summary>
          <p className="mt-3 text-sm text-gray-400">
            No. Your public key is derived from your seed phrase and cannot be changed. To get a new public key, create a new identity with a new seed phrase.
          </p>
        </details>

        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer">How to change my display name?</summary>
          <p className="mt-3 text-sm text-gray-400">
            In Dashboard, go to Settings → Identity → Edit Display Name. If you're verified on-chain, you'll need to re-verify with the new name.
          </p>
        </details>
      </div>
    </div>
  );
}

function MessagingGuide() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]">
        Encrypted Messaging
      </h1>

      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold mb-2 text-orange-400">Coming Soon</h3>
            <p className="text-gray-300">
              End-to-end encrypted messaging is currently in development. Expected release Q2 2025.
            </p>
          </div>
        </div>
      </div>

      <p className="text-lg text-gray-300 mb-8">
        Send private messages with Signal Protocol encryption. Perfect forward secrecy ensures your conversations stay private forever.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Planned Features</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-3 text-[#00E0FF]">Security</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Signal Protocol (Double Ratchet)</li>
            <li>• Perfect forward secrecy</li>
            <li>• Metadata protection</li>
            <li>• Self-destructing messages</li>
          </ul>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-3 text-[#8A2BE2]">Features</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• 1-on-1 messaging</li>
            <li>• Group chats (up to 256 members)</li>
            <li>• File sharing</li>
            <li>• Voice/video calls</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">How It Will Work</h2>
      <div className="space-y-4">
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2">1. Find Contact by Public Key</h4>
          <p className="text-sm text-gray-400">
            Enter recipient's public key or scan QR code to add them as contact
          </p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2">2. Initiate Encrypted Session</h4>
          <p className="text-sm text-gray-400">
            Signal Protocol establishes encryption keys through Diffie-Hellman exchange
          </p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2">3. Send Encrypted Messages</h4>
          <p className="text-sm text-gray-400">
            Messages are encrypted locally before sending; only recipient can decrypt
          </p>
        </div>
      </div>
    </div>
  );
}

function DriveGuide() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]">
        Private Drive
      </h1>

      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold mb-2 text-orange-400">Coming Soon</h3>
            <p className="text-gray-300">
              Client-side encrypted file storage is currently in development. Expected release Q3 2025.
            </p>
          </div>
        </div>
      </div>

      <p className="text-lg text-gray-300 mb-8">
        Store files with client-side encryption on IPFS. Your files are encrypted before leaving your device—we only see encrypted data.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Planned Specifications</h2>
      <table className="w-full bg-black/40 border border-white/10 rounded-lg overflow-hidden mb-8">
        <thead className="bg-white/5">
          <tr>
            <th className="text-left p-4 font-bold">Feature</th>
            <th className="text-left p-4 font-bold">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <tr>
            <td className="p-4 text-gray-300">Encryption</td>
            <td className="p-4 text-sm text-gray-400">AES-256-GCM (client-side)</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">Storage</td>
            <td className="p-4 text-sm text-gray-400">IPFS distributed network</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">Max File Size</td>
            <td className="p-4 text-sm text-gray-400">5GB per file</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">Total Storage</td>
            <td className="p-4 text-sm text-gray-400">10GB free, up to 1TB paid</td>
          </tr>
          <tr>
            <td className="p-4 text-gray-300">File Sharing</td>
            <td className="p-4 text-sm text-gray-400">Encrypted share links</td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-2xl font-bold mt-8 mb-4">How It Will Work</h2>
      <div className="space-y-4">
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2">1. Select File</h4>
          <p className="text-sm text-gray-400">
            Drag-and-drop or browse to select files from your device
          </p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2">2. Client-Side Encryption</h4>
          <p className="text-sm text-gray-400">
            Files are encrypted in your browser using AES-256-GCM before upload
          </p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2">3. Upload to IPFS</h4>
          <p className="text-sm text-gray-400">
            Encrypted file is distributed across IPFS network
          </p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2">4. Access Anytime</h4>
          <p className="text-sm text-gray-400">
            Download and decrypt files on any device with your Zynexa identity
          </p>
        </div>
      </div>
    </div>
  );
}

function SwapGuide() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]">
        Stealth Swap
      </h1>

      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold mb-2 text-orange-400">Coming Soon</h3>
            <p className="text-gray-300">
              MEV-protected token swaps are currently in development. Expected release Q3 2025.
            </p>
          </div>
        </div>
      </div>

      <p className="text-lg text-gray-300 mb-8">
        Execute token swaps without revealing your wallet balance or trading patterns. Protection against MEV extraction and front-running.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">The MEV Problem</h2>
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-8">
        <h4 className="font-bold mb-3 text-red-400">Without Stealth Swap</h4>
        <p className="text-sm text-gray-300 mb-3">
          Traditional DEX swaps are vulnerable to:
        </p>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>• <strong>Front-running:</strong> Bots see your transaction and buy before you</li>
          <li>• <strong>Sandwich attacks:</strong> Buy before + sell after your trade for profit</li>
          <li>• <strong>Balance snooping:</strong> Traders see your wallet holdings</li>
          <li>• <strong>Pattern tracking:</strong> Your trading strategy is public</li>
        </ul>
      </div>

      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-8">
        <h4 className="font-bold mb-3 text-green-400">With Stealth Swap</h4>
        <p className="text-sm text-gray-300 mb-3">
          Zynexa's stealth swap protects you:
        </p>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>• <strong>Stealth addresses:</strong> Fresh address for each swap</li>
          <li>• <strong>Private RPC:</strong> Transactions not visible in public mempool</li>
          <li>• <strong>MEV protection:</strong> Direct routing prevents front-running</li>
          <li>• <strong>Hidden balance:</strong> No one can see your wallet holdings</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Supported DEXs (Planned)</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-black/40 border border-white/10 rounded-lg p-4 text-center">
          <h4 className="font-bold mb-2">Raydium</h4>
          <p className="text-xs text-gray-400">Solana's leading AMM</p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4 text-center">
          <h4 className="font-bold mb-2">Orca</h4>
          <p className="text-xs text-gray-400">User-friendly DEX</p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4 text-center">
          <h4 className="font-bold mb-2">Jupiter</h4>
          <p className="text-xs text-gray-400">Best price aggregator</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">How It Will Work</h2>
      <div className="space-y-4">
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2">1. Generate Stealth Address</h4>
          <p className="text-sm text-gray-400">
            Create a temporary address for this swap only
          </p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2">2. Transfer via Private RPC</h4>
          <p className="text-sm text-gray-400">
            Move tokens to stealth address through private relay
          </p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2">3. Execute Swap</h4>
          <p className="text-sm text-gray-400">
            Perform swap from stealth address (MEV-protected)
          </p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2">4. Receive to New Address</h4>
          <p className="text-sm text-gray-400">
            Swapped tokens sent to another stealth address you control
          </p>
        </div>
      </div>
    </div>
  );
}

function Tokenomics() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]">
        ZYNX Tokenomics
      </h1>

      <div className="bg-gradient-to-br from-[#00E0FF]/10 to-[#8A2BE2]/10 border border-[#00E0FF]/20 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-3 text-[#00E0FF]">Fair Launch on Pump.fun</h3>
        <p className="text-gray-300">
          ZYNX launches as a <strong>fair launch token on Pump.fun</strong> (Solana), ensuring equal opportunity for all participants. No presale, no private allocation—just pure community-driven growth.
        </p>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Token Metrics</h2>
      <div className="bg-black/40 border border-white/10 rounded-lg p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Total Supply</div>
            <div className="text-2xl font-bold text-[#00E0FF]">1,000,000,000 ZYNX</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Launch Platform</div>
            <div className="text-2xl font-bold text-[#8A2BE2]">Pump.fun</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Network</div>
            <div className="text-2xl font-bold">Solana</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Token Type</div>
            <div className="text-2xl font-bold">SPL Token</div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Supply Distribution</h2>
      <div className="space-y-4 mb-8">
        <div className="bg-black/40 border border-white/10 rounded-lg p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold text-lg">Community (Pump.fun Fair Launch)</h4>
              <p className="text-sm text-gray-400">Public bonding curve on Pump.fun</p>
            </div>
            <div className="text-3xl font-bold text-[#00E0FF]">95%</div>
          </div>
          <div className="text-sm text-gray-500 font-mono">950,000,000 ZYNX</div>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-lg p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold text-lg">Team Allocation</h4>
              <p className="text-sm text-gray-400">Locked for 2 years with linear vesting</p>
            </div>
            <div className="text-3xl font-bold text-[#8A2BE2]">5%</div>
          </div>
          <div className="text-sm text-gray-500 font-mono">50,000,000 ZYNX</div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Liquidity</h2>
      <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="text-xl font-bold text-green-400">100% Liquidity BURNED</h3>
        </div>
        <p className="text-gray-300">
          After bonding curve graduation on Pump.fun, all liquidity is automatically <strong>burned forever</strong>. This ensures:
        </p>
        <ul className="mt-3 space-y-2 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <span>Permanent liquidity (can never be pulled)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <span>No rug-pull risk</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <span>Community trust and confidence</span>
          </li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Buyback & Lock Mechanism</h2>
      <div className="bg-black/40 border border-[#00E0FF]/20 rounded-lg p-6 mb-8">
        <p className="text-gray-300 mb-4">
          Trading fees generated from Pump.fun are used for strategic token buybacks, which are then locked for future ecosystem development.
        </p>

        <h4 className="font-bold mb-3 text-[#00E0FF]">How it Works:</h4>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#00E0FF]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#00E0FF] font-mono text-sm">1</span>
            </div>
            <div>
              <h5 className="font-bold mb-1">Fee Collection</h5>
              <p className="text-sm text-gray-400">100% of trading fees from Pump.fun are collected by the team</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#00E0FF]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#00E0FF] font-mono text-sm">2</span>
            </div>
            <div>
              <h5 className="font-bold mb-1">Token Buyback</h5>
              <p className="text-sm text-gray-400">Fees are used to buy ZYNX tokens from the open market</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#00E0FF]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#00E0FF] font-mono text-sm">3</span>
            </div>
            <div>
              <h5 className="font-bold mb-1">Lock & Reserve</h5>
              <p className="text-sm text-gray-400">Bought tokens are locked for future development, marketing, partnerships, and emergency reserves</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-[#00E0FF]/5 border border-[#00E0FF]/20 rounded-lg p-4">
          <h5 className="font-bold mb-2 text-[#00E0FF]">Use Cases for Locked Tokens:</h5>
          <ul className="space-y-1 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-[#8A2BE2]">›</span>
              <span>Protocol development & feature expansion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#8A2BE2]">›</span>
              <span>Marketing campaigns & partnerships</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#8A2BE2]">›</span>
              <span>Ecosystem growth & community incentives</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#8A2BE2]">›</span>
              <span>Emergency reserves for unforeseen events</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Token Utility</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-[#00E0FF]">Governance</h4>
          <p className="text-sm text-gray-400">Vote on protocol upgrades, feature proposals, and treasury allocation</p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-[#00E0FF]">Staking Rewards</h4>
          <p className="text-sm text-gray-400">Stake ZYNX to earn rewards and secure the network</p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-[#00E0FF]">Premium Features</h4>
          <p className="text-sm text-gray-400">Access exclusive privacy features and increased storage limits</p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-[#00E0FF]">Fee Discounts</h4>
          <p className="text-sm text-gray-400">Get up to 50% discount on transaction fees by holding ZYNX</p>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-br from-[#8A2BE2]/10 to-transparent border border-[#8A2BE2]/20 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-2 text-[#8A2BE2]">Transparency Commitment</h3>
        <p className="text-gray-300 text-sm">
          All token transactions, buybacks, and locks are fully transparent and verifiable on-chain via Solana blockchain explorer. The community can track every movement in real-time.
        </p>
      </div>
    </div>
  );
}

function FAQ() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]">
        FAQ & Troubleshooting
      </h1>

      <p className="text-lg text-gray-300 mb-8">
        Common questions and solutions for Zynexa users.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Getting Started</h2>
      <div className="space-y-3 mb-8">
        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group open:bg-black/60">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            Do I need to provide an email or personal information?
          </summary>
          <p className="mt-3 text-sm text-gray-400 pl-6">
            No. Zynexa uses zero-knowledge identity. You only need to create a password and save your seed phrase. No email, phone number, or personal information is required.
          </p>
        </details>

        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            Is Zynexa free to use?
          </summary>
          <p className="mt-3 text-sm text-gray-400 pl-6">
            Yes. Creating an identity and on-chain verification are both completely free. Zynexa sponsors all blockchain transaction fees, so you don't need any SOL in your wallet. Future features may have premium tiers.
          </p>
        </details>

        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            Do I need SOL to verify my identity on-chain?
          </summary>
          <p className="mt-3 text-sm text-gray-400 pl-6">
            No. Zynexa sponsors all blockchain fees using a system fee payer wallet. You only need to sign a proof of ownership message in your browser (which is free). The system wallet pays the ~0.000005 SOL gas fee on Solana Mainnet.
          </p>
        </details>

        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            Can I use Zynexa on mobile?
          </summary>
          <p className="mt-3 text-sm text-gray-400 pl-6">
            Currently Zynexa works on mobile browsers, but the experience is optimized for desktop. Native mobile apps are planned for late 2025.
          </p>
        </details>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Identity & Security</h2>
      <div className="space-y-3 mb-8">
        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            I forgot my password. How do I recover my identity?
          </summary>
          <p className="mt-3 text-sm text-gray-400 pl-6">
            Use your 12-word seed phrase to restore your identity on any device. Click "Restore from Seed" on the login page and enter your words in the correct order. You'll then set a new password for that device.
          </p>
        </details>

        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            I lost my seed phrase. Can Zynexa recover it?
          </summary>
          <div className="mt-3 text-sm pl-6">
            <p className="text-red-400 font-bold mb-2">No. This is not possible.</p>
            <p className="text-gray-400">
              Your seed phrase is generated in your browser and never transmitted to Zynexa servers. We cannot recover it. If you lost both your seed phrase and access to all devices where you're logged in, your identity is permanently lost.
            </p>
          </div>
        </details>

        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            Is the fee payer system safe? Does Zynexa control my identity?
          </summary>
          <div className="mt-3 text-sm text-gray-400 pl-6">
            <p className="mb-2"><strong className="text-green-400">Yes, it's safe.</strong> The fee payer wallet only pays gas fees—it has NO access to your identity:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Your private key never leaves your browser</li>
              <li>Fee payer cannot sign transactions for you</li>
              <li>Fee payer cannot access your funds or assets</li>
              <li>You maintain full ownership and control</li>
            </ul>
            <p className="mt-2">Think of it like a courier who pays shipping fees but cannot open your package or access your home.</p>
          </div>
        </details>

        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            Someone stole my device. Is my identity safe?
          </summary>
          <p className="mt-3 text-sm text-gray-400 pl-6">
            If you used a strong password, yes. Your private key is encrypted with AES-256 and stored in browser LocalStorage. Without your password, the thief cannot access your identity. However, you should restore your identity on a new device and consider creating a fresh identity for sensitive operations.
          </p>
        </details>

        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            Can I change my public key?
          </summary>
          <p className="mt-3 text-sm text-gray-400 pl-6">
            No. Your public key is mathematically derived from your seed phrase. To get a new public key, you must create a completely new identity with a new seed phrase.
          </p>
        </details>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Technical Issues</h2>
      <div className="space-y-3 mb-8">
        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            "Invalid signature" error when publishing identity
          </summary>
          <div className="mt-3 text-sm text-gray-400 pl-6">
            <p className="mb-2">This usually means:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Browser clock is incorrect (check system time)</li>
              <li>Browser extensions interfering (try incognito mode)</li>
              <li>Corrupted local storage (clear browser data and restore from seed)</li>
            </ul>
          </div>
        </details>

        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            Login page won't load or shows blank screen
          </summary>
          <div className="mt-3 text-sm text-gray-400 pl-6">
            <p className="mb-2">Try these steps:</p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Clear browser cache and cookies</li>
              <li>Disable ad blockers/privacy extensions</li>
              <li>Try a different browser (Chrome, Firefox, Safari)</li>
              <li>Check if JavaScript is enabled</li>
            </ol>
          </div>
        </details>

        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            Transaction stuck on "Pending" for a long time
          </summary>
          <p className="mt-3 text-sm text-gray-400 pl-6">
            Solana network congestion can cause delays. Wait 2-3 minutes. If still pending after 5 minutes, check Solana network status at status.solana.com. You may need to retry the transaction.
          </p>
        </details>

        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            Getting "Network Error" or "Failed to fetch"
          </summary>
          <div className="mt-3 text-sm text-gray-400 pl-6">
            <p className="mb-2">Possible causes:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Firewall blocking zynexa.io</li>
              <li>VPN interfering with connection</li>
              <li>Solana RPC endpoint down (temporary)</li>
              <li>Server maintenance (check status page)</li>
            </ul>
          </div>
        </details>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Privacy & Data</h2>
      <div className="space-y-3 mb-8">
        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            Can Zynexa see my private keys or messages?
          </summary>
          <p className="mt-3 text-sm text-gray-400 pl-6">
            No. All encryption happens client-side in your browser. Your private keys never leave your device, and we cannot decrypt your data. This is cryptographically guaranteed by design.
          </p>
        </details>

        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            Is my data sold to advertisers?
          </summary>
          <p className="mt-3 text-sm text-gray-400 pl-6">
            No. We don't track, collect, or sell user data. We only store your public key, display name, and verification status—all of which you choose to share. There are no ads or third-party trackers on Zynexa.
          </p>
        </details>

        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            What data is stored on Zynexa servers?
          </summary>
          <div className="mt-3 text-sm text-gray-400 pl-6">
            <p className="mb-2">Only minimal public metadata:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Public key (already public by design)</li>
              <li>Display name (optional, you chose to share)</li>
              <li>Verification status (boolean)</li>
              <li>Transaction hash (if verified on-chain)</li>
            </ul>
            <p className="mt-2">We do NOT store: private keys, passwords, seed phrases, messages, or file content.</p>
          </div>
        </details>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Blockchain & Verification</h2>
      <div className="space-y-3 mb-8">
        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            Do I need SOL to use Zynexa?
          </summary>
          <p className="mt-3 text-sm text-gray-400 pl-6">
            Not for basic use. Creating an identity is free. You only need a tiny amount of SOL (~$0.001) if you want to verify your identity on-chain, which is optional.
          </p>
        </details>

        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            What's the difference between verified and unverified identity?
          </summary>
          <div className="mt-3 text-sm text-gray-400 pl-6">
            <table className="w-full text-xs mt-2">
              <thead className="text-gray-500">
                <tr>
                  <th className="text-left pb-2">Feature</th>
                  <th className="text-left pb-2">Unverified</th>
                  <th className="text-left pb-2">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-2">Cost</td>
                  <td>Free</td>
                  <td>~$0.001 SOL</td>
                </tr>
                <tr>
                  <td className="py-2">Privacy</td>
                  <td>Fully private</td>
                  <td>Public key on-chain</td>
                </tr>
                <tr>
                  <td className="py-2">Trust</td>
                  <td>Zynexa database</td>
                  <td>Blockchain verified</td>
                </tr>
                <tr>
                  <td className="py-2">Use case</td>
                  <td>Personal use</td>
                  <td>Public/business</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>

        <details className="bg-black/40 border border-white/10 rounded-lg p-4 group">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            Can I un-verify my identity from blockchain?
          </summary>
          <p className="mt-3 text-sm text-gray-400 pl-6">
            No. Blockchain transactions are immutable and permanent. Once your identity is verified on-chain, that record exists forever. This is a fundamental property of blockchain technology.
          </p>
        </details>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Still Need Help?</h2>
      <div className="bg-gradient-to-br from-[#00E0FF]/10 to-[#8A2BE2]/10 border border-[#00E0FF]/20 rounded-lg p-6">
        <p className="text-gray-300 mb-4">
          Can't find an answer? Reach out to our community or support team:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-black/40 rounded-lg p-4">
            <h4 className="font-bold mb-2">Community Discord</h4>
            <p className="text-sm text-gray-400">Chat with other users and get quick answers</p>
          </div>
          <div className="bg-black/40 rounded-lg p-4">
            <h4 className="font-bold mb-2">Email Support</h4>
            <p className="text-sm text-gray-400">support@zynexa.io (24-48hr response)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
