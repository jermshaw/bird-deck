import { useState } from 'react';
import { Bird } from '@shared/birds';

interface BirdCardProps {
  bird: Bird;
  isCollected: boolean;
  onClick: () => void;
}

export function BirdCard({ bird, isCollected, onClick }: BirdCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Show placeholder card if image failed to load
  if (imageError) {
    return (
      <div
        className="bg-white rounded-[14.4px] p-1 cursor-pointer relative overflow-hidden border-2 border-dashed border-gray-300"
        style={{ boxShadow: '0 10.8px 10.8px -6.3px rgba(0, 0, 0, 0.05)' }}
        onClick={onClick}
      >
        {/* Placeholder Container */}
        <div className="relative aspect-[154/253] rounded-[12.6px] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center">
          {/* Placeholder Icon */}
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-2">🐦</div>
            <div className="text-gray-500 text-xs px-2">Image Coming Soon</div>
          </div>
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
    );
  }

  return (
    <div
      className="bg-white rounded-[14.4px] p-1 cursor-pointer relative overflow-hidden"
      style={{ boxShadow: '0 10.8px 10.8px -6.3px rgba(0, 0, 0, 0.05)' }}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[154/253] rounded-[12.6px] border border-white overflow-hidden">
        {/* Loading State */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-2xl">🔄</div>
          </div>
        )}
        
        <img
          src={bird.imageUrl}
          alt={bird.name}
          className={`w-full h-full object-cover ${!isCollected ? 'grayscale' : ''} ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onError={() => setImageError(true)}
          onLoad={() => setImageLoading(false)}
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
