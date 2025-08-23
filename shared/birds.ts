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

export const birds: Bird[] = [
  {
    id: '1',
    name: 'Ruby-Crowned Kinglet',
    ability: 'Crown Flash',
    rarity: 'common',
    description: 'A tiny, energetic songbird with a hidden ruby crown that appears when excited.',
    funFact: 'Despite weighing less than a penny, it can survive temperatures as low as -40°F!',
    habitat: 'forest',
    size: 'tiny',
    imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde028550?w=400&h=300&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1571776944849-3b0e4de35b55?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    ]
  },
  {
    id: '2',
    name: 'Peregrine Falcon',
    ability: 'Speed Dive',
    rarity: 'rare',
    description: 'The fastest bird in the world, capable of incredible hunting dives at breathtaking speeds.',
    funFact: 'Can reach speeds over 240 mph during hunting dives, making it the fastest animal on Earth!',
    habitat: 'mountain',
    size: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=400&h=300&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
    ]
  },
  {
    id: '3',
    name: 'Arctic Tern',
    ability: 'Endless Journey',
    rarity: 'legendary',
    description: 'The ultimate migrant, traveling from Arctic to Antarctic and back each year.',
    funFact: 'Sees more daylight than any other creature, experiencing two summers per year!',
    habitat: 'arctic',
    size: 'small',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1571776944849-3b0e4de35b55?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    ]
  },
  {
    id: '4',
    name: 'Hummingbird',
    ability: 'Hover Master',
    rarity: 'common',
    description: 'A jewel-like bird that can fly backwards and hover in place with rapid wing beats.',
    funFact: 'Their hearts beat up to 1,260 times per minute and they visit 2,000 flowers daily!',
    habitat: 'forest',
    size: 'tiny',
    imageUrl: 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=400&h=300&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1552728089-57bdde028550?w=400&h=300&fit=crop'
    ]
  },
  {
    id: '5',
    name: 'Snowy Owl',
    ability: 'Silent Hunter',
    rarity: 'rare',
    description: 'A majestic white owl from the Arctic with exceptional hearing and silent flight.',
    funFact: 'Their feathers are so thick they can survive temperatures down to -50°F!',
    habitat: 'arctic',
    size: 'large',
    imageUrl: 'https://images.unsplash.com/photo-1549611012-65c3b5d0d73f?w=400&h=300&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571776944849-3b0e4de35b55?w=400&h=300&fit=crop'
    ]
  },
  {
    id: '6',
    name: 'Phoenix',
    ability: 'Eternal Rebirth',
    rarity: 'legendary',
    description: 'A mythical bird of fire that rises from its own ashes, symbolizing renewal.',
    funFact: 'Lives for 500 years before building a nest of aromatic wood and spices to be consumed by fire!',
    habitat: 'desert',
    size: 'large',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
    ]
  },
  {
    id: '7',
    name: 'Blue Jay',
    ability: 'Mimic Voice',
    rarity: 'common',
    description: 'An intelligent blue bird known for its ability to mimic other birds and sounds.',
    funFact: 'Can imitate the calls of hawks to scare other birds away from food sources!',
    habitat: 'forest',
    size: 'small',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1549611012-65c3b5d0d73f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=400&h=300&fit=crop'
    ]
  },
  {
    id: '8',
    name: 'Great Blue Heron',
    ability: 'Patient Strike',
    rarity: 'common',
    description: 'A tall, elegant wading bird that stands motionless before striking at fish.',
    funFact: 'Can stand perfectly still for over an hour waiting for the perfect moment to strike!',
    habitat: 'wetland',
    size: 'large',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1552728089-57bdde028550?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571776944849-3b0e4de35b55?w=400&h=300&fit=crop'
    ]
  },
  {
    id: '9',
    name: 'Resplendent Quetzal',
    ability: 'Sacred Aura',
    rarity: 'legendary',
    description: 'A spectacular bird with iridescent plumage, considered sacred by ancient civilizations.',
    funFact: 'Males grow tail feathers up to 3 feet long during breeding season - longer than their body!',
    habitat: 'forest',
    size: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1571776944849-3b0e4de35b55?w=400&h=300&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1549611012-65c3b5d0d73f?w=400&h=300&fit=crop'
    ]
  },
  {
    id: '10',
    name: 'Barn Owl',
    ability: 'Night Vision',
    rarity: 'common',
    description: 'A ghostly white owl with exceptional hearing that hunts silently in the dark.',
    funFact: 'Can locate prey in complete darkness using only their asymmetrical ears!',
    habitat: 'grassland',
    size: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1549611012-65c3b5d0d73f?w=400&h=300&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=400&h=300&fit=crop'
    ]
  },
  {
    id: '11',
    name: 'Wandering Albatross',
    ability: 'Ocean Glider',
    rarity: 'rare',
    description: 'The largest flying bird with the longest wingspan, master of oceanic gliding.',
    funFact: 'Has the largest wingspan of any living bird at up to 12 feet across!',
    habitat: 'ocean',
    size: 'enormous',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=400&h=300&fit=crop'
    ]
  },
  {
    id: '12',
    name: 'Rock Pigeon',
    ability: 'Urban Adaptation',
    rarity: 'common',
    description: 'A highly adaptable bird that has mastered city life alongside humans.',
    funFact: 'Can recognize themselves in mirrors and are one of the few non-mammal species to pass the mirror test!',
    habitat: 'urban',
    size: 'small',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1552728089-57bdde028550?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571776944849-3b0e4de35b55?w=400&h=300&fit=crop'
    ]
  },
  {
    id: '13',
    name: 'Golden Eagle',
    ability: 'Mountain Soar',
    rarity: 'rare',
    description: 'A powerful raptor that rules the mountain skies with incredible eyesight.',
    funFact: 'Can spot a rabbit from over 2 miles away and dive at speeds up to 150 mph!',
    habitat: 'mountain',
    size: 'large',
    imageUrl: 'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=400&h=300&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1549611012-65c3b5d0d73f?w=400&h=300&fit=crop'
    ]
  },
  {
    id: '14',
    name: 'Roadrunner',
    ability: 'Desert Sprint',
    rarity: 'rare',
    description: 'A ground-dwelling bird famous for its speed and ability to catch rattlesnakes.',
    funFact: 'Can run up to 20 mph and is fast enough to catch and eat rattlesnakes!',
    habitat: 'desert',
    size: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
    ]
  },
  {
    id: '15',
    name: 'Emperor Penguin',
    ability: 'Ice Walker',
    rarity: 'rare',
    description: 'The largest penguin that endures the harshest conditions on Earth to raise their young.',
    funFact: 'Males incubate eggs on their feet for 64 days in -40°F temperatures without eating!',
    habitat: 'arctic',
    size: 'large',
    imageUrl: 'https://images.unsplash.com/photo-1549611012-65c3b5d0d73f?w=400&h=300&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1571776944849-3b0e4de35b55?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    ]
  }
];

export const rarityColors = {
  common: 'bg-common',
  rare: 'bg-rare', 
  legendary: 'bg-legendary'
} as const;

export const habitatIcons = {
  forest: '🌲',
  wetland: '🦆',
  grassland: '🌾',
  mountain: '⛰️',
  desert: '🌵',
  arctic: '❄️',
  ocean: '🌊',
  urban: '🏙️'
} as const;

export const sizeIcons = {
  tiny: '🐣',
  small: '🐦',
  medium: '🦅',
  large: '🦆',
  enormous: '🦢'
} as const;
