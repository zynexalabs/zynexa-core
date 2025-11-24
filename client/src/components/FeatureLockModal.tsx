import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Lock, Shield, Loader2, ExternalLink, Check } from 'lucide-react';
import { useKeypair } from '../contexts/KeypairContext';
import { signMessage } from '../lib/crypto';

interface FeatureLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  featureDescription: string;
  onVerified: () => void;
}

export function FeatureLockModal({
  isOpen,
  onClose,
  featureName,
  featureDescription,
  onVerified,
}: FeatureLockModalProps) {
  const { keypair } = useKeypair();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleVerify = async () => {
    if (!keypair) {
      setError('No keypair found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const publicKey = keypair.publicKey.toBase58();
      const message = `Verify feature: ${featureName} for ${publicKey}`;
      const signature = signMessage(message, keypair.secretKey);

      const response = await fetch('/api/features/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          publicKey,
          featureName,
          signature,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Verification failed');
        setLoading(false);
        return;
      }

      setTxHash(data.txHash);
      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        onVerified();
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/95 border-[#00E0FF]/30 backdrop-blur-xl max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-[#00E0FF]/10 border border-[#00E0FF]/30 flex items-center justify-center">
              {success ? (
                <Check className="w-6 h-6 text-green-400" />
              ) : (
                <Lock className="w-6 h-6 text-[#00E0FF]" />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl text-white">
                {success ? 'Feature Unlocked' : 'Feature Locked'}
              </DialogTitle>
              <p className="text-sm text-gray-400 font-mono">
                {featureName}
              </p>
            </div>
          </div>
          <DialogDescription className="text-gray-300 leading-relaxed">
            {success
              ? `You now have full access to ${featureDescription}.`
              : `Verify on Solana to unlock ${featureDescription}.`}
          </DialogDescription>
        </DialogHeader>

        {!success && (
          <div className="space-y-4 mt-4">
            <div className="bg-[#00E0FF]/5 border border-[#00E0FF]/20 rounded-lg p-4">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-[#00E0FF] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <p className="font-semibold text-white mb-1">On Chain Verification</p>
                  <p>
                    A small transaction (0.0001 SOL) will be published to Solana Mainnet to verify your access. 
                    Transaction costs are sponsored by the platform.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm font-mono" data-testid="text-verify-error">
                  {error}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-white/20 hover:border-white/40"
                disabled={loading}
                data-testid="button-cancel-verify"
              >
                Cancel
              </Button>
              <Button
                onClick={handleVerify}
                disabled={loading}
                className="flex-1 bg-[#00E0FF] text-black hover:bg-[#00E0FF]/90 font-medium"
                data-testid="button-verify-feature"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Verify Now (Free)
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {success && txHash && (
          <div className="space-y-4 mt-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-400 text-sm mb-2 font-semibold">
                Verification Complete
              </p>
              <p className="text-gray-300 text-sm">
                Transaction confirmed on Solana Mainnet.
              </p>
            </div>

            <a
              href={`https://solscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border border-[#00E0FF]/20 hover:border-[#00E0FF]/40 text-[#00E0FF] transition-all"
              data-testid="link-explorer"
            >
              <ExternalLink className="w-4 h-4" />
              View on Solscan
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
