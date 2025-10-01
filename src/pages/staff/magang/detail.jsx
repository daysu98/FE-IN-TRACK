import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import { Sidebar } from "../../../layouts/sidebar";
import { HeaderA } from "../../../layouts/header";
import { Footer } from "../../../components/footer";
import { FaArrowLeft } from "react-icons/fa";

export const InternshipDetailPage = () => {
  const { id } = useParams();
  const [intern, setIntern] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternDetails = async () => {
      setLoading(true);
      const token = Cookies.get("token");
      try {
        const userRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIntern(userRes.data.data);

        const progressRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/job_intern`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProgress(
          progressRes.data.data.filter((p) => p.user_id === id)
        );
      } catch (error) {
        console.error("Failed to fetch intern details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInternDetails();
  }, [id]);

  const avatarUrl =
    intern?.photo && intern.photo !== "-"
      ? `${import.meta.env.VITE_STORAGE_URL}/img/avt/${intern.photo}`
      : `https://ui-avatars.com/api/?name=${(
          intern?.name || "User"
        ).replace(" ", "+")}&background=random&color=fff`;

  if (loading) {
    return (
      <div className="bg-gray-50 text-gray-900 min-h-screen">
        <HeaderA />
        <Sidebar />
        <main className="md:ml-64 p-6 pt-24">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <HeaderA />
      <Sidebar />
      <main className="md:ml-64 p-6 pt-24">
        <div className="mb-6">
          <Link
            to="/magangs"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold"
          >
            <FaArrowLeft />
            Back to Internship List
          </Link>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={avatarUrl}
              alt={intern.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-teal-400"
            />
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800">
                {intern.name}
              </h2>
              <p className="text-md text-gray-500">{intern.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Joined on: {intern.date}
              </p>
            </div>
          </div>
          <hr className="my-6" />
          <div>
            <h3 className="text-xl font-bold mb-4">Daily Work Reports</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="py-3 px-6">TASK</th>
                    <th className="py-3 px-6">DESCRIPTION</th>
                    <th className="py-3 px-6">DEADLINE</th>
                    <th className="py-3 px-6">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.length > 0 ? (
                    progress.map((p) => (
                      <tr key={p.id} className="border-b">
                        <td className="px-6 py-4 font-medium">{p.task}</td>
                        <td className="px-6 py-4">{p.description}</td>
                        <td className="px-6 py-4">{p.deadline}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${
                              p.status === "Done"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-gray-500">
                        No progress reports found for this intern.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};