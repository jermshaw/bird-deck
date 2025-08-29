import { useState, useEffect } from 'react';
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

  // Get background gradient based on time of day and weather
  const getBackgroundGradient = () => {
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;
    
    // Time-based gradients with weather influence
    if (isDay) {
      // Cloudy day - muted blues and grays
      return 'linear-gradient(180deg, #657D91 0%, #495373 50%, #454564 100%)';
    } else {
      // Night - darker blues and purples
      return 'linear-gradient(180deg, #2D3748 0%, #1A202C 50%, #171923 100%)';
    }
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
        'Ground dwellers': '#a3a3a3',
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
    setBirdOfTheDay(selectBirdOfTheDay());
  }, []);

  const handleBirdClick = (bird: Bird) => {
    setSelectedBird(bird);
    setModalOpen(true);
  };

  const categoryStats = getCollectionStatsByCategory();
  const totalCollected = Object.values(categoryStats).reduce((sum, stat) => sum + stat.collected, 0);
  const totalBirds = Object.values(categoryStats).reduce((sum, stat) => sum + stat.total, 0);

  return (
    <div 
      className="min-h-screen relative font-rubik"
      style={{ background: getBackgroundGradient() }}
    >
      {/* Background gradient circles - matching Figma design */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -left-48 top-16 w-[644px] h-[555px] rounded-full opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(69, 69, 100, 0.6) 0%, transparent 70%)',
            filter: 'blur(100px)'
          }}
        />
        <div 
          className="absolute right-8 -top-32 w-[528px] h-[455px] rounded-full opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(73, 83, 115, 0.6) 0%, transparent 70%)',
            filter: 'blur(100px)'
          }}
        />
        <div 
          className="absolute left-16 -top-40 w-[403px] h-[348px] rounded-full opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(101, 125, 145, 0.6) 0%, transparent 70%)',
            filter: 'blur(100px)'
          }}
        />
      </div>

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
              San Francisco{' '}
              <span className="text-white/40 font-normal">California</span>
            </h1>
            <div className="flex items-center gap-2">
              <svg 
                width="16" 
                height="11" 
                viewBox="0 0 16 11" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="fill-white/40"
              >
                <path d="M9 0C11.7614 0 14 2.23858 14 5C14 5.05755 13.997 5.1148 13.9951 5.17188C15.1624 5.58259 16 6.6923 16 8C16 9.65685 14.6569 11 13 11C11.9962 11 11.11 10.5052 10.5654 9.74805C10.0728 9.91037 9.54697 10 9 10C8.30349 10 7.64054 9.85691 7.03809 9.59961C6.30446 10.4562 5.21622 11 4 11C1.79086 11 0 9.20914 0 7C0 4.79086 1.79086 3 4 3C4.13744 3 4.27336 3.006 4.40723 3.01953C5.17426 1.24314 6.94208 0 9 0Z" fill="white" fillOpacity="0.4"/>
              </svg>
              <span className="text-white/40 text-[14px] italic font-rubik">
                {currentWeather}
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          className="flex gap-6 pb-4 mb-8 -mx-6 px-6 lg:-mx-8 lg:px-8"
          style={{
            overflowX: 'auto',
            overflowY: 'visible',
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none' /* IE and Edge */
          }}
        >
          
          {/* Bird of the Day Card */}
          {birdOfTheDay && (
            <div
              className="flex-1 basis-0 min-w-[300px] h-[460px] rounded-[24px] border-8 border-white relative overflow-hidden cursor-pointer"
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
                <div className="flex justify-center mb-6">
                  <div
                    className="w-[160px] h-[160px] rounded-full border-4 border-white overflow-hidden"
                  >
                    <img
                      src={`/images/birds/${birdOfTheDay.name}/profile.png`}
                      alt={birdOfTheDay.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Bird Name */}
                <h4 className="text-white/70 text-[16px] italic font-medium text-center mb-4 font-rubik">
                  {birdOfTheDay.name}
                </h4>

                {/* Fun Fact */}
                <p className="text-white text-[20px] font-normal text-center leading-normal letter-spacing-[0.2px] flex-1 flex items-center justify-center font-rubik px-2">
                  {birdOfTheDay.funFact}
                </p>
              </div>
            </div>
          )}

          {/* Collection Progress Card */}
          <div className="flex-1 basis-0 min-w-[300px] h-[460px] rounded-[24px] bg-white relative p-6">
            <h3 className="text-[#2C2C2C] text-[16px] font-medium mb-2 font-rubik">
              Birds collected
            </h3>
            
            <div className="mb-8">
              <span className="text-[#2A2A2A] text-[61px] font-medium font-rubik leading-none">
                {totalCollected}
              </span>
              <span className="text-[#121212]/50 text-[40px] font-medium font-rubik">
                /{totalBirds}
              </span>
            </div>

            {/* Collection Dots Grid */}
            <div className="mb-8">
              <div className="grid grid-cols-10 gap-1 mb-4">
                {Array.from({ length: Math.min(75, totalBirds) }).map((_, index) => {
                  const bird = birds[index];
                  const isCollected = bird && isInCollection(bird.id);
                  const rarityColor = bird?.rarity === 'legendary' ? '#FFD700' : 
                                   bird?.rarity === 'rare' ? '#9C27B0' : '#4CAF50';
                  
                  return (
                    <div
                      key={index}
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

          {/* Google Maps Placeholder Card */}
          <div className="flex-1 basis-0 min-w-[300px] h-[460px] rounded-[24px] bg-white relative p-6">
            <h3 className="text-[#2C2C2C] text-[16px] font-medium mb-4 font-rubik">
              Birding hotspots
            </h3>
            
            {/* Placeholder for Google Maps */}
            <div className="w-full h-[360px] bg-gray-100 rounded-[16px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-600"
                  >
                    <path 
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-[14px] font-rubik">
                  Google Maps integration<br />coming soon
                </p>
              </div>
            </div>
            
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-[12px] text-gray-400 font-rubik">
                Best birding locations in and around San Francisco
              </p>
            </div>
          </div>
        </div>

        {/* Birds of San Francisco Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-[18px] font-normal font-rubik">
              Birds of San Francisco
            </h2>
            <div className="w-8 h-8 bg-white/70 backdrop-blur-sm rounded-lg flex items-center justify-center">
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
          </div>
        </div>

        {/* Bird Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {birds
            .filter(bird => bird.imageUrl && !bird.imageUrl.includes('placeholder') && !bird.imageUrl.includes('404'))
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
            className="bg-white/70 mx-[-1px] mb-[-1px] border-t border-[#2C2C2C]"
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
