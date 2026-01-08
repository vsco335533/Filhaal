import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../../lib/api";

export function DebateDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    apiGet<any>(`/debate?id=${encodeURIComponent(id)}`)
      .then((res) => {
        if (!mounted) return;
        setPdfUrl(res.pdfUrl || null);
        setTitle(res.title || null);
        setSourceUrl(res.sourceUrl || null);
      })
      .catch((err) => setError(err.message || "Failed to load debate"))
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">{title || "Debate"}</h1>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : pdfUrl ? (
        <div className="w-full" style={{ height: 800 }}>
          <iframe src={pdfUrl} title={title || "debate"} className="w-full h-full border" />
        </div>
      ) : (
        <div>
          <p className="mb-4">No embeddable PDF found for this debate.</p>
          {sourceUrl && (
            <a href={sourceUrl} target="_blank" rel="noreferrer" className="text-red-700 underline">
              Open original debate page
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default DebateDetail;
