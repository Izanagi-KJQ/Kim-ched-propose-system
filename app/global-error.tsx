"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="error-boundary-fallback">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Something went wrong</h2>
          <p className="mb-4">An unexpected error occurred. Please try refreshing the page or click below to retry.</p>
          <button onClick={() => reset()} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Try Again</button>
        </div>
      </body>
    </html>
  );
} 