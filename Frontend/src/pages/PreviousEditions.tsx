import { useEffect, useState } from 'react';
import { apiGet } from '../lib/api';
import { Link } from 'react-router-dom';

interface Edition {
  id: string;
  title: string;
  sourceUrl?: string;
}

export default function PreviousEditions() {
  const [items, setItems] = useState<Edition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    apiGet<{ items: Edition[] }>('/previous-editions')
      .then((res) => {
        if (!mounted) return;
        setItems(res.items || []);
      })
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));

    return () => { mounted = false };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Previous Editions</h1>
      {loading ? <div>Loading...</div> : error ? <div className="text-red-600">{error}</div> : (
        <div className="grid gap-4">
          {items.map(it => (
            <Link key={it.id} to={`/previous-editions/${encodeURIComponent(it.id)}`} className="block p-4 border rounded bg-white">{it.title}</Link>
          ))}
        </div>
      )}
    </div>
  )
}
