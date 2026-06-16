import React, { useEffect, useRef } from 'react';
import './interactive.css';

export default function InteractiveBackground() {
  const containerRef = useRef(null);
  const blobsRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      blobsRef.current.forEach((b, i) => {
        const speed = 0.08 + i * 0.03;
        b.style.transform = `translate(${(x - b._x) * speed}px, ${(y - b._y) * speed}px)`;
        b._x = x;
        b._y = y;
      });
    };

    container.addEventListener('mousemove', handleMove);
    container.addEventListener('touchmove', (ev) => handleMove(ev.touches[0]));

    // init positions
    blobsRef.current.forEach((b) => {
      b._x = container.clientWidth / 2;
      b._y = container.clientHeight / 2;
    });

    return () => {
      container.removeEventListener('mousemove', handleMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="interactive-bg">
      <div className="blob blob-1" ref={(el) => (blobsRef.current[0] = el)} />
      <div className="blob blob-2" ref={(el) => (blobsRef.current[1] = el)} />
      <div className="blob blob-3" ref={(el) => (blobsRef.current[2] = el)} />
      <div className="blob blob-4" ref={(el) => (blobsRef.current[3] = el)} />
    </div>
  );
}
