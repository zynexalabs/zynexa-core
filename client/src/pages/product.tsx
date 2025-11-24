import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import Header from "@/components/Header";
import { Shield, Zap, Lock, Globe, CheckCircle2 } from "lucide-react";

export default function ProductPage() {
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
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
      
      <Header />
      
      <div className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-[#00E0FF]/5 border border-[#00E0FF]/20 rounded-full px-4 py-2 text-xs font-mono text-[#00E0FF] mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E0FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E0FF]"></span>
              </span>
              PRODUCT OVERVIEW
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] via-white to-[#8A2BE2]">
              The Private OS for Web3
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Zynexa is a comprehensive privacy-first operating system built for the decentralized web. 
              Combining zero-knowledge cryptography, end-to-end encryption, and blockchain technology 
              to create a truly private digital experience.
            </p>
          </div>

          {/* Value Propositions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            <ValueProp 
              icon={Shield}
              title="Zero-Knowledge Privacy"
              description="Your identity and data remain private through advanced ZK-proof cryptography"
            />
            <ValueProp 
              icon={Lock}
              title="End-to-End Encryption"
              description="All communications encrypted with Curve25519 (NaCl box) ensuring only sender and recipient can read messages"
            />
            <ValueProp 
              icon={Zap}
              title="MEV Protection"
              description="Stealth addresses protect your transactions from front-running and MEV extraction"
            />
            <ValueProp 
              icon={Globe}
              title="Decentralized"
              description="Built on Solana blockchain for true decentralization and censorship resistance"
            />
          </div>

          {/* System Architecture */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-4 text-center">System Architecture</h2>
            <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Zynexa's modular architecture separates identity, storage, communication, and transaction layers 
              while maintaining seamless integration through our unified privacy protocol.
            </p>
            <div className="bg-black/40 border border-[#00E0FF]/20 rounded-lg p-8 backdrop-blur-sm">
              <div ref={mermaidRef} className="mermaid">
{`graph TB
    subgraph Client["Client Layer"]
        UI[Web Interface]
        Crypto[Client-Side Cryptography]
    end
    
    subgraph Identity["Identity Layer"]
        ZK[ZK Identity System]
        KeyMgmt[Key Management]
        Auth[Authentication]
    end
    
    subgraph Privacy["Privacy Layer"]
        E2E[E2E Encryption]
        Stealth[Stealth Addresses]
        ZKProof[ZK Proofs]
    end
    
    subgraph Services["Service Layer"]
        Msg[Encrypted Messaging]
        Drive[Private Drive]
        Swap[Stealth Swap]
    end
    
    subgraph Blockchain["Blockchain Layer"]
        Solana[Solana Network]
        Smart[Smart Contracts]
    end
    
    subgraph Storage["Storage Layer"]
        DB[(PostgreSQL)]
        IPFS[Distributed Storage]
    end
    
    UI --> Crypto
    Crypto --> ZK
    ZK --> KeyMgmt
    ZK --> Auth
    Auth --> E2E
    E2E --> Msg
    E2E --> Drive
    KeyMgmt --> Stealth
    Stealth --> Swap
    ZKProof --> Solana
    Msg --> DB
    Drive --> IPFS
    Swap --> Smart
    Smart --> Solana
    
    style Client fill:#00E0FF20,stroke:#00E0FF
    style Identity fill:#8A2BE220,stroke:#8A2BE2
    style Privacy fill:#00E0FF20,stroke:#00E0FF
    style Services fill:#8A2BE220,stroke:#8A2BE2
    style Blockchain fill:#00E0FF20,stroke:#00E0FF
    style Storage fill:#8A2BE220,stroke:#8A2BE2`}
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-4 text-center">Primary Use Cases</h2>
            <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Zynexa serves multiple user segments requiring privacy, security, and decentralization.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <UseCase 
                title="Privacy-Conscious Individuals"
                items={[
                  "Secure personal communications",
                  "Private file storage",
                  "Anonymous transactions",
                  "Identity protection"
                ]}
              />
              <UseCase 
                title="Crypto Traders & DeFi Users"
                items={[
                  "MEV-protected swaps",
                  "Anonymous trading",
                  "Stealth addresses",
                  "Portfolio privacy"
                ]}
              />
              <UseCase 
                title="Journalists & Activists"
                items={[
                  "Censorship-resistant communication",
                  "Source protection",
                  "Secure document sharing",
                  "Anonymous publishing"
                ]}
              />
            </div>
          </div>

          {/* Key Features Summary */}
          <div className="bg-gradient-to-br from-[#00E0FF]/10 to-[#8A2BE2]/10 border border-[#00E0FF]/20 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Core Capabilities</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Capability text="Deterministic Ed25519 keypairs from BIP-39 mnemonic (cross-device support)" />
              <Capability text="BIP-39 seed phrase backup for identity recovery" />
              <Capability text="On-chain identity verification via Solana blockchain" />
              <Capability text="End-to-end encrypted messaging with perfect forward secrecy" />
              <Capability text="Encrypted file storage with client-side encryption" />
              <Capability text="MEV-protected token swaps using stealth addresses" />
              <Capability text="Zero-knowledge proofs for privacy-preserving authentication" />
              <Capability text="Decentralized architecture resistant to censorship" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ValueProp({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-6 hover:border-[#00E0FF]/40 transition-all backdrop-blur-sm">
      <Icon className="w-10 h-10 text-[#00E0FF] mb-4" />
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function UseCase({ title, items }: { title: string, items: string[] }) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
      <h3 className="text-xl font-bold mb-4 text-[#00E0FF]">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-300">
            <CheckCircle2 className="w-5 h-5 text-[#8A2BE2] flex-shrink-0 mt-0.5" />
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Capability({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="w-5 h-5 text-[#00E0FF] flex-shrink-0 mt-0.5" />
      <span className="text-gray-200">{text}</span>
    </div>
  );
}
