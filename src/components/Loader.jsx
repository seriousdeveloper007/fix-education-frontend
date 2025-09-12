import React from 'react';

export default function Loader({ text = 'Preparing your interactive lesson...' }) {
  return (
    <div className="flex flex-col items-center gap-3 text-gray-600">
      <svg
        className="h-6 w-6 animate-spin text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
        />
      </svg>
      <p>{text}</p>
    </div>
  );
}
