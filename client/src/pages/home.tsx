import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Cloud, ShieldCheck, Zap, Menu, X, Lock, Eye, Globe, Server, Cpu, Key, Terminal, LayoutGrid } from "lucide-react";

// Zynexa Landing — Revised based on feedback
// 1. Header is sticky/fixed
// 2. Removed "—" symbol
// 3. Tech/Spy background effects added
// 4. Updated Feature status (Live/Upcoming)

export default function ZynexaLanding() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('product');
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative font-sans selection:bg-[#00E0FF]/30 selection:text-[#00E0FF]">
      <TechBackground />
      
      {/* Scanline effect overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20 mix-blend-overlay"></div>
      <div className="fixed inset-0 pointer-events-none z-[90] bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]"></div>

      {/* Fixed Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-[110] px-6 sm:px-12 lg:px-24 py-4 transition-all duration-300 ${
          scrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/5' : 'bg-transparent'
        }`}
      >
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center group relative overflow-hidden">
              <span className="font-bold text-white text-sm">Z</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold tracking-tight text-white text-lg">Zynexa</span>
            </div>
          </div>

          {/* desktop tab menu */}
          <div className="hidden md:flex items-center gap-8">
            <TabItem label="Product" id="product" active={activeTab==='product'} onClick={()=>setActiveTab('product')} />
            <TabItem label="Features" id="features" active={activeTab==='features'} onClick={()=>setActiveTab('features')} />
            <TabItem label="About" id="about" active={activeTab==='about'} onClick={()=>setActiveTab('about')} />
            <TabItem label="Docs" id="docs" active={activeTab==='docs'} onClick={()=>setActiveTab('docs')} />
            <TabItem label="Roadmap" id="roadmap" active={activeTab==='roadmap'} onClick={()=>setActiveTab('roadmap')} />
          </div>

          {/* mobile burger */}
          <div className="md:hidden">
            <button onClick={()=>setOpen(!open)} className="p-2 rounded bg-white/5 text-gray-300 hover:text-white">
              {open ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
            </button>
          </div>
        </nav>

        {/* mobile menu panel */}
        <AnimatePresence>
          {open && (
            <motion.div 
              initial={{opacity:0, height: 0}} 
              animate={{opacity:1, height: 'auto'}} 
              exit={{opacity:0, height: 0}}
              className="md:hidden overflow-hidden bg-black/90 backdrop-blur-xl border-t border-white/10 mt-4 -mx-6 px-6 pb-6"
            >
              <div className="flex flex-col gap-2 pt-4">
                <MobileLink label="Product" />
                <MobileLink label="Features" />
                <MobileLink label="About" />
                <MobileLink label="Docs" />
                <MobileLink label="Roadmap" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-30 px-6 sm:px-12 lg:px-24 pb-20 pt-32">
        <section className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* left - hero & CTA */}
          <motion.div initial={{opacity:0, x:-30}} animate={{opacity:1, x:0}} transition={{duration:0.6}} className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#00E0FF]/5 border border-[#00E0FF]/20 rounded px-3 py-1 text-xs font-mono text-[#00E0FF] w-max">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E0FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E0FF]"></span>
              </span>
              SYSTEM BETA V0.9
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tighter">
              Zynexa
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] via-white to-[#8A2BE2] pb-2">The Private OS for Web3</span>
            </h1>

            <p className="text-gray-400 max-w-xl text-lg leading-relaxed border-l-2 border-white/10 pl-6">
              Encrypted by default. Work, browse, message and trade. All in one private environment powered by zero-knowledge proofs.
            </p>

            <div className="w-full max-w-md pt-4">
               <LaunchTerminal />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-2">
              <div className="flex items-center gap-4 px-4 py-2 text-sm font-mono text-gray-500 border border-white/5 rounded bg-white/5">
                <span>// SECURE</span>
                <span className="text-white/20">|</span>
                <span>// ANONYMOUS</span>
                <span className="text-white/20">|</span>
                <span>// DECENTRALIZED</span>
              </div>
            </div>

            {/* Updated Badges - Tech Style */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              <TechBadge label="Live" text="Private Msg" active />
              <TechBadge label="Live" text="Encr. Drive" active />
              <TechBadge label="Live" text="Stealth Swap" active />
              <TechBadge label="Live" text="Anon Browser" active />
            </div>

          </motion.div>

          {/* right - visual */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8}} className="relative w-full flex justify-center lg:justify-end">
             <CyberDeck />
          </motion.div>
        </section>

        {/* full feature cards mid-section */}
        <section id="modules" className="max-w-7xl mx-auto mt-32">
          <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">System Modules</h2>
              <p className="text-gray-400 font-mono text-sm">/// ACTIVE AND UPCOMING PROTOCOLS</p>
            </div>
            <div className="hidden sm:flex gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-500 font-mono uppercase">System Online</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* LIVE FEATURES - Now Clickable */}
            <Link href="/messaging">
              <div className="cursor-pointer h-full">
                <FeatureCard 
                  title="Private Messaging" 
                  status="LIVE" 
                  desc="End-to-end encrypted, onchain signal protocol." 
                  Icon={Lock} 
                  active
                />
              </div>
            </Link>
            
            <Link href="/drive">
              <div className="cursor-pointer h-full">
                <FeatureCard 
                  title="Encrypted Drive" 
                  status="LIVE" 
                  desc="Decentralized file vault with ZK access controls." 
                  Icon={Server} 
                  active
                />
              </div>
            </Link>

            <Link href="/swap">
              <div className="cursor-pointer h-full">
                <FeatureCard 
                  title="Stealth Swap" 
                  status="LIVE" 
                  desc="MEV-protected swaps via stealth addresses." 
                  Icon={Zap} 
                  active
                />
              </div>
            </Link>
            
            <Link href="/browser">
              <div className="cursor-pointer h-full">
                <FeatureCard 
                  title="Anon Browser" 
                  status="LIVE" 
                  desc="Tor-routed browsing with fingerprint protection." 
                  Icon={Globe} 
                  active
                />
              </div>
            </Link>

            {/* UPCOMING TECH FEATURES - Not Clickable */}
            <FeatureCard 
              title="Ghost Relayer" 
              status="DEV" 
              desc="Transaction broadcasting without IP leakage." 
              Icon={Cpu} 
            />
            <FeatureCard 
              title="Hardware Enclave" 
              status="DEV" 
              desc="Direct integration with Secure Enclave/TEEs." 
              Icon={Key} 
            />
            <FeatureCard 
              title="P2P Mesh Net" 
              status="PLAN" 
              desc="Offline-first resilient communication layer." 
              Icon={Terminal} 
            />
          </div>
        </section>
      </main>

      <footer className="relative z-30 border-t border-white/10 bg-black/50 backdrop-blur-md mt-24 mb-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-md bg-black border border-white/10 flex items-center justify-center overflow-hidden">
              <img src={zynLogo} alt="Zynexa Logo" className="w-full h-full object-contain p-0.5" />
            </div>
            <span className="font-mono text-xl font-bold">ZYNEXA</span>
            <div className="h-4 w-px bg-white/20"></div>
            <span className="text-xs font-mono text-gray-400">EST. 2025 // GENESIS BLOCK</span>
          </div>
          <div className="text-xs text-gray-500 font-mono">
            ENCRYPTED CONNECTION ESTABLISHED
          </div>
        </div>
      </footer>
      
      <StatusTicker />

    </div>
  );
}

