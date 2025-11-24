import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  getIdentityFromLocalStorage,
  clearIdentityFromLocalStorage,
  getMnemonicFromLocalStorage,
  clearMnemonicFromLocalStorage,
} from '../lib/crypto';
import { useKeypair } from '../contexts/KeypairContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { 
  Eye, 
  EyeOff, 
  Copy, 
  Check,
  LogOut,
  Key,
  User,
  AlertTriangle,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import Header from '../components/Header';
import zynLogo from "@assets/file_00000000570c7207af3c30941c82de96_1763899068789.png";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { clearKeypair } = useKeypair();
  const [identity, setIdentity] = useState<any>(null);
  const [dbIdentity, setDbIdentity] = useState<any>(null);
  
  // Export Mnemonic State
  const [showExportSection, setShowExportSection] = useState(false);
  const [mnemonic, setMnemonic] = useState('');
  const [mnemonicRevealed, setMnemonicRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportError, setExportError] = useState('');

  // Display Name State
  const [editingName, setEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [updatingName, setUpdatingName] = useState(false);

  useEffect(() => {
    const storedIdentity = getIdentityFromLocalStorage();
    if (!storedIdentity) {
      setLocation('/identity/login');
      return;
    }

    setIdentity(storedIdentity);

    // Fetch identity data from backend
    fetch(`/api/identity/${storedIdentity.publicKey}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setDbIdentity(data);
        setNewDisplayName(data.displayName || '');
      })
      .catch(err => console.error('Failed to fetch identity:', err));
  }, [setLocation]);

  const handleExportMnemonic = () => {
    setExportError('');

    try {
      const retrievedMnemonic = getMnemonicFromLocalStorage();
      
      if (retrievedMnemonic) {
        setMnemonic(retrievedMnemonic);
        setMnemonicRevealed(true);
      } else {
        setExportError('Seed phrase not found. Your identity may have been created before this feature was added.');
      }
    } catch (err: any) {
      setExportError('Failed to retrieve seed phrase');
    }
  };

  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateDisplayName = async () => {
    if (!newDisplayName.trim()) return;

    setUpdatingName(true);
    try {
      const response = await fetch(`/api/identity/${identity.publicKey}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ displayName: newDisplayName }),
      });

      if (response.ok) {
        const updated = await response.json();
        setDbIdentity(updated);
        setEditingName(false);
      }
    } catch (err) {
      console.error('Failed to update display name:', err);
    } finally {
      setUpdatingName(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to logout?')) return;

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Failed to logout:', err);
    }
    
    clearIdentityFromLocalStorage();
    clearMnemonicFromLocalStorage();
    clearKeypair();
    setLocation('/');
  };

  if (!identity) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>

      <Header />

      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 max-w-4xl">
        <div className="mb-8">
          <Button
            onClick={() => setLocation('/identity/dashboard')}
            variant="ghost"
            className="text-gray-400 hover:text-white mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-md bg-black border border-white/10 flex items-center justify-center">
              <img src={zynLogo} alt="Zynexa Logo" className="w-full h-full object-contain p-1" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] via-white to-[#8A2BE2]">
              Settings
            </h1>
          </div>
        </div>

        <div className="space-y-6">
          {/* Account Information */}
          <Card className="bg-black/40 border-[#00E0FF]/20 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-[#00E0FF]" />
              <h2 className="text-xl font-bold text-white">Account Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-mono">Display Name</label>
                {editingName ? (
                  <div className="flex gap-2">
                    <Input
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      className="bg-black/40 border-[#00E0FF]/20 text-white"
                      placeholder="Enter display name"
                      data-testid="input-display-name"
                    />
                    <Button
                      onClick={handleUpdateDisplayName}
                      disabled={updatingName}
                      className="bg-[#00E0FF] text-black hover:bg-[#00E0FF]/90"
                      data-testid="button-save-name"
                    >
                      {updatingName ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                    </Button>
                    <Button
                      onClick={() => setEditingName(false)}
                      variant="outline"
                      className="border-white/20"
                      data-testid="button-cancel-edit"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-white font-medium" data-testid="text-current-name">
                      {dbIdentity?.displayName || 'No display name set'}
                    </p>
                    <Button
                      onClick={() => setEditingName(true)}
                      variant="outline"
                      className="border-[#00E0FF]/20 hover:border-[#00E0FF]/40 text-[#00E0FF]"
                      data-testid="button-edit-name"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block font-mono">Public Key</label>
                <p className="text-white font-mono text-sm break-all bg-black/40 border border-white/10 rounded p-3" data-testid="text-public-key-settings">
                  {identity.publicKey}
                </p>
              </div>

              {dbIdentity?.createdAt && (
                <div>
                  <label className="text-sm text-gray-400 mb-2 block font-mono">Account Created</label>
                  <p className="text-white" data-testid="text-created-date">
                    {new Date(dbIdentity.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Export Mnemonic */}
          <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Export Seed Phrase</h2>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
              <div className="flex gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-200/90">
                  <p className="font-semibold mb-1">Security Warning</p>
                  <p>Never share your seed phrase with anyone. Anyone with access to your seed phrase can control your identity and assets.</p>
                </div>
              </div>
            </div>

            {!showExportSection ? (
              <Button
                onClick={() => setShowExportSection(true)}
                variant="outline"
                className="w-full border-yellow-500/20 hover:border-yellow-500/40 text-yellow-400"
                data-testid="button-show-export"
              >
                <Key className="w-4 h-4 mr-2" />
                Reveal Seed Phrase
              </Button>
            ) : (
              <div className="space-y-4">
                {!mnemonicRevealed ? (
                  <>
                    {exportError && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <p className="text-red-400 text-sm font-mono" data-testid="text-export-error">{exportError}</p>
                      </div>
                    )}

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4">
                      <p className="text-amber-200 text-sm font-mono">
                        ⚠️ Make sure you are in a private location. Your seed phrase will be displayed in plain text.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleExportMnemonic}
                        className="flex-1 bg-yellow-500 text-black hover:bg-yellow-500/90"
                        data-testid="button-export-mnemonic"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Reveal Seed Phrase
                      </Button>
                      <Button
                        onClick={() => {
                          setShowExportSection(false);
                          setExportError('');
                        }}
                        variant="outline"
                        className="border-white/20"
                        data-testid="button-cancel-export"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-black/60 border border-yellow-500/20 rounded-lg p-4">
                      <label className="text-sm text-gray-400 mb-2 block font-mono">Your Seed Phrase (12 Words)</label>
                      <p className="text-white font-mono text-lg leading-relaxed" data-testid="text-mnemonic-words">
                        {mnemonic}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleCopyMnemonic}
                        className="flex-1 bg-[#00E0FF] text-black hover:bg-[#00E0FF]/90"
                        data-testid="button-copy-mnemonic"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Seed Phrase
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => {
                          setMnemonicRevealed(false);
                          setShowExportSection(false);
                          setMnemonic('');
                        }}
                        variant="outline"
                        className="border-white/20"
                        data-testid="button-hide-mnemonic"
                      >
                        Hide
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Danger Zone */}
          <Card className="bg-red-950/20 border-red-500/20 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h2 className="text-xl font-bold text-white">Danger Zone</h2>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                Logging out will clear your encrypted identity from this browser. Make sure you have your seed phrase saved.
              </p>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-red-500/40 hover:border-red-500 hover:bg-red-500/10 text-red-400 hover:text-red-300"
                data-testid="button-logout-danger"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout from This Device
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
