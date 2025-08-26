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
  colors: string[]; // Main colors of the bird for confetti and theming
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
    imageUrl: "/images/birds/ruby-crowned-kinglet/main.png",
    additionalImages: [],
    colors: ["#dc2626", "#65a30d", "#fbbf24"]
  },
  {
    id: "2",
    name: "Western Blue Jay",
    ability: "Acorn Hoarder",
    rarity: "common",
    description: "A clever bird with bright blue plumage, often seen hiding acorns in secret caches.",
    funFact: "Western Blue Jays can remember hundreds of hiding spots for their winter meals!",
    habitat: "oak woodland",
    size: "medium",
    imageUrl: "/images/birds/western-blue-jay/main.png",
    additionalImages: [],
    colors: ["#2563eb", "#f8fafc", "#1e40af"]
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
    imageUrl: "/images/birds/annas-hummingbird/main.png",
    additionalImages: [],
    colors: ["#16a34a", "#ec4899", "#f59e0b"]
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
    imageUrl: "/images/birds/pacific-wren/main.png",
    additionalImages: [],
    colors: ["#a16207", "#d97706", "#92400e"]
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
    imageUrl: "/images/birds/california-towhee/main.png",
    additionalImages: [],
    colors: ["#a16207", "#6b7280", "#d97706"]
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
    imageUrl: "/images/birds/stellers-jay/main.png",
    additionalImages: [],
    colors: ["#1e40af", "#1f2937", "#2563eb"]
  },
  {
    id: "7",
    name: "Rock Pigeon",
    ability: "Urban Survivor",
    rarity: "common",
    description: "A highly adaptable bird that thrives in urban environments worldwide.",
    funFact: "Rock Pigeons can navigate using magnetic fields and are excellent at finding their way home!",
    habitat: "urban",
    size: "medium",
    imageUrl: "/images/birds/rock-pigeon/main.png",
    additionalImages: [
      "/images/birds/rock-pigeon/male.png",
      "/images/birds/rock-pigeon/female.png",
      "/images/birds/rock-pigeon/juvenile.png",
      "/images/birds/rock-pigeon/extra.png"
    ],
    colors: ["#6b7280", "#7c3aed", "#475569"]
  },
  {
    id: "8",
    name: "Great Blue Heron",
    ability: "Patient Hunter",
    rarity: "rare",
    description: "A large wading bird known for its incredible patience while hunting fish.",
    funFact: "Great Blue Herons can stand motionless for over an hour waiting for the perfect moment to strike!",
    habitat: "wetland",
    size: "large",
    imageUrl: "/images/birds/great-blue-heron/main.png",
    additionalImages: [],
    colors: ["#1e40af", "#6b7280", "#f1f5f9"]
  },
  {
    id: "9",
    name: "Black-Crowned Night Heron",
    ability: "Night Vision",
    rarity: "rare",
    description: "A stocky heron that hunts primarily at dawn and dusk with excellent night vision.",
    funFact: "Night Herons have special adaptations that allow them to see clearly in low light conditions!",
    habitat: "wetland",
    size: "medium",
    imageUrl: "/images/birds/night-heron/main.png",
    additionalImages: [],
    colors: ["#1f2937", "#6b7280", "#f8fafc"]
  },
  {
    id: "10",
    name: "Peregrine Falcon",
    ability: "Speed Demon",
    rarity: "legendary",
    description: "The fastest bird in the world, capable of diving at speeds over 240 mph.",
    funFact: "Peregrine Falcons are found on every continent except Antarctica and have made a remarkable recovery from near extinction!",
    habitat: "mountain",
    size: "medium",
    imageUrl: "/images/birds/peregrine-falcon/main.png",
    additionalImages: [],
    colors: ["#6b7280", "#f8fafc", "#374151"]
  },
  {
    id: "11",
    name: "Northern Cardinal",
    ability: "Brilliant Flash",
    rarity: "common",
    description: "A vibrant red songbird that brightens winter landscapes with its striking plumage.",
    funFact: "Cardinals mate for life and often stay together year-round!",
    habitat: "forest",
    size: "small",
    imageUrl: "/images/birds/northern-cardinal/main.png",
    additionalImages: [
      "/images/birds/northern-cardinal/male.png",
      "/images/birds/northern-cardinal/female.png"
    ],
    colors: ["#dc2626", "#fbbf24", "#1f2937"]
  },
  {
    id: "12",
    name: "Great Horned Owl",
    ability: "Silent Stalker",
    rarity: "rare",
    description: "A powerful nocturnal hunter with distinctive ear tufts and piercing yellow eyes.",
    funFact: "Their talons exert pressure of 300 pounds per square inch - stronger than a large dog bite!",
    habitat: "forest",
    size: "large",
    imageUrl: "/images/birds/great-horned-owl/main.png",
    additionalImages: [
      "/images/birds/great-horned-owl/hunting.png",
      "/images/birds/great-horned-owl/nest.png"
    ],
    colors: ["#a16207", "#f59e0b", "#1f2937"]
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
