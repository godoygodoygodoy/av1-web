import React, { useEffect, useState } from 'react';

// Loads frames from assets reliably using import.meta.globEager
function loadFramesFromAssets(baseNames = ['pacman', 'pacman s', 'pacman-s']) {
  // glob all image assets under src/assets
  const modules = import.meta.globEager('../../assets/**/*.{png,jpg,jpeg,webp}');
  const entries = Object.entries(modules);

  for (const base of baseNames) {
    const matched = entries.filter(([p]) => p.includes(`/assets/${base}/`));
    if (matched.length) {
      // sort by filename (numeric if present)
      matched.sort(([a], [b]) => {
        const fa = a.split('/').pop();
        const fb = b.split('/').pop();
        const na = (fa.match(/(\d+)/) || [])[0];
        const nb = (fb.match(/(\d+)/) || [])[0];
        if (na && nb) return Number(na) - Number(nb);
        return fa.localeCompare(fb, undefined, { numeric: true });
      });
      return matched.map(([, mod]) => mod.default || mod);
    }
  }

  return [];
}

export default function PacmanButton({ active = false, onClick, size = 28, alt = 'Pacman toggle' }) {
  const [frame, setFrame] = useState(0);
  const [framesActive, setFramesActive] = useState([]);
  const [framesInactive, setFramesInactive] = useState([]);

  useEffect(() => {
    // load frames once (both sets)
    const inactive = loadFramesFromAssets(['pacman', 'pacman s', 'pacman-s']);
    const activeSet = loadFramesFromAssets(['pacman s', 'pacman-s', 'pacman']);
    setFramesInactive(inactive.length ? inactive : []);
    setFramesActive(activeSet.length ? activeSet : inactive.slice());
  }, []);

  const frames = active ? framesActive : framesInactive;

  useEffect(() => {
    setFrame(0);
    if (!frames || frames.length === 0) return undefined;
    let mounted = true;
    const id = setInterval(() => {
      if (!mounted) return;
      setFrame((f) => (f + 1) % frames.length);
    }, 120);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [active, frames]);

  const src = frames && frames.length ? frames[frame] : '';

  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      title={active ? 'Marcar como pendente' : 'Marcar como concluída'}
      style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          width={size}
          height={size}
          style={{ imageRendering: 'pixelated', width: size, height: size, display: 'block' }}
        />
      ) : (
        <span style={{ width: size, height: size, display: 'inline-block', background: '#FFD800', borderRadius: '50%' }} />
      )}
    </button>
  );
}