/* ---------- UI Components ---------- */

function StatusTicker() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 border-t border-white/10 backdrop-blur-md h-8 flex items-center overflow-hidden pointer-events-none">
      <div className="flex items-center gap-8 animate-marquee whitespace-nowrap px-4 text-[10px] font-mono text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span>SYSTEM: ONLINE</span>
        </div>
        <span className="text-white/20">|</span>
        <div>BLOCK_HEIGHT: #89,204,211</div>
        <span className="text-white/20">|</span>
        <div>TPS: 4,200</div>
        <span className="text-white/20">|</span>
        <div>AVG_GAS: 12 GWEI</div>
        <span className="text-white/20">|</span>
        <div className="text-[#00E0FF]">ENCRYPTION: AES-256-GCM ACTIVE</div>
        <span className="text-white/20">|</span>
        <div>NODES: 1,402</div>
        <span className="text-white/20">|</span>
        <div>ZK_PROVER: IDLE</div>
        <span className="text-white/20">|</span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span>SYSTEM: ONLINE</span>
        </div>
        <span className="text-white/20">|</span>
        <div>BLOCK_HEIGHT: #89,204,212</div>
        <span className="text-white/20">|</span>
        <div>TPS: 4,150</div>
        <span className="text-white/20">|</span>
        <div>AVG_GAS: 11 GWEI</div>
        <span className="text-white/20">|</span>
        <div className="text-[#00E0FF]">ENCRYPTION: AES-256-GCM ACTIVE</div>
      </div>
    </div>
  );
}

