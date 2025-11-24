import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  getIdentityFromLocalStorage,
  getKeypairFromLocalStorage,
  signMessage,
} from '../../lib/crypto';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { 
  ExternalLink, 
  Copy, 
  Check,
  Rocket,
  Loader2
} from 'lucide-react';

export default function DashboardHome() {
  const [, setLocation] = useLocation();
  const [identity, setIdentity] = useState<any>(null);
  const [dbIdentity, setDbIdentity] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');

  useEffect(() => {
    const storedIdentity = getIdentityFromLocalStorage();
    if (storedIdentity) {
      setIdentity(storedIdentity);
      
      fetch(`/api/identity/${storedIdentity.publicKey}`)
        .then(res => res.json())
        .then(data => setDbIdentity(data))
        .catch(err => console.error('Failed to fetch identity:', err));
    }
  }, []);

  const handleCopyPublicKey = () => {
    if (identity) {
      navigator.clipboard.writeText(identity.publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePublishOnChain = async () => {
    if (!identity) return;

    setPublishing(true);
    setPublishError('');

    try {
      const keypair = getKeypairFromLocalStorage();
      if (!keypair) {
        setPublishError('Keypair not found. Please log in again.');
        setPublishing(false);
        return;
      }

      const message = `Publish identity: ${identity.publicKey}`;
      const signature = signMessage(message, keypair.secretKey);

      const response = await fetch('/api/identity/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: identity.publicKey,
          signature,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to publish');
      }

      const result = await response.json();
      
      const updatedIdentity = await fetch(`/api/identity/${identity.publicKey}`).then(r => r.json());
      setDbIdentity(updatedIdentity);

      alert(`✅ Identity published on-chain!\n\nTransaction: ${result.txHash}\n\nView on explorer: ${result.explorer}`);
    } catch (err: any) {
      setPublishError(err.message || 'Failed to publish on-chain');
    } finally {
      setPublishing(false);
    }
  };

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] via-white to-[#8A2BE2] mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-400">Manage your ZK Identity and access Zynexa features</p>
      </div>

      <div className="space-y-6">
        <Card className="bg-black/40 border-[#00E0FF]/20 backdrop-blur-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Your ZK Identity</h2>
              {dbIdentity?.displayName && (
                <p className="text-[#00E0FF] text-lg font-medium" data-testid="text-display-name">
                  {dbIdentity.displayName}
                </p>
              )}
            </div>
            {dbIdentity?.isVerified && (
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium font-mono">Verified</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block font-mono">Public Key (Your ID)</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-black/60 border border-[#00E0FF]/20 rounded-lg px-4 py-3">
                  <p className="text-white font-mono text-sm break-all" data-testid="text-public-key">
                    {identity.publicKey}
                  </p>
                </div>
                <Button
                  onClick={handleCopyPublicKey}
                  variant="outline"
                  className="border-[#00E0FF]/20 hover:border-[#00E0FF]/40 hover:text-[#00E0FF]"
                  data-testid="button-copy-public-key"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {dbIdentity?.createdAt && (
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-mono">Created</label>
                <p className="text-white font-mono" data-testid="text-created-at">
                  {new Date(dbIdentity.createdAt).toLocaleString()}
                </p>
              </div>
            )}

            {dbIdentity?.onchainTxHash ? (
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-mono">On-Chain Transaction</label>
                <a
                  href={`https://solscan.io/tx/${dbIdentity.onchainTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#00E0FF] hover:text-[#00E0FF]/80 transition-colors"
                  data-testid="link-explorer"
                >
                  <span className="font-mono text-sm">{dbIdentity.onchainTxHash.slice(0, 16)}...</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-3 font-mono">
                  Your identity is not yet published on-chain. Publish it to make it verifiable on Solana Mainnet.
                </p>
                {publishError && (
                  <p className="text-red-400 text-sm mb-3 font-mono" data-testid="text-publish-error">
                    Error: {publishError}
                  </p>
                )}
                <Button
                  onClick={handlePublishOnChain}
                  disabled={publishing}
                  className="w-full bg-[#00E0FF] text-black hover:bg-[#00E0FF]/90 font-medium"
                  data-testid="button-publish-onchain"
                >
                  {publishing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publishing on Solana...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Publish On-Chain
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
