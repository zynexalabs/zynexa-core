import { useState } from "react";
import Header from "@/components/Header";
import { Shield, MessageSquare, HardDrive, Repeat, ChevronRight } from "lucide-react";

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 0,
      name: "ZK Identity System",
      icon: Shield,
      tagline: "Self-Sovereign Identity with Zero-Knowledge Proofs",
      description: "Create and manage your digital identity without relying on centralized authorities. Using Ed25519 cryptography and zero-knowledge proofs, your identity remains private while being verifiable on-chain.",
      workflow: `sequenceDiagram
    participant User
    participant Browser
    participant LocalStorage
    participant Server
    participant FeePayer
    participant Solana
    
    User->>Browser: Request New Identity
    Browser->>Browser: Generate BIP-39 Mnemonic (12 words)
    Browser->>Browser: Derive Ed25519 Keypair
    Browser->>User: Display 12-Word Seed Phrase
    User->>User: Save Seed Phrase Offline
    Browser->>LocalStorage: Store Mnemonic + Keypair (plaintext)
    Browser->>Server: Register Public Key + Signature
    Server->>Server: Verify Signature
    Server->>FeePayer: Load Fee Payer Wallet
    FeePayer->>Solana: Create & Send Transaction (Mainnet)
    Solana-->>Server: Transaction Hash
    Server-->>Browser: On-chain Proof + Explorer Link`,
      specs: [
        { feature: "Key Generation", value: "Ed25519 (Curve25519)" },
        { feature: "Seed Phrase", value: "BIP-39 (128-bit entropy, 12 words)" },
        { feature: "Derivation", value: "Deterministic (same mnemonic = same identity)" },
        { feature: "Cross-Device", value: "Import same 12 words on any device" },
        { feature: "On-Chain Network", value: "Solana Mainnet-Beta" },
        { feature: "Storage", value: "Browser Local Storage (browser-sandboxed)" },
        { feature: "System Cost", value: "~0.001 SOL (~$0.14) per verification" },
        { feature: "User Cost", value: "Free (you receive 0.001 SOL)" },
        { feature: "Fee Mechanism", value: "Sponsored by system (free for users)" }
      ]
    },
    {
      id: 1,
      name: "Encrypted Messaging",
      icon: MessageSquare,
      tagline: "End-to-End Encrypted Communication with Perfect Forward Secrecy",
      description: "Send private messages that only you and your intended recipient can read. Messages are encrypted client-side using the Signal Protocol, ensuring that not even our servers can access your conversations.",
      workflow: `sequenceDiagram
    participant Alice
    participant AliceDevice
    participant Server
    participant BobDevice
    participant Bob
    
    Alice->>AliceDevice: Compose Message
    AliceDevice->>AliceDevice: Encrypt with Bob's Public Key
    AliceDevice->>AliceDevice: Sign with Alice's Private Key
    AliceDevice->>Server: Send Encrypted Message
    Server->>Server: Store Encrypted (cannot decrypt)
    Server->>BobDevice: Forward Encrypted Message
    BobDevice->>BobDevice: Verify Alice's Signature
    BobDevice->>BobDevice: Decrypt with Bob's Private Key
    BobDevice->>Bob: Display Plain Text`,
      specs: [
        { feature: "Encryption Protocol", value: "Double Ratchet Algorithm" },
        { feature: "Key Exchange", value: "X3DH (Extended Triple Diffie-Hellman)" },
        { feature: "Message Encryption", value: "AES-256-GCM" },
        { feature: "Forward Secrecy", value: "Perfect Forward Secrecy (PFS)" },
        { feature: "Authentication", value: "Ed25519 Signatures" },
        { feature: "Metadata Protection", value: "Minimal metadata stored" }
      ]
    },
    {
      id: 2,
      name: "Private Drive",
      icon: HardDrive,
      tagline: "Zero-Knowledge Encrypted File Storage",
      description: "Store your files with complete privacy. All files are encrypted on your device before upload, ensuring that only you hold the decryption keys. Even Zynexa cannot access your stored files.",
      workflow: `sequenceDiagram
    participant User
    participant Browser
    participant Encryption
    participant IPFS
    participant Database
    
    User->>Browser: Select File to Upload
    Browser->>Encryption: Generate Random File Key
    Encryption->>Encryption: Encrypt File (AES-256-GCM)
    Encryption->>Encryption: Encrypt File Key with User's Public Key
    Encryption->>IPFS: Upload Encrypted File
    IPFS-->>Encryption: Return Content Hash (CID)
    Encryption->>Database: Store Metadata + Encrypted Key
    Database-->>Browser: Upload Confirmed
    Browser-->>User: File Securely Stored`,
      specs: [
        { feature: "File Encryption", value: "AES-256-GCM" },
        { feature: "Key Management", value: "RSA-OAEP for key wrapping" },
        { feature: "Storage Backend", value: "IPFS (Distributed)" },
        { feature: "Chunking", value: "256KB chunks for large files" },
        { feature: "Deduplication", value: "Content-addressed storage" },
        { feature: "Max File Size", value: "5GB per file" }
      ]
    },
    {
      id: 3,
      name: "Stealth Swap",
      icon: Repeat,
      tagline: "MEV-Protected Token Swaps via Stealth Addresses",
      description: "Execute token swaps without revealing your trading patterns or wallet balance. Stealth addresses protect you from MEV extraction, front-running, and sandwich attacks.",
      workflow: `sequenceDiagram
    participant User
    participant StealthGen
    participant DEX
    participant Blockchain
    participant Relayer
    
    User->>StealthGen: Initiate Swap Request
    StealthGen->>StealthGen: Generate One-Time Stealth Address
    StealthGen->>User: Display Stealth Address
    User->>StealthGen: Transfer Tokens to Stealth
    StealthGen->>DEX: Execute Swap via Private RPC
    DEX->>Blockchain: Submit Transaction
    Blockchain-->>DEX: Swap Executed
    DEX->>Relayer: Send Output to New Stealth Address
    Relayer->>User: Transfer Complete (Private)`,
      specs: [
        { feature: "Stealth Protocol", value: "Dual-key ECDH stealth addresses" },
        { feature: "MEV Protection", value: "Private RPC + Flashbots integration" },
        { feature: "Supported DEXs", value: "Raydium, Orca, Jupiter" },
        { feature: "Slippage Protection", value: "Configurable (0.1% - 5%)" },
        { feature: "Privacy Level", value: "Transaction graph analysis resistant" },
        { feature: "Fee Structure", value: "0.3% platform fee + network fees" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
      
      <Header />
      
      <div className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#00E0FF]/5 border border-[#00E0FF]/20 rounded-full px-4 py-2 text-xs font-mono text-[#00E0FF] mb-6">
              TECHNICAL FEATURES
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] via-white to-[#8A2BE2]">
              Privacy-First Core Modules
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Deep dive into Zynexa's four core privacy modules, each built with cutting-edge cryptography and blockchain technology.
            </p>
          </div>

          {/* Feature Tabs */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeFeature === feature.id
                      ? 'bg-[#00E0FF] text-black'
                      : 'bg-black/40 border border-white/10 text-gray-400 hover:border-[#00E0FF]/40'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{feature.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Feature Detail */}
          {features.map((feature) => {
            const Icon = feature.icon;
            return activeFeature === feature.id && (
              <div key={feature.id} className="space-y-8">
                {/* Header */}
                <div className="bg-gradient-to-br from-[#00E0FF]/10 to-[#8A2BE2]/10 border border-[#00E0FF]/20 rounded-lg p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-[#00E0FF]/20 rounded-lg">
                      <Icon className="w-8 h-8 text-[#00E0FF]" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{feature.name}</h2>
                      <p className="text-[#00E0FF] text-lg font-medium">{feature.tagline}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>

                {/* Workflow Diagram */}
                <div>
                  <h3 className="text-2xl font-bold mb-4">Technical Workflow</h3>
                  <div className="bg-black/40 border border-[#00E0FF]/20 rounded-lg p-8 backdrop-blur-sm">
                    <div ref={el => { if (el) mermaidRefs.current[feature.id] = el; }} className="mermaid">
                      {feature.workflow}
                    </div>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div>
                  <h3 className="text-2xl font-bold mb-4">Technical Specifications</h3>
                  <div className="bg-black/40 border border-white/10 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-[#00E0FF]/10 border-b border-[#00E0FF]/20">
                        <tr>
                          <th className="text-left px-6 py-4 font-mono text-sm text-[#00E0FF]">Feature</th>
                          <th className="text-left px-6 py-4 font-mono text-sm text-[#00E0FF]">Implementation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feature.specs.map((spec, idx) => (
                          <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                            <td className="px-6 py-4 font-medium text-gray-300">{spec.feature}</td>
                            <td className="px-6 py-4 text-gray-400 font-mono text-sm">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Comparison Table */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Feature Comparison Matrix</h2>
            <div className="bg-black/40 border border-white/10 rounded-lg overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#00E0FF]/10 border-b border-[#00E0FF]/20">
                  <tr>
                    <th className="text-left px-6 py-4 font-mono text-sm text-[#00E0FF]">Capability</th>
                    <th className="text-center px-6 py-4 font-mono text-sm text-[#00E0FF]">ZK Identity</th>
                    <th className="text-center px-6 py-4 font-mono text-sm text-[#00E0FF]">Messaging</th>
                    <th className="text-center px-6 py-4 font-mono text-sm text-[#00E0FF]">Private Drive</th>
                    <th className="text-center px-6 py-4 font-mono text-sm text-[#00E0FF]">Stealth Swap</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "End-to-End Encryption", values: ["✓", "✓", "✓", "✓"] },
                    { name: "Zero-Knowledge Proofs", values: ["✓", "—", "—", "—"] },
                    { name: "On-Chain Verification", values: ["✓", "—", "Optional", "✓"] },
                    { name: "MEV Protection", values: ["—", "—", "—", "✓"] },
                    { name: "Perfect Forward Secrecy", values: ["—", "✓", "—", "—"] },
                    { name: "Metadata Protection", values: ["✓", "✓", "✓", "✓"] },
                    { name: "Client-Side Encryption", values: ["✓", "✓", "✓", "—"] },
                    { name: "Distributed Storage", values: ["—", "—", "✓", "—"] }
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-6 py-4 font-medium text-gray-300">{row.name}</td>
                      {row.values.map((val, i) => (
                        <td key={i} className="px-6 py-4 text-center">
                          <span className={val === "✓" ? "text-green-400 text-xl" : "text-gray-600"}>
                            {val}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
