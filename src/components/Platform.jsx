import { Routes, Route } from 'react-router-dom';
import themeConfig from './themeConfig';
import PlatformNavbar from './PlatformNavbar';
import PlatformFooter from './PlatformFooter';
import Library from './Library';
import LectureHall from './LectureHall';
import PlatformLanding from './PlatformLanding';

export default function Platform({ theme, toggleTheme }) {
  const cfg = themeConfig[theme];
  return (
    <div className={cfg.root}>
      <PlatformNavbar theme={theme} toggleTheme={toggleTheme} />
      <main className="min-h-screen px-4 py-6">
        <Routes>
          <Route index element={<PlatformLanding theme={theme} />} />
          <Route path="library" element={<Library />} />
          <Route path="lecturehall" element={<LectureHall theme={theme} />} />
        </Routes>
      </main>
      <PlatformFooter theme={theme} />
    </div>
  );
}