function LaunchTerminal() {
  const handleAccessSystem = () => {
    const hostname = window.location.hostname;
    if (hostname.startsWith('app.')) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = 'https://app.zynexa.io/dashboard';
    }
  };

  return (
    <div onClick={handleAccessSystem} className="block cursor-pointer">
      <div className="group relative w-full overflow-hidden rounded bg-black border border-white/20 cursor-pointer hover:border-[#00E0FF]/50 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(0,224,255,0.15)]">
         <div className="absolute inset-0 bg-gradient-to-r from-[#00E0FF]/10 to-[#8A2BE2]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
         
         {/* Animated border effect */}
         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00E0FF] to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>

         <div className="relative flex items-center px-6 py-4">
            <div className="mr-4 flex items-center justify-center w-8 h-8 rounded bg-[#00E0FF]/10 text-[#00E0FF]">
               <LayoutGrid className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold text-white group-hover:text-[#00E0FF] transition-colors tracking-wider">ACCESS_SYSTEM</span>
              <span className="text-[10px] text-gray-500 font-mono group-hover:text-gray-400">v0.9.2-beta // modules_ready</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
               <span className="hidden sm:inline-block text-[10px] font-mono text-gray-600 group-hover:text-[#00E0FF] transition-colors">ENTER_PLATFORM</span>
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            </div>
         </div>
      </div>
    </div>
  );
}

