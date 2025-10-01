import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

export const SearchResults = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/search?query=${query}`
        );
        setResults(res.data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (query) fetchResults();
  }, [query]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Search results for: <span className="text-teal-500">{query}</span>
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Users</h3>
          {results.users?.length > 0 ? (
            <ul className="list-disc pl-6">
              {results.users.map((u) => (
                <li key={u.id}>
                  <Link
                    to={`/users/${u.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {u.name} ({u.email})
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No users found</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Magang</h3>
          {results.magang?.length > 0 ? (
            <ul className="list-disc pl-6">
              {results.magang.map((m) => (
                <li key={m.id}>
                  <Link
                    to={`/magang/${m.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {m.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No magang found</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Progress</h3>
          {results.progress?.length > 0 ? (
            <ul className="list-disc pl-6">
              {results.progress.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/progress/${p.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No progress found</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Attendance</h3>
          {results.attendance?.length > 0 ? (
            <ul className="list-disc pl-6">
              {results.attendance.map((a) => (
                <li key={a.id}>
                  <Link
                    to={`/attendance/${a.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {a.status}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No attendance found</p>
          )}
        </div>
      </div>
    </div>
  );
};