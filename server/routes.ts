import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertZkIdentitySchema, insertMessageSchema, insertFeatureVerificationSchema } from "@shared/schema";
import { Connection, Keypair, Transaction, SystemProgram, PublicKey } from "@solana/web3.js";
import nacl from 'tweetnacl';
import crypto from 'crypto';

// Anti-replay signature cache: stores used signature hashes with timestamp
const usedSignatures = new Map<string, number>();

// Periodically clean expired signatures (older than 5 minutes)
setInterval(() => {
  const now = Date.now();
  const fiveMinutesAgo = now - (5 * 60 * 1000);
  Array.from(usedSignatures.entries()).forEach(([hash, timestamp]) => {
    if (timestamp < fiveMinutesAgo) {
      usedSignatures.delete(hash);
    }
  });
}, 60 * 1000); // Clean every minute

// Middleware to check feature verification
async function requireFeatureVerification(featureName: string, req: any, res: any): Promise<boolean> {
  if (!req.session.publicKey) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }

  const verification = await storage.getFeatureVerification(req.session.publicKey, featureName);
  if (!verification) {
    res.status(403).json({ 
      error: "Feature verification required",
      featureName,
      message: `You must verify the "${featureName}" feature on-chain before using it`
    });
    return false;
  }

  return true;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { publicKey, signature, message } = req.body;
      
      if (!publicKey || !signature || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Verify signature
      const messageBytes = Buffer.from(message, 'utf-8');
      const signatureBytes = Buffer.from(signature, 'base64');
      const publicKeyBytes = new PublicKey(publicKey).toBytes();
      
      const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
      
      if (!isValid) {
        return res.status(401).json({ error: "Invalid signature" });
      }

      // Check if identity exists
      const identity = await storage.getIdentity(publicKey);
      if (!identity) {
        return res.status(404).json({ error: "Identity not found" });
      }

      // Create session
      console.log('[AUTH] Creating session for publicKey:', publicKey.slice(0, 10) + '...');
      req.session.publicKey = publicKey;
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error('[AUTH] Session save error:', err);
            reject(err);
          } else {
            console.log('[AUTH] Session saved successfully, sessionID:', req.sessionID);
            resolve(undefined);
          }
        });
      });

      console.log('[AUTH] Sending login success response');
      res.json({ 
        success: true,
        identity 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      await new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) reject(err);
          else resolve(undefined);
        });
      });

      res.clearCookie('connect.sid');
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/auth/session", async (req, res) => {
    try {
      console.log('[AUTH] Session check - sessionID:', req.sessionID, 'publicKey:', req.session.publicKey?.slice(0, 10) + '...' || 'NONE');
      
      if (!req.session.publicKey) {
        console.log('[AUTH] No publicKey in session - not authenticated');
        return res.json({ authenticated: false });
      }

      const identity = await storage.getIdentity(req.session.publicKey);
      if (!identity) {
        console.log('[AUTH] Identity not found in DB for session publicKey');
        req.session.destroy(() => {});
        return res.json({ authenticated: false });
      }

      console.log('[AUTH] Session authenticated for:', identity.publicKey.slice(0, 10) + '...');
      res.json({ 
        authenticated: true,
        identity 
      });
    } catch (error: any) {
      console.error('[AUTH] Session check error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ZK Identity routes
  app.post("/api/identity/register", async (req, res) => {
    try {
      const validatedData = insertZkIdentitySchema.parse(req.body);
      const identity = await storage.createIdentity(validatedData);
      res.json(identity);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/identity/:publicKey", async (req, res) => {
    try {
      const identity = await storage.getIdentity(req.params.publicKey);
      if (!identity) {
        return res.status(404).json({ error: "Identity not found" });
      }
      res.json(identity);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/identity/:publicKey", async (req, res) => {
    try {
      const { displayName } = req.body;
      
      if (!displayName || typeof displayName !== 'string') {
        return res.status(400).json({ error: "Invalid display name" });
      }

      const identity = await storage.updateDisplayName(req.params.publicKey, displayName);
      res.json(identity);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/identity/publish", async (req, res) => {
    try {
      const { publicKey, signature } = req.body;
      
      if (!publicKey || !signature) {
        return res.status(400).json({ error: "Missing publicKey or signature" });
      }

      // Verify signature
      const message = `Publish identity: ${publicKey}`;
      const messageBytes = Buffer.from(message, 'utf-8');
      const signatureBytes = Buffer.from(signature, 'base64');
      const publicKeyBytes = new PublicKey(publicKey).toBytes();
      
      const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
      
      if (!isValid) {
        return res.status(401).json({ error: "Invalid signature" });
      }

      // Load fee payer from environment
      const feePayerPrivateKey = process.env.FEE_PAYER_PRIVATE_KEY;
      if (!feePayerPrivateKey) {
        return res.status(500).json({ error: "Fee payer not configured" });
      }

      // Parse private key (JSON array format)
      let secretKey: Uint8Array;
      try {
        const privateKeyArray = JSON.parse(feePayerPrivateKey);
        secretKey = Uint8Array.from(privateKeyArray);
      } catch (parseError) {
        return res.status(500).json({ error: "Invalid fee payer private key format" });
      }

      const feePayer = Keypair.fromSecretKey(secretKey);

      // Connect to Solana mainnet
      const rpcEndpoint = process.env.SOLANA_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com";
      const connection = new Connection(rpcEndpoint, "confirmed");

      // Check fee payer balance
      const balance = await connection.getBalance(feePayer.publicKey);
      if (balance < 5000) { // Less than 0.000005 SOL
        return res.status(500).json({ 
          error: "Insufficient fee payer balance",
          details: `Current balance: ${balance / 1000000000} SOL. Please top up the fee payer wallet.`
        });
      }

      console.log(`[On-chain Publish] Fee payer balance: ${balance / 1000000000} SOL`);
      console.log(`[On-chain Publish] Publishing identity: ${publicKey.slice(0, 8)}...`);

      // Create transaction with memo
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: feePayer.publicKey,
          toPubkey: new PublicKey(publicKey),
          lamports: 1000000, // 0.001 SOL (enough for rent-exempt)
        })
      );

      // Add memo instruction (using transaction data)
      const memoData = Buffer.from(`ZK-ID:${publicKey.slice(0, 8)}`);
      transaction.add({
        keys: [],
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        data: memoData,
      });

      const txHash = await connection.sendTransaction(transaction, [feePayer]);
      console.log(`[On-chain Publish] Transaction sent: ${txHash}`);
      
      await connection.confirmTransaction(txHash);
      console.log(`[On-chain Publish] Transaction confirmed: ${txHash}`);

      // Update identity in database
      await storage.updateIdentityTxHash(publicKey, txHash);

      console.log(`[On-chain Publish] ✅ Successfully published identity ${publicKey.slice(0, 8)}...`);

      res.json({ 
        txHash,
        explorer: `https://solscan.io/tx/${txHash}`
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/identity/verify", async (req, res) => {
    try {
      const { message, signature, publicKey } = req.body;
      
      if (!message || !signature || !publicKey) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const messageBytes = Buffer.from(message, 'utf-8');
      const signatureBytes = Buffer.from(signature, 'base64');
      const publicKeyBytes = new PublicKey(publicKey).toBytes();
      
      const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
      
      res.json({ valid: isValid });
    } catch (error: any) {
      res.status(400).json({ error: error.message, valid: false });
    }
  });

  // Feature verification routes
  app.post("/api/features/verify", async (req, res) => {
    try {
      const { publicKey, featureName, signature } = req.body;
      
      if (!publicKey || !featureName || !signature) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if already verified
      const existing = await storage.getFeatureVerification(publicKey, featureName);
      if (existing) {
        return res.status(400).json({ 
          error: "Feature already verified",
          txHash: existing.txHash 
        });
      }

      // Verify signature
      const message = `Verify feature: ${featureName} for ${publicKey}`;
      const messageBytes = Buffer.from(message, 'utf-8');
      const signatureBytes = Buffer.from(signature, 'base64');
      const publicKeyBytes = new PublicKey(publicKey).toBytes();
      
      const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
      
      if (!isValid) {
        return res.status(401).json({ error: "Invalid signature" });
      }

      // Load fee payer
      const feePayerPrivateKey = process.env.FEE_PAYER_PRIVATE_KEY;
      if (!feePayerPrivateKey) {
        return res.status(500).json({ error: "Fee payer not configured" });
      }

      let secretKey: Uint8Array;
      try {
        const privateKeyArray = JSON.parse(feePayerPrivateKey);
        secretKey = Uint8Array.from(privateKeyArray);
      } catch (parseError) {
        return res.status(500).json({ error: "Invalid fee payer private key format" });
      }

      const feePayer = Keypair.fromSecretKey(secretKey);

      // Connect to Solana
      const rpcEndpoint = process.env.SOLANA_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com";
      const connection = new Connection(rpcEndpoint, "confirmed");

      // Check fee payer balance
      const balance = await connection.getBalance(feePayer.publicKey);
      if (balance < 5000) {
        return res.status(500).json({ 
          error: "Insufficient fee payer balance"
        });
      }

      console.log(`[Feature Verification] Fee payer balance: ${balance / 1000000000} SOL`);
      console.log(`[Feature Verification] Verifying feature "${featureName}" for ${publicKey.slice(0, 8)}...`);

      // Create transaction with memo
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: feePayer.publicKey,
          toPubkey: new PublicKey(publicKey),
          lamports: 100000, // 0.0001 SOL per feature
        })
      );

      const memoData = Buffer.from(`ZK-FEAT:${featureName}:${publicKey.slice(0, 8)}`);
      transaction.add({
        keys: [],
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        data: memoData,
      });

      const txHash = await connection.sendTransaction(transaction, [feePayer]);
      console.log(`[Feature Verification] Transaction sent: ${txHash}`);
      
      await connection.confirmTransaction(txHash);
      console.log(`[Feature Verification] Transaction confirmed: ${txHash}`);

      // Save to database
      const verification = await storage.createFeatureVerification({
        publicKey,
        featureName,
        txHash
      });

      console.log(`[Feature Verification] ✅ Feature "${featureName}" verified for ${publicKey.slice(0, 8)}...`);

      res.json({ 
        txHash,
        featureName,
        explorer: `https://solscan.io/tx/${txHash}`,
        verification
      });
    } catch (error: any) {
      console.error('[Feature Verification] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/features/status/:publicKey", async (req, res) => {
    try {
      const verifications = await storage.getFeatureVerificationsByPublicKey(req.params.publicKey);
      const features = verifications.map(v => v.featureName);
      res.json({ 
        verifiedFeatures: features,
        verifications 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Message routes
  app.post("/api/messages/send", async (req, res) => {
    try {
      // Require feature verification for messages
      const hasAccess = await requireFeatureVerification("messages", req, res);
      if (!hasAccess) return;

      const { fromPublicKey, toPublicKey, content, isEncrypted, signature, timestamp } = req.body;
      
      if (!fromPublicKey || !toPublicKey || !content || typeof isEncrypted !== 'boolean' || !signature || !timestamp) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Verify sender matches authenticated session
      if (fromPublicKey !== req.session.publicKey) {
        return res.status(403).json({ error: "Cannot send messages on behalf of another identity" });
      }

      // Validate timestamp to prevent replay attacks (must be within 5 minutes)
      const now = Date.now();
      const messageAge = now - timestamp;
      if (messageAge < 0 || messageAge > 5 * 60 * 1000) {
        return res.status(400).json({ error: "Invalid timestamp - message expired or from future" });
      }

      // Validate message length (max 500 chars to fit in 566 byte Memo limit)
      if (content.length > 500) {
        return res.status(400).json({ error: "Message too long (max 500 characters)" });
      }

      // Validate base64 encoding for encrypted messages
      if (isEncrypted) {
        try {
          // Attempt to decode and re-encode to verify valid base64
          const decoded = Buffer.from(content, 'base64');
          const reencoded = decoded.toString('base64');
          if (reencoded !== content) {
            return res.status(400).json({ error: "Invalid base64 encoding for encrypted message" });
          }
        } catch (e) {
          return res.status(400).json({ error: "Invalid base64 encoding for encrypted message" });
        }
      }

      // Verify signature including content, timestamp, and encryption status to prevent replay attacks
      const signedMessage = `SEND:${fromPublicKey}:${toPublicKey}:${content}:${isEncrypted}:${timestamp}`;
      const messageBytes = Buffer.from(signedMessage, 'utf-8');
      const signatureBytes = Buffer.from(signature, 'base64');
      const publicKeyBytes = new PublicKey(fromPublicKey).toBytes();
      
      const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
      
      if (!isValid) {
        return res.status(401).json({ error: "Invalid signature" });
      }

      // Check signature deduplication - prevent replay within timestamp window
      const signatureHash = crypto.createHash('sha256').update(signature).digest('hex');
      if (usedSignatures.has(signatureHash)) {
        return res.status(400).json({ error: "Signature already used - replay attack detected" });
      }
      
      // Store signature hash with current timestamp
      usedSignatures.set(signatureHash, timestamp);

      // Load fee payer from environment
      const feePayerPrivateKey = process.env.FEE_PAYER_PRIVATE_KEY;
      if (!feePayerPrivateKey) {
        return res.status(500).json({ error: "Fee payer not configured" });
      }

      // Parse private key (JSON array format)
      let secretKey: Uint8Array;
      try {
        const privateKeyArray = JSON.parse(feePayerPrivateKey);
        secretKey = Uint8Array.from(privateKeyArray);
      } catch (parseError) {
        return res.status(500).json({ error: "Invalid fee payer private key format" });
      }

      const feePayer = Keypair.fromSecretKey(secretKey);

      // Connect to Solana mainnet
      const rpcEndpoint = process.env.SOLANA_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com";
      const connection = new Connection(rpcEndpoint, "confirmed");

      // Check fee payer balance
      const balance = await connection.getBalance(feePayer.publicKey);
      if (balance < 5000) {
        return res.status(500).json({ 
          error: "Insufficient fee payer balance",
          details: `Current balance: ${balance / 1000000000} SOL`
        });
      }

      console.log(`[Message Send] Sending message from ${fromPublicKey.slice(0, 8)}... to ${toPublicKey.slice(0, 8)}...`);

      // Create memo instruction with message format
      const messageType = isEncrypted ? "ENCRYPT" : "PUBLIC";
      const memoText = `MSG:${messageType}:${fromPublicKey}:${toPublicKey}:${content}`;
      const memoData = Buffer.from(memoText);

      // Create transaction with just the memo (no transfer needed for messages)
      const transaction = new Transaction().add({
        keys: [],
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        data: memoData,
      });

      const txHash = await connection.sendTransaction(transaction, [feePayer]);
      console.log(`[Message Send] Transaction sent: ${txHash}`);
      
      await connection.confirmTransaction(txHash);
      console.log(`[Message Send] Transaction confirmed: ${txHash}`);

      // Create preview - for encrypted messages, store full content (base64 ciphertext must not be truncated)
      // For public messages, truncate to 50 chars
      const contentPreview = isEncrypted ? content : (content.length > 50 ? content.slice(0, 50) + '...' : content);

      // Save message to database for caching
      const savedMessage = await storage.createMessage({
        txHash,
        fromPublicKey,
        toPublicKey,
        isEncrypted,
        contentPreview,
      });

      console.log(`[Message Send] ✅ Message saved to database`);

      res.json({ 
        txHash,
        explorer: `https://solscan.io/tx/${txHash}`,
        message: savedMessage
      });
    } catch (error: any) {
      console.error(`[Message Send] ❌ Error:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/messages/:publicKey", async (req, res) => {
    try {
      // Require session authentication
      if (!req.session.publicKey) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { publicKey } = req.params;

      // Only allow fetching own messages
      if (publicKey !== req.session.publicKey) {
        return res.status(403).json({ error: "Cannot access messages for another identity" });
      }

      // Get messages from database cache
      const messages = await storage.getMessagesByPublicKey(publicKey);

      res.json({ messages });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Health check endpoint for fee payer and mainnet connection
  app.get("/api/health/blockchain", async (req, res) => {
    try {
      // Check if fee payer is configured
      const feePayerPrivateKey = process.env.FEE_PAYER_PRIVATE_KEY;
      if (!feePayerPrivateKey) {
        return res.status(500).json({ 
          status: "error",
          error: "Fee payer not configured" 
        });
      }

      // Parse and load fee payer
      const privateKeyArray = JSON.parse(feePayerPrivateKey);
      const secretKey = Uint8Array.from(privateKeyArray);
      const feePayer = Keypair.fromSecretKey(secretKey);

      // Connect to mainnet
      const rpcEndpoint = process.env.SOLANA_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com";
      const connection = new Connection(rpcEndpoint, "confirmed");

      // Get fee payer balance
      const balance = await connection.getBalance(feePayer.publicKey);
      const balanceSOL = balance / 1000000000;

      // Check if balance is sufficient
      const isBalanceSufficient = balance >= 5000; // 0.000005 SOL minimum

      res.json({
        status: "ok",
        network: "mainnet-beta",
        rpcEndpoint,
        feePayerPublicKey: feePayer.publicKey.toString(),
        balance: balanceSOL,
        balanceLamports: balance,
        isBalanceSufficient,
        minBalanceRequired: "0.000005 SOL",
        estimatedTransactionsRemaining: Math.floor(balance / 5000)
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error",
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