function TabItem({ label, id, active, onClick } : { label: string, id: string, active: boolean, onClick: () => void }) {
  const getSubdomain = () => {
    const currentDomain = window.location.hostname;
    const baseDomain = currentDomain.replace(/^(www\.|app\.|docs\.|about\.|features\.|product\.)/, '');
    
    switch(id) {
      case 'product': return `https://product.${baseDomain}`;
      case 'features': return `https://features.${baseDomain}`;
      case 'about': return `https://about.${baseDomain}`;
      case 'docs': return `https://docs.${baseDomain}`;
      case 'roadmap': return `https://docs.${baseDomain}/roadmap`;
      default: return `https://${baseDomain}`;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
    window.location.href = getSubdomain();
  };

  return (
    <button 
      onClick={handleClick}
      className={`relative text-sm font-medium transition-all duration-200 py-1 cursor-pointer ${
        active ? 'text-white' : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      {label}
      {active && (
        <motion.div layoutId="tab-indicator" className="absolute -bottom-1 left-0 right-0 h-px bg-[#00E0FF] shadow-[0_0_8px_rgba(0,224,255,0.8)]" />
      )}
    </button>
  );
}

function MobileLink({ label }: { label: string }) {
  const getSubdomain = () => {
    const currentDomain = window.location.hostname;
    const baseDomain = currentDomain.replace(/^(www\.|app\.|docs\.|about\.|features\.|product\.)/, '');
    
    switch(label) {
      case 'Product': return `https://product.${baseDomain}`;
      case 'Features': return `https://features.${baseDomain}`;
      case 'About': return `https://about.${baseDomain}`;
      case 'Docs': return `https://docs.${baseDomain}`;
      case 'Roadmap': return `https://docs.${baseDomain}/roadmap`;
      default: return `https://${baseDomain}`;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = getSubdomain();
  };

  return (
    <a 
      onClick={handleClick}
      className="block py-3 text-gray-400 border-b border-white/5 hover:text-white hover:pl-2 transition-all cursor-pointer font-mono text-sm uppercase tracking-wider"
    >
      {label}
    </a>
  );
}

function TechBadge({ label, text, active }: { label: string, text: string, active?: boolean }) {
  return (
    <div className="flex flex-col bg-white/5 border border-white/10 rounded p-2 hover:border-[#00E0FF]/30 transition-colors group">
      <div className="flex items-center justify-between mb-1">
        <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-amber-500'}`}></div>
        <span className="text-[8px] uppercase font-mono text-gray-500">{label}</span>
      </div>
      <div className="text-xs font-bold text-gray-300 group-hover:text-white truncate">{text}</div>
    </div>
  );
}

function FeatureCard({ title, status, desc, Icon, active }: { title: string, status: string, desc: string, Icon: any, active?: boolean }) {
  return (
    <div className="group relative bg-black border border-white/10 p-6 hover:border-[#00E0FF]/50 transition-all duration-300 overflow-hidden h-full">
      {/* Hover Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00E0FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded bg-white/5 border border-white/10 ${active ? 'text-[#00E0FF] shadow-[0_0_15px_rgba(0,224,255,0.15)]' : 'text-gray-500'}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className={`text-[10px] font-mono px-2 py-1 border ${
            status === 'LIVE' 
              ? 'border-green-500/30 text-green-400 bg-green-500/5' 
              : 'border-white/10 text-gray-500'
          }`}>
            {status}
          </div>
        </div>
        
        <h3 className={`text-lg font-bold mb-2 ${active ? 'text-white' : 'text-gray-400'}`}>{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors">{desc}</p>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-[#00E0FF] transition-colors"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-[#00E0FF] transition-colors"></div>
    </div>
  );
}

/* ---------- Enhanced Tech Background ---------- */

function TechBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
      {/* Base Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
      
      {/* Moving Matrix/Code Rain Effect (Simulated with gradients for performance) */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_20%,#00E0FF_25%,transparent_30%)] bg-[length:100%_200%] animate-scan-slow"></div>
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00E0FF] rounded-full blur-[150px] opacity-10 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#8A2BE2] rounded-full blur-[150px] opacity-10 animate-pulse-slow animation-delay-2000"></div>
    </div>
  );
}

/* ---------- Cyber Deck Visual (Spy/Tech Feel) ---------- */

function CyberDeck() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Main Terminal Window */}
      <div className="relative bg-black/80 border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="text-[10px] font-mono text-gray-500 uppercase">root@zynexa-node:~</div>
        </div>
        
        {/* Content Area */}
        <div className="p-6 font-mono text-xs sm:text-sm space-y-2 h-[320px] overflow-hidden relative">
          {/* Scanline inside terminal */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] opacity-10 pointer-events-none"></div>

          <div className="text-gray-500">$ init_secure_handshake --v2</div>
          <div className="text-[#00E0FF]">
            <span className="mr-2">[SUCCESS]</span>
            Handshake established. ID: 0x7F...3A
          </div>
          
          <div className="text-gray-500 mt-4">$ scan_network --stealth</div>
          <div className="space-y-1 pl-2 border-l border-white/10 ml-1">
            <div className="flex justify-between">
              <span className="text-white">Node_Alpha</span>
              <span className="text-green-500">ACTIVE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white">Relay_09</span>
              <span className="text-green-500">ACTIVE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Proxy_Gate</span>
              <span className="text-amber-500">STANDBY</span>
            </div>
          </div>

          <div className="text-gray-500 mt-4">$ decrypt_vault --key=***</div>
          <div className="text-[#8A2BE2] animate-pulse">
             Unlocking secure storage...
          </div>
          
          {/* Animated Data Stream */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20"></div>
          <div className="absolute bottom-4 left-6 right-6 border-t border-[#00E0FF]/30 pt-2 flex justify-between text-[10px] text-[#00E0FF]/70">
             <span>MEM: 24TB ENCRYPTED</span>
             <span>UP: 99.99%</span>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div 
        animate={{ y: [0, -10, 0] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-12 top-20 bg-black border border-[#00E0FF]/30 p-3 rounded shadow-[0_0_20px_rgba(0,224,255,0.1)] z-30 hidden sm:block"
      >
        <div className="text-[10px] font-mono text-[#00E0FF] mb-1">ENCRYPTION LEVEL</div>
        <div className="text-xl font-bold text-white">AES-256-GCM</div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -left-8 bottom-12 bg-black border border-[#8A2BE2]/30 p-3 rounded shadow-[0_0_20px_rgba(138,43,226,0.1)] z-30 hidden sm:block"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#8A2BE2] rounded-full animate-ping"></div>
          <div className="text-[10px] font-mono text-[#8A2BE2]">LIVE THREAT DETECTED</div>
        </div>
        <div className="text-xs text-gray-400 mt-1">0 blocked in last 10s</div>
      </motion.div>
    </div>
  );
}