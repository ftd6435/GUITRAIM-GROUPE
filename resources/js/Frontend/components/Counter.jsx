import React, { useState, useEffect, useRef } from 'react';

const Counter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Extract number and suffix (e.g., "150+" -> number: 150, suffix: "+")
  const number = parseInt(value.replace(/\D/g, ''), 10) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = number;
    if (start === end) return;

    let totalFrames = Math.floor(duration / 16); // ~60fps
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Use easeOutExpo for smoother animation
      const currentCount = Math.floor(end * (1 - Math.pow(2, -10 * progress)));
      
      if (frame === totalFrames) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(currentCount);
      }
    }, 16);

    return () => clearInterval(counter);
  }, [isVisible, number, duration]);

  return (
    <span ref={countRef}>
      {count}{suffix}
    </span>
  );
};

export default Counter;
