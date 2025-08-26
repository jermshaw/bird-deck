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
    // Check if bird is already collected to avoid duplicate confetti
    const wasAlreadyCollected = collectedBirdIds.has(birdId);

    if (!wasAlreadyCollected) {
      // Get the bird data to customize confetti based on rarity
      const bird = birds.find(b => b.id === birdId);
      const rarity = bird?.rarity || 'common';

      // Define colors based on rarity
      const rarityColors = {
        common: ['#22c55e', '#16a34a', '#15803d'],
        rare: ['#8b5cf6', '#7c3aed', '#6d28d9'],
        legendary: ['#f59e0b', '#d97706', '#b45309', '#ffd700']
      };

      // Create multiple confetti bursts for celebration
      const colors = rarityColors[rarity as keyof typeof rarityColors];

      // First burst from left
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.2, y: 0.7 },
        colors: colors,
        startVelocity: 45,
        gravity: 0.8,
        drift: 1
      });

      // Second burst from right
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.8, y: 0.7 },
        colors: colors,
        startVelocity: 45,
        gravity: 0.8,
        drift: -1
      });

      // Center celebration burst
      setTimeout(() => {
        confetti({
          particleCount: rarity === 'legendary' ? 150 : rarity === 'rare' ? 100 : 75,
          angle: 90,
          spread: 360,
          origin: { x: 0.5, y: 0.6 },
          colors: colors,
          startVelocity: 30,
          gravity: 0.5,
          drift: 0,
          scalar: rarity === 'legendary' ? 1.2 : 1
        });
      }, 200);

      // Extra golden shower for legendary birds
      if (rarity === 'legendary') {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            angle: 90,
            spread: 45,
            origin: { x: 0.5, y: 0 },
            colors: ['#ffd700', '#ffed4a', '#fff59d'],
            startVelocity: 25,
            gravity: 0.4,
            drift: 0,
            shapes: ['circle', 'square'],
            scalar: 0.8
          });
        }, 400);
      }
    }

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
