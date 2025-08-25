import { useState } from 'react';
import { birds, Bird } from '@shared/birds';
import { BirdDetailModal } from '@/components/BirdDetailModal';
import { CollectionProvider, useCollection } from '@/hooks/use-collection';
import { useHolographicCard } from '@/hooks/use-holographic-card';

// Main page content component that uses collection context
function LocationPackContent() {
  const { collectionStats, isInCollection } = useCollection();
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Get first 6 birds for the location pack
  const locationBirds = birds.slice(0, 6);

  const handleBirdClick = (bird: Bird) => {
    setSelectedBird(bird);
    setModalOpen(true);
  };

  // Get collected birds from the displayed location birds
  const collectedLocationBirds = locationBirds.filter(bird => isInCollection(bird.id));

  return (
    <div className="min-h-screen relative font-rubik">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#699886] via-[#699886] to-[#F0F0F0] bg-[#F0F0F0]" 
           style={{ background: 'linear-gradient(180deg, #699886 52.38%, #F0F0F0 99.77%)' }}>
      </div>

      {/* Decorative illustration */}
      <div className="absolute top-0 right-0 w-60 h-80 lg:w-80 lg:h-96 overflow-hidden pointer-events-none">
        <img 
          src="https://api.builder.io/api/v1/image/assets/TEMP/55ea6c5e3b5a6de969e6a09982fc7faaefd4d165?width=480" 
          alt="Decorative birds illustration"
          className="w-full h-full object-cover object-left"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-4 py-8 max-w-md mx-auto lg:max-w-6xl lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-white text-3xl lg:text-4xl font-black uppercase tracking-wider leading-tight mb-2">
            San Francisco
          </h1>
          <p className="text-white/70 text-lg lg:text-xl font-medium">
            The West
          </p>
        </div>

        {/* Statistics Section */}
        <div className="mb-8 lg:mb-12">
          <div className="bg-black/30 rounded-xl p-4 backdrop-blur-2xl">
            <div className="flex items-center">
              {/* Birds Collected */}
              <div className="flex-1 text-center">
                <div className="text-white">
                  <span className="text-2xl lg:text-3xl font-bold">{collectedLocationBirds.length}</span>
                  <span className="text-lg lg:text-xl font-bold text-white/50">/{locationBirds.length}</span>
                </div>
                <div className="text-white text-xs font-bold uppercase tracking-wider mt-1">
                  Birds Collected
                </div>
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-white/20 mx-4"></div>

              {/* Achievements */}
              <div className="flex-1 text-center">
                <div className="text-white">
                  <span className="text-2xl lg:text-3xl font-bold">5</span>
                  <span className="text-lg lg:text-xl font-bold text-white/50">/30</span>
                </div>
                <div className="text-white text-xs font-bold uppercase tracking-wider mt-1">
                  Achievements
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bird Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {locationBirds.map((bird) => (
            <LocationBirdCard 
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

// Location-specific bird card component
function LocationBirdCard({ bird, isCollected, onClick }: {
  bird: Bird;
  isCollected: boolean;
  onClick: () => void;
}) {
  const { cardProps, glareProps, shineProps, isHovered } = useHolographicCard({
    maxTilt: 15,
    scale: 1.06,
    speed: 200,
    glareIntensity: 0.5,
    shineIntensity: 0.7
  });

  return (
    <div
      {...cardProps}
      className={`bg-white rounded-2xl overflow-hidden cursor-pointer relative ${
        isHovered
          ? 'shadow-2xl shadow-black/30'
          : 'shadow-lg shadow-black/10'
      } transition-shadow duration-200`}
      onClick={onClick}
    >
      {/* Holographic Glare Effect */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        {...glareProps}
      />

      {/* Holographic Shine Effect */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        {...shineProps}
      />

      {/* Card Content */}
      <div className="relative p-1 z-0">
        {/* Bird Image */}
        <div className="relative aspect-[154/253] rounded-xl overflow-hidden border border-white">
          <img 
            src={bird.imageUrl} 
            alt={bird.name}
            className="w-full h-full object-cover"
          />
          
          {/* Rarity Badge */}
          <div className="absolute top-2 right-2 w-6 h-6 bg-[#F3F3F3] border border-[#2C2C2C] rounded-full flex items-center justify-center">
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
            <div className="bg-white border border-black mx-[-1px] mb-1">
              <div className="px-4 py-2 text-center flex flex-col justify-center items-center ml-0.5">
                <h3 className="text-[#2C2C2C] font-rubik-one text-sm font-normal uppercase leading-tight">
                  {bird.name}
                </h3>
                <p className="text-[#2C2C2C]/50 font-rubik text-xs italic mt-1">
                  {bird.ability}
                </p>
              </div>
            </div>
          </div>

          {/* Collection indicator */}
          {isCollected && (
            <div className="absolute top-2 left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main component with provider
export default function Index() {
  return (
    <CollectionProvider>
      <LocationPackContent />
    </CollectionProvider>
  );
}
