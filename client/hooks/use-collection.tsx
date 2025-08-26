import * as React from 'react';
import { Bird, birds } from '@shared/birds';
import confetti from 'canvas-confetti';

interface CollectionContextType {
  collectedBirdIds: Set<string>;
  addToCollection: (birdId: string) => void;
  removeFromCollection: (birdId: string) => void;
  isInCollection: (birdId: string) => boolean;
  collectionStats: {
    total: number;
    common: number;
    rare: number;
    legendary: number;
    habitats: Set<string>;
  };
  clearCollection: () => void;
}

const CollectionContext = React.createContext<CollectionContextType | undefined>(undefined);

const STORAGE_KEY = 'birddex-collection';

interface CollectionProviderProps {
  children: React.ReactNode;
}

export function CollectionProvider({ children }: CollectionProviderProps) {
  const [collectedBirdIds, setCollectedBirdIds] = React.useState<Set<string>>(new Set());

  // Load collection from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedIds = JSON.parse(saved) as string[];
        setCollectedBirdIds(new Set(savedIds));
      }
    } catch (error) {
      console.error('Failed to load collection from localStorage:', error);
    }
  }, []);

  // Save collection to localStorage whenever it changes
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(collectedBirdIds)));
    } catch (error) {
      console.error('Failed to save collection to localStorage:', error);
    }
  }, [collectedBirdIds]);

  const addToCollection = (birdId: string) => {
    setCollectedBirdIds(prev => new Set([...prev, birdId]));
  };

  const removeFromCollection = (birdId: string) => {
    setCollectedBirdIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(birdId);
      return newSet;
    });
  };

  const isInCollection = (birdId: string) => {
    return collectedBirdIds.has(birdId);
  };

  const clearCollection = () => {
    setCollectedBirdIds(new Set());
  };

  // Calculate collection statistics
  const collectionStats = (() => {
    const collectedBirds = birds.filter(bird => collectedBirdIds.has(bird.id));
    
    return {
      total: collectedBirds.length,
      common: collectedBirds.filter(b => b.rarity === 'common').length,
      rare: collectedBirds.filter(b => b.rarity === 'rare').length,
      legendary: collectedBirds.filter(b => b.rarity === 'legendary').length,
      habitats: new Set(collectedBirds.map(b => b.habitat))
    };
  })();

  const value: CollectionContextType = {
    collectedBirdIds,
    addToCollection,
    removeFromCollection,
    isInCollection,
    collectionStats,
    clearCollection
  };

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = React.useContext(CollectionContext);
  if (context === undefined) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context;
}
