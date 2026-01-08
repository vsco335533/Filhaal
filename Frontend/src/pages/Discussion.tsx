import { useEffect, useState } from "react";
import { apiGet } from "../lib/api";
import { Link } from "react-router-dom";

interface DebateItem {
  id: string;
  title: string;
  sourceUrl?: string;
}

export function Discussion() {
  const [items, setItems] = useState<DebateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    apiGet<{ items: DebateItem[] }>("/debates")
      .then((res) => {
        if (!mounted) return;
        setItems(res.items || []);
      })
      .catch((err) => setError(err.message || "Failed to load debates"))
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Discussions & Debates</h1>
      <p className="text-gray-700 mb-6">This page mirrors the debates list from the original Filhaal site.</p>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-gray-600">No debates found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((it) => (
            <Link
              key={it.id}
              to={`/debates/${encodeURIComponent(it.id)}`}
              className="block border rounded p-4 hover:shadow-md bg-white"
            >
              <div className="font-semibold text-lg">{it.title}</div>
              {it.sourceUrl && <div className="text-sm text-gray-500">Source</div>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Discussion;
