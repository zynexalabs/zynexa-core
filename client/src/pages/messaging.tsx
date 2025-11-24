import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { MessageSquare, Send, Lock, LockOpen, ExternalLink, Loader2, User, Shield } from 'lucide-react';
import { getIdentityFromLocalStorage, signMessage, encryptMessage, decryptMessage } from '../lib/crypto';
import { useKeypair } from '../contexts/KeypairContext';
import { useToast } from '../hooks/use-toast';
import { FeatureLockModal } from '../components/FeatureLockModal';

interface Message {
  id: number;
  txHash: string;
  fromPublicKey: string;
  toPublicKey: string;
  isEncrypted: boolean;
  contentPreview: string | null;
  createdAt: string;
  decryptedContent?: string | null;
}

interface Conversation {
  contactPublicKey: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export default function MessagingPage() {
  const { toast } = useToast();
  const { keypair } = useKeypair();
  const [myPublicKey, setMyPublicKey] = useState<string>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [recipientInput, setRecipientInput] = useState<string>('');
  const [isEncrypted, setIsEncrypted] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [showLockModal, setShowLockModal] = useState<boolean>(false);
  const [checkingVerification, setCheckingVerification] = useState<boolean>(true);

  useEffect(() => {
    const identity = getIdentityFromLocalStorage();
    if (identity) {
      setMyPublicKey(identity.publicKey);
      console.log('[Messaging] Loaded identity publicKey:', identity.publicKey);
      checkFeatureVerification(identity.publicKey);
    } else {
      console.log('[Messaging] No identity found in localStorage');
      setCheckingVerification(false);
    }
    
    // Check keypair in localStorage
    const storedKeypair = localStorage.getItem('zk_keypair');
    console.log('[Messaging] Keypair in localStorage:', storedKeypair ? 'EXISTS' : 'MISSING');
    console.log('[Messaging] Keypair from context:', keypair ? 'EXISTS' : 'MISSING');
  }, []);

  const checkFeatureVerification = async (publicKey: string) => {
    try {
      const response = await fetch(`/api/features/status/${publicKey}`);
      const data = await response.json();
      
      if (response.ok) {
        const hasMessagesVerified = data.verifiedFeatures.includes('messages');
        setIsVerified(hasMessagesVerified);
        if (!hasMessagesVerified) {
          setShowLockModal(true);
        }
      }
    } catch (error) {
      console.error('[Messaging] Failed to check feature verification:', error);
    } finally {
      setCheckingVerification(false);
    }
  };

  useEffect(() => {
    if (keypair && myPublicKey) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [keypair, myPublicKey]);

  useEffect(() => {
    if (messages.length > 0) {
      buildConversations();
    }
  }, [messages, myPublicKey]);

  const fetchMessages = async () => {
    if (!myPublicKey || !keypair) {
      console.log('[Messaging] Cannot fetch - missing myPublicKey or keypair', { myPublicKey: !!myPublicKey, keypair: !!keypair });
      return;
    }
    
    console.log('[Messaging] Fetching messages for', myPublicKey);
    
    try {
      const response = await fetch(`/api/messages/${myPublicKey}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log('[Messaging] Received', data.messages.length, 'messages');
        
        const messagesWithDecryption = await Promise.all(
          data.messages.map(async (msg: Message) => {
            if (msg.isEncrypted && msg.contentPreview) {
              // For NaCl box decryption, we need the OTHER party's public key
              // If we sent it (fromPublicKey === myPublicKey), decrypt with recipient's key (toPublicKey)
              // If we received it (toPublicKey === myPublicKey), decrypt with sender's key (fromPublicKey)
              const otherPartyKey = msg.fromPublicKey === myPublicKey 
                ? msg.toPublicKey 
                : msg.fromPublicKey;
              
              console.log('[Messaging] Decrypting message', msg.id, {
                fromMe: msg.fromPublicKey === myPublicKey,
                otherPartyKey: otherPartyKey.slice(0, 8) + '...',
                hasKeypair: !!keypair
              });
              
              const decrypted = decryptMessage(
                msg.contentPreview,
                otherPartyKey,
                keypair.secretKey
              );
              
              console.log('[Messaging] Decrypt result for msg', msg.id, decrypted ? 'SUCCESS' : 'FAILED');
              
              return { ...msg, decryptedContent: decrypted };
            }
            return msg;
          })
        );
        setMessages(messagesWithDecryption);
      }
    } catch (error: any) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const buildConversations = () => {
    const contactMap = new Map<string, Conversation>();
    
    messages.forEach(msg => {
      const contactKey = msg.fromPublicKey === myPublicKey 
        ? msg.toPublicKey 
        : msg.fromPublicKey;
      
      const content = msg.isEncrypted 
        ? (msg.decryptedContent || '[Encrypted]')
        : (msg.contentPreview || '');
      
      if (!contactMap.has(contactKey)) {
        contactMap.set(contactKey, {
          contactPublicKey: contactKey,
          lastMessage: content.substring(0, 50),
          timestamp: msg.createdAt,
          unreadCount: 0
        });
      }
    });
    
    setConversations(Array.from(contactMap.values()));
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !recipientInput.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter both recipient and message"
      });
      return;
    }

    if (messageInput.length > 500) {
      toast({
        variant: "destructive",
        title: "Message too long",
        description: "Maximum 500 characters allowed"
      });
      return;
    }

    if (!keypair) {
      toast({
        variant: "destructive",
        title: "Unlock required",
        description: "Please login first"
      });
      return;
    }

    setIsSending(true);

    try {
      let content = messageInput;
      
      if (isEncrypted) {
        content = encryptMessage(messageInput, recipientInput, keypair.secretKey);
      }

      // Sign message with content, timestamp, and encryption status to prevent replay attacks
      const timestamp = Date.now();
      const signatureMessage = `SEND:${myPublicKey}:${recipientInput}:${content}:${isEncrypted}:${timestamp}`;
      const signature = signMessage(signatureMessage, keypair.secretKey);

      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromPublicKey: myPublicKey,
          toPublicKey: recipientInput,
          content,
          isEncrypted,
          signature,
          timestamp
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: (
            <div className="flex items-center gap-2">
              <span>View on Solscan</span>
              <a 
                href={data.explorer} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#00E0FF] hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )
        });
        setMessageInput('');
        fetchMessages();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to send",
        description: error.message
      });
    } finally {
      setIsSending(false);
    }
  };

  const filteredMessages = selectedContact
    ? messages.filter(msg => 
        msg.fromPublicKey === selectedContact || msg.toPublicKey === selectedContact
      )
    : [];

  if (!keypair) {
    return (
      <DashboardLayout currentPath="/messaging">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <Card className="bg-black/40 border-[#00E0FF]/20 backdrop-blur-sm p-8 text-center">
            <Lock className="w-16 h-16 text-[#00E0FF] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Login Required</h2>
            <p className="text-gray-400 mb-6">
              Please login to access encrypted messaging
            </p>
            <Button 
              onClick={() => window.location.href = '/identity/login'}
              className="bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]"
            >
              Go to Login
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (checkingVerification) {
    return (
      <DashboardLayout currentPath="/messaging">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <Card className="bg-black/40 border-[#00E0FF]/20 backdrop-blur-sm p-8 text-center">
            <Loader2 className="w-16 h-16 text-[#00E0FF] mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-white mb-4">Checking Access</h2>
            <p className="text-gray-400">
              Verifying feature permissions...
            </p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!isVerified) {
    return (
      <DashboardLayout currentPath="/messaging">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <Card className="bg-black/40 border-[#00E0FF]/20 backdrop-blur-sm p-8 text-center">
            <Shield className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Feature Locked</h2>
            <p className="text-gray-400 mb-6">
              Verify on chain to unlock private messaging features.
            </p>
            <Button 
              onClick={() => setShowLockModal(true)}
              className="bg-[#00E0FF] text-black hover:bg-[#00E0FF]/90"
              data-testid="button-unlock-messages"
            >
              <Shield className="w-4 h-4 mr-2" />
              Verify Now (Free)
            </Button>
          </Card>
        </div>
        <FeatureLockModal
          isOpen={showLockModal}
          onClose={() => setShowLockModal(false)}
          featureName="messages"
          featureDescription="private messaging"
          onVerified={() => {
            setIsVerified(true);
            setShowLockModal(false);
          }}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPath="/messaging">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] via-white to-[#8A2BE2] mb-2">
            Private Messaging
          </h1>
          <p className="text-gray-400">On-chain encrypted communication</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
          <Card className="bg-black/40 border-[#00E0FF]/20 backdrop-blur-sm p-4 overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Conversations</h3>
            
            <div className="space-y-2">
              <div className="mb-4">
                <Label className="text-xs text-gray-400">New Conversation</Label>
                <Input
                  placeholder="Recipient Public Key"
                  value={recipientInput}
                  onChange={(e) => {
                    setRecipientInput(e.target.value);
                    setSelectedContact(e.target.value);
                  }}
                  className="bg-black/60 border-[#00E0FF]/30 text-xs"
                  data-testid="input-recipient"
                />
              </div>

              {conversations.map((conv) => (
                <div
                  key={conv.contactPublicKey}
                  onClick={() => {
                    setSelectedContact(conv.contactPublicKey);
                    setRecipientInput(conv.contactPublicKey);
                  }}
                  className={`p-3 rounded cursor-pointer transition-all ${
                    selectedContact === conv.contactPublicKey
                      ? 'bg-[#00E0FF]/20 border border-[#00E0FF]/50'
                      : 'bg-black/40 hover:bg-black/60 border border-transparent'
                  }`}
                  data-testid={`conversation-${conv.contactPublicKey}`}
                >
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-[#00E0FF] mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 truncate font-mono">
                        {conv.contactPublicKey.slice(0, 8)}...{conv.contactPublicKey.slice(-4)}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="md:col-span-2 bg-black/40 border-[#00E0FF]/20 backdrop-blur-sm flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {selectedContact ? (
                filteredMessages.length > 0 ? (
                  filteredMessages.map((msg) => {
                    const isMe = msg.fromPublicKey === myPublicKey;
                    const content = msg.isEncrypted 
                      ? (msg.decryptedContent || '[Unable to decrypt]')
                      : (msg.contentPreview || '');

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        data-testid={`message-${msg.id}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            isMe
                              ? 'bg-gradient-to-r from-[#00E0FF]/20 to-[#8A2BE2]/20 border border-[#00E0FF]/30'
                              : 'bg-black/60 border border-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {msg.isEncrypted ? (
                              <Lock className="w-3 h-3 text-[#00E0FF]" />
                            ) : (
                              <LockOpen className="w-3 h-3 text-gray-400" />
                            )}
                            <span className="text-xs text-gray-400">
                              {msg.isEncrypted ? 'Encrypted' : 'Public'}
                            </span>
                          </div>
                          <p className="text-sm text-white break-words">{content}</p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700/50">
                            <span className="text-xs text-gray-500">
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </span>
                            <a
                              href={`https://solscan.io/tx/${msg.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#00E0FF] hover:underline flex items-center gap-1"
                              data-testid={`link-solscan-${msg.id}`}
                            >
                              View on Solscan
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-500 mt-20">
                    No messages yet. Start the conversation!
                  </div>
                )
              ) : (
                <div className="text-center text-gray-500 mt-20">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  Select a conversation or enter a recipient to start messaging
                </div>
              )}
            </div>

            <div className="border-t border-[#00E0FF]/20 p-4 space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isEncrypted}
                    onCheckedChange={setIsEncrypted}
                    data-testid="toggle-encryption"
                  />
                  <Label className="text-sm flex items-center gap-2">
                    {isEncrypted ? (
                      <>
                        <Lock className="w-4 h-4 text-[#00E0FF]" />
                        <span className="text-[#00E0FF]">Encrypted</span>
                      </>
                    ) : (
                      <>
                        <LockOpen className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">Public</span>
                      </>
                    )}
                  </Label>
                </div>
                <span className="text-xs text-gray-500">
                  {messageInput.length}/500
                </span>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder={isEncrypted ? "Type encrypted message..." : "Type public message..."}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                  className="bg-black/60 border-[#00E0FF]/30"
                  maxLength={500}
                  data-testid="input-message"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isSending || !messageInput.trim() || !selectedContact}
                  className="bg-gradient-to-r from-[#00E0FF] to-[#8A2BE2]"
                  data-testid="button-send"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
