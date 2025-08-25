import { useRef, useState, useCallback } from 'react';

interface Use3DCardHoverOptions {
  maxTilt?: number;
  scale?: number;
  speed?: number;
}

export function use3DCardHover({
  maxTilt = 15,
  scale = 1.05,
  speed = 300
}: Use3DCardHoverOptions = {}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [transform, setTransform] = useState('');

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate the center of the card
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate the mouse position relative to the center
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate rotation values
    const rotateX = ((mouseY - centerY) / (rect.height / 2)) * -maxTilt;
    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * maxTilt;
    
    // Apply transform
    const transformValue = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
    setTransform(transformValue);
  }, [maxTilt, scale]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransform(`perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`);
  }, []);

  const cardProps = {
    ref: cardRef,
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    style: {
      transform,
      transformStyle: 'preserve-3d' as const,
      transition: isHovered ? 'none' : `transform ${speed}ms ease-out`,
      willChange: 'transform'
    }
  };

  return { cardProps, isHovered };
}
