// import { useEffect, useState } from 'react';
// import { createMiniLesson } from '../services/miniLessonService';

// function extractLessonUrl(response) {
//   if (!response || typeof response !== 'object') {
//     return null;
//   }

//   // Prefer the new deploymentUrl shape
//   const directUrl = response.deploymentUrl || response.deployment_url;
//   if (typeof directUrl === 'string' && directUrl.trim().length > 0) {
//     return directUrl;
//   }

//   return (
//     response.vercel_link ||
//     response.vercelLink ||
//     response.vercel_url ||
//     response.vercelUrl ||
//     null
//   );
// }

// function extractVercelKey(urlString) {
//   if (typeof urlString !== 'string' || urlString.trim().length === 0) {
//     return null;
//   }

//   try {
//     const parsed = new URL(urlString);

//     // If it's already a vercel.app deployment, return the host as the key
//     if (parsed.hostname.endsWith('.vercel.app')) {
//       return parsed.hostname;
//     }

//     // Sometimes the deployment dashboard URL includes the deployed URL as a query param like ?url=https%3A%2F%2Fxyz.vercel.app
//     const embeddedUrl = parsed.searchParams.get('url') || parsed.searchParams.get('targetUrl');
//     if (embeddedUrl) {
//       const embeddedParsed = new URL(embeddedUrl);
//       if (embeddedParsed.hostname.endsWith('.vercel.app')) {
//         return embeddedParsed.hostname;
//       }
//     }

//     return null;
//   } catch (_) {
//     return null;
//   }
// }

// export function useShortLesson(miniLessonId) {
//   const [lessonUrl, setLessonUrl] = useState(null);
//   const [vercelKey, setVercelKey] = useState(null);
//   const [loading, setLoading] = useState(Boolean(miniLessonId));
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!miniLessonId) {
//       setLessonUrl(null);
//       setVercelKey(null);
//       setLoading(false);
//       setError('Mini lesson ID is required.');
//       return undefined;
//     }

//     let isCancelled = false;

//     async function fetchLesson() {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await createMiniLesson(miniLessonId);
//         const url = extractLessonUrl(response);
//         const key = extractVercelKey(url);

//         if (!isCancelled) {
//           if (url) {
//             setLessonUrl(url);
//             setVercelKey(key);
//             setError(null);
//           } else {
//             setLessonUrl(null);
//             setVercelKey(null);
//             setError('Mini lesson link not found in the response.');
//           }

//           setLoading(false);
//         }
//       } catch (err) {
//         if (!isCancelled) {
//           setLessonUrl(null);
//           setVercelKey(null);
//           setError(err?.message || 'Failed to load the mini lesson.');
//           setLoading(false);
//         }
//       }
//     }

//     fetchLesson();

//     return () => {
//       isCancelled = true;
//     };
//   }, [miniLessonId]);

//   return { lessonUrl, vercelKey, loading, error };
// }

import { useEffect, useState } from 'react';
import { createMiniLesson } from '../services/miniLessonService';

function normalizeUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return null;

  // Ensure it has protocol
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
}

export function useShortLesson(miniLessonId) {
  const [lessonUrl, setLessonUrl] = useState(null);
  const [loading, setLoading] = useState(Boolean(miniLessonId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!miniLessonId) {
      setLessonUrl(null);
      setLoading(false);
      setError('Mini lesson ID is required.');
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await createMiniLesson(miniLessonId);
        const url = normalizeUrl(res?.deploymentUrl);

        if (!cancelled) {
          if (url) {
            setLessonUrl(url);
          } else {
            setError('deploymentUrl missing in server response.');
          }
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || 'Failed to load the mini lesson.');
          setLessonUrl(null);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [miniLessonId]);

  return { lessonUrl, loading, error };
}
