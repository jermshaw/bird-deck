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
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [userLocation, setUserLocation] = useState('San Francisco, The West');
  const [headerBird, setHeaderBird] = useState<Bird | null>(null);

  // Function to determine current time period
  const getTimeOfDay = () => {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= 5 && currentHour < 8) {
      return 'early-morning'; // 5 AM – 8 AM
    } else if (currentHour >= 8 && currentHour < 11) {
      return 'morning'; // 8 AM – 11 AM
    } else if (currentHour >= 11 && currentHour < 14) {
      return 'noon'; // 11 AM – 2 PM
    } else if (currentHour >= 14 && currentHour < 17) {
      return 'afternoon'; // 2 PM – 5 PM
    } else if (currentHour >= 17 && currentHour < 20) {
      return 'evening'; // 5 PM – 8 PM
    } else {
      return 'night'; // 8 PM – 5 AM
    }
  };

  // Function to get dynamic greeting based on time period
  const getDynamicGreeting = (period: string) => {
    const greetings = {
      'early-morning': [
        "Good dawn! The Ruby-Crowned Kinglets are singing just for you.",
        "Rise and shine! A new day of bird spotting awaits."
      ],
      'morning': [
        "Chirp, chirp! Let's see what birds are up and about today.",
        "Morning calls: time to fill your wings with adventure!"
      ],
      'noon': [
        "The sun is high, and so are the Peregrine Falcons!",
        "Time to stretch your wings and explore the skies."
      ],
      'afternoon': [
        "Golden hour for golden finches.",
        "The woods are whispering – hear the songbirds?"
      ],
      'evening': [
        "Dusk is settling. The night herons are on patrol.",
        "Evening calls: rest or spot a Steller's Jay before nightfall."
      ],
      'night': [
        "Good night, little night owl. Sweet dreams of feathered friends.",
        "The forest is quiet… perfect time to dream of tomorrow's sightings."
      ]
    };

    const periodGreetings = greetings[period as keyof typeof greetings] || greetings.morning;
    // Randomly select one of the two greetings for variety
    return periodGreetings[Math.floor(Math.random() * periodGreetings.length)];
  };

  // Function to get dynamic circles colors based on time period
  const getCircleColors = (period: string) => {
    switch (period) {
      case 'early-morning':
        return {
          circle1: '#FFB6C1', // Light pink
          circle2: '#FFD700', // Gold
          circle3: '#FFA07A'  // Light salmon
        };
      case 'morning':
        return {
          circle1: '#87CEEB', // Sky blue
          circle2: '#F0E68C', // Khaki
          circle3: '#98FB98'  // Pale green
        };
      case 'noon':
        return {
          circle1: '#00BFFF', // Deep sky blue
          circle2: '#87CEFA', // Light sky blue
          circle3: '#B0E0E6'  // Powder blue
        };
      case 'afternoon':
        return {
          circle1: '#FFD700', // Gold
          circle2: '#FF8C00', // Dark orange
          circle3: '#FFA500'  // Orange
        };
      case 'evening':
        return {
          circle1: '#FF6347', // Tomato
          circle2: '#DA70D6', // Orchid
          circle3: '#8A2BE2'  // Blue violet
        };
      case 'night':
        return {
          circle1: '#2F4F4F', // Dark slate gray
          circle2: '#483D8B', // Dark slate blue
          circle3: '#191970'  // Midnight blue
        };
      default:
        return {
          circle1: '#87CEEB',
          circle2: '#F0E68C',
          circle3: '#98FB98'
        };
    }
  };

  // Function to get background gradient for each time period
  const getBackgroundGradient = (period: string) => {
    switch (period) {
      case 'early-morning':
        return 'linear-gradient(180deg, #FDF2F8 0%, #FED7AA 100%)'; // pale pink → light orange
      case 'morning':
        return 'linear-gradient(180deg, #FEF08A 0%, #BAE6FD 100%)'; // bright yellow → soft sky blue
      case 'noon':
        return 'linear-gradient(180deg, #0EA5E9 0%, #38BDF8 100%)'; // vibrant sky blue
      case 'afternoon':
        return 'linear-gradient(180deg, #FBBF24 0%, #FB923C 100%)'; // golden yellow → soft orange
      case 'evening':
        return 'linear-gradient(180deg, #EA580C 0%, #7C3AED 100%)'; // deep orange → purple
      case 'night':
        return 'linear-gradient(180deg, #1E293B 0%, #000000 100%)'; // dark navy → black
      default:
        return 'linear-gradient(180deg, #FEF08A 0%, #BAE6FD 100%)'; // fallback to morning
    }
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
          setUserLocation(`${city}, ${state}`);
        } else if (city && country) {
          setUserLocation(`${city}, ${country}`);
        } else if (state && country) {
          setUserLocation(`${state}, ${country}`);
        } else {
          setUserLocation('Your Location');
        }
      }
    } catch (error) {
      console.log('Error getting location:', error);
      // Keep default location if geolocation fails
    }
  };

  // Update background based on time of day and get user location
  useEffect(() => {
    const updateTimeOfDay = () => {
      setTimeOfDay(getTimeOfDay());
    };

    // Set initial state
    updateTimeOfDay();
    getUserLocation();

    // Update every minute
    const interval = setInterval(updateTimeOfDay, 60000);

    return () => clearInterval(interval);
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
      {/* Dynamic Background with gradient */}
      <div
        className="fixed inset-0 transition-all duration-1000 ease-in-out"
        style={{
          background: getBackgroundGradient(timeOfDay)
        }}
      >
      </div>

      {/* Dynamic Background Circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out"
          viewBox="0 0 393 887"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="blur1" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="60" />
            </filter>
            <filter id="blur2" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="50" />
            </filter>
            <filter id="blur3" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="70" />
            </filter>
          </defs>

          {/* Large pink/primary circle */}
          <circle
            cx="12%"
            cy="46%"
            r="35%"
            fill={getCircleColors(timeOfDay).circle1}
            filter="url(#blur1)"
            opacity="0.85"
            className="transition-all duration-1000 ease-in-out"
          />

          {/* Medium cyan/secondary circle */}
          <circle
            cx="78%"
            cy="8%"
            r="28%"
            fill={getCircleColors(timeOfDay).circle2}
            filter="url(#blur2)"
            opacity="0.75"
            className="transition-all duration-1000 ease-in-out"
          />

          {/* Small yellow/accent circle */}
          <circle
            cx="22%"
            cy="3%"
            r="22%"
            fill={getCircleColors(timeOfDay).circle3}
            filter="url(#blur3)"
            opacity="0.9"
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-4 py-8 max-w-md mx-auto lg:max-w-6xl lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8 lg:mb-12 mt-[100px]">
          <div className="w-full lg:w-1/3">
            <h1 className="text-white text-2xl lg:text-3xl font-medium font-rubik uppercase leading-tight mb-2">
              {getDynamicGreeting(timeOfDay)}
            </h1>
            <p className="text-white/70 text-lg lg:text-xl font-medium">
              {userLocation}
            </p>
          </div>
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
                  <span className="text-2xl lg:text-3xl font-bold">0</span>
                  <span className="text-lg lg:text-xl font-bold text-white/50">/10</span>
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
