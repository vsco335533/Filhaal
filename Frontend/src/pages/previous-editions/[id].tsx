import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet } from '../../lib/api';

export default function EditionDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    apiGet<any>(`/previous-edition?id=${encodeURIComponent(id)}`)
      .then(res => {
        if (!mounted) return;
        setPdfUrl(res.pdfUrl || null);
        setTitle(res.title || null);
        setSourceUrl(res.sourceUrl || null);
      })
      .catch(err => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));

    return () => { mounted = false };
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">{title || 'Edition'}</h1>
      {loading ? <div>Loading...</div> : error ? <div className="text-red-600">{error}</div> : pdfUrl ? (
        <div style={{height: 800}} className="w-full">
          <iframe src={pdfUrl} title={title || 'edition'} className="w-full h-full border" />
        </div>
      ) : (
        <div>
          <p>No embeddable PDF found.</p>
          {sourceUrl && <a href={sourceUrl} target="_blank" rel="noreferrer" className="text-red-700 underline">Open original</a>}
        </div>
      )}
    </div>
  )
}
