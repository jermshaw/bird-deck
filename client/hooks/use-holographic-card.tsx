import { useRef, useState, useCallback } from 'react';

interface UseHolographicCardOptions {
  maxTilt?: number;
  scale?: number;
  speed?: number;
  glareIntensity?: number;
  shineIntensity?: number;
}

export function useHolographicCard({
  maxTilt = 20,
  scale = 1.08,
  speed = 300,
  glareIntensity = 0.4,
  shineIntensity = 0.6
}: UseHolographicCardOptions = {}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [transform, setTransform] = useState('');
  const [glareStyle, setGlareStyle] = useState({});
  const [shineStyle, setShineStyle] = useState({});

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
    
    // Calculate mouse position as percentage for glare effect
    const pointerX = ((mouseX - rect.left) / rect.width) * 100;
    const pointerY = ((mouseY - rect.top) / rect.height) * 100;
    
    // Apply 3D transform
    const transformValue = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
    setTransform(transformValue);
    
    // Update glare position (radial gradient following mouse)
    setGlareStyle({
      background: `radial-gradient(circle at ${pointerX}% ${pointerY}%, 
        rgba(255, 255, 255, ${glareIntensity}) 0%, 
        rgba(255, 255, 255, ${glareIntensity * 0.3}) 25%, 
        transparent 50%)`,
      mixBlendMode: 'overlay' as const,
      opacity: isHovered ? 1 : 0
    });
    
    // Update shine effect (dynamic gradient based on mouse position)
    const shineAngle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
    setShineStyle({
      background: `linear-gradient(${shineAngle + 45}deg, 
        rgba(255, 255, 255, 0) 0%, 
        rgba(255, 255, 255, ${shineIntensity * 0.1}) 25%, 
        rgba(255, 255, 255, ${shineIntensity * 0.3}) 50%, 
        rgba(255, 255, 255, ${shineIntensity * 0.1}) 75%, 
        rgba(255, 255, 255, 0) 100%)`,
      mixBlendMode: 'soft-light' as const,
      opacity: isHovered ? 1 : 0
    });
  }, [maxTilt, scale, glareIntensity, shineIntensity, isHovered]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransform(`perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`);
    setGlareStyle({ opacity: 0 });
    setShineStyle({ opacity: 0 });
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
      willChange: 'transform',
      filter: isHovered ? 'brightness(1.1) contrast(1.15) saturate(1.2)' : 'none'
    }
  };

  const glareProps = {
    style: {
      ...glareStyle,
      transition: `opacity ${speed}ms ease-out`
    }
  };

  const shineProps = {
    style: {
      ...shineStyle,
      transition: `opacity ${speed}ms ease-out`
    }
  };

  return { 
    cardProps, 
    glareProps, 
    shineProps, 
    isHovered 
  };
}
