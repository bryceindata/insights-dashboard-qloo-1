import React, { useState } from 'react';

const API_KEY = import.meta.env.VITE_QLOO_API_KEY;
const BASE_URL = 'https://api.qloo.com/v1/insights';

export default function App() {
  const [inputs, setInputs] = useState({ music: '', movie: '', book: '' });
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const fetchInsights = async () => {
    setLoading(true);
    setPredictions(null);
    try {
      const payload = {
        seed: Object.values(inputs).filter(Boolean),
        type: 'brands',
      };
      const res = await fetch(`${BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': API_KEY,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setPredictions(data?.results || []);
    } catch (err) {
      console.error('Failed to fetch insights', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto mt-10 p-4 space-y-4">
      <h1 className="text-3xl font-bold text-center">🔮 Qloo Taste Predictor</h1>
      <p className="text-center text-sm text-gray-500">
        Enter what you love. We’ll predict the brands you'll love next.
      </p>
      <div className="space-y-2">
        <input name="music" placeholder="Favorite music artist" className="w-full p-2 border rounded" onChange={handleChange} />
        <input name="movie" placeholder="Favorite movie or show" className="w-full p-2 border rounded" onChange={handleChange} />
        <input name="book" placeholder="Favorite book or author" className="w-full p-2 border rounded" onChange={handleChange} />
      </div>
      <button className="w-full p-2 bg-blue-600 text-white rounded" onClick={fetchInsights} disabled={loading}>
        {loading ? 'Loading...' : 'Get My Taste Insights'}
      </button>
      {predictions && (
        <div className="bg-white shadow p-4 rounded mt-4">
          <h2 className="text-xl font-semibold">Predicted Brands You’ll Love:</h2>
          <ul className="list-disc list-inside">
            {predictions.map((brand, idx) => (
              <li key={idx}>{brand.name}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}