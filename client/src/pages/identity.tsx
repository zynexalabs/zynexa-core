import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  generateMnemonic,
  createIdentityFromMnemonic,
  mnemonicToKeypair,
  saveIdentityToLocalStorage,
  signMessage,
  saveKeypairToLocalStorage,
  saveMnemonicToLocalStorage,
} from '../lib/crypto';
import { useKeypair } from '../contexts/KeypairContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Copy, Check, Shield, Lock } from 'lucide-react';
import Header from '../components/Header';
import zynLogo from "@assets/file_00000000570c7207af3c30941c82de96_1763899068789.png";

export default function IdentityPage() {
  const [, setLocation] = useLocation();
  const { setKeypair } = useKeypair();
  const [step, setStep] = useState<'choice' | 'create' | 'import'>('choice');
  const [mnemonic, setMnemonic] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [importMnemonic, setImportMnemonic] = useState('');
  const [mnemonicSaved, setMnemonicSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateNew = () => {
    try {
      console.log('Creating new identity...');
      const newMnemonic = generateMnemonic();
      console.log('Generated mnemonic:', newMnemonic);
      setMnemonic(newMnemonic);
      setStep('create');
    } catch (error) {
      console.error('Error generating mnemonic:', error);
      setError('Failed to generate mnemonic: ' + (error as Error).message);
    }
  };

  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmBackup = async () => {
    if (!mnemonicSaved) {
      setError('Please confirm you have saved your seed phrase');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { identity, keypair } = createIdentityFromMnemonic(mnemonic);
      
      saveIdentityToLocalStorage(identity);
      saveKeypairToLocalStorage(keypair);
      saveMnemonicToLocalStorage(mnemonic);
      setKeypair(keypair);

      // Register identity on backend
      const response = await fetch('/api/identity/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          publicKey: identity.publicKey,
          displayName: displayName || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register identity');
      }

      // Create session by signing a login message
      const loginMessage = `Login to Zynexa: ${Date.now()}`;
      const loginSignature = signMessage(loginMessage, keypair.secretKey);

      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          publicKey: identity.publicKey,
          message: loginMessage,
          signature: loginSignature,
        }),
      });

      if (!loginResponse.ok) {
        console.error('Failed to create session');
      }

      setLocation('/identity/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create identity');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!importMnemonic.trim()) {
      setError('Please enter your seed phrase');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { identity, keypair } = createIdentityFromMnemonic(importMnemonic.trim());
      
      saveIdentityToLocalStorage(identity);
      saveKeypairToLocalStorage(keypair);
      saveMnemonicToLocalStorage(importMnemonic.trim());
      setKeypair(keypair);

      // Check if identity exists, if not register it
      const checkResponse = await fetch(`/api/identity/${identity.publicKey}`, { credentials: 'include' });
      if (checkResponse.status === 404) {
        await fetch('/api/identity/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            publicKey: identity.publicKey,
            displayName: displayName || undefined,
          }),
        });
      }

      // Create session by signing a login message
      const loginMessage = `Login to Zynexa: ${Date.now()}`;
      const loginSignature = signMessage(loginMessage, keypair.secretKey);

      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          publicKey: identity.publicKey,
          message: loginMessage,
          signature: loginSignature,
        }),
      });

      if (!loginResponse.ok) {
        console.error('Failed to create session');
      }

      setLocation('/identity/dashboard');
    } catch (err: any) {
      setError('Invalid seed phrase or failed to import identity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>

      <Header />

      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 max-w-2xl">
        <div className="mb-12 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#00E0FF]/5 border border-[#00E0FF]/20 rounded px-3 py-1 text-xs font-mono text-[#00E0FF] w-max mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E0FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E0FF]"></span>
            </span>
            ZK IDENTITY SYSTEM
          </div>
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-md bg-black border border-white/10 flex items-center justify-center">
              <img src={zynLogo} alt="Zynexa Logo" className="w-full h-full object-contain p-1" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] via-white to-[#8A2BE2]">
              ZK Identity
            </h1>
          </div>
          <p className="text-gray-400 text-base md:text-lg max-w-xl text-center">
            Create your anonymous, verifiable digital identity
          </p>
        </div>

        {step === 'choice' && (
          <div className="space-y-4">
            <Card className="bg-black/40 border-[#00E0FF]/20 backdrop-blur-sm p-6 md:p-8 hover:border-[#00E0FF]/40 transition-all">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Create New Identity</h2>
              <p className="text-gray-400 mb-6 font-mono text-sm">
                Generate a new cryptographic identity with a secure seed phrase
              </p>
              <Button
                onClick={handleCreateNew}
                className="w-full bg-[#00E0FF] text-black hover:bg-[#00E0FF]/90 font-medium"
                data-testid="button-create-identity"
              >
                Create New Identity
              </Button>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-sm p-6 md:p-8 hover:border-white/20 transition-all">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Import Existing</h2>
              <p className="text-gray-400 mb-6 font-mono text-sm">
                Restore your identity using your seed phrase
              </p>
              <Button
                onClick={() => setStep('import')}
                variant="outline"
                className="w-full border-white/20 hover:border-[#00E0FF]/40 hover:text-[#00E0FF]"
                data-testid="button-import-identity"
              >
                Import Identity
              </Button>
            </Card>
          </div>
        )}

        {step === 'create' && (
          <Card className="bg-black/40 border-[#00E0FF]/20 backdrop-blur-sm p-4 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Backup Your Seed Phrase</h2>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
              <p className="text-red-400 text-xs md:text-sm font-mono leading-relaxed">
                ⚠️ CRITICAL: Write down these 12 words and store them safely. This is the ONLY way to recover your identity.
              </p>
            </div>

            <div className="bg-black/60 border border-[#00E0FF]/20 rounded-lg p-3 md:p-6 mb-4 md:mb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-4">
                {mnemonic.split(' ').map((word, i) => (
                  <div key={i} className="bg-black/50 border border-white/10 px-2 md:px-3 py-2 rounded text-center">
                    <span className="text-gray-500 text-xs mr-1">{i + 1}.</span>
                    <span className="text-white font-mono text-sm md:text-base">{word}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleCopyMnemonic}
                variant="outline"
                className="w-full border-[#00E0FF]/20 hover:border-[#00E0FF]/40 hover:text-[#00E0FF]"
                data-testid="button-copy-mnemonic"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" /> Copy Seed Phrase
                  </>
                )}
              </Button>
            </div>

            {/* Entropy Visualizer */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Entropy Strength</h3>
                  <p className="text-green-400 text-sm font-mono">128-bit Security</p>
                </div>
              </div>

              {/* Strength Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400 font-mono">Cryptographic Strength</span>
                  <span className="text-sm text-green-400 font-bold font-mono">MAXIMUM</span>
                </div>
                <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-green-500/20">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 rounded-full animate-pulse"
                    style={{ width: '100%' }}
                    data-testid="entropy-bar"
                  ></div>
                </div>
              </div>

              {/* Entropy Details */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-black/40 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-400 font-mono">Entropy Bits</span>
                  </div>
                  <p className="text-white font-bold text-xl font-mono" data-testid="entropy-bits">128</p>
                </div>
                <div className="bg-black/40 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-400 font-mono">Word Count</span>
                  </div>
                  <p className="text-white font-bold text-xl font-mono" data-testid="word-count">12</p>
                </div>
              </div>

              {/* Security Explanation */}
              <div className="bg-black/40 border border-green-500/20 rounded-lg p-3">
                <p className="text-green-200/90 text-xs md:text-sm font-mono leading-relaxed">
                  ✓ Your seed phrase has <strong>128 bits of entropy</strong>, providing 2<sup>128</sup> possible combinations.
                  <br />
                  ✓ That's <strong>340 undecillion possibilities</strong>, making brute force attacks computationally infeasible.
                  <br />
                  ✓ Uses <strong>BIP-39 standard</strong> with cryptographically secure randomness (same as major crypto wallets).
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-mono">Display Name (Optional)</label>
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Choose a display name"
                  className="bg-black/40 border-[#00E0FF]/20 text-white"
                  data-testid="input-display-name"
                />
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="mnemonic-saved"
                    checked={mnemonicSaved}
                    onCheckedChange={(checked) => setMnemonicSaved(checked as boolean)}
                    className="mt-1"
                    data-testid="checkbox-mnemonic-saved"
                  />
                  <label htmlFor="mnemonic-saved" className="text-amber-200 text-sm font-mono leading-relaxed cursor-pointer">
                    I have securely saved my 12-word seed phrase. I understand this is the only way to recover my identity.
                  </label>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                <p className="text-red-400 text-sm font-mono" data-testid="text-error">{error}</p>
              </div>
            )}

            <Button
              onClick={handleConfirmBackup}
              disabled={loading}
              className="w-full bg-[#00E0FF] text-black hover:bg-[#00E0FF]/90 font-medium"
              data-testid="button-confirm-backup"
            >
              {loading ? 'Creating Identity...' : 'I Have Backed Up My Seed Phrase'}
            </Button>
          </Card>
        )}

        {step === 'import' && (
          <Card className="bg-black/40 border-[#00E0FF]/20 backdrop-blur-sm p-4 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Import Your Identity</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-mono">Seed Phrase (12 words)</label>
                <textarea
                  value={importMnemonic}
                  onChange={(e) => setImportMnemonic(e.target.value)}
                  placeholder="Enter your 12-word seed phrase separated by spaces"
                  className="w-full bg-black/40 border border-[#00E0FF]/20 rounded-lg px-4 py-3 text-white font-mono resize-none focus:outline-none focus:border-[#00E0FF]/40"
                  rows={3}
                  data-testid="input-import-mnemonic"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block font-mono">Display Name (Optional)</label>
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Choose a display name"
                  className="bg-black/40 border-[#00E0FF]/20 text-white"
                  data-testid="input-display-name-import"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                <p className="text-red-400 text-sm font-mono" data-testid="text-error-import">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => setStep('choice')}
                variant="outline"
                className="flex-1 border-white/20 hover:border-white/40"
                data-testid="button-back"
              >
                Back
              </Button>
              <Button
                onClick={handleImport}
                disabled={loading}
                className="flex-1 bg-[#00E0FF] text-black hover:bg-[#00E0FF]/90 font-medium"
                data-testid="button-import-submit"
              >
                {loading ? 'Importing...' : 'Import Identity'}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// feat: create identity management pages
