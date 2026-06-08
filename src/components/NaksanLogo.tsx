import React from 'react';

export default function NaksanLogo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Base white triangle with deep charcoal stroke */}
      <polygon 
        points="50,6 95,94 5,94" 
        stroke="#1c1917" 
        strokeWidth="6" 
        fill="#ffffff" 
        strokeLinejoin="round" 
      />
      {/* Face profile cut defining the black region on the right */}
      <path
        d="M 50,6
           C 50,16 52,24 52.5,29
           C 51.5,35 49,39 45,42
           C 51,44.5 50.5,47.5 50.5,49
           C 50.5,51 52.5,53.2 52.5,56
           C 52.5,58.5 50,61 50.5,65
           C 51,69 52.5,73 52.5,78
           C 52.5,83 54.5,89 55,93
           L 92,93
           Z"
        fill="#1c1917"
      />
    </svg>
  );
}
