import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">Practice Project</h1>
        <p className="text-xl mb-8 text-indigo-100">
          Welcome to My Project management platform
        </p>
        <Link
          href="/login"
          className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}