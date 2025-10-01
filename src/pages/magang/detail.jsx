import { Sidebar } from "../../layouts/sidebar";
import { HeaderA } from "../../layouts/header";
import { Footer } from "../../components/footer";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";

export const DetailPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const day = queryParams.get('day');

  useEffect(() => {
    if (!day) return;

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/picket-tasks-details?day=${day}`, {
                headers: { Authorization: `Bearer ${Cookies.get("token")}` }
            });
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch picket details:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchDetails();
  }, [day]);

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <Sidebar />
      <HeaderA />
      <main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-1">Detail Jadwal Piket</h2>
            {loading ? (
                <p>Loading details...</p>
            ) : (
                <ul className="space-y-4 text-gray-700 list-disc list-inside">
                    {tasks.length > 0 ? tasks.map((task) => (
                        <li key={task.id}>{task.task_description}</li>
                    )) : <p>Belum ada detail tugas untuk hari ini.</p>}
                </ul>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
};