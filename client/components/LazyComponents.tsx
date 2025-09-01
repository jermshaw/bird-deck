import { lazy } from 'react';

// Lazy load heavy components to improve initial load time
export const BirdDetailModal = lazy(() => 
  import('./BirdDetailModal').then(module => ({ default: module.BirdDetailModal }))
);

// Lazy load confetti-heavy collection hook
export const CollectionProvider = lazy(() => 
  import('../hooks/use-collection').then(module => ({ default: module.CollectionProvider }))
);
