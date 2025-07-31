import { Routes, Route } from 'react-router-dom';
import themeConfig from './themeConfig';
import PlatformNavbar from './PlatformNavbar';
import PlatformFooter from './PlatformFooter';
import Library from './Library';
import LectureHall from './LectureHall';
import PlatformLanding from './PlatformLanding';

export default function Platform() {
  const cfg = themeConfig.website;
  return (
    <div className={cfg.root}>
      <PlatformNavbar />
      <main className="min-h-screen px-4 py-6">
        <Routes>
          <Route index element={<PlatformLanding/>} />
          <Route path="library" element={<Library />} />
          <Route path="lecturehall" element={<LectureHall  />} />
        </Routes>
      </main>
      <PlatformFooter  />
    </div>
  );
}
