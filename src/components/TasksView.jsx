import React, { useEffect, useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { fetchTasks } from '../services/taskService';

export default function TasksView() {
  const tabId = localStorage.getItem('tabId');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="p-4 text-sm text-gray-700">Loading...</div>;
  }

  if (!tasks.length) {
    return (
      <div className="p-4 text-sm text-gray-700">
        There is no extracted code from the video
      </div>
    );
  }

  return (
    <div className="p-4 text-sm text-gray-700 overflow-auto space-y-4">
      {tasks.map((task, idx) => (
        <div key={idx} className="space-y-2">
          {task.description && <p className="text-gray-800">{task.description}</p>}
          {task.code && (
            <MarkdownRenderer text={`\n\u0060\u0060\u0060\n${task.code}\n\u0060\u0060\u0060\n`} />
          )}
        </div>
      ))}
    </div>
  );
}
