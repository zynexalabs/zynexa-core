import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { KeypairProvider } from "@/contexts/KeypairContext";
import NotFound from "@/pages/not-found";
import RootRouter from "@/pages/root-router";
import Dashboard from "@/pages/dashboard";
import MessagingPage from "@/pages/messaging";
import DrivePage from "@/pages/drive";
import SwapPage from "@/pages/swap";
import BrowserPage from "@/pages/browser";
import IdentityPage from "@/pages/identity";
import IdentityDashboard from "@/pages/identity-dashboard";
import IdentityLogin from "@/pages/identity-login";
import SettingsPage from "@/pages/settings";
import ProductPage from "@/pages/product";
import FeaturesPage from "@/pages/features";
import AboutPage from "@/pages/about";
import DocsInvestorPage from "@/pages/docs-investor";
import DocsPage from "@/pages/docs";
import RoadmapPage from "@/pages/roadmap";

function Router() {
  return (
    <Switch>
      <Route path="/" component={RootRouter} />
      <Route path="/product" component={ProductPage} />
      <Route path="/features" component={FeaturesPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/docs" component={DocsPage} />
      <Route path="/docs/roadmap" component={RoadmapPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/identity" component={IdentityPage} />
      <Route path="/identity/login" component={IdentityLogin} />
      <Route path="/identity/dashboard" component={IdentityDashboard} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/messaging" component={MessagingPage} />
      <Route path="/drive" component={DrivePage} />
      <Route path="/swap" component={SwapPage} />
      <Route path="/browser" component={BrowserPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <KeypairProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </KeypairProvider>
    </QueryClientProvider>
  );
}

export default App;

// feat: add routing structure and page framework
