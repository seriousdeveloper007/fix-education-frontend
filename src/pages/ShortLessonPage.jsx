import Navbar from '../components/navbar/Navbar';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config'; // ✅ import base URL

function ensureHtmlDocument(snippet, title = 'Mini Lesson') {
  const s = String(snippet || '');
  const isFullDoc =
    /<!DOCTYPE html/i.test(s) ||
    /<html[\s>]/i.test(s) ||
    /<body[\s>]/i.test(s);

  if (isFullDoc) return s;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body>
  <div id="app"></div>
  <script>
  (function(){
    try {
      const maybeHtml = ${JSON.stringify(s)};
      if (/<[a-z!][\\s\\S]*>/i.test(maybeHtml)) {
        document.getElementById('app').innerHTML = maybeHtml;
      } else {
        const fn = new Function(maybeHtml);
        fn();
      }
    } catch (e) {
      document.body.innerHTML = '<pre style="padding:16px;color:#fecaca">Error running snippet:\\n' + (e && e.stack || e) + '</pre>';
    }
  })();
  </script>
</body>
</html>
  `.trim();
}

export default function ShortLessonPage() {
  const { miniLesson } = useParams();
  const lessonName = decodeURIComponent(miniLesson || '');

  const [iframeHtml, setIframeHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let alive = true;

    async function fetchLesson() {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const res = await fetch(`${API_BASE_URL}/mini-lesson`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mini_lesson: lessonName }),
        });

        if (!res.ok) {
          throw new Error(`Backend error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        const code = data?.code_for_iframe ?? data?.code ?? '';
        if (!code) throw new Error('Empty code returned from backend');

        const html = ensureHtmlDocument(code, `${lessonName} - Mini Lesson`);
        if (alive) setIframeHtml(html);
      } catch (e) {
        if (alive) {
          setErrorMessage(e?.message || 'Unable to load mini lesson');
          setIframeHtml(`
<!DOCTYPE html><html><body style="background:#0f172a;color:#fecaca;font-family:sans-serif">
  <div style="padding:16px">
    <h3>Failed to load lesson</h3>
    <pre>${(e && e.stack) || String(e)}</pre>
  </div>
</body></html>`);
        }
      } finally {
        if (alive) setIsLoading(false);
      }
    }

    fetchLesson();
    return () => { alive = false; };
  }, [lessonName]);

  const iframeSandbox = [
    'allow-scripts',
    'allow-forms',
    'allow-modals',
    'allow-popups',
    'allow-popups-to-escape-sandbox',
  ].join(' ');

  return (
    <>
      <Navbar />
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="text-2xl font-bold">{lessonName}</h1>
          {isLoading && <span className="text-sm text-gray-500">Generating…</span>}
        </div>
        {!!errorMessage && (
          <div className="mt-2 text-sm text-red-500">{errorMessage}</div>
        )}

        <div className="mt-4">
          <iframe
            title={`Mini Lesson: ${lessonName}`}
            srcDoc={iframeHtml}
            style={{ width: '100%', height: '640px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            sandbox={iframeSandbox}
          />
        </div>
      </div>
    </>
  );
}
