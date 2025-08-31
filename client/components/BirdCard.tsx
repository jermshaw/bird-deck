import { useState } from 'react';
import { Bird } from '@shared/birds';

interface BirdCardProps {
  bird: Bird;
  isCollected: boolean;
  onClick: () => void;
}

export function BirdCard({ bird, isCollected, onClick }: BirdCardProps) {
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
