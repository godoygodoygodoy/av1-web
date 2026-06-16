import React from 'react';

export default function Toast({ message, type = 'info' }) {
  if (!message) return null;
  const bg = type === 'error' ? 'bg-red-700' : 'bg-slate-800';
  return (
    <div className={`fixed top-6 right-6 ${bg} text-white px-4 py-2 rounded-lg shadow-lg z-50`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
