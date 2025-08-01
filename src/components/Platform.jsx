import { Routes, Route, useLocation } from 'react-router-dom';
import themeConfig from './themeConfig';
import PlatformNavbar from './PlatformNavbar';
import Library from './Library';
import LectureHall from './LectureHall';
import { LectureHallProvider } from './LectureHallContext.jsx';
import PlatformLanding from './PlatformLanding';
import Stats from './Stats';
import Profile from './Profile';

export default function Platform() {
  const cfg = themeConfig.app;
  const location = useLocation();
  const isLectureHall = location.pathname.startsWith('/platform/lecturehall');
  return (
    <LectureHallProvider>
      <div className={`${cfg.root} h-screen flex flex-col overflow-hidden`}>
        <PlatformNavbar />
        <main className={`flex-1 overflow-hidden ${isLectureHall ? 'p-2 pt-2' : 'px-4 py-6'}`}>
          <Routes>
            <Route index element={<PlatformLanding/>} />
            <Route path="library" element={<Library />} />
            <Route path="lecturehall" element={<LectureHall />} />
            <Route path="stats" element={<Stats />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </LectureHallProvider>
  );
}
