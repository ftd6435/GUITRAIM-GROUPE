import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/utils';

const Reveal = ({
  children,
  className = '',
  delay = 0,
  direction = 'up'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    // Fallback: Show content if observer fails or after long delay
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'reveal-base',
        `reveal-${direction}`,
        isVisible && 'reveal-visible',
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default Reveal;
