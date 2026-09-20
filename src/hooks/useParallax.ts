import { useEffect, useRef, useState } from 'react';

/**
 * useParallax — returns a ref to attach to the section element and
 * a `offset` value (in px) to apply as translateY to the background image.
 * @param speed  0 = no parallax, 0.4 = medium, 0.6 = strong
 */
export function useParallax(speed = 0.35) {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      // Progress from -1 (fully below) to +1 (fully above)
      const progress = (viewportH / 2 - rect.top - rect.height / 2) / viewportH;
      setOffset(progress * viewportH * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref, offset };
}
