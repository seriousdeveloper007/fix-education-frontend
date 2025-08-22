import { useEffect, useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { fetchTasks, createTasks } from '../services/taskService';
import themeConfig from './themeConfig';
import { Loader2 } from 'lucide-react';

export default function TasksView() {
  const cfg = themeConfig.app;
  const tabId = localStorage.getItem('tabId');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!tabId) {
        setTasks([]);
        setLoading(false);
        return;
      }
      try {
        const data = await fetchTasks(tabId);
        const list = Array.isArray(data) ? data : data?.tasks || [];
        setTasks(list);
      } catch (e) {
        console.error('Failed to fetch tasks:', e);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tabId]);

  const handleExtract = async () => {
    if (!tabId) return;
    setExtracting(true);
    try {
      const data = await createTasks(tabId);
      const list = Array.isArray(data) ? data : data?.tasks || [];
      if (list.length) {
        setTasks((prev) => [...prev, ...list]);
      }
    } catch (e) {
      console.error('Failed to extract code:', e);
    } finally {
      setExtracting(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-sm text-gray-700">Loading...</div>;
  }

  return (
    <div className="p-4 text-sm text-gray-700 overflow-auto space-y-4">
      <button
        onClick={handleExtract}
        disabled={extracting}
        className={cfg.primaryButton}
      >
        {extracting ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 size={20} className="animate-spin" /> Extracting...
          </div>
        ) : (
          'Extract Code'
        )}
      </button>

      {!tasks.length ? (
        <div>There is no extracted code from the video</div>
      ) : (
        tasks.map((task, idx) => (
          <div key={idx} className="space-y-2">
            {task.description && <p className="text-gray-800">{task.description}</p>}
            {task.code && (
              <MarkdownRenderer text={`\n\u0060\u0060\u0060${task.language ? task.language : ''}\n${task.code}\n\u0060\u0060\u0060\n`} />
            )}
          </div>
        ))
      )}
    </div>
  );
}
