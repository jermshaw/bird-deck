export type BirdRarity = "common" | "rare" | "legendary";
export type BirdHabitat = "forest" | "wetland" | "grassland" | "mountain" | "desert" | "arctic" | "ocean" | "urban" | "oak woodland" | "gardens";
export type BirdSize = "tiny" | "small" | "medium" | "large" | "huge";

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
  additionalImages: string[];
}

export const birds: Bird[] = [
  {
    id: "1",
    name: "Ruby-Crowned Kinglet",
    ability: "Crown Flash",
    rarity: "common",
    description: "A tiny, energetic songbird with a hidden ruby crown that appears when excited.",
    funFact: "Despite weighing less than a penny, it can survive temperatures as low as -40°F!",
    habitat: "forest",
    size: "tiny",
    imageUrl: "https://placekitten.com/400/300",
    additionalImages: [
      "https://placekitten.com/401/300",
      "https://placekitten.com/402/300"
    ]
  },
  {
    id: "2",
    name: "Western Scrub-Jay",
    ability: "Acorn Hoarder",
    rarity: "common",
    description: "A clever bird with bright blue plumage, often seen hiding acorns in secret caches.",
    funFact: "Western Scrub-Jays can remember hundreds of hiding spots for their winter meals!",
    habitat: "oak woodland",
    size: "medium",
    imageUrl: "https://placekitten.com/403/300",
    additionalImages: [
      "https://placekitten.com/404/300",
      "https://placekitten.com/405/300"
    ]
  },
  {
    id: "3",
    name: "Anna's Hummingbird",
    ability: "Hover Master",
    rarity: "common",
    description: "A tiny iridescent bird with a sparkling rose-pink throat, known for hovering with precision.",
    funFact: "Anna's Hummingbirds can survive cold nights by lowering their metabolism dramatically.",
    habitat: "gardens",
    size: "tiny",
    imageUrl: "https://placekitten.com/406/300",
    additionalImages: [
      "https://placekitten.com/407/300",
      "https://placekitten.com/408/300"
    ]
  },
  {
    id: "4",
    name: "Pacific Wren",
    ability: "Tiny Songbird",
    rarity: "common",
    description: "A small brown bird with a big personality, constantly singing in dense forests.",
    funFact: "Its song is so loud that it can be heard over a waterfall!",
    habitat: "forest",
    size: "tiny",
    imageUrl: "https://placekitten.com/409/300",
    additionalImages: [
      "https://placekitten.com/410/300",
      "https://placekitten.com/411/300"
    ]
  },
  {
    id: "5",
    name: "California Towhee",
    ability: "Bush Hopper",
    rarity: "common",
    description: "A plump brown bird often found hopping through underbrush and suburban yards.",
    funFact: "Its call sounds like \"chink-chink\" and is often heard before the bird is seen.",
    habitat: "urban",
    size: "medium",
    imageUrl: "https://placekitten.com/412/300",
    additionalImages: [
      "https://placekitten.com/413/300",
      "https://placekitten.com/414/300"
    ]
  },
  {
    id: "6",
    name: "Steller's Jay",
    ability: "Forest Guardian",
    rarity: "rare",
    description: "A bold blue and black bird known for its intelligence and loud calls.",
    funFact: "Steller's Jays can mimic the calls of hawks to scare other birds away from food!",
    habitat: "mountain",
    size: "medium",
    imageUrl: "https://placekitten.com/415/300",
    additionalImages: [
      "https://placekitten.com/416/300",
      "https://placekitten.com/417/300"
    ]
  }
];

export const rarityColors = {
  common: "bg-common",
  rare: "bg-rare", 
  legendary: "bg-legendary"
} as const;

export const habitatIcons = {
  forest: "🌲",
  wetland: "🦆",
  grassland: "🌾",
  mountain: "⛰️",
  desert: "🌵",
  arctic: "❄️",
  ocean: "🌊",
  urban: "🏙️",
  "oak woodland": "🌳",
  gardens: "🌺"
} as const;

export const sizeIcons = {
  tiny: "🐣",
  small: "🐦",
  medium: "🦅",
  large: "🦆",
  huge: "🦢"
} as const;
