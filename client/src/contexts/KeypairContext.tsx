import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Keypair } from '@solana/web3.js';
import { getKeypairFromLocalStorage, saveKeypairToLocalStorage, clearKeypairFromLocalStorage } from '../lib/crypto';

interface KeypairContextType {
  keypair: Keypair | null;
  setKeypair: (keypair: Keypair | null) => void;
  clearKeypair: () => void;
}

const KeypairContext = createContext<KeypairContextType | undefined>(undefined);

export function KeypairProvider({ children }: { children: ReactNode }) {
  const [keypair, setKeypairState] = useState<Keypair | null>(null);

  useEffect(() => {
    console.log('[KeypairContext] Initializing - attempting to load keypair from localStorage');
    const loadedKeypair = getKeypairFromLocalStorage();
    if (loadedKeypair) {
      console.log('[KeypairContext] Successfully loaded keypair, publicKey:', loadedKeypair.publicKey.toBase58());
      setKeypairState(loadedKeypair);
    } else {
      console.log('[KeypairContext] No keypair found in localStorage');
    }
  }, []);

  const setKeypair = (newKeypair: Keypair | null) => {
    console.log('[KeypairContext] setKeypair called', newKeypair ? 'with keypair' : 'with null');
    setKeypairState(newKeypair);
    if (newKeypair) {
      console.log('[KeypairContext] Saving keypair to localStorage, publicKey:', newKeypair.publicKey.toBase58());
      saveKeypairToLocalStorage(newKeypair);
    } else {
      console.log('[KeypairContext] Clearing keypair from localStorage');
      clearKeypairFromLocalStorage();
    }
  };

  const clearKeypair = () => {
    setKeypairState(null);
    clearKeypairFromLocalStorage();
  };

  return (
    <KeypairContext.Provider value={{ keypair, setKeypair, clearKeypair }}>
      {children}
    </KeypairContext.Provider>
  );
}

export function useKeypair() {
  const context = useContext(KeypairContext);
  if (context === undefined) {
    throw new Error('useKeypair must be used within a KeypairProvider');
  }
  return context;
}
