import React from "react";
import { BG_ICONS } from "./constants";

export const BackgroundIconCloud = React.memo(function BackgroundIconCloud() {
  const icons = BG_ICONS ?? [];

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
