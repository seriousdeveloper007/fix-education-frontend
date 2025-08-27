import React from 'react'

export const BackgroundIconCloud = React.memo(function BackgroundIconCloud({ icons }) {
    return (
      <div className="pointer-events-none absolute inset-0">
        {icons.map(({ C, color, size, top, left }, i) => (
          <div
            key={i}
            className="absolute opacity-20 hover:opacity-40 transition-opacity duration-300 sm:scale-100 scale-75"
            style={{ top, left }}
          >
            <C size={size} style={{ color }} />
          </div>
        ))}
      </div>
    );
  });