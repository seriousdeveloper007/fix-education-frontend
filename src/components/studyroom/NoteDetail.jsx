import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaTag, FaEdit, FaShareAlt } from 'react-icons/fa'; // Icons for polish

export default function NoteDetail() {
  const { id } = useParams(); // Get note ID from URL
  // Mock note data (replace with API fetch)
  const note = {
    title: 'Intro to React',
    date: '2025-07-25',
    source: 'YouTube',
    tags: ['Programming'],
    content: 'Key Takeaways: React is a JS library for building UIs... Action Items: Practice hooks...',
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen"> {/* Subtle background gradient */}
      <Link to="/dashboard" className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center space-x-2 transition-colors">
        <FaArrowLeft /> <span>Back to Notes</span>
      </Link>
      <h1 className="text-2xl font-semibold text-indigo-800 mb-4"> {/* Classic typography */}
        {note.title}
      </h1>
      <div className="flex flex-wrap items-center space-x-4 mb-6 text-gray-600"> {/* Metadata with icons */}
        <p className="flex items-center space-x-1">
          <FaCalendarAlt className="text-indigo-500" /> <span>Created: {note.date}</span>
        </p>
        <p>Source: {note.source}</p>
        <p className="flex items-center space-x-1">
          <FaTag className="text-indigo-500" /> <span>Tags: {note.tags.map((tag) => (
            <span key={tag} className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-sm ml-1">{tag}</span>
          ))}</span>
        </p>
      </div>
      <div className="bg-white/30 backdrop-blur-md p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-auto max-h-[60vh]"> {/* Glassmorphism card */}
        <p className="text-gray-700 leading-relaxed">{note.content}</p>
        {/* Future expansions: Full AI-enhanced sections */}
      </div>
      <div className="mt-6 flex space-x-4"> {/* Action buttons with icons */}
        <button className="py-2 px-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-transform duration-200 hover:scale-105 flex items-center space-x-2">
          <FaEdit /> <span>Edit</span> {/* Placeholder for edit feature */}
        </button>
        <button className="py-2 px-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-transform duration-200 hover:scale-105 flex items-center space-x-2">
          <FaShareAlt /> <span>Share</span> {/* Placeholder for share feature */}
        </button>
      </div>
    </div>
  );
}
