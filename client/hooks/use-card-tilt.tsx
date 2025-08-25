import { useEffect, useRef, useState } from 'react';

interface TiltState {
  rotateX: number;
  rotateY: number;
  scale: number;
  sheenX: number;
  sheenY: number;
  sheenOpacity: number;
}

interface UseCardTiltOptions {
  maxTilt?: number;
  scale?: number;
  speed?: number;
  glare?: boolean;
  maxGlare?: number;
}

export function useCardTilt({
  maxTilt = 25,
  scale = 1.05,
  speed = 1000,
  glare = true,
  maxGlare = 0.3
}: UseCardTiltOptions = {}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    sheenX: 50,
    sheenY: 50,
    sheenOpacity: 0
  });

  const [isHovered, setIsHovered] = useState(false);

  // Reset function
  const resetTilt = () => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      sheenX: 50,
      sheenY: 50,
      sheenOpacity: 0
    });
  };

  // Calculate tilt from mouse position
  const updateTiltFromMouse = (clientX: number, clientY: number) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (clientX - centerX) / (rect.width / 2);
    const deltaY = (clientY - centerY) / (rect.height / 2);

    const rotateY = deltaX * maxTilt;
    const rotateX = -deltaY * maxTilt;

    const sheenX = 50 + deltaX * 50;
    const sheenY = 50 + deltaY * 50;

    const newTilt = {
      rotateX,
      rotateY,
      scale: scale,
      sheenX: Math.max(0, Math.min(100, sheenX)),
      sheenY: Math.max(0, Math.min(100, sheenY)),
      sheenOpacity: glare ? maxGlare : 0
    };

    console.log('Setting tilt:', newTilt);
    setTilt(newTilt);
  };

  // Calculate tilt from device orientation
  const updateTiltFromOrientation = (beta: number, gamma: number) => {
    // Beta: front-to-back tilt (-180 to 180)
    // Gamma: left-to-right tilt (-90 to 90)
    
    // Normalize and clamp values
    const normalizedBeta = Math.max(-45, Math.min(45, beta)) / 45;
    const normalizedGamma = Math.max(-45, Math.min(45, gamma)) / 45;

    const rotateX = normalizedBeta * maxTilt;
    const rotateY = normalizedGamma * maxTilt;

    const sheenX = 50 + normalizedGamma * 50;
    const sheenY = 50 + normalizedBeta * 50;

    setTilt({
      rotateX,
      rotateY,
      scale: scale,
      sheenX: Math.max(0, Math.min(100, sheenX)),
      sheenY: Math.max(0, Math.min(100, sheenY)),
      sheenOpacity: glare ? maxGlare * 0.7 : 0 // Slightly less intense on mobile
    });
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let timer: NodeJS.Timeout | null = null;

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      if (isHovered) {
        updateTiltFromMouse(e.clientX, e.clientY);
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      resetTilt();
    };

    // Device orientation handler
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        updateTiltFromOrientation(e.beta, e.gamma);
      }
    };

    // Request device orientation permission for iOS 13+
    const requestOrientationPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && 'requestPermission' in DeviceOrientationEvent) {
        try {
          // @ts-ignore - TypeScript doesn't know about requestPermission
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch (error) {
          console.warn('Device orientation permission denied:', error);
        }
      } else if (typeof DeviceOrientationEvent !== 'undefined') {
        // For other browsers that don't require permission
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    // Add event listeners
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousemove', handleMouseMove);

    // Check if we're on a mobile device and request orientation permission
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // Add a small delay to avoid immediately requesting permission
      timer = setTimeout(requestOrientationPermission, 1000);
    }

    // Cleanup function - always return the same cleanup pattern
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isHovered, maxTilt, scale, glare, maxGlare]);

  // Generate CSS transform string
  const transform = `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`;

  // Generate sheen styles
  const sheenStyle = {
    background: `linear-gradient(${tilt.sheenX + tilt.sheenY}deg, 
      transparent 30%, 
      rgba(255, 255, 255, ${tilt.sheenOpacity}) 50%, 
      transparent 70%)`,
    transform: `translateX(${(tilt.sheenX - 50) * 2}%) translateY(${(tilt.sheenY - 50) * 2}%)`,
    opacity: tilt.sheenOpacity > 0 ? 1 : 0
  };

  return {
    elementRef,
    tilt,
    transform,
    sheenStyle,
    isHovered,
    resetTilt
  };
}
