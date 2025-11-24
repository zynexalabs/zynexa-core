import React from "react";
import { Link } from "wouter";
import { ArrowLeft, Terminal } from "lucide-react";
import Header from "./Header";

export default function FeaturePage({ title, type }: { title: string, type: string }) {
  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-[#00E0FF]/30">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%] opacity-20 pointer-events-none"></div>
      
      <Header />
      
      <div className="p-8 pt-32">
        <Link href="/">
          <span className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00E0FF] transition-colors mb-8 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN_TO_ROOT</span>
          </span>
        </Link>

        <div className="max-w-4xl mx-auto mt-20 border border-white/10 bg-black/50 backdrop-blur-md rounded-lg overflow-hidden">
          <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
            <div className="text-xs text-gray-500">zynexa_module_{type}.exe</div>
          </div>
          
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#00E0FF]/10 flex items-center justify-center mb-6 border border-[#00E0FF]/20">
              <Terminal className="w-10 h-10 text-[#00E0FF]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {title} <span className="text-[#00E0FF]">Active</span>
            </h1>
            <p className="text-gray-400 max-w-lg mb-8">
              Secure channel established. This module is currently running in a protected environment.
            </p>
            
            <div className="w-full max-w-md bg-black border border-white/10 p-4 rounded font-mono text-xs text-left space-y-2">
              <div className="text-green-500">➜ System initialized</div>
              <div className="text-gray-400">Loading encryption keys... [OK]</div>
              <div className="text-gray-400">Connecting to ZK circuit... [OK]</div>
              <div className="text-[#00E0FF] animate-pulse">Waiting for user input_</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
