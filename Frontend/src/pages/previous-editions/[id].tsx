import { Link, useParams } from "react-router-dom";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function EditionDetail() {
  const { id, month } = useParams();

  // YEAR PAGE → MONTHS
  if (id && !month) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-black text-white text-center py-2 font-semibold mb-6">
          All previous points
        </div>

        <h1 className="text-xl font-bold text-center mb-8">
          Issues of {id}
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 text-center text-lg">
          {MONTHS.map((m) => (
            <Link
              key={m}
              to={`/previous-editions/${id}/${m.toLowerCase()}`}
              className="hover:text-red-700"
            >
              {m} {id}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // MONTH PAGE → CONTENT
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-black text-white text-center py-2 font-semibold mb-6">
        All previous points
      </div>

      <h1 className="text-xl font-bold text-center mb-6">
        Issues for {month} {id}
      </h1>

      <p className="text-center text-gray-600">
        Content for this month will appear here
        (articles / videos / PDFs).
      </p>
    </div>
  );
}
