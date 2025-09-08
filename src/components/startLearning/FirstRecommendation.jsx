import React from 'react';
import { BookOpen, ArrowRight, Target } from 'lucide-react';

const FirstMicroLessonsDisplay = ({ data }) => {
  const moduleName = data?.module_name ?? 'Recommended Module';
  const microLessons = Array.isArray(data?.micro_lessons) ? data.micro_lessons : [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{moduleName}</h3>
            <p className="text-sm text-gray-600">{microLessons.length} recommended micro-lessons</p>
          </div>
        </div>
      </div>

      {/* Micro-lessons List */}
      <div className="divide-y divide-gray-100">
        {microLessons.map((lesson, index) => (
          <div key={lesson?.order ?? index} className="p-6 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-start gap-4">
              {/* Order Number */}
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
                {lesson?.order ?? index + 1}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-medium text-gray-900 mb-2">
                  {lesson?.title ?? 'Untitled Lesson'}
                </h4>
                
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <Target className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{lesson?.why_this_lesson ?? 'Details coming soon.'}</p>
                </div>
              </div>

              {/* Arrow for visual flow */}
              {index < microLessons.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-2" />
              )}
            </div>
          </div>
        ))}

        {microLessons.length === 0 && (
          <div className="p-6 text-sm text-gray-500">No micro-lessons available.</div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 border-t border-gray-100">
        Ready to start your learning journey? Follow the lessons in order for the best experience.
      </div>
    </div>
  );
};

export default function FirstRecommendation({ data }) {
  return <FirstMicroLessonsDisplay data={data} />;
}