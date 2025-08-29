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
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState<'name' | 'collected' | 'not-collected'>('name');
  const filterButtonRef = useRef<HTMLDivElement>(null);

  // Function to select a random bird of the day based on current date
  const selectBirdOfTheDay = () => {
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const randomIndex = seed % birds.length;
    return birds[randomIndex];
  };

  // Function to update background colors based on bird of the day
  const updateBackgroundColors = (bird: Bird) => {
    if (!bird || !bird.colors || bird.colors.length < 3) {
      console.log('No bird or insufficient colors:', bird);
      return;
    }

    const [color1, color2, color3] = bird.colors;
    console.log('Bird colors from data:', { color1, color2, color3 });

    // Target the body element for background
    const body = document.body;

    // Create a darker base color from the primary bird color
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const { r: r1, g: g1, b: b1 } = hexToRgb(color1);
    const { r: r2, g: g2, b: b2 } = hexToRgb(color2);
    const { r: r3, g: g3, b: b3 } = hexToRgb(color3);

    // Create a dark base color (20% of primary color brightness)
    const baseColor = `rgb(${Math.round(r1 * 0.2)}, ${Math.round(g1 * 0.2)}, ${Math.round(b1 * 0.2)})`;

    // Create gradient colors with bird colors
    const gradientColors = [
      `rgba(${r1}, ${g1}, ${b1}, 0.6)`, // Primary color at 60% opacity
      `rgba(${r2}, ${g2}, ${b2}, 0.4)`, // Secondary color at 40% opacity
      `rgba(${r3}, ${g3}, ${b3}, 0.3)`, // Tertiary color at 30% opacity
      `rgba(${r1}, ${g1}, ${b1}, 0.2)`, // Primary again at 20% opacity
      `rgba(${r2}, ${g2}, ${b2}, 0.1)`  // Secondary again at 10% opacity
    ];

    // Build the multi-radial gradient background
    const backgroundImage = [
      'url("data:image/svg+xml,%3Csvg viewBox=\\\'0 0 1746 1746\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\'%3E%3Cfilter id=\\\'noiseFilter\\\'%3E%3CfeTurbulence type=\\\'fractalNoise\\\' baseFrequency=\\\'0.65\\\' numOctaves=\\\'3\\\' stitchTiles=\\\'stitch\\\'/%3E%3C/filter%3E%3Crect width=\\\'100%25\\\' height=\\\'100%25\\\' filter=\\\'url(%23noiseFilter)\\\'/%3E%3C/svg%3E")',
      `radial-gradient(circle at 0% 99%, ${gradientColors[0]} 0%, transparent 67%)`,
      `radial-gradient(circle at 46% 94%, ${gradientColors[1]} 0%, transparent 81%)`,
      `radial-gradient(circle at 89% 8%, ${gradientColors[2]} 0%, transparent 150%)`,
      `radial-gradient(circle at 93% 95%, ${gradientColors[3]} 0%, transparent 66%)`,
      `radial-gradient(circle at 89% 8%, ${gradientColors[4]} 0%, transparent 150%)`
    ].join(', ');

    console.log('Applying background:', { baseColor, backgroundImage });

    // Clear any existing background styles and apply new ones
    body.style.removeProperty('background');
    body.style.removeProperty('background-color');
    body.style.removeProperty('background-image');

    // Apply the new background
    body.style.backgroundColor = baseColor;
    body.style.backgroundImage = backgroundImage;
    body.style.backgroundBlendMode = 'overlay, normal, normal, normal, normal, normal';
    body.style.backgroundAttachment = 'fixed';

    console.log('Background applied successfully for', bird.name);
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
    console.log('Selected bird of the day:', selectedBird?.name, selectedBird?.colors);
    setBirdOfTheDay(selectedBird);
    // Update background colors when bird of the day changes
    if (selectedBird) {
      console.log('Calling updateBackgroundColors with:', selectedBird);
      updateBackgroundColors(selectedBird);
    }
  }, []);

  // Handle clicking outside filter menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterButtonRef.current && !filterButtonRef.current.contains(event.target as Node)) {
        setFilterMenuOpen(false);
      }
    };

    if (filterMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterMenuOpen]);

  const handleBirdClick = (bird: Bird) => {
    setSelectedBird(bird);
    setModalOpen(true);
  };

  // Filter birds to match what's shown on home page
  const filteredBirds = birds.filter(bird => bird.imageUrl && !bird.imageUrl.includes('placeholder') && !bird.imageUrl.includes('404'));

  // Count collected birds from filtered list
  const totalCollected = filteredBirds.filter(bird => isInCollection(bird.id)).length;
  const totalBirds = filteredBirds.length;

  // Get category stats for legend (using all birds for category display)
  const categoryStats = getCollectionStatsByCategory();

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
                background: `linear-gradient(135deg, ${birdOfTheDay.colors[0] || '#FBAF4D'} 0%, ${birdOfTheDay.colors[1] || '#64455B'} 50%, ${birdOfTheDay.colors[2] || '#F4791D'} 100%)`,
                boxShadow: '0 16px 100px 0 rgba(107, 75, 94, 0.4)'
              }}
              onClick={() => handleBirdClick(birdOfTheDay)}
            >
              {/* Background gradient circles matching Figma */}
              <div className="absolute inset-0 overflow-hidden">
                <div 
                  className="absolute -right-5 top-20 w-[454px] h-[454px] rounded-full opacity-80"
                  style={{
                    background: `radial-gradient(circle, ${birdOfTheDay.colors[0] || '#FBAF4D'} 0%, transparent 70%)`,
                    filter: 'blur(100px)'
                  }}
                />
                <div 
                  className="absolute -left-12 top-56 w-[554px] h-[554px] rounded-full opacity-70"
                  style={{
                    background: `radial-gradient(circle, ${birdOfTheDay.colors[1] || '#64455B'} 0%, transparent 70%)`,
                    filter: 'blur(100px)'
                  }}
                />
                <div 
                  className="absolute left-24 -top-20 w-[347px] h-[347px] rounded-full opacity-90"
                  style={{
                    background: `radial-gradient(circle, ${birdOfTheDay.colors[2] || '#F4791D'} 0%, transparent 70%)`,
                    filter: 'blur(100px)'
                  }}
                />
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col">
                <h3 className="text-white text-[16px] font-medium mb-6 font-rubik">
                  Bird of the day
                </h3>
                
                {/* Bird Image */}
                <div className="flex justify-center mb-6 sm:mt-0 mt-[30px]">
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
          <div className="flex-1 basis-0 min-w-[322px] lg:min-w-[342px] h-[460px] rounded-[24px] bg-white relative p-6">
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
          <div className="flex items-center justify-between">
            <h2 className="text-white text-[18px] font-normal font-rubik">
              Birds of San Francisco
            </h2>
            <div className="relative">
              <div
                ref={filterButtonRef}
                className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/40 transition-colors"
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              >
                <svg
                  width="12"
                  height="10"
                  viewBox="0 0 12 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="12" height="2" rx="1" fill="#D9D9D9"/>
                  <rect y="4" width="12" height="2" rx="1" fill="#D9D9D9"/>
                  <rect y="8" width="12" height="2" rx="1" fill="#D9D9D9"/>
                </svg>
              </div>

              {/* Filter Menu Dropdown */}
              {filterMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[140px] z-50">
                  <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Sort by
                  </div>
                  <button
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      sortOption === 'name' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setSortOption('name');
                      setFilterMenuOpen(false);
                    }}
                  >
                    Name A-Z
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      sortOption === 'collected' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setSortOption('collected');
                      setFilterMenuOpen(false);
                    }}
                  >
                    Collected
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      sortOption === 'not-collected' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setSortOption('not-collected');
                      setFilterMenuOpen(false);
                    }}
                  >
                    Not Collected
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bird Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {birds
            .filter(bird => bird.imageUrl && !bird.imageUrl.includes('placeholder') && !bird.imageUrl.includes('404'))
            .sort((a, b) => {
              const aCollected = isInCollection(a.id);
              const bCollected = isInCollection(b.id);

              switch (sortOption) {
                case 'name':
                  return a.name.localeCompare(b.name);
                case 'collected':
                  if (aCollected === bCollected) {
                    return a.name.localeCompare(b.name); // Secondary sort by name
                  }
                  return aCollected ? -1 : 1; // Collected first
                case 'not-collected':
                  if (aCollected === bCollected) {
                    return a.name.localeCompare(b.name); // Secondary sort by name
                  }
                  return aCollected ? 1 : -1; // Not collected first
                default:
                  return a.name.localeCompare(b.name);
              }
            })
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
        />
        
        {/* Rarity Badge */}
        <div className="absolute top-2 right-2 w-6 h-6 bg-[#F3F3F3] border-[1.1px] border-[#2C2C2C] rounded-full flex items-center justify-center">
          <svg 
            width="12" 
            height="10" 
            viewBox="0 0 8 15" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-2.5 fill-[#2C2C2C] transform rotate-[-23.972deg]"
          >
            <path d="M6.80255 0.39989C7.2046 0.0565747 7.79657 0.141577 7.82664 0.549448C7.87776 0.948024 7.90655 1.46684 7.87151 2.06849C7.81534 3.24752 6.58006 5.15219 5.30671 5.97482L7.38227 5.05195C7.20793 5.62405 6.9769 6.23934 6.66944 6.85232C6.30497 7.5639 5.934 8.26036 5.53553 8.89549L4.38439 9.75574L4.9811 9.74692C3.73732 11.6006 2.84391 12.1447 2.03342 12.1936C2.55555 9.96461 2.78201 8.95583 4.46463 6.88361C2.91991 8.70524 2.25359 10.0244 1.62073 12.1741C1.74943 12.1982 1.86808 12.1976 2.00526 12.188C1.74894 13.1996 1.67207 13.8202 1.65036 13.8848C1.62797 14.0046 1.50066 14.1164 1.35393 14.1267C1.20719 14.137 1.11769 14.0477 1.119 13.9372L1.11225 13.9221C1.13426 13.8556 1.25174 13.2748 1.5899 12.1792C1.57575 12.1786 1.56048 12.1757 1.54518 12.1724C0.220929 11.9735 0.155025 9.84108 2.12819 5.94103L2.91001 6.43985C2.87025 5.66976 3.03111 5.19109 3.36163 4.40293C3.69894 3.63018 4.1965 2.87754 4.86803 2.17597C4.88904 2.16658 4.90361 2.14198 4.92464 2.13263C5.25854 2.82686 5.54558 2.99795 5.54558 2.99795L6.01943 1.07834C6.30873 0.821472 6.56282 0.598078 6.80255 0.39989Z" fill="#2C2C2C"/>
          </svg>
        </div>

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
