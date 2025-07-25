import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-gray-900 text-gray-300">
      {/* decorative gradient bar */}
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400" />

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* 4-column grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h2
              onClick={() => (window.location.href = '/')}
              className="cursor-pointer text-2xl font-semibold text-white"
            >
              EduNote
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-6 text-gray-400">
              Smart note-taking companion to help you organize, learn&nbsp;and grow.
            </p>
          </div>

          {/* Product links */}
          <nav>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-white mb-3">
              Product
            </h3>
            <ul className="list-disc pl-4 space-y-2">
              <li>
                <Link to="/extension" className="hover:text-white">
                  Chrome Extension
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-white">
                  Features
                </a>
              </li>
            </ul>
          </nav>

          {/* Company links */}
          <nav>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-white mb-3">
              Company
            </h3>
            <ul className="list-disc pl-4 space-y-2">
              <li>
                <Link to="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </nav>

          {/* Resources links */}
          <nav>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-white mb-3">
              Resources
            </h3>
            <ul className="list-disc pl-4 space-y-2">
              <li>
                <Link to="/docs" className="hover:text-white">
                  Docs
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white">
                  Privacy&nbsp;Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-white/10 pt-8 lg:flex lg:items-center lg:justify-between">
          {/* Socials */}
          <div className="flex space-x-6">
            <a
              href="https://twitter.com/yourhandle"
              className="text-gray-400 transition hover:text-white"
            >
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 19c7.5 0 11.6-6.2 11.6-11.6 0-.2 0-.4 0-.6A8.3 8.3 0 0022 4.9a8.2 8.2 0 01-2.4.7 4.2 4.2 0 001.8-2.3c-.8.5-1.7.9-2.7 1.1a4.1 4.1 0 00-7 3.8A11.7 11.7 0 013 4.8a4.1 4.1 0 001.3 5.5 4.1 4.1 0 01-1.9-.5v.1a4.1 4.1 0 003.3 4 4.2 4.2 0 01-1.9.1 4.1 4.1 0 003.8 2.8A8.3 8.3 0 012 17.7a11.8 11.8 0 006.3 1.9" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/yourcompany"
              className="text-gray-400 transition hover:text-white"
            >
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.45 20.45h-3.555v-5.57c0-1.33-.026-3.04-1.86-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.345V9h3.415v1.56h.05c.476-.786 1.65-1.61 3.39-1.61 3.62 0 4.29 2.38 4.29 5.47v6.99zM5.337 7.433a1.72 1.72 0 110-3.439 1.72 1.72 0 010 3.44zM6.945 20.45H3.728V9h3.217v11.45z" />
              </svg>
            </a>
          </div>

          {/* Legal */}
          <p className="mt-8 text-xs leading-6 text-gray-400 lg:mt-0">
            &copy; {new Date().getFullYear()} EduNote. All rights&nbsp;reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
