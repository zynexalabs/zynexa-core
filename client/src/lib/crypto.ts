import { generateMnemonic as generateBip39Mnemonic, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { Keypair, PublicKey } from '@solana/web3.js';
import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';
import { convertSecretKey, convertPublicKey } from 'ed2curve';

export interface Identity {
  publicKey: string;
}

// Legacy format detection (for migration)
export interface LegacyIdentity {
  publicKey: string;
  encryptedPrivateKey: string;
  salt: string;
}

export function isLegacyIdentity(identity: any): identity is LegacyIdentity {
  return identity && 'encryptedPrivateKey' in identity && 'salt' in identity;
}

export function generateMnemonic(): string {
  return generateBip39Mnemonic(wordlist, 128); // 12 words
}

export function mnemonicToKeypair(mnemonic: string): Keypair {
  if (!validateMnemonic(mnemonic, wordlist)) {
    throw new Error('Invalid mnemonic phrase');
  }
  const seed = mnemonicToSeedSync(mnemonic, '');
  const seedBytes = new Uint8Array(seed.slice(0, 32));
  return Keypair.fromSeed(seedBytes);
}

export function saveIdentityToLocalStorage(identity: Identity): void {
  localStorage.setItem('zk_identity', JSON.stringify(identity));
}

export function getIdentityFromLocalStorage(): Identity | null {
  const stored = localStorage.getItem('zk_identity');
  if (!stored) return null;
  return JSON.parse(stored);
}

export function clearIdentityFromLocalStorage(): void {
  localStorage.removeItem('zk_identity');
  localStorage.removeItem('zk_keypair');
}

export function saveKeypairToLocalStorage(keypair: Keypair): void {
  const secretKeyBase64 = naclUtil.encodeBase64(keypair.secretKey);
  localStorage.setItem('zk_keypair', secretKeyBase64);
}

export function getKeypairFromLocalStorage(): Keypair | null {
  try {
    const secretKeyBase64 = localStorage.getItem('zk_keypair');
    if (!secretKeyBase64) return null;
    
    const secretKey = naclUtil.decodeBase64(secretKeyBase64);
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    return null;
  }
}

export function clearKeypairFromLocalStorage(): void {
  localStorage.removeItem('zk_keypair');
}

// Simplified: Create identity from mnemonic (no password needed)
export function createIdentityFromMnemonic(mnemonic: string): { identity: Identity; keypair: Keypair } {
  const keypair = mnemonicToKeypair(mnemonic);
  const identity: Identity = {
    publicKey: keypair.publicKey.toBase58()
  };
  
  return { identity, keypair };
}

export function signMessage(message: string, secretKey: Uint8Array): string {
  const messageBytes = naclUtil.decodeUTF8(message);
  const signature = nacl.sign.detached(messageBytes, secretKey);
  return naclUtil.encodeBase64(signature);
}

export function verifySignature(message: string, signature: string, publicKey: Uint8Array): boolean {
  try {
    const messageBytes = naclUtil.decodeUTF8(message);
    const signatureBytes = naclUtil.decodeBase64(signature);
    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKey);
  } catch (error) {
    return false;
  }
}


export function encryptMessage(message: string, recipientPublicKeyBase58: string, senderSecretKey: Uint8Array): string {
  const messageBytes = naclUtil.decodeUTF8(message);
  
  // Convert Ed25519 keys to Curve25519 for NaCl box encryption
  const recipientPublicKeyBytes = new PublicKey(recipientPublicKeyBase58).toBytes();
  const curve25519PublicKey = convertPublicKey(recipientPublicKeyBytes);
  const curve25519SecretKey = convertSecretKey(senderSecretKey);
  
  if (!curve25519PublicKey || !curve25519SecretKey) {
    throw new Error('Failed to convert Ed25519 keys to Curve25519');
  }
  
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const encrypted = nacl.box(messageBytes, nonce, curve25519PublicKey, curve25519SecretKey);
  
  const combined = new Uint8Array(nonce.length + encrypted.length);
  combined.set(nonce);
  combined.set(encrypted, nonce.length);
  
  return naclUtil.encodeBase64(combined);
}

export function decryptMessage(encryptedMessage: string, senderPublicKeyBase58: string, recipientSecretKey: Uint8Array): string | null {
  try {
    const combined = naclUtil.decodeBase64(encryptedMessage);
    const nonce = combined.slice(0, nacl.box.nonceLength);
    const encrypted = combined.slice(nacl.box.nonceLength);
    
    // Convert Ed25519 keys to Curve25519 for NaCl box decryption
    const senderPublicKeyBytes = new PublicKey(senderPublicKeyBase58).toBytes();
    const curve25519PublicKey = convertPublicKey(senderPublicKeyBytes);
    const curve25519SecretKey = convertSecretKey(recipientSecretKey);
    
    if (!curve25519PublicKey || !curve25519SecretKey) {
      console.error('[Decryption] Failed to convert Ed25519 keys to Curve25519');
      return null;
    }
    
    const decrypted = nacl.box.open(encrypted, nonce, curve25519PublicKey, curve25519SecretKey);
    if (!decrypted) {
      console.error('[Decryption] NaCl box.open returned null');
      return null;
    }
    
    return naclUtil.encodeUTF8(decrypted);
  } catch (error) {
    console.error('[Decryption] Exception:', error);
    return null;
  }
}

export function saveMnemonicToLocalStorage(mnemonic: string): void {
  localStorage.setItem('zk_mnemonic', mnemonic);
}

export function getMnemonicFromLocalStorage(): string | null {
  return localStorage.getItem('zk_mnemonic');
}

export function clearMnemonicFromLocalStorage(): void {
  localStorage.removeItem('zk_mnemonic');
}

// feat: implement core cryptography utilities
