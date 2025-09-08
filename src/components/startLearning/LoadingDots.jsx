import React from "react"

export const LoadingDots = React.memo(function LoadingDots() {
    return (
      <div className="mr-auto w-fit max-w-full bg-gray-100 px-3 py-2 rounded-xl text-sm">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  });
  