import themeConfig from './themeConfig';

export default function WorkspaceFooter({ theme }) {
  const cfg = themeConfig[theme];
  return (
    <footer className={`text-center py-4 ${cfg.cardBg} ${cfg.borderTop}`}> 
      <p className={cfg.text}>© 2025 EduNote</p>
    </footer>
  );
}
