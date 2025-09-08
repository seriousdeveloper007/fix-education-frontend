import React from "react";

export default function RoadmapHeading() {
  return (
    <div className="py-12">
      <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mx-2">
        Achieve your goal by building your{" "}
        <span className="relative inline-block px-1 py-1 sm:py-2">
          <span className="absolute inset-x-0 bottom-0 h-3 bg-emerald-200/60 rounded-lg -z-10" />
          <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
            Personalized Roadmap
          </span>
        </span>
      </h1>
      <p className="text-center mt-3 text-base sm:text-lg text-slate-700 max-w-4xl mx-auto">
        "ILON AI curates the best free resources from YouTube, GitHub,
        LeetCode, HackerRank, and more — matched to your skill level."
      </p>
    </div>
  );
}