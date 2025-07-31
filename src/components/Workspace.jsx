import { Routes, Route } from 'react-router-dom';
import themeConfig from './themeConfig';
import WorkspaceNavbar from './WorkspaceNavbar';
import WorkspaceFooter from './WorkspaceFooter';
import Library from './Library';
import LectureHall from './LectureHall';
import WorkspaceLanding from './WorkspaceLanding';

export default function Workspace() {
  const cfg = themeConfig.website;
  return (
    <div className={cfg.root}>
      <WorkspaceNavbar />
      <main className="min-h-screen px-4 py-6">
        <Routes>
          <Route index element={<WorkspaceLanding />} />
          <Route path="library" element={<Library />} />
          <Route path="lecturehall" element={<LectureHall />} />
        </Routes>
      </main>
      <WorkspaceFooter />
    </div>
  );
}
