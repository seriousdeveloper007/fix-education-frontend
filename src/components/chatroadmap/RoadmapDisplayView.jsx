import React from 'react';
import RoadMapUI from '../RoadMapUI';
import CreateNewButton from './CreateNewButton';

export default function RoadmapDisplayView({ existingRoadmap, onReset }) {
  return (
    <div className="relative z-10 h-screen w-full flex flex-col">
      {/* Navbar */}
      <div className="w-full flex-shrink-0">
      </div>

      {/* Main content container - needs overflow-hidden */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full max-w-4xl mx-auto px-1 py-4">
            <RoadMapUI roadmapData={existingRoadmap} />
          </div>
        </div>

        {/* Button - outside scrollable area */}
        <div className="flex-shrink-0 w-full max-w-4xl mx-auto px-1 py-4">
          <div className="flex justify-center">
            <CreateNewButton onClick={onReset} />
          </div>
        </div>
      </div>
    </div>
  );
}