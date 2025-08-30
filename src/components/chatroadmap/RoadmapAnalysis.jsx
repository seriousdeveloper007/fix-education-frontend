import React from "react";
import themeConfig from "../themeConfig";

export default function RoadmapAnalysis({ roadmap }) {
  const btn = themeConfig.buttons
  const skills = Array.isArray(roadmap?.skills_already_have)
    ? roadmap.skills_already_have
    : [];

  const getLevelColor = (level) => {
    const levelStr = String(level).toLowerCase();
    if (levelStr.includes('expert') || levelStr.includes('advanced')) {
      return 'text-green-600';
    }
    if (levelStr.includes('intermediate') || levelStr.includes('medium')) {
      return 'text-blue-600';
    }
    if (levelStr.includes('beginner') || levelStr.includes('basic') || levelStr.includes('novice')) {
      return 'text-amber-600';
    }
    return 'text-gray-600';
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-8">
          <div className="md:col-span-5">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              Target
            </p>
            <p className="text-base text-gray-900">
              {roadmap?.target_skill_or_role || "—"}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              Duration
            </p>
            <p className="text-base text-gray-900">
              {Number(roadmap?.total_weeksuration) || "—"} weeks
            </p>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              Current Profession
            </p>
            <p className="text-base text-gray-900">
              {roadmap?.current_profession || "—"}
            </p>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">
              Current Skills
            </h3>
            <span className="text-xs text-gray-500">
              {skills.length}
            </span>
          </div>

          {skills.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">No skills listed</p>
            </div>
          ) : (
            <div className="space-y-2">
              {skills.map((s, i) => {
                const name = s?.name || s?.topic || "Skill";
                const level = s?.level ?? "";
                const levelColor = getLevelColor(level);
                
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-sm text-gray-900">
                      {name}
                    </span>
                    {String(level).length > 0 && (
                      <span className={`text-xs ${levelColor}`}>
                        {level}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6">
          <button className={`px-4 py-2 text-sm ${btn.secondary}`}>
            Create roadmap
          </button>
        </div>
      </div>
    </div>
  );
}