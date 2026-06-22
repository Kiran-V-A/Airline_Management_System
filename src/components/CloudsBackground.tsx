'use client';
// ============================================
// CloudsBackground — Animated Parallax Clouds
// ============================================
import React from 'react';

const CloudSVG = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 300 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="150" cy="80" rx="140" ry="40" fill="white" fillOpacity="0.7" />
    <ellipse cx="100" cy="60" rx="80" ry="50" fill="white" fillOpacity="0.8" />
    <ellipse cx="200" cy="55" rx="70" ry="45" fill="white" fillOpacity="0.75" />
    <ellipse cx="150" cy="50" rx="60" ry="35" fill="white" fillOpacity="0.9" />
  </svg>
);

export default function CloudsBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Layer 1 — Distant clouds (slow) */}
      <CloudSVG
        className="cloud-1 absolute"
        style={{ top: '8%', width: '250px', opacity: 0.3 }}
      />
      <CloudSVG
        className="cloud-2 absolute"
        style={{ top: '15%', width: '200px', opacity: 0.25 }}
      />

      {/* Layer 2 — Mid-distance clouds */}
      <CloudSVG
        className="cloud-3 absolute"
        style={{ top: '25%', width: '320px', opacity: 0.4 }}
      />
      <CloudSVG
        className="cloud-4 absolute cloud-float"
        style={{ top: '35%', width: '280px', opacity: 0.35 }}
      />

      {/* Layer 3 — Foreground clouds (faster, more opaque) */}
      <CloudSVG
        className="cloud-5 absolute"
        style={{ top: '55%', width: '380px', opacity: 0.5 }}
      />
      <CloudSVG
        className="cloud-1 absolute"
        style={{ top: '70%', width: '300px', opacity: 0.45, animationDelay: '20s' }}
      />
      <CloudSVG
        className="cloud-2 absolute"
        style={{ top: '80%', width: '260px', opacity: 0.3, animationDelay: '15s' }}
      />
    </div>
  );
}
