import { useState } from 'react';
import { useLocation } from 'wouter';
import { mnemonicToKeypair, signMessage, saveKeypairToLocalStorage, saveIdentityToLocalStorage, saveMnemonicToLocalStorage } from '../lib/crypto';
import { useKeypair } from '../contexts/KeypairContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import Header from '../components/Header';

export default function IdentityLogin() {
  const [, setLocation] = useLocation();
  const { setKeypair } = useKeypair();
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mnemonic.trim()) {
      setError('Please enter your 12-word seed phrase');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Derive keypair from mnemonic
      const keypair = mnemonicToKeypair(mnemonic.trim());
      const publicKey = keypair.publicKey.toBase58();

      // Save identity, keypair, and mnemonic
      saveIdentityToLocalStorage({ publicKey });
      saveKeypairToLocalStorage(keypair);
      saveMnemonicToLocalStorage(mnemonic.trim());
      setKeypair(keypair);

      // Create session by signing a login message
      const loginMessage = `Login to Zynexa: ${Date.now()}`;
      const loginSignature = signMessage(loginMessage, keypair.secretKey);

      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          publicKey,
          message: loginMessage,
          signature: loginSignature,
        }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        setError(errorData.error || 'Failed to create session');
        setLoading(false);
        return;
      }

      // Successfully logged in with session
      setLocation('/identity/dashboard');
    } catch (err: any) {
      setError('Invalid seed phrase - please check and try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>

      <Header />

      <div className="relative z-10 w-full max-w-md px-4 pt-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-md bg-black border border-white/10 flex items-center justify-center">
              <img src={zynLogo} alt="Zynexa Logo" className="w-full h-full object-contain p-1" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] via-white to-[#8A2BE2]">
              Welcome Back
            </h1>
          </div>
          <p className="text-gray-400 text-base md:text-lg">
            Unlock your ZK Identity
          </p>
        </div>

        <Card className="bg-black/40 border-[#00E0FF]/20 backdrop-blur-sm p-4 md:p-8">
          <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
            <div>
              <label className="text-sm text-gray-400 mb-2 block font-mono">Your Seed Phrase (12 words)</label>
              <Textarea
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                placeholder="Enter your 12-word seed phrase separated by spaces"
                className="bg-black/40 border-[#00E0FF]/20 text-white font-mono text-sm h-24 resize-none"
                autoFocus
                data-testid="input-mnemonic-login"
              />
              <p className="text-xs text-gray-500 mt-2 font-mono">
                Enter the same seed phrase you used when creating your identity
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm font-mono" data-testid="text-login-error">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !mnemonic.trim()}
              className="w-full bg-[#00E0FF] text-black hover:bg-[#00E0FF]/90 font-medium"
              data-testid="button-login-submit"
            >
              {loading ? 'Unlocking...' : 'Unlock Identity'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setLocation('/identity')}
                className="text-sm text-gray-400 hover:text-[#00E0FF] transition-colors font-mono"
                data-testid="link-create-new"
              >
                Don't have an identity? Create one
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}