import { Routes, Route } from 'react-router-dom';
import themeConfig from './themeConfig';
import WorkspaceNavbar from './WorkspaceNavbar';
import WorkspaceFooter from './WorkspaceFooter';
import Library from './Library';
import LectureHall from './LectureHall';

export default function Workspace({ theme, toggleTheme }) {
  const cfg = themeConfig[theme];
  return (
    <div className={cfg.root}>
      <WorkspaceNavbar theme={theme} toggleTheme={toggleTheme} />
      <main className="min-h-screen px-4 py-6">
        <Routes>
          <Route path="library" element={<Library />} />
          <Route path="lecturehall" element={<LectureHall />} />
        </Routes>
      </main>
      <WorkspaceFooter theme={theme} />
    </div>
  );
}
