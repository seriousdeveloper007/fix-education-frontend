import React from "react";
import { BG_ICONS } from "./chatroadmap/constants";

export const BackgroundIconCloud = React.memo(function BackgroundIconCloud() {
  const icons = BG_ICONS ?? [];
  return (
    <div className="pointer-events-none fixed inset-0 -z-10"> {/* was just inset-0 */}
      {icons.map(({ C, color, size, top, left }, i) => (
        <div
          key={i}
          className="absolute opacity-20 transition-opacity duration-300 sm:scale-100 scale-75"
          style={{ top, left }}
        >
          <C size={size} style={{ color }} />
        </div>
      ))}
    </div>
  );
});
