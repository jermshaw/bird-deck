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
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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

    const updateMobileDetection = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    // Set initial state
    updateTimeOfDay();
    updateMobileDetection();
    getUserLocation();

    // Update every minute (for time of day only)
    const timeInterval = setInterval(updateTimeOfDay, 60000);

    // Listen for window resize to update mobile detection
    window.addEventListener('resize', updateMobileDetection);

    return () => {
      clearInterval(timeInterval);
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
    <div className="min-h-screen relative font-rubik" style={{ background: '#2C6066' }}>
      {/* San Francisco Background */}
      <div
        className="fixed inset-0"
        style={{
          height: isMobile ? '125vw' : '56.25vw', // 4:5 on mobile, 16:9 on tablet+
          maxHeight: '100vh',
          overflow: 'hidden'
        }}
      >
        <img
          src={isMobile
            ? "https://api.builder.io/api/v1/image/assets/TEMP/ded9186ce5bbaf36dbc8ba60f229ceef2074f0f5?width=888"
            : "https://api.builder.io/api/v1/image/assets/TEMP/caacd8627ebcc9512d90dd46451f79f83a02cc4d?width=3872"
          }
          alt="San Francisco Golden Gate Bridge"
          className="w-full h-auto max-w-none object-cover"
          style={{
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            minWidth: '100%',
            height: 'auto',
            minHeight: '400px'
          }}
        />
        {/* Gradient fade overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isMobile
              ? 'linear-gradient(to bottom, transparent 40%, #2C6066 100%)'
              : window.innerWidth < 1024
                ? 'linear-gradient(to bottom, transparent 50%, #2C6066 100%)'
                : 'linear-gradient(to bottom, transparent 70%, #2C6066 100%)'
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-6 py-8 max-w-md mx-auto md:max-w-lg lg:max-w-6xl lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8 lg:mb-12 mt-[120px] md:mt-[131px] lg:mt-[230px] flex flex-col justify-center items-center text-center">
          {/* San Francisco Title */}
          <h1 className="text-white text-[30px] md:text-[45px] lg:text-6xl font-black font-rubik uppercase tracking-[3px] leading-[26px] mb-1 md:mb-2 lg:mb-4">
            San Francisco
          </h1>
          <p className="text-white text-[20px] lg:text-3xl font-medium font-rubik leading-9 mb-8 md:mb-20">
            California
          </p>

          {/* Search Bar */}
          <div className="max-w-sm mx-auto mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-gray-600"
                >
                  <path d="M6.79458 1.63585e-05C5.72197 0.000503088 4.6647 0.254807 3.70919 0.74214C2.75368 1.22947 1.92705 1.936 1.29688 2.80398C0.666713 3.67195 0.250886 4.67673 0.0833919 5.73618C-0.0841026 6.79563 0.00148992 7.87968 0.333174 8.89972C0.664857 9.91976 1.23322 10.8468 1.99179 11.6052C2.75037 12.3635 3.67763 12.9315 4.69778 13.2629C5.71793 13.5942 6.80201 13.6794 7.8614 13.5116C8.9208 13.3437 9.92544 12.9276 10.7932 12.2971L14.1787 15.6826C14.3788 15.8827 14.6501 15.9951 14.9331 15.9951C15.2161 15.9951 15.4874 15.8827 15.6875 15.6826C15.8876 15.4825 16 15.2112 16 14.9282C16 14.6453 15.8876 14.3739 15.6875 14.1738L12.302 10.7883C13.0399 9.77403 13.4826 8.57524 13.5809 7.32481C13.6792 6.07437 13.4294 4.82113 12.8591 3.70399C12.2888 2.58684 11.4203 1.64943 10.3499 0.995654C9.27943 0.341875 8.04887 -0.00273598 6.79458 1.63585e-05ZM6.79458 11.4627C5.87191 11.4627 4.96997 11.1891 4.20281 10.6765C3.43564 10.1639 2.83771 9.43535 2.48462 8.58292C2.13153 7.73049 2.03915 6.7925 2.21915 5.88757C2.39916 4.98263 2.84346 4.1514 3.49588 3.49898C4.1483 2.84656 4.97953 2.40226 5.88447 2.22225C6.7894 2.04225 7.72739 2.13463 8.57982 2.48772C9.43225 2.84081 10.1608 3.43874 10.6734 4.20591C11.186 4.97307 11.4596 5.87501 11.4596 6.79768C11.4582 8.03449 10.9663 9.22025 10.0917 10.0948C9.21715 10.9694 8.03139 11.4613 6.79458 11.4627Z" fill="#3A3A3A"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Bird search"
                className="w-full py-4 pl-12 pr-6 text-lg font-rubik text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

        </div>

        {/* Statistics Section */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center justify-center gap-8 lg:gap-16">
            {/* Birds Collected */}
            <div className="text-center">
              <div className="text-white">
                <span className="text-3xl lg:text-4xl font-bold font-rubik">{collectedLocationBirds.length}</span>
                <span className="text-xl lg:text-2xl font-bold text-white/50 font-rubik">/{locationBirds.length}</span>
              </div>
              <div className="text-white text-xs font-bold uppercase tracking-wider mt-1 font-rubik">
                Birds Collected
              </div>
            </div>

            {/* Divider */}
            <div className="w-11 h-px bg-white/20"></div>

            {/* Achievements */}
            <div className="text-center">
              <div className="text-white">
                <span className="text-3xl lg:text-4xl font-bold font-rubik">0</span>
                <span className="text-xl lg:text-2xl font-bold text-white/50 font-rubik">/10</span>
              </div>
              <div className="text-white text-xs font-bold uppercase tracking-wider mt-1 font-rubik">
                Achievements
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
