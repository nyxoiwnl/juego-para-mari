import { useState, useEffect, useRef, useCallback } from 'react';

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [normalized, setNormalized] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      setPosition({ x, y });
      setNormalized({
        x: (x / window.innerWidth - 0.5) * 2,
        y: (y / window.innerHeight - 0.5) * 2,
      });
    };
    const handleTouch = (e) => {
      if (e.touches.length > 0) {
        const x = e.touches[0].clientX;
        const y = e.touches[0].clientY;
        setPosition({ x, y });
        setNormalized({
          x: (x / window.innerWidth - 0.5) * 2,
          y: (y / window.innerHeight - 0.5) * 2,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, []);

  return { position, normalized };
}

export function useHoldDetect(duration = 2000) {
  const [holding, setHolding] = useState(false);
  const [spinMode, setSpinMode] = useState(false);
  const timerRef = useRef(null);

  const startHold = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setSpinMode(true);
      setHolding(false);
    }, duration);
    setHolding(true);
  }, [duration]);

  const endHold = useCallback(() => {
    clearTimeout(timerRef.current);
    setHolding(false);
  }, []);

  const resetSpin = useCallback(() => {
    setSpinMode(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousedown', startHold);
    window.addEventListener('mouseup', endHold);
    window.addEventListener('touchstart', startHold, { passive: true });
    window.addEventListener('touchend', endHold, { passive: true });
    return () => {
      window.removeEventListener('mousedown', startHold);
      window.removeEventListener('mouseup', endHold);
      window.removeEventListener('touchstart', startHold);
      window.removeEventListener('touchend', endHold);
      clearTimeout(timerRef.current);
    };
  }, [startHold, endHold]);

  return { holding, spinMode, resetSpin };
}
