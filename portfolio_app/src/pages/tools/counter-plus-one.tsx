'use client';
import { useState, useEffect } from 'react';

const StupidButton: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  // console.log(process.env.NEXT_PUBLIC_FIRESTORE_SA_KEY);

  // Fetch initial counter value on mount
  useEffect(() => {
    const fetchCounter = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/fetchPlusOne', { method: 'GET' });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch counter');
        }

        setCount(data.counter);
      } catch (err: any) {
        console.error('Fetch error:', err.message);
        setError('Failed to load counter. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCounter();
  }, []);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/fetchPlusOne', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update counter');
      }

      setCount(data.counter);
    } catch (err: any) {
      console.error('Button error:', err.message);
      setError('Failed to update the counter. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="prose max-w-none mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Counter Plus One</h1>
            <p className="text-gray-600 mb-6">
              For every moment of boredom, there's a click. Add one more to the world's dumbest counter.
            </p>

            <div className="flex flex-col items-center gap-6">
              <button
                onClick={handleClick}
                disabled={loading}
                className="transition transform duration-200 ease-in-out bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-500 hover:brightness-110 active:scale-95 disabled:opacity-60 text-white font-semibold py-4 px-10 rounded-full shadow-lg text-xl relative overflow-hidden"
              >
                {loading ? (
                  <span className="animate-pulse">Counting…</span>
                ) : (
                  'Add One'
                )}
              </button>

              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}

              <div className="bg-gray-100 border border-gray-300 px-8 py-4 rounded-lg shadow-inner w-full max-w-xl">
                <p className="text-xl font-medium text-gray-800">
                  This button has been pressed{' '}
                  <span className="font-extrabold text-indigo-600 text-2xl">
                    {count !== null ? count : '...'}
                  </span>{' '}
                  times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StupidButton;