import Navbar from '../components/navbar/Navbar';
import { useParams } from 'react-router-dom';

export default function ShortLessonPage() {
  const { miniLesson } = useParams();
  const lessonName = decodeURIComponent(miniLesson);

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">{lessonName}</h1>
      </div>
    </>
  );
}
