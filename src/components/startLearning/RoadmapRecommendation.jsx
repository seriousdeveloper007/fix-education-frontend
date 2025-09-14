import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Info, ChevronRight, Target, Play, CheckCircle, Clock } from 'lucide-react';
import { createRoadmap } from '../../services/chatService';

export default function RoadmapComponent({ props }) {

  const data = props?.payload
  console.log(props)
  const moduleName = data?.module_name ?? 'Learning Roadmap';
  const currentLesson = data?.current_lesson;
  const futureLessons = Array.isArray(data?.future_lessons) ? data.future_lessons : [];
  const whyThisRoadmap = data?.why_this_roadmap ?? '';
  const [hoveredTopic, setHoveredTopic] = useState(null);
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const navigate = useNavigate();

  // Helper to ensure we display the proper lesson title
  const getLessonTitle = (lesson, fallback) => {
    const n = lesson?.name;
    if (typeof n === 'string' && n.trim()) return n.trim();
    if (typeof n === 'number') return `Lesson ${n}`;
    return fallback ?? '';
  };

  // Helper to get mini lesson name - handles both string and object formats
  const getMiniLessonName = (miniLesson) => {
    if (typeof miniLesson === 'string') {
      return miniLesson;
    }
    if (typeof miniLesson === 'object' && miniLesson !== null) {
      return miniLesson.name || '';
    }
    return '';
  };

  // Helper to get the complete mini lesson data for navigation
  const getMiniLessonData = (miniLesson) => {
    if (typeof miniLesson === 'string') {
      return { name: miniLesson };
    }
    if (typeof miniLesson === 'object' && miniLesson !== null) {
      return miniLesson;
    }
    return { name: '' };
  };

  const handleTopicClick = async (miniLesson, topicIndex) => {
    const topicName = getMiniLessonName(miniLesson);
    const miniLessonData = getMiniLessonData(miniLesson);
    const existing_id =typeof miniLesson === "object" && miniLesson !== null? miniLesson.id: null;
    console.log(existing_id)
    if(!existing_id){
    
    const userStr = localStorage.getItem("user");
    let user_id = null;

    if (userStr) {
      const userObj = JSON.parse(userStr);
      user_id = userObj.id;
    }
    
    const apiPayload = {
      message_id: props.messageId,
      user_id: user_id,
      name: topicName,
      payload: data
    };
    console.log(apiPayload)
    const response = await createRoadmap(apiPayload);
    console.log('Roadmap created successfully:', response);

    }

    const next = new Set(completedTopics);
    next.has(topicIndex) ? next.delete(topicIndex) : next.add(topicIndex);
    setCompletedTopics(next);
    
    const lessonTitle = getLessonTitle(currentLesson, 'Current Lesson');
    
    // Pass both the lesson name and the complete mini lessons array for navigation
    const miniLessonsForNavigation = currentLesson?.mini_lessons || [];
    
    navigate(`/short-lesson/${encodeURIComponent(topicName)}`, {
      state: { 
        lessonName: lessonTitle, 
        miniLessonList: miniLessonsForNavigation,
        currentMiniLesson: miniLessonData
      },
    });
  };

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
            {/* Current Lesson - Styled like future lessons but expanded */}
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

                {/* Topics - Expanded Content */}
                <div className="p-4">
                  <div className="space-y-3">
                    {currentLesson?.mini_lessons && currentLesson.mini_lessons.length > 0 ? (
                      currentLesson.mini_lessons.map((miniLesson, topicIndex) => {
                        const isCompleted = completedTopics.has(topicIndex);
                        const isHovered = hoveredTopic === topicIndex;
                        const topicName = getMiniLessonName(miniLesson);

                        return (
                          <button
                            type="button"
                            key={topicIndex}
                            onClick={() => handleTopicClick(miniLesson, topicIndex)}
                            onMouseEnter={() => setHoveredTopic(topicIndex)}
                            onMouseLeave={() => setHoveredTopic(null)}
                            className={`group w-full text-left bg-white border rounded-lg shadow-sm hover:shadow-md focus:shadow-md transition-all duration-200 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 transform hover:scale-[1.01] ${isCompleted
                                ? 'border-green-200 bg-green-50'
                                : isHovered
                                  ? 'border-indigo-200 bg-indigo-50'
                                  : 'border-gray-200'
                              }`}
                          >
                            <div className="flex items-center justify-between p-4">
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isCompleted
                                    ? 'bg-green-100 text-green-600'
                                    : isHovered
                                      ? 'bg-indigo-100 text-indigo-600'
                                      : 'bg-gray-100 text-gray-400'
                                  }`}>
                                  {isCompleted ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : isHovered ? (
                                    <Play className="w-3 h-3 ml-0.5" />
                                  ) : (
                                    <Clock className="w-4 h-4" />
                                  )}
                                </div>
                                <h5 className={`text-base font-semibold transition-colors ${isCompleted
                                    ? 'text-green-800'
                                    : isHovered
                                      ? 'text-indigo-800'
                                      : 'text-slate-800'
                                  }`}>
                                  {topicName}
                                </h5>
                              </div>
                              <ChevronRight className={`w-4 h-4 transition-all duration-200 ${isCompleted
                                  ? 'text-green-600'
                                  : isHovered
                                    ? 'text-indigo-600 transform translate-x-1'
                                    : 'text-slate-500 group-hover:text-slate-700'
                                }`} />
                            </div>

                            {/* Progress indicator */}
                            <div className={`h-1 transition-all duration-300 ${isCompleted
                                ? 'bg-gradient-to-r from-green-400 to-green-500'
                                : isHovered
                                  ? 'bg-gradient-to-r from-indigo-400 to-blue-500'
                                  : 'bg-gray-200'
                              }`} />
                          </button>
                        );
                      })
                    ) : (
                      <div className="bg-slate-50 border border-gray-200 rounded-lg p-8 text-center">
                        <p className="text-slate-700">No topics defined for current lesson</p>
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
            Current: {currentLesson?.mini_lessons?.length ?? 0} topics • Future: {futureLessons.length} lessons
          </span>
        </div>
      </div>
    </div>
  );
};