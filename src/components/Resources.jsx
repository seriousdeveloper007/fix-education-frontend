import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, BookOpen, Clock, Target, Loader2 } from 'lucide-react';
import { findResources } from '../services/resourceService';

export default function Resources() {
    const { id } = useParams();
    const location = useLocation();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [classification, setClassification] = useState('');

    // Get data from navigation state
    const miniLessonId = location.state?.mini_lesson_id;
    const miniLessonName = location.state?.mini_lesson_name;

    useEffect(() => {
        const fetchResources = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await findResources(miniLessonName, miniLessonId);
                setResources(data.resources || []);
                setClassification(data.classification || '');
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (miniLessonId && miniLessonName) {
            fetchResources();
        }
    }, [miniLessonId, miniLessonName]);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'beginner': return 'bg-green-100 text-green-800';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'advanced': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getResourceTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'practice': return <Target className="w-4 h-4" />;
            case 'tutorial': return <BookOpen className="w-4 h-4" />;
            case 'repository': return <ExternalLink className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Finding resources for you...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4">
                        <Link
                            to="/learn-now"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                                {miniLessonName || 'Resources'}
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600">Practice Resources</p>
                        </div>
                    </div>

                    {classification && (
                        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                            <span className="font-medium">Category:</span>
                            <span>{classification}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center">
                        <p className="text-red-700 mb-4">Failed to load resources</p>
                        <p className="text-red-600 text-sm">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : resources.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 text-center">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resources Found</h3>
                        <p className="text-gray-600">We couldn't find any resources for this mini lesson yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Found {resources.length} resource{resources.length !== 1 ? 's' : ''}
                            </h2>
                        </div>

                        <div className="grid gap-4">
                            {resources.map((resource, index) => (
                                <div key={resource.id || index} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                                                    {getResourceTypeIcon(resource.resource_type)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-gray-900 truncate">{resource.title}</h3>
                                                    <p className="text-sm text-gray-600 truncate">{resource.platform}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                                                    {resource.difficulty}
                                                </span>
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                    {resource.resource_type}
                                                </span>
                                            </div>
                                        </div>

                                        <a href={resource.url} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto flex-shrink-0"

 > <span>Open</span>
                                        <ExternalLink className="w-4 h-4" />
  
                                    </a>

                                </div>
                </div>
              ))}
                    </div>
          </div>
        )}
        </div>
    </div >
  );
}