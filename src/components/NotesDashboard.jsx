import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaCalendarAlt, FaList, FaTh, FaPlus, FaGlobe, FaTag, FaArrowLeft } from 'react-icons/fa'; // Added FaArrowLeft here

export default function NotesDashboard() {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  // Mock notes data
  const notes = [
    { id: 1, title: 'Intro to React', date: '2025-07-25', source: 'YouTube', tags: ['Programming'], content: 'Key takeaways: React is a JS library for building UIs...' },
    // Add more...
  ];

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen"> {/* Subtle background gradient */}
      <h1 className="text-2xl font-semibold text-indigo-800 mb-6">
        My Notes
      </h1>
      <div className="flex flex-wrap items-center space-x-4 mb-6 p-4 bg-white/30 backdrop-blur-md rounded-xl shadow-sm"> {/* Glassmorphism for filters */}
        <div className="relative">
          <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select className="pl-10 p-2 border border-gray-200 rounded-full bg-white/50 focus:border-indigo-300 transition-all duration-200">
            <option>Last 7 Days</option>
            <option>Last Month</option>
          </select>
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search notes..." className="pl-10 p-2 border border-gray-200 rounded-full bg-white/50 flex-1 focus:border-indigo-300 transition-all duration-200" />
        </div>
        <button className="py-2 px-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-transform duration-200 hover:scale-105 flex items-center space-x-2">
          <FaPlus /> <span>Add New Note</span>
        </button>
        <div className="flex items-center space-x-2 bg-white/50 p-1 rounded-full">
          <button onClick={() => setViewMode('table')} className={`p-2 rounded-full ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'} hover:bg-indigo-50 transition-colors`}>
            <FaList />
          </button>
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'} hover:bg-indigo-50 transition-colors`}>
            <FaTh />
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="overflow-x-auto rounded-xl shadow-sm bg-white/30 backdrop-blur-md">
          <table className="w-full">
            <thead className="bg-gray-100/50">
              <tr>
                <th className="p-3 text-left font-medium text-gray-700">Title</th>
                <th className="p-3 text-left font-medium text-gray-700">Created Date</th>
                <th className="p-3 text-left font-medium text-gray-700">Source</th>
                <th className="p-3 text-left font-medium text-gray-700">Tags</th>
                <th className="p-3 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr key={note.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-3">{note.title}</td>
                  <td className="p-3">{note.date}</td>
                  <td className="p-3">{note.source}</td>
                  <td className="p-3">{note.tags.map(tag => <span key={tag} className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-sm">{tag}</span>)}</td>
                  <td className="p-3"><Link to={`/note/${note.id}`} className="text-indigo-600 hover:text-indigo-800 transition-colors">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Improved Grid View */}
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white/30 backdrop-blur-md p-6 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300" // Enhanced hover
            >
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">{note.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                <FaCalendarAlt className="text-indigo-500" /> <span>{note.date}</span>
                <FaGlobe className="text-indigo-500 ml-4" /> <span>{note.source}</span>
              </div>
              <p className="text-gray-700 line-clamp-3 mb-4">{note.content}</p>
              <div className="flex items-center space-x-2 mb-4">
                <FaTag className="text-indigo-500" />
                {note.tags.map((tag) => (
                  <span key={tag} className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs">{tag}</span>
                ))}
              </div>
              <Link to={`/note/${note.id}`} className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center space-x-1">
                <span>View Details</span> <FaArrowLeft className="rotate-180" /> {/* Now imported and defined */}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
