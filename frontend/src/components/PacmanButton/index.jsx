import React, { useEffect, useState } from 'react';

function buildFrames(folder, count = 3) {
  // expects images in src/assets/{folder}/0.png, 1.png, 2.png
  return Array.from({ length: count }).map((_, i) => new URL(`../../assets/${folder}/${i}.png`, import.meta.url).href);
}

export default function PacmanButton({ active = false, onClick, size = 28, alt = 'Pacman toggle' }) {
  const [frame, setFrame] = useState(0);

  const frames = active ? buildFrames('pacman-s', 3) : buildFrames('pacman', 3);

  useEffect(() => {
    setFrame(0);
    let mounted = true;
    const id = setInterval(() => {
      if (!mounted) return;
      setFrame((f) => (f + 1) % frames.length);
    }, 120);
    return () => {
      mounted = false;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      title={active ? 'Marcar como pendente' : 'Marcar como concluída'}
      style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      <img
        src={frames[frame]}
        alt={alt}
        width={size}
        height={size}
        style={{ imageRendering: 'pixelated', width: size, height: size, display: 'block' }}
      />
    </button>
  );
}
