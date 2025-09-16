import React, { useState, useEffect } from 'react';
import { Star, Send, MessageCircle, RotateCcw, AlertCircle } from 'lucide-react';
import Navbar from './navbar/Navbar';
import { submitFeedback } from '../services/feedbackService';

const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        rating: 0,
        feedback: '',
        email: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userObj = JSON.parse(storedUser);
                if (userObj?.email) {
                    setFormData((prev) => ({ ...prev, email: userObj.email }));
                }
            }
        } catch (err) {
            console.error("Error parsing user from localStorage:", err);
        }
    }, []);


    const handleStarClick = (rating) => {
        setFormData({ ...formData, rating });
        setError(null); // Clear error when user provides rating
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        if (formData.rating === 0) {
            setError('Please provide a rating');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await submitFeedback({
                rating: formData.rating,
                feedback: formData.feedback || null,
                email: formData.email || null
            });

            console.log('Feedback submitted successfully:', result);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setError(error.message || 'Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendAgain = () => {
        setIsSubmitted(false);
        setError(null);
        setFormData({
            rating: 0,
            feedback: '',
            email: ''
        });
    };

    if (isSubmitted) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
                    <div className="max-w-lg mx-auto pt-8">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Feedback Submitted Successfully!</h2>
                            <p className="text-gray-600 mb-6">Thank you for helping us improve your learning experience.</p>

                            <button
                                onClick={handleSendAgain}
                                className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                <RotateCcw className="w-5 h-5" />
                                <span>Send Another Feedback</span>
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
                <div className="max-w-2xl mx-auto p-4 space-y-4">
                    {/* Header */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-50 to-indigo-50 px-4 py-5 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <MessageCircle className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Send Feedback</h1>
                                    <p className="text-sm text-gray-600">We'd love to hear from you</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-semibold text-red-900 mb-1">Error</h4>
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Card */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 sm:p-6 space-y-6">

                            {/* Overall Rating */}
                            <div className="space-y-3">
                                <label className="block text-base font-semibold text-gray-900">
                                    Overall Rating <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleStarClick(star)}
                                            className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${star <= formData.rating
                                                        ? 'text-yellow-400 fill-current'
                                                        : 'text-gray-300'
                                                    } transition-colors`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Feedback */}
                            <div className="space-y-3">
                                <label htmlFor="feedback" className="block text-base font-semibold text-gray-900">
                                    Send us your query or feedback
                                </label>
                                <textarea
                                    id="feedback"
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none text-base"
                                    placeholder="Tell us what you think, ask questions, or share suggestions..."
                                    value={formData.feedback}
                                    onChange={(e) => handleInputChange('feedback', e.target.value)}
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-3">
                                <label htmlFor="email" className="block text-base font-semibold text-gray-900">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-base"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting || formData.rating === 0}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        <span>Submit Feedback</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FeedbackForm;