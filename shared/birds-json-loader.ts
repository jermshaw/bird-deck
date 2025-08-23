export type BirdRarity = 'common' | 'rare' | 'legendary';
export type BirdHabitat = 'forest' | 'wetland' | 'grassland' | 'mountain' | 'desert' | 'arctic' | 'ocean' | 'urban';
export type BirdSize = 'tiny' | 'small' | 'medium' | 'large' | 'enormous';

export interface Bird {
  id: string;
  name: string;
  ability: string;
  rarity: BirdRarity;
  description: string;
  funFact: string;
  habitat: BirdHabitat;
  size: BirdSize;
  imageUrl: string;
  additionalImages?: string[];
}

// Load birds from JSON file
let birdsData: Bird[] = [];

export const loadBirds = async (): Promise<Bird[]> => {
  if (birdsData.length === 0) {
    try {
      const response = await fetch('/data/birds.json');
      const data = await response.json();
      birdsData = data.birds;
    } catch (error) {
      console.error('Failed to load birds data:', error);
      birdsData = []; // Fallback to empty array
    }
  }
  return birdsData;
};

// For synchronous access (you'd need to call loadBirds first)
export const birds = birdsData;

// Alternative: Import JSON directly (if using build tools that support it)
// import birdsJson from '../public/data/birds.json';
// export const birds = birdsJson.birds;
