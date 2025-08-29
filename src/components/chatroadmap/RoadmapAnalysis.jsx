import React from "react";

export default function RoadmapAnalysis({ roadmap }) {
  const skills = Array.isArray(roadmap?.skills_already_have) ? roadmap.skills_already_have : [];

  return (
    <div className="w-full">
      <div className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-4 shadow-sm">
        <div className="mb-2">
          <div className="text-xs uppercase tracking-wide text-cyan-700/80">Goal and skill Analysis</div>
          <h3 className="text-base font-semibold text-cyan-900">{roadmap?.title || "Untitled Roadmap"}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-white/70 p-3">
            <div className="text-[11px] uppercase text-slate-500">Target</div>
            <div className="font-medium">{roadmap?.target_skill_or_role || "—"}</div>
          </div>

          <div className="rounded-lg bg-white/70 p-3">
            <div className="text-[11px] uppercase text-slate-500">Duration</div>
            <div className="font-medium">{Number(roadmap?.time_duration) || "—"} weeks</div>
          </div>

          <div className="rounded-lg bg-white/70 p-3 sm:col-span-2">
            <div className="text-[11px] uppercase text-slate-500">Current Profession</div>
            <div className="font-medium">{roadmap?.current_profession || "Not specified"}</div>
          </div>
        </div>

        <div className="mt-3">
          <div className="text-[11px] uppercase text-slate-500 mb-1">Skills Already Have</div>
          {skills.length === 0 ? (
            <div className="text-sm text-slate-600">No skills provided.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => {
                const name = s?.name || s?.topic || "Skill";
                const level = s?.level ?? "";
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-white/80 px-2 py-1 text-xs"
                  >
                    <span className="font-medium">{name}</span>
                    {String(level).length > 0 && (
                      <span className="rounded-full bg-cyan-100 px-1.5 py-0.5 text-[10px] text-cyan-800">
                        {level}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
