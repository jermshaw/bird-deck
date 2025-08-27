import { useState, useEffect } from 'react';
import { birds, Bird } from '@shared/birds';
import { BirdDetailModal } from '@/components/BirdDetailModal';
import { CollectionProvider, useCollection } from '@/hooks/use-collection';
import { useHolographicCard } from '@/hooks/use-holographic-card';

// Main page content component that uses collection context
function LocationPackContent() {
  const { collectionStats, isInCollection } = useCollection();
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [birdOfTheDay, setBirdOfTheDay] = useState<Bird | null>(null);
  const [userLocation, setUserLocation] = useState('San Francisco');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Function to select a random bird of the day
  const selectBirdOfTheDay = () => {
    // Use current date as seed for consistent "bird of the day" selection
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const randomIndex = seed % birds.length;
    return birds[randomIndex];
  };


  // Function to get user's location
  const getUserLocation = async () => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by this browser.');
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;

      // Use OpenStreetMap Nominatim API for reverse geocoding (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
      );

      if (response.ok) {
        const data = await response.json();
        const city = data.address?.city || data.address?.town || data.address?.village || data.address?.hamlet;
        const state = data.address?.state || data.address?.province || data.address?.region;
        const country = data.address?.country;

        if (city && state) {
          setUserLocation(`${city}`);
        } else if (city && country) {
          setUserLocation(`${city}`);
        } else if (state && country) {
          setUserLocation(`${state}`);
        } else {
          setUserLocation('Your Location');
        }
      }
    } catch (error) {
      console.log('Error getting location:', error);
      // Keep default location if geolocation fails
    }
  };

  // Initialize bird of the day and get user location
  useEffect(() => {
    const updateMobileDetection = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    // Set initial state
    setBirdOfTheDay(selectBirdOfTheDay());
    updateMobileDetection();
    getUserLocation();

    // Listen for window resize to update mobile detection
    window.addEventListener('resize', updateMobileDetection);

    return () => {
      window.removeEventListener('resize', updateMobileDetection);
    };
  }, []);

  // Show all birds
  const locationBirds = birds;

  const handleBirdClick = (bird: Bird) => {
    setSelectedBird(bird);
    setModalOpen(true);
  };

  // Get collected birds from the displayed location birds
  const collectedLocationBirds = locationBirds.filter(bird => isInCollection(bird.id));

  return (
    <div className="min-h-screen relative font-rubik">
      {/* Blurred Bird Background - Same as Modal */}
      {birdOfTheDay && (
        <>
          {/* Blurred Bird Image Background */}
          <div
            className="fixed inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: `url(${birdOfTheDay.imageUrl})`,
              filter: 'blur(120px) saturate(1.3) brightness(1.1)'
            }}
          />

          {/* Colorful Gradient Overlay */}
          <div
            className="fixed inset-0 z-0"
            style={{
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(236, 72, 153, 0.2) 50%, rgba(34, 197, 94, 0.2) 100%)'
            }}
          />
        </>
      )}

      {/* Fallback background when no bird */}
      {!birdOfTheDay && (
        <div className="fixed inset-0 bg-[#ECE9DF] z-0" />
      )}

      {/* Content Container */}
      <div className="relative z-10 px-6 py-8 max-w-md mx-auto md:max-w-lg lg:max-w-6xl lg:px-8">

        {/* Header Section */}
        <div className="mb-8 lg:mb-12">
          {/* Top Bar - App Name and Location */}
          <div className="flex justify-between items-center mb-8 md:mb-12 lg:mb-16">
            {/* App Name - Top Left */}
            <h1 className="text-white text-[24px] md:text-[28px] lg:text-[30px] font-semibold font-rubik tracking-wide">
              BirdDeck
            </h1>

            {/* User Location - Top Right */}
            <div className="flex items-center gap-2">
              <svg
                width="12"
                height="16"
                viewBox="0 0 13 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-white/70"
              >
                <path d="M6.13184 0.842773C9.51837 0.842773 12.2636 3.58808 12.2637 6.97461C12.2637 9.83754 7.88153 15.2913 6.52637 16.9092C6.31917 17.1562 5.94448 17.1563 5.7373 16.9092C4.38215 15.2913 0 9.83754 0 6.97461C3.11318e-05 3.5881 2.74533 0.842808 6.13184 0.842773ZM6.13184 4.5752C4.80666 4.5752 3.73242 5.64944 3.73242 6.97461C3.73258 8.29965 4.80676 9.37402 6.13184 9.37402C7.45678 9.37387 8.53109 8.29956 8.53125 6.97461C8.53125 5.64953 7.45688 4.57535 6.13184 4.5752Z" fill="white" fillOpacity="0.7"/>
              </svg>
              <span className="text-white/70 text-[16px] md:text-[17px] font-medium font-rubik">
                {userLocation}
              </span>
            </div>
          </div>

          {/* Bird of the Day Section */}
          {birdOfTheDay && (
            <div className="flex flex-col items-center text-center mt-8 mb-8">
              {/* Circular Bird Image */}
              <div
                className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px] rounded-full border-[1.5px] border-black/60 overflow-hidden mb-4 lg:mb-6"
                style={{
                  backgroundImage: `url(${birdOfTheDay.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />

              {/* Bird Name */}
              <h2 className="text-white/70 text-[14px] md:text-[15px] lg:text-[16px] font-medium italic font-rubik mb-3 sm:mb-4 lg:mb-6">
                {birdOfTheDay.name}
              </h2>

              {/* Fun Fact */}
              <p className="text-white text-[20px] md:text-[18px] lg:text-[20px] font-normal font-rubik text-center max-w-[354px] sm:max-w-[320px] md:max-w-[320px] lg:max-w-[380px] leading-[28px] sm:leading-relaxed tracking-wide">
                {birdOfTheDay.funFact}
              </p>
            </div>
          )}

        </div>

        {/* Statistics Section */}
        <div className="mb-8 lg:mb-12 flex justify-center">
          <div className="relative w-[345px] lg:w-[450px] h-[76px] flex items-center justify-center">
            {/* Background overlay */}
            <div
              className="absolute inset-0 rounded-xl bg-black/25"
              style={{ mixBlendMode: 'overlay' }}
            />

            {/* Statistics content */}
            <div className="relative flex items-center justify-center w-full px-8">
              {/* Birds Collected */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="mb-1">
                  <span className="text-white font-bold sm:font-medium font-rubik text-[31px] leading-none">{collectedLocationBirds.length}</span>
                  <span className="text-white/50 font-bold font-rubik text-[20px]">/</span>
                  <span className="text-white/50 font-bold sm:font-medium font-rubik text-[20px]">{locationBirds.length}</span>
                </div>
                <div className="text-white text-[11px] sm:text-[12px] font-semibold sm:font-bold uppercase tracking-[0.96px] font-rubik">
                  Birds Collected
                </div>
              </div>

              {/* Divider */}
              <div className="w-0 h-[44px] bg-white/10 border-l border-white/10 mx-4"></div>

              {/* Achievements */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="mb-1">
                  <span className="text-white font-bold sm:font-medium font-rubik text-[31px] leading-none">0</span>
                  <span className="text-white/50 font-bold sm:font-medium font-rubik text-[20px]">/30</span>
                </div>
                <div className="text-white text-[11px] sm:text-[12px] font-semibold sm:font-bold uppercase tracking-[0.96px] font-rubik">
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
        <div className="relative aspect-[154/253] rounded-xl overflow-hidden border border-black">
          <img
            src={bird.imageUrl}
            alt={bird.name}
            className={`w-full h-full object-cover transition-all duration-300 ${
              !isCollected ? 'grayscale' : ''
            }`}
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



          {/* Name Box - positioned at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="bg-white/70 border-t border-black mx-[-1px] mb-[-2px]" style={{ backdropFilter: 'blur(12px)', borderBottomLeftRadius: '15px', borderBottomRightRadius: '12px', borderTopWidth: '1.5px' }}>
              <div className="px-4 py-2 text-center flex flex-col justify-center items-center ml-0.5">
                <h3 className="text-[#2C2C2C] font-rubik font-bold text-sm uppercase leading-tight">
                  {bird.name}
                </h3>
                <p className="text-[#2C2C2C]/50 font-rubik text-xs italic mt-1">
                  {bird.ability}
                </p>
              </div>
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
      <LocationPackContent />
    </CollectionProvider>
  );
}
