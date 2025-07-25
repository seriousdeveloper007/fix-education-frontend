import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">AI notepad</span> for learning
              <br />
              across all platforms
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              EduNote transforms your raw shorthand notes into beautiful, structured summaries across YouTube, Coursera, and any learning platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105">
                Install Extension
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-xl text-gray-600">Simple workflow, powerful results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Learning Mode</h3>
              <p className="text-gray-600">Activate EduNote during any YouTube video or Coursera lecture to begin capturing audio and notes</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Shorthand Notes</h3>
              <p className="text-gray-600">Quickly jot down raw ideas or upload existing notes with automatic organization</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Beautiful Notes</h3>
              <p className="text-gray-600">AI instantly enhances your inputs into structured, professional summaries ready for review</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Your notes + transcript</h3>
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="text-sm text-gray-500 mb-2">Raw notes:</div>
                  <div className="text-gray-800 font-mono text-sm">
                    - React hooks intro<br/>
                    - useState example @ 5:30<br/>
                    - useEffect lifecycle<br/>
                    - custom hooks best practices
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI enhanced</span>
                </h3>
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="text-sm text-gray-500 mb-2">Enhanced summary:</div>
                  <div className="text-gray-800 text-sm space-y-2">
                    <div><strong>Key Concepts:</strong> React Hooks fundamentals</div>
                    <div><strong>useState:</strong> State management in functional components (5:30)</div>
                    <div><strong>useEffect:</strong> Component lifecycle and side effects</div>
                    <div><strong>Next Steps:</strong> Practice custom hooks implementation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Works across all platforms, no bots needed</h2>
            <p className="text-xl text-gray-600">EduNote integrates directly with your browser across all learning platforms</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-4 w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Seamless Integration</h3>
              <p className="text-gray-600">Works directly in your browser on YouTube, Coursera, and any video-based learning platform</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg p-4 w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Enhancement</h3>
              <p className="text-gray-600">Advanced AI processing transforms shorthand into structured, professional summaries</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg p-4 w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Customizable Templates</h3>
              <p className="text-gray-600">Tailor templates for different lecture types: programming, courses, tutorials, and more</p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Customizable templates for your learning needs</h2>
            <p className="text-xl text-gray-600">Get notes in the exact format that helps you learn best</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">React Fundamentals - Today 2:00 PM</h3>
                  <span className="text-sm text-gray-500">45 participants</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Key Concepts</h4>
                    <p className="text-gray-600 text-sm">Component lifecycle, state management, props drilling</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Takeaways and Insights</h4>
                    <p className="text-gray-600 text-sm">useState vs useReducer comparison, performance optimization tips</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Questions & Challenges</h4>
                    <p className="text-gray-600 text-sm">When to use custom hooks? Best practices for component composition</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Study Timeline</h4>
                    <p className="text-gray-600 text-sm">Week 1: Hooks mastery, Week 2: Context API, Week 3: Performance optimization</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Next Steps</h4>
                    <p className="text-gray-600 text-sm">Build a todo app using learned concepts, review advanced patterns documentation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Post-Learning Tools */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Put your learning to work</h2>
            <p className="text-xl text-gray-600">EduNote's AI helps you with post-learning action items</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Generate key takeaways',
              'Create study questions', 
              'List action items',
              'Highlight important concepts',
              'Extract timelines',
              'Identify participants',
              'Create review summaries',
              'Generate blog-style recaps',
              'Build study guides'
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-2 h-2 mr-3"></div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 mt-12 shadow-sm">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Ask about your learning</h3>
              <p className="text-gray-600 mb-6">Get instant answers about your lecture content, review concepts, and clarify doubts</p>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all">
                Try AI Assistant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <blockquote className="text-2xl font-medium text-gray-900 mb-6">
                "EduNote has become indispensable for my online learning journey - feels like I'm living in the future of education."
              </blockquote>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-white font-semibold text-lg">AK</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Alex Kumar</div>
                  <div className="text-gray-600">Computer Science Student</div>
                </div>
              </div>
            </div>

            <div>
              <blockquote className="text-2xl font-medium text-gray-900 mb-6">
                "The addiction is real - at this point I can't imagine learning without it. Effortlessly powerful note-taking."
              </blockquote>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-white font-semibold text-lg">SM</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Martinez</div>
                  <div className="text-gray-600">Data Science Learner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Share your notes with one click</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            EduNote makes it easy to share enhanced notes on the platforms your study group already uses
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {['Notion', 'Discord', 'Slack', 'Google Docs', 'Obsidian', 'Roam'].map((platform) => (
              <div key={platform} className="bg-white rounded-lg px-6 py-3 shadow-sm border">
                <span className="font-medium text-gray-700">{platform}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-12 shadow-sm max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-6">
              Ready to transform your learning?
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of learners who've made their study sessions more productive with EduNote
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105">
                Install Chrome Extension
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all">
                Watch Demo Video
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage