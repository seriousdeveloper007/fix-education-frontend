import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import LessonHeader from '../components/lesson/LessonHeader';
import DiscussionUI from '../components/discussionPanel/DiscussionUI';

export default function MiniLessonDiscussionPage() {
  const { id, miniLessonSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const lessonDisplayName = miniLessonSlug
    ? miniLessonSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : state?.name || 'Interactive Lesson';

  const search = location.search || '';

  const handleGoToLesson = () => {
    if (!id || !miniLessonSlug) return;
    navigate(`/${id}/${miniLessonSlug}/learn${search}`, {
      state,
      replace: false,
    });
  };

  return (
    <div className="lesson-page-container min-h-[100dvh] w-[100dvw] max-w-[100dvw] flex flex-col overflow-x-hidden">
      <Navbar />
      <div className="flex-1 min-w-0 px-4 py-5 max-w-5xl mx-auto w-full flex flex-col overflow-x-hidden">
        <LessonHeader
          lessonDisplayName={lessonDisplayName}
          actionLabel="Go to Lesson"
          onActionClick={handleGoToLesson}
        />
        <DiscussionUI lessonId={id} lessonName={lessonDisplayName} />
      </div>
    </div>
  );
}

