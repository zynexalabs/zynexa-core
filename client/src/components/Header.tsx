import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import zynLogo from "/zynexa-logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [isDashboard, setIsDashboard] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    const path = window.location.pathname;
    setIsDevelopment(hostname.includes('localhost'));
    
    // Check if on dashboard pages
    setIsDashboard(
      path.startsWith('/identity/dashboard') || 
      path === '/messaging' || 
      path === '/drive' || 
      path === '/swap' || 
      path === '/browser' || 
      path === '/settings'
    );
    
    // Set active tab based on subdomain or path
    if (hostname.startsWith('product.') || path === '/product') {
      setActiveTab('product');
    } else if (hostname.startsWith('features.') || path === '/features') {
      setActiveTab('features');
    } else if (hostname.startsWith('about.') || path === '/about') {
      setActiveTab('about');
    } else if (hostname.startsWith('docs.') || path === '/docs' || path.startsWith('/docs')) {
      setActiveTab(path === '/docs/roadmap' ? 'roadmap' : 'docs');
    } else {
      setActiveTab('');
    }
  }, []);

  const getNavHref = (subdomain: string, path: string) => {
    if (isDevelopment) {
      return path;
    }
    // Production: navigate to subdomain root
    return `https://${subdomain}.zynexa.io`;
  };

  const handleLogoClick = () => {
    const hostname = window.location.hostname;
    const isProduction = !hostname.includes('localhost');
    
    // In production, check if on subdomain or main domain
    if (isProduction) {
      // If on any subdomain (contains dot before zynexa.io) OR is explicitly a known subdomain
      const isSubdomain = hostname !== 'zynexa.io' && hostname.endsWith('zynexa.io');
      
      if (isSubdomain) {
        // Redirect to main domain from ANY subdomain
        window.location.href = 'https://zynexa.io';
      } else {
        // Already on main domain, go to root
        window.location.href = '/';
      }
    } else {
      // Development environment, go to root
      window.location.href = '/';
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 lg:px-24 py-4 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <div onClick={handleLogoClick} className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-md bg-black border border-white/10 flex items-center justify-center group relative overflow-hidden">
            <img src={zynLogo} alt="Zynexa Logo" className="w-full h-full object-contain p-1" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold tracking-tight text-white text-lg">Zynexa</span>
          </div>
        </div>

        {/* desktop tab menu */}
        <div className="hidden md:flex items-center gap-8">
          <TabItem label="Product" id="product" active={activeTab==='product'} href={getNavHref('product', '/product')} />
          <TabItem label="Features" id="features" active={activeTab==='features'} href={getNavHref('features', '/features')} />
          <TabItem label="About" id="about" active={activeTab==='about'} href={getNavHref('about', '/about')} />
          <TabItem label="Docs" id="docs" active={activeTab==='docs'} href={getNavHref('docs', '/docs')} />
          <TabItem label="Roadmap" id="roadmap" active={activeTab==='roadmap'} href={isDevelopment ? '/docs/roadmap' : 'https://docs.zynexa.io/roadmap'} />
        </div>

        {/* mobile burger - hidden on dashboard pages */}
        {!isDashboard && (
          <div className="md:hidden">
            <button onClick={()=>setOpen(!open)} className="p-2 rounded bg-white/5 text-gray-300 hover:text-white">
              {open ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
            </button>
          </div>
        )}
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
              <MobileLink label="Product" href={getNavHref('product', '/product')} />
              <MobileLink label="Features" href={getNavHref('features', '/features')} />
              <MobileLink label="About" href={getNavHref('about', '/about')} />
              <MobileLink label="Docs" href={getNavHref('docs', '/docs')} />
              <MobileLink label="Roadmap" href={isDevelopment ? '/docs/roadmap' : 'https://docs.zynexa.io/roadmap'} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function TabItem({ label, id, active, href } : { label: string, id: string, active: boolean, href: string }) {
  const handleClick = () => {
    window.location.href = href;
  };

  return (
    <button 
      onClick={handleClick} 
      className={`relative text-sm font-medium transition-all duration-200 py-1 ${
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

function MobileLink({ label, href }: { label: string, href: string }) {
  return (
    <a 
      href={href}
      className="block py-3 text-gray-400 border-b border-white/5 hover:text-white hover:pl-2 transition-all cursor-pointer font-mono text-sm uppercase tracking-wider"
    >
      {label}
    </a>
  );
}
