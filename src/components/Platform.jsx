import { Routes, Route } from 'react-router-dom';
import themeConfig from './themeConfig';
import PlatformNavbar from './PlatformNavbar';
import Library from './Library';
import LectureHall from './LectureHall';
import PlatformLanding from './PlatformLanding';
import Stats from './Stats';
import Profile from './Profile';

export default function Platform() {
  const cfg = themeConfig.app;
  return (
    <div className={`${cfg.root} min-h-screen flex flex-col`}>
      <PlatformNavbar />
      <main className="flex-1 overflow-hidden px-4 py-6">
        <Routes>
          <Route index element={<PlatformLanding/>} />
          <Route path="library" element={<Library />} />
          <Route path="lecturehall" element={<LectureHall  />} />
          <Route path="stats" element={<Stats />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}
