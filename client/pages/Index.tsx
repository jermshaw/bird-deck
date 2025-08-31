import { useState, useEffect, useRef } from 'react';
import { birds, Bird } from '@shared/birds';
import { BirdDetailModal } from '@/components/BirdDetailModal';
import { CollectionProvider, useCollection } from '@/hooks/use-collection';

// Main page content component that uses collection context
function BirdDeckHome() {
  const { collectionStats, isInCollection } = useCollection();
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [birdOfTheDay, setBirdOfTheDay] = useState<Bird | null>(null);
  const [currentWeather, setCurrentWeather] = useState('65° and the skies are a bit cloudy');

  // Function to select a random bird of the day based on current date
  const selectBirdOfTheDay = () => {
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const randomIndex = seed % birds.length;
    return birds[randomIndex];
  };

  // Helper function to enhance colors for better visibility
  const enhanceColorsForDisplay = (colors: string[]) => {
    const enhanceColor = (hex: string) => {
      // If color is too muted (gray-ish), enhance it
      if (hex === '#808080') return '#4A90E2'; // Gray -> Blue
      if (hex === '#FFFFFF') return '#E8F4FD'; // White -> Light Blue
      if (hex === '#000000') return '#2C3E50'; // Black -> Dark Blue

      // For other colors, return as-is (they're already vibrant)
      return hex;
    };

    return colors.map(enhanceColor);
  };

  // Helper function to convert hex color to HSL
  const hexToHsl = (hex: string) => {
    // Ensure hex is valid and has # prefix
    if (!hex || typeof hex !== 'string') return { h: 0, s: 0, l: 50 };

    let cleanHex = hex.startsWith('#') ? hex : '#' + hex;
    if (cleanHex.length !== 7) return { h: 0, s: 0, l: 50 };

    try {
      const r = parseInt(cleanHex.slice(1, 3), 16) / 255;
      const g = parseInt(cleanHex.slice(3, 5), 16) / 255;
      const b = parseInt(cleanHex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    } catch (error) {
      console.warn('Error parsing hex color:', hex, error);
      return { h: 0, s: 0, l: 50 };
    }
  };

  // Function to update background colors based on bird of the day
  const updateBackgroundColors = (bird: Bird) => {
    if (!bird || !bird.colors || bird.colors.length < 3) {
      return;
    }

    // Use the same color enhancement as the bird card
    const enhancedColors = enhanceColorsForDisplay(bird.colors);
    const [color1, color2, color3, color4] = enhancedColors.length >= 4 ? enhancedColors : [...enhancedColors, enhancedColors[0]];

    // Convert hex colors to HSL
    const hsl1 = hexToHsl(color1);
    const hsl2 = hexToHsl(color2);
    const hsl3 = hexToHsl(color3);
    const hsl4 = hexToHsl(color4);

    // Target the body element for background
    const body = document.body;

    // Create base color (muted version of primary color)
    const baseHsl = hexToHsl(color1);
    const backgroundColor = `hsla(${baseHsl.h}, ${Math.max(baseHsl.s - 30, 0)}%, ${Math.max(baseHsl.l - 40, 5)}%, 1)`;

    // Create the radial gradient background using the user's pattern
    const backgroundImage = [
      `radial-gradient(at 10% 9%, hsla(${hsl1.h}, ${hsl1.s}%, ${hsl1.l}%, 0.8) 0px, transparent 50%)`,
      `radial-gradient(at 81% 18%, hsla(${hsl2.h}, ${hsl2.s}%, ${hsl2.l}%, 0.6) 0px, transparent 50%)`,
      `radial-gradient(at 41% 60%, hsla(${hsl3.h}, ${hsl3.s}%, ${hsl3.l}%, 0.4) 0px, transparent 50%)`,
      `radial-gradient(at 68% 52%, hsla(${hsl4.h}, ${hsl4.s}%, ${hsl4.l}%, 0.7) 0px, transparent 50%)`
    ].join(', ');

    // Clear any existing background styles and apply new ones
    body.style.removeProperty('background');
    body.style.removeProperty('background-color');
    body.style.removeProperty('background-image');
    body.style.removeProperty('background-blend-mode');

    // Apply the new background
    body.style.backgroundColor = backgroundColor;
    body.style.backgroundImage = backgroundImage;
    body.style.backgroundAttachment = 'fixed';
  };


  // Get collection stats by category
  const getCollectionStatsByCategory = () => {
    const categories = {
      'Perchers': ['forest'],
      'Ground dwellers': ['shrubland', 'grassland'],
      'Raptors': ['mountain'],
      'Hummingbirds': ['gardens'],
      'Water dwellers': ['wetland', 'coast'],
      'Woodpeckers': ['oak woodland'],
      'Foragers': ['urban'],
      'Shorebirds': ['coast']
    };

    const stats: Record<string, { collected: number; total: number; color: string }> = {};

    Object.entries(categories).forEach(([category, habitats]) => {
      const categoryBirds = birds.filter(bird => habitats.includes(bird.habitat));
      const collectedInCategory = categoryBirds.filter(bird => isInCollection(bird.id));
      
      // Color based on habitat
      const colors = {
        'Perchers': '#22c55e',
        'Ground dwellers': '#8B4513',
        'Raptors': '#ef4444',
        'Hummingbirds': '#ec4899',
        'Water dwellers': '#3b82f6',
        'Woodpeckers': '#a855f7',
        'Foragers': '#f59e0b',
        'Shorebirds': '#06b6d4'
      };

      stats[category] = {
        collected: collectedInCategory.length,
        total: categoryBirds.length,
        color: colors[category as keyof typeof colors] || '#6b7280'
      };
    });

    return stats;
  };

  useEffect(() => {
    const selectedBird = selectBirdOfTheDay();
    setBirdOfTheDay(selectedBird);
    // Update background colors when bird of the day changes
    if (selectedBird) {
      updateBackgroundColors(selectedBird);
    }
  }, []);


  const handleBirdClick = (bird: Bird) => {
    setSelectedBird(bird);
    setModalOpen(true);
  };

  // Filter birds to match what's shown on home page
  const filteredBirds = birds.filter(bird => bird.imageUrl && (bird.imageUrl.includes('main.jpg') || bird.imageUrl.includes('main.png')));

  // Count collected birds from filtered list
  const totalCollected = filteredBirds.filter(bird => isInCollection(bird.id)).length;
  const totalBirds = filteredBirds.length;

  // Get category stats for legend (using all birds for category display)
  const categoryStats = getCollectionStatsByCategory();

  // Get enhanced colors for bird of the day card and build gradient system
  const enhancedBirdColors = birdOfTheDay ? enhanceColorsForDisplay(birdOfTheDay.colors) : ['#FBAF4D', '#64455B', '#F4791D'];

  // Build the same gradient system as page background for bird card
  const getBirdCardGradientStyles = () => {
    if (!birdOfTheDay) return { backgroundColor: '#FBAF4D', backgroundImage: '' };

    const [color1, color2, color3, color4] = enhancedBirdColors.length >= 4 ? enhancedBirdColors : [...enhancedBirdColors, enhancedBirdColors[0]];

    // Convert hex colors to HSL
    const hsl1 = hexToHsl(color1);
    const hsl2 = hexToHsl(color2);
    const hsl3 = hexToHsl(color3);
    const hsl4 = hexToHsl(color4);

    // Create base color (muted version of primary color)
    const baseHsl = hexToHsl(color1);
    const backgroundColor = `hsla(${baseHsl.h}, ${Math.max(baseHsl.s - 30, 0)}%, ${Math.max(baseHsl.l - 40, 5)}%, 1)`;

    // Create the radial gradient background using the same pattern as the page
    const backgroundImage = [
      `radial-gradient(at 10% 9%, hsla(${hsl1.h}, ${hsl1.s}%, ${hsl1.l}%, 0.8) 0px, transparent 50%)`,
      `radial-gradient(at 81% 18%, hsla(${hsl2.h}, ${hsl2.s}%, ${hsl2.l}%, 0.6) 0px, transparent 50%)`,
      `radial-gradient(at 41% 60%, hsla(${hsl3.h}, ${hsl3.s}%, ${hsl3.l}%, 0.4) 0px, transparent 50%)`,
      `radial-gradient(at 68% 52%, hsla(${hsl4.h}, ${hsl4.s}%, ${hsl4.l}%, 0.7) 0px, transparent 50%)`
    ].join(', ');

    return {
      backgroundColor: backgroundColor,
      backgroundImage: backgroundImage
    };
  };

  const birdCardStyles = getBirdCardGradientStyles();

  return (
    <div
      className="min-h-screen relative font-rubik"
    >

      {/* Content Container */}
      <div className="relative z-10 px-6 py-8 max-w-md mx-auto md:max-w-4xl lg:max-w-6xl lg:px-8">
        
        {/* Header Section */}
        <div className="mb-6">
          {/* Bird Logo */}
          <div className="mb-6">
            <svg 
              width="40" 
              height="26" 
              viewBox="0 0 40 26" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="fill-white"
            >
              <path d="M39.7633 2.45794L37.3009 1.63479C37.1683 1.59294 37.0358 1.50226 36.9242 1.39065C34.481 -1.17116 32.2995 0.175126 30.4437 2.4579C29.6624 3.33685 28.909 4.15995 28.2882 4.11111C27.9115 4.07623 27.507 3.70653 27.0954 3.02988C25.477 0.351245 22.8263 0.609332 18.8086 0.993002C14.5552 1.27551 0.942086 6.23331 0.225551 6.47572C-0.088349 6.57338 -0.0726567 7.07212 0.260429 7.13842C0.406915 7.17329 3.07161 7.82901 6.1128 7.32676C7.27252 7.99468 10.0994 8.13593 11.9027 7.23608C12.3822 7.55173 15.2544 8.18999 16.709 7.80806C16.9357 8.00512 18.4773 8.49343 19.6248 8.37307C19.9771 9.30256 21.2501 9.61297 22.2965 9.48917C18.9412 11.547 5.58984 14.5674 0.274537 15.6487C-0.128303 15.7254 -0.0655247 16.3794 0.379173 16.3393C6.49003 15.7115 13.1514 15.4045 14.0166 15.9487C13.6189 16.8834 8.12891 20.5666 2.90423 23.6774C2.56243 23.8727 2.79786 24.4447 3.19023 24.3122C3.55296 24.1936 12.0771 21.4662 15.2861 18.8853C18.2472 16.1142 24.0439 16.32 28.8047 15.4463C27.3049 17.532 24.8146 19.4712 24.7867 19.4922C24.0368 20.4897 26.433 20.0624 26.7818 20.0014C24.5635 22.1917 24.3194 24.7935 24.3054 24.9194C24.288 25.1164 24.4554 25.3082 24.6542 25.296C29.8075 22.9034 39.3291 11.418 39.1287 8.27555C39.024 6.22295 37.3394 6.36773 36.1013 7.27802C36.1152 7.01295 36.1082 6.82462 36.1013 6.72694C36.0315 5.20628 37.1058 4.55751 37.1406 4.53662L39.8193 3.09265C40.0843 2.96884 40.051 2.53468 39.7633 2.45794ZM34.2944 3.25314C33.3771 3.2357 33.3788 1.8702 34.2944 1.85801C35.2117 1.86673 35.2134 3.23921 34.2944 3.25314ZM31.6855 13.6574C31.6959 13.6504 31.7064 13.6452 31.7169 13.6382C31.7064 13.6452 31.6977 13.6504 31.6855 13.6574Z" fill="white"/>
            </svg>
          </div>

          {/* Location and Weather */}
          <div className="mb-4">
            <h1 className="text-white font-bold text-[28px] leading-[30px] mb-1 font-rubik">
              <span className="block sm:inline">San Francisco</span>
              <span className="sm:ml-2">
                <span className="block sm:inline text-white/40 font-normal">California</span>
              </span>
            </h1>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          className="flex gap-4 pb-8 mb-0 -mx-6 px-6 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden sm:pb-8 pb-12"
          style={{
            overflowX: 'auto',
            overflowY: 'auto',
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none' /* IE and Edge */
          }}
        >
          
          {/* Bird of the Day Card */}
          {birdOfTheDay && (
            <div
              className="flex-1 basis-0 min-w-[322px] lg:min-w-[342px] h-[460px] rounded-[24px] border-8 border-white relative overflow-hidden cursor-pointer"
              style={{
                backgroundColor: birdCardStyles.backgroundColor,
                backgroundImage: birdCardStyles.backgroundImage
              }}
              onClick={() => handleBirdClick(birdOfTheDay)}
            >
              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col">
                <h3 className="text-white text-[16px] font-medium mb-6 font-rubik">
                  Bird of the day
                </h3>

                {/* Bird Image */}
                <div className="flex justify-center mb-3 sm:mt-[15px] mt-[45px]">
                  <div
                    className="w-[160px] h-[160px] rounded-full border-4 border-white overflow-hidden"
                  >
                    <img
                      src={`/images/birds/${birdOfTheDay.name}/profile.png`}
                      alt={birdOfTheDay.name}
                      className="w-full h-full object-cover sm:mb-0 mb-5"
                    />
                  </div>
                </div>

                {/* Bird Name */}
                <h4 className="text-white/70 text-[16px] italic font-medium text-center mb-4 font-rubik">
                  {birdOfTheDay.name}
                </h4>

                {/* Fun Fact */}
                <p className="text-white text-[20px] font-normal text-center leading-normal sm:leading-normal leading-[27px] letter-spacing-[0.2px] flex-1 flex items-center justify-center font-rubik px-2 sm:pb-0 pb-[35px]">
                  {birdOfTheDay.funFact}
                </p>
              </div>
            </div>
          )}

          {/* Collection Progress Card */}
          <div className="flex-1 basis-0 min-w-[380px] lg:min-w-[342px] h-[460px] rounded-[24px] bg-white relative p-6">
            <h3 className="text-[#2C2C2C] text-[16px] font-medium mb-2 font-rubik">
              Birds collected
            </h3>
            
            <div className="mb-4">
              <span className="text-[#2A2A2A] text-[61px] font-medium font-rubik leading-none">
                {totalCollected}
              </span>
              <span className="text-[#121212]/50 text-[40px] font-medium font-rubik">
                /{totalBirds}
              </span>
            </div>

            {/* Collection Dots Grid */}
            <div className="mb-8">
              <div className="grid grid-cols-10 gap-x-1 gap-y-2 mb-4">
                {filteredBirds.map((bird, index) => {
                  const isCollected = isInCollection(bird.id);
                  const rarityColor = bird.rarity === 'legendary' ? '#FFD700' :
                                   bird.rarity === 'rare' ? '#9C27B0' : '#4CAF50';

                  return (
                    <div
                      key={bird.id}
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: isCollected ? rarityColor : '#E5E5E5'
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Category Legend */}
            <div className="space-y-2">
              <div className="border-t border-[#F5F5F5] pt-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[14px] text-[#2C2C2C] font-rubik">
                  {Object.entries(categoryStats).map(([category, stats]) => (
                    <div key={category} className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: stats.color }}
                      />
                      <span>{category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Map Card */}
          <a
            href="https://www.google.com/maps/d/u/0/edit?mid=1mYRHgY8diPuzRDcbJTKF_rC3iKmk0nU&usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 basis-0 min-w-[322px] lg:min-w-[342px] h-[460px] rounded-[24px] bg-white relative overflow-hidden block cursor-pointer hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-[#2C2C2C] text-[16px] font-medium font-rubik absolute left-6 top-6 z-10">
              Places to spot birds
            </h3>

            {/* Map Image - Edge to Edge */}
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/a9af1b5559035184da90d06c929dce466c7c3492?width=2154"
              alt="Map with Locations"
              className="absolute left-0 right-0 bottom-0 w-full h-[420px] object-cover"
              style={{ top: '59px' }}
            />
          </a>
        </div>

        {/* Birds of San Francisco Section */}
        <div className="mb-6">
          <h2 className="text-white text-[20px] font-bold font-rubik">
            Birds of San Francisco
          </h2>
        </div>

        {/* Bird Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {birds
            .filter(bird => bird.imageUrl && (bird.imageUrl.includes('main.jpg') || bird.imageUrl.includes('main.png')))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((bird) => (
            <BirdCard
              key={bird.id}
              bird={bird}
              isCollected={isInCollection(bird.id)}
              onClick={() => handleBirdClick(bird)}
            />
          ))}
        </div>
      </div>

      {/* Bird Detail Modal */}
      <BirdDetailModal
        bird={selectedBird}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}

// Bird card component matching Figma design
function BirdCard({ bird, isCollected, onClick }: {
  bird: Bird;
  isCollected: boolean;
  onClick: () => void;
}) {
  const [imageError, setImageError] = useState(false);

  // Don't render the card if image failed to load
  if (imageError) {
    return null;
  }

  return (
    <div
      className="bg-white rounded-[14.4px] p-1 cursor-pointer relative overflow-hidden"
      style={{ boxShadow: '0 10.8px 10.8px -6.3px rgba(0, 0, 0, 0.05)' }}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[154/253] rounded-[12.6px] border border-white overflow-hidden">
        <img
          src={bird.imageUrl}
          alt={bird.name}
          className={`w-full h-full object-cover ${!isCollected ? 'grayscale' : ''}`}
          onError={() => setImageError(true)}
        />

        {/* Name Box */}
        <div className="absolute bottom-0 left-0 right-0">
          <div
            className="bg-white/70 mx-[-1px] mb-[-1px]"
            style={{
              backdropFilter: 'blur(17px)',
              borderBottomLeftRadius: '11.6px',
              borderBottomRightRadius: '11.6px'
            }}
          >
            <div className="px-4 py-2 text-center">
              <h3 className="text-[#2C2C2C] font-rubik font-bold text-[14px] uppercase leading-tight">
                {bird.name}
              </h3>
              <p className="text-[#2C2C2C]/50 font-rubik text-[11px] italic mt-1">
                {bird.ability}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with provider
export default function Index() {
  return (
    <CollectionProvider>
      <BirdDeckHome />
    </CollectionProvider>
  );
}
