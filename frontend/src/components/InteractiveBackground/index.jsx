import React, { useEffect, useRef } from 'react';
import './interactive.css';

export default function InteractiveBackground() {
  const containerRef = useRef(null);
  const blobsRef = useRef([]);
  const stateRef = useRef({ pointerX: 0, pointerY: 0, running: false, raf: null });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = () => container.getBoundingClientRect();

    // initialize blobs internal state (ignore undefined refs)
    const blobs = blobsRef.current.filter(Boolean).map((el, i) => ({
      el,
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      speed: 0.06 + i * 0.03,
      intensity: 28 + i * 18,
      // personalities: 0: follow, 1: flee, 2: orbit, 3: lazy follow
      behavior: i === 0 ? 'follow' : i === 1 ? 'flee' : i === 2 ? 'orbit' : 'linger',
      orbitAngle: Math.random() * Math.PI * 2,
    }));

    const onMove = (clientX, clientY) => {
      const r = rect();
      const centerX = r.left + r.width / 2;
      const centerY = r.top + r.height / 2;
      const offsetX = clientX - centerX; // center-based
      const offsetY = clientY - centerY;

      blobs.forEach((b) => {
        if (b.behavior === 'follow') {
          b.targetX = (offsetX / r.width) * b.intensity;
          b.targetY = (offsetY / r.height) * b.intensity;
        } else if (b.behavior === 'flee') {
          // run away opposite to pointer
          b.targetX = (-offsetX / r.width) * b.intensity * 1.4;
          b.targetY = (-offsetY / r.height) * b.intensity * 1.4;
        } else if (b.behavior === 'linger') {
          // small follow, more inertia
          b.targetX = (offsetX / r.width) * (b.intensity * 0.45);
          b.targetY = (offsetY / r.height) * (b.intensity * 0.45);
        } else if (b.behavior === 'orbit') {
          // orbit will be handled in animate using pointer as center
          b.orbitCenterX = offsetX / r.width * (b.intensity * 0.6);
          b.orbitCenterY = offsetY / r.height * (b.intensity * 0.6);
        }
      });
    };

    const handleMove = (e) => {
      const client = e.touches ? e.touches[0] : e;
      onMove(client.clientX, client.clientY);
    };

    let last = performance.now();
    const animate = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      blobs.forEach((b) => {
        if (b.behavior === 'orbit') {
          b.orbitAngle += 0.8 * dt; // angular speed
          const rad = 20 + (b.intensity || 40) * 0.25;
          const cx = b.orbitCenterX || 0;
          const cy = b.orbitCenterY || 0;
          b.targetX = cx + Math.cos(b.orbitAngle) * rad;
          b.targetY = cy + Math.sin(b.orbitAngle) * rad;
        }

        b.x += (b.targetX - b.x) * b.speed;
        b.y += (b.targetY - b.y) * b.speed;
        if (b.el) b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
      });
      stateRef.current.raf = requestAnimationFrame(animate);
    };

    // listen on window so pointer-events:none on container doesn't block events
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: true });

    // start animation loop
    if (!stateRef.current.running) {
      stateRef.current.running = true;
      stateRef.current.raf = requestAnimationFrame(animate);
    }

    // set initial center-based target so blobs start near center
    const r0 = rect();
    onMove(r0.left + r0.width / 2, r0.top + r0.height / 2);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      if (stateRef.current.raf) cancelAnimationFrame(stateRef.current.raf);
      stateRef.current.running = false;
    };
  }, []);

  return (
    <div ref={containerRef} className="interactive-bg" aria-hidden>
      <div className="blob blob-1" ref={(el) => (blobsRef.current[0] = el)} />
      <div className="blob blob-2" ref={(el) => (blobsRef.current[1] = el)} />
      <div className="blob blob-3" ref={(el) => (blobsRef.current[2] = el)} />
      <div className="blob blob-4" ref={(el) => (blobsRef.current[3] = el)} />
    </div>
  );
}
