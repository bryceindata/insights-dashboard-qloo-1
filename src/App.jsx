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
    if (!API_KEY) {
      console.error('Qloo API key missing');
      alert('Missing API configuration - please check environment variables');
      return;
    }

    setLoading(true);
    setPredictions(null);
    try {
      const payload = {
        seed: Object.values(inputs).filter(Boolean),
        type: 'brands',
      };
      
      console.log('API Request:', {
        url: `${BASE_URL}/predict`,
        payload,
        headers: { 'X-API-KEY': API_KEY?.slice(0, 5) + '...' }
      });

      const res = await fetch(`${BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': API_KEY,
        },
        body: JSON.stringify(payload),
      });

      console.log('API Response Status:', res.status);
      const data = await res.json();
      console.log('API Response Data:', data);

      // Qloo API returns predictions under 'brands' property
      const brands = data?.brands || data?.results || [];
      setPredictions(brands);
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
      {loading && <div className="text-center py-4">Analyzing your tastes...</div>}
      
      {!loading && predictions && (
        <div className="bg-white shadow p-4 rounded mt-4">
          <h2 className="text-xl font-semibold mb-2">Predicted Brands You’ll Love:</h2>
          {predictions.length > 0 ? (
            <ul className="list-disc list-inside">
              {predictions.map((brand, idx) => (
                <li key={idx} className="py-1">{brand.name}</li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 italic">No brand predictions found - try different inputs</div>
          )}
        </div>
      )}
      
      {!loading && !predictions && (
        <div className="text-center text-gray-500 mt-4">
          Submit your favorites to see brand predictions
        </div>
      )}
    </main>
  );
}