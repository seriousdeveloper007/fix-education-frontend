import themeConfig from './themeConfig';

export default function PlatformFooter() {
  const cfg =themeConfig.website;
  return (
    <footer className={`text-center py-4 ${cfg.cardBg} ${cfg.borderTop}`}> 
      <p className={cfg.text}>© 2025 EduNote</p>
    </footer>
  );
}
