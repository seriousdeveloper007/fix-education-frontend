// StudyRoomRouter.jsx
import { useState, useEffect } from 'react';
import StudyRoom from './StudyRoom';
import StudyRoomMobile from '../components/studyroom/StudyRoomMobile';

export default function StudyRoomRouter() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? <StudyRoomMobile /> : <StudyRoom />;
}