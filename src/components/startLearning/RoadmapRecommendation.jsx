import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Info, ChevronRight, Target, Play, Clock } from 'lucide-react';
import { createRoadmap } from '../../services/roadmapService';

export default function RoadmapComponent({ message }) {
  // The message is the raw API response - extract data from payload
  console.log("input data", message)
  const data = message?.payload || {};
  const messageId = message?.id || message?.message_id;


  const moduleName = data?.module_name || 'Learning Roadmap';
  const currentLesson = data?.current_lesson || null;
  const futureLessons = Array.isArray(data?.future_lessons) ? data.future_lessons : [];
  const whyThisRoadmap = data?.why_this_roadmap || '';

  const [hoveredMiniLesson, setHoveredMiniLesson] = useState(null);
  const navigate = useNavigate();

  // Helper to ensure we display the proper lesson title
  const getLessonTitle = (lesson, fallback) => {
    const n = lesson?.name;
    if (typeof n === 'string' && n.trim()) return n.trim();
    if (typeof n === 'number') return `Lesson ${n}`;
    return fallback || '';
  };

  const handleMiniLessonClick = (miniLesson, miniLessonIndex) => {
    const miniLessonName = miniLesson?.name || `Mini Lesson ${miniLessonIndex + 1}`;

    // Only create roadmap if mini lesson has no id key
    if (!miniLesson?.id) {
      const messageData = {
        message_id: messageId,
        payload: data,
        mini_lesson_name: miniLessonName
      };

      createRoadmap(messageData).catch((error) => {
        console.error('Error creating roadmap:', error);
      });
    }

    // navigate(`/short-lesson/${encodeURIComponent(miniLessonName)}`, {
    //   state: miniLesson
    // });
  };

  // If no payload or data, show error state
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-700">No roadmap data available</p>
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-yellow-600">Debug Info</summary>
          <pre className="mt-2 text-xs bg-yellow-100 p-2 rounded overflow-auto">
            {JSON.stringify(message, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-indigo-50 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{moduleName}</h3>
            <p className="text-sm text-gray-600">Progressive learning path • Start with current lesson</p>
          </div>
        </div>
      </div>

      {/* Roadmap Content */}
      <div className="p-4 sm:p-6">
        {!currentLesson ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>No lessons defined yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Lesson */}
            <div className="relative">
              <div className="bg-white border-2 border-indigo-200 rounded-lg overflow-hidden shadow-sm">
                {/* Current Lesson Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 border-b border-indigo-100">
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <Target className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-semibold text-slate-900">
                          {getLessonTitle(currentLesson, 'Current Lesson')}
                        </h4>
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full">
                          Current
                        </span>
                      </div>
                      {currentLesson.description && (
                        <p className="text-sm text-slate-600 leading-relaxed">{currentLesson.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mini Lessons */}
                <div className="p-4">
                  <div className="space-y-3">
                    {currentLesson?.mini_lessons && currentLesson.mini_lessons.length > 0 ? (
                      currentLesson.mini_lessons.map((miniLesson, miniLessonIndex) => {
                        const isHovered = hoveredMiniLesson === miniLessonIndex;
                        const miniLessonName = miniLesson?.name || `Mini Lesson ${miniLessonIndex + 1}`;

                        return (

                          <div key={miniLessonIndex} className="flex items-center gap-2">
                            <button
                              type="button"
                              key={miniLessonIndex}
                              onClick={() => handleMiniLessonClick(miniLesson, miniLessonIndex)}
                              onMouseEnter={() => setHoveredMiniLesson(miniLessonIndex)}
                              onMouseLeave={() => setHoveredMiniLesson(null)}
                              className={`group w-full text-left bg-white border rounded-lg shadow-sm hover:shadow-md focus:shadow-md transition-all duration-200 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 transform hover:scale-[1.01] ${isHovered ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200'
                                }`}
                            >
                              <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isHovered ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    {isHovered ? (
                                      <Play className="w-3 h-3 ml-0.5" />
                                    ) : (
                                      <Clock className="w-4 h-4" />
                                    )}
                                  </div>
                                  <h5 className={`text-base font-semibold transition-colors ${isHovered ? 'text-indigo-800' : 'text-slate-800'
                                    }`}>
                                    {miniLessonName}
                                  </h5>
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-all duration-200 ${isHovered ? 'text-indigo-600 transform translate-x-1' : 'text-slate-500 group-hover:text-slate-700'
                                  }`} />
                              </div>
                              {/* Progress indicator */}
                              <div className={`h-1 transition-all duration-300 ${isHovered ? 'bg-gradient-to-r from-indigo-400 to-blue-500' : 'bg-gray-200'
                                }`} />
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(`/resources/${miniLesson?.id}`, {
                                state: {
                                  mini_lesson_id: miniLesson?.id ,
                                  mini_lesson_name: miniLessonName
                                }
                              })}
                              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
                            >
                              Resources
                            </button>
                          </div>

                        );
                      })
                    ) : (
                      <div className="bg-slate-50 border border-gray-200 rounded-lg p-8 text-center">
                        <p className="text-slate-700">No mini lessons defined for current lesson</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Future Lessons */}
            {futureLessons.length > 0 && (
              <div className="space-y-3">
                {futureLessons.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="relative">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-slate-50 transition-colors duration-150">
                      <div className="flex items-start gap-3">
                        <div className="bg-slate-200 text-slate-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-semibold text-slate-900 mb-1">
                            {getLessonTitle(lesson, `Lesson ${lessonIndex + 1}`)}
                          </h4>
                          {lesson?.description && (
                            <p className="text-sm text-slate-600 leading-relaxed">{lesson.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Why This Roadmap Section */}
        {whyThisRoadmap && (
          <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-indigo-700 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-indigo-900 mb-1">Why this roadmap?</h4>
                <p className="text-sm text-indigo-900/80 leading-relaxed">{whyThisRoadmap}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 sm:px-6 py-3 text-xs text-gray-500 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>Continue messaging to improve the roadmap</span>
          <span className="text-slate-700 font-medium">
            Current: {currentLesson?.mini_lessons?.length || 0} mini lessons • Future: {futureLessons.length} lessons
          </span>
        </div>
      </div>
    </div>
  );
}