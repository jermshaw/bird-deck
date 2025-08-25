import { useRef, useState, useCallback, useEffect } from 'react';

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
  const [isActive, setIsActive] = useState(false); // For touch/orientation active state
  const [transform, setTransform] = useState('');
  const [glareStyle, setGlareStyle] = useState({});
  const [shineStyle, setShineStyle] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  // Update card effects based on rotation values
  const updateCardEffects = useCallback((rotateX: number, rotateY: number, pointerX: number = 50, pointerY: number = 50) => {
    // Apply 3D transform
    const transformValue = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered || isActive ? scale : 1})`;
    setTransform(transformValue);
    
    // Update glare position (radial gradient following pointer/tilt)
    setGlareStyle({
      background: `radial-gradient(circle at ${pointerX}% ${pointerY}%, 
        rgba(255, 255, 255, ${glareIntensity}) 0%, 
        rgba(255, 255, 255, ${glareIntensity * 0.3}) 25%, 
        transparent 50%)`,
      mixBlendMode: 'overlay' as const,
      opacity: (isHovered || isActive) ? 1 : 0
    });
    
    // Update shine effect (dynamic gradient based on rotation)
    const shineAngle = Math.atan2(rotateX, rotateY) * (180 / Math.PI) + 45;
    setShineStyle({
      background: `linear-gradient(${shineAngle}deg, 
        rgba(255, 255, 255, 0) 0%, 
        rgba(255, 255, 255, ${shineIntensity * 0.1}) 25%, 
        rgba(255, 255, 255, ${shineIntensity * 0.3}) 50%, 
        rgba(255, 255, 255, ${shineIntensity * 0.1}) 75%, 
        rgba(255, 255, 255, 0) 100%)`,
      mixBlendMode: 'soft-light' as const,
      opacity: (isHovered || isActive) ? 1 : 0
    });
  }, [maxTilt, scale, glareIntensity, shineIntensity, isHovered, isActive]);

  // Desktop mouse interactions
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;

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
    
    updateCardEffects(rotateX, rotateY, pointerX, pointerY);
  }, [maxTilt, updateCardEffects, isMobile]);

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      setIsHovered(true);
    }
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      setIsHovered(false);
      setTransform(`perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`);
      setGlareStyle({ opacity: 0 });
      setShineStyle({ opacity: 0 });
    }
  }, [isMobile]);

  // Mobile touch interactions
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    setIsActive(true);
  }, [isMobile]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isMobile) return;

    const touch = e.touches[0];
    if (!touch) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate the center of the card
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate rotation values based on touch position
    const rotateX = ((touch.clientY - centerY) / (rect.height / 2)) * -maxTilt;
    const rotateY = ((touch.clientX - centerX) / (rect.width / 2)) * maxTilt;
    
    // Calculate touch position as percentage for glare effect
    const pointerX = ((touch.clientX - rect.left) / rect.width) * 100;
    const pointerY = ((touch.clientY - rect.top) / rect.height) * 100;
    
    updateCardEffects(rotateX, rotateY, pointerX, pointerY);
  }, [maxTilt, updateCardEffects, isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (!isMobile) return;
    setIsActive(false);
    setTransform(`perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`);
    setGlareStyle({ opacity: 0 });
    setShineStyle({ opacity: 0 });
  }, [isMobile]);

  // Device orientation for mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;

      // Normalize orientation values
      // Beta: front-to-back tilt (-180 to 180)
      // Gamma: left-to-right tilt (-90 to 90)
      const beta = Math.max(-45, Math.min(45, event.beta)) / 45;
      const gamma = Math.max(-45, Math.min(45, event.gamma)) / 45;

      const rotateX = beta * maxTilt * 0.5; // Reduce intensity for orientation
      const rotateY = gamma * maxTilt * 0.5;

      // Calculate pointer position based on orientation
      const pointerX = 50 + gamma * 30; // Slight offset based on tilt
      const pointerY = 50 + beta * 30;

      updateCardEffects(rotateX, rotateY, pointerX, pointerY);
    };

    const requestPermissionAndListen = async () => {
      // Try to request permission for iOS 13+ devices
      if (typeof DeviceOrientationEvent !== 'undefined' && 'requestPermission' in DeviceOrientationEvent) {
        try {
          // @ts-ignore - TypeScript doesn't know about requestPermission
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch (error) {
          // Permission denied or error, but don't show modal
          // Silently fall back to touch-only interactions
        }
      } else if (typeof DeviceOrientationEvent !== 'undefined') {
        // For other browsers that don't require permission
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    // Only request permission when user actually interacts with a card
    const handleFirstTouch = () => {
      requestPermissionAndListen();
      document.removeEventListener('touchstart', handleFirstTouch);
    };

    document.addEventListener('touchstart', handleFirstTouch, { once: true });

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      document.removeEventListener('touchstart', handleFirstTouch);
    };
  }, [isMobile, maxTilt, updateCardEffects]);

  const cardProps = {
    ref: cardRef,
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    style: {
      transform,
      transformStyle: 'preserve-3d' as const,
      transition: (isHovered || isActive) ? 'none' : `transform ${speed}ms ease-out`,
      willChange: 'transform',
      filter: (isHovered || isActive) ? 'brightness(1.1) contrast(1.15) saturate(1.2)' : 'none',
      // Prevent text selection and scrolling on mobile
      userSelect: 'none' as const,
      touchAction: 'none' as const
    }
  };

  const glareProps = {
    style: {
      ...glareStyle,
      transition: `opacity ${speed}ms ease-out`,
      pointerEvents: 'none' as const
    }
  };

  const shineProps = {
    style: {
      ...shineStyle,
      transition: `opacity ${speed}ms ease-out`,
      pointerEvents: 'none' as const
    }
  };

  return { 
    cardProps, 
    glareProps, 
    shineProps, 
    isHovered: isHovered || isActive
  };
}
