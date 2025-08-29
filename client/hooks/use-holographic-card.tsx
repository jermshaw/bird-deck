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
  const [orientationPermission, setOrientationPermission] = useState<'granted' | 'denied' | 'pending'>('pending');

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  // Update card effects based on rotation values
  const updateCardEffects = useCallback((rotateX: number, rotateY: number, pointerX: number = 50, pointerY: number = 50, isOrientation: boolean = false) => {
    // Apply 3D transform
    const transformValue = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered || isActive ? scale : 1})`;
    setTransform(transformValue);
    
    // Enhanced glare intensity for mobile orientation
    const effectiveGlareIntensity = isOrientation ? glareIntensity * 1.3 : glareIntensity;
    const effectiveShineIntensity = isOrientation ? shineIntensity * 1.2 : shineIntensity;

    // Update glare position (radial gradient following pointer/tilt)
    setGlareStyle({
      background: `radial-gradient(circle at ${pointerX}% ${pointerY}%,
        rgba(255, 255, 255, ${effectiveGlareIntensity}) 0%,
        rgba(255, 255, 255, ${effectiveGlareIntensity * 0.4}) 30%,
        rgba(255, 255, 255, ${effectiveGlareIntensity * 0.1}) 60%,
        transparent 80%)`,
      mixBlendMode: 'overlay' as const,
      opacity: (isHovered || isActive) ? 1 : 0
    });

    // Enhanced shine effect with more dramatic angles for orientation
    const shineAngle = Math.atan2(rotateX, rotateY) * (180 / Math.PI) + (isOrientation ? 90 : 45);
    setShineStyle({
      background: `linear-gradient(${shineAngle}deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, ${effectiveShineIntensity * 0.15}) 20%,
        rgba(255, 255, 255, ${effectiveShineIntensity * 0.4}) 50%,
        rgba(255, 255, 255, ${effectiveShineIntensity * 0.15}) 80%,
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

    updateCardEffects(rotateX, rotateY, pointerX, pointerY, false);
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

  // Request device orientation permission (iOS 13+)
  const requestOrientationPermission = useCallback(async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && 'requestPermission' in DeviceOrientationEvent) {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        setOrientationPermission(permission);
        return permission === 'granted';
      } catch (error) {
        console.warn('DeviceOrientationEvent permission request failed:', error);
        setOrientationPermission('denied');
        return false;
      }
    }
    // If no permission required (Android), assume granted
    setOrientationPermission('granted');
    return true;
  }, []);

  // Mobile touch interactions - disabled to remove hover effects on mobile
  const handleTouchStart = useCallback(async (e: React.TouchEvent<HTMLDivElement>) => {
    // Disabled - no hover effects on mobile
    return;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    // No special handling - allow normal scrolling
    return;
  }, []);

  const handleTouchEnd = useCallback(() => {
    // Disabled - no hover effects on mobile
    return;
  }, []);

  // Device orientation for mobile - disabled to remove hover effects
  useEffect(() => {
    // Disabled - no orientation-based effects on mobile
    return;
  }, []);

  const cardProps = {
    ref: cardRef,
    // Only enable mouse interactions on non-mobile devices
    ...(isMobile ? {} : {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    }),
    // Remove touch handlers to eliminate mobile hover effects
    style: {
      // No transform effects on mobile
      transform: isMobile ? 'none' : transform,
      transformStyle: isMobile ? 'flat' as const : 'preserve-3d' as const,
      transition: isMobile ? 'none' : ((isHovered || isActive) ? 'none' : `transform ${speed}ms ease-out`),
      willChange: isMobile ? 'auto' : 'transform',
      filter: isMobile ? 'none' : ((isHovered || isActive) ? 'brightness(1.1) contrast(1.15) saturate(1.2)' : 'none'),
      // Allow normal touch interactions on mobile
      userSelect: isMobile ? 'auto' as const : 'none' as const,
      touchAction: 'manipulation',
      // Performance optimizations
      backfaceVisibility: 'hidden' as const,
      perspective: isMobile ? 'none' : '1000px'
    }
  };

  const glareProps = {
    style: {
      // Disable glare effects on mobile
      ...(isMobile ? { opacity: 0 } : glareStyle),
      transition: isMobile ? 'none' : `opacity ${speed}ms ease-out`,
      pointerEvents: 'none' as const,
      // Performance optimizations
      willChange: isMobile ? 'auto' : 'opacity, background',
      backfaceVisibility: 'hidden' as const
    }
  };

  const shineProps = {
    style: {
      // Disable shine effects on mobile
      ...(isMobile ? { opacity: 0 } : shineStyle),
      transition: isMobile ? 'none' : `opacity ${speed}ms ease-out`,
      pointerEvents: 'none' as const,
      // Performance optimizations
      willChange: isMobile ? 'auto' : 'opacity, background',
      backfaceVisibility: 'hidden' as const
    }
  };

  return { 
    cardProps, 
    glareProps, 
    shineProps, 
    isHovered: isHovered || isActive
  };
}
