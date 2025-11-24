import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { getIdentityFromLocalStorage } from '../lib/crypto';
import ZynexaLanding from './home';
import ProductPage from './product';
import FeaturesPage from './features';
import AboutPage from './about';
import DocsInvestorPage from './docs-investor';
import DocsPage from './docs';
import RoadmapPage from './roadmap';

export default function RootRouter() {
  const [, setLocation] = useLocation();
  const [checking, setChecking] = useState(true);

  const checkAuthAndRedirect = async () => {
    try {
      // Check server session first
      const sessionResponse = await fetch('/api/auth/session', { credentials: 'include' });
      const sessionData = await sessionResponse.json();
      
      if (sessionData.authenticated) {
        // User has valid session, redirect to dashboard
        setLocation('/identity/dashboard');
        setChecking(false);
        return;
      }

      // No valid session, check localStorage
      const storedIdentity = getIdentityFromLocalStorage();
      if (storedIdentity) {
        // Has stored identity, redirect to login
        setLocation('/identity/login');
      } else {
        // No identity, redirect to create/import page
        setLocation('/identity');
      }
    } catch (err) {
      // Error checking auth, fallback to localStorage check
      const storedIdentity = getIdentityFromLocalStorage();
      if (storedIdentity) {
        setLocation('/identity/login');
      } else {
        setLocation('/identity');
      }
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    const hostname = window.location.hostname;
    
    // Route based on subdomain
    if (hostname.startsWith('app.')) {
      // Check authentication status before redirecting
      checkAuthAndRedirect();
    } else if (hostname.startsWith('product.')) {
      setLocation('/product');
      setChecking(false);
    } else if (hostname.startsWith('features.')) {
      setLocation('/features');
      setChecking(false);
    } else if (hostname.startsWith('about.')) {
      setLocation('/about');
      setChecking(false);
    } else if (hostname.startsWith('docs.')) {
      // Keep current path for docs subdomain (allows /docs and /docs/roadmap)
      setChecking(false);
    } else if (hostname.includes('localhost')) {
      // Development - allow manual navigation
      setChecking(false);
    } else {
      setChecking(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show loading while checking auth
  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00E0FF]/20 border-t-[#00E0FF] rounded-full animate-spin"></div>
          <p className="text-gray-400 font-mono text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Determine which page to show based on current path
  const path = window.location.pathname;
  
  if (path === '/product') return <ProductPage />;
  if (path === '/features') return <FeaturesPage />;
  if (path === '/about') return <AboutPage />;
  if (path === '/docs') return <DocsPage />;
  if (path === '/docs/roadmap') return <RoadmapPage />;
  
  // Show landing page for main domain
  return <ZynexaLanding />;
}
