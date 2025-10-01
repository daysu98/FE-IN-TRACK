import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sidebar } from "../../layouts/sidebar";
import { HeaderA } from "../../layouts/header";
import { Footer } from "../../components/footer";
import { Link } from "react-router";
import Cookies from "js-cookie";

export const JadwalPage = () => {
  const [allSchedules, setAllSchedules] = useState([]);
  const [dayIndex, setDayIndex] = useState(new Date().getDay() - 1 < 0 ? 6 : new Date().getDay() - 1);
  const [loading, setLoading] = useState(true);

  const days = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/cod`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAllSchedules(response.data.data || []);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const nextDay = () => {
    setDayIndex((prev) => (prev + 1) % days.length);
  };

  const prevDay = () => {
    setDayIndex((prev) => (prev - 1 + days.length) % days.length);
  };
  
  const currentDaySchedules = allSchedules.filter(
    (item) => item.days?.toLowerCase() === days[dayIndex]?.toLowerCase()
  );

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 ">
      <HeaderA />
      <Sidebar />

      <main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
        <div className="bg-white rounded-xl p-10 flex flex-col items-center">
          <div className="flex items-center gap-6 mb-8">
            <button
              onClick={prevDay}
              className="px-3 py-2 bg-gray-100 rounded-full hover:bg-gray-200 text-lg"
            >
              &lt;
            </button>
            <h2 className="text-xl font-bold w-24 text-center">{days[dayIndex] || '...'}</h2>
            <button
              onClick={nextDay}
              className="px-3 py-2 bg-gray-100 rounded-full hover:bg-gray-200 text-lg"
            >
              &gt;
            </button>
          </div>

          {loading ? (
            <p>Loading schedule...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
                {currentDaySchedules.length > 0 ? (
                currentDaySchedules.map((schedule) => (
                    <div
                        key={schedule.id}
                        className="flex flex-col items-center text-center"
                    >
                    <img
                        src={
                            schedule.user.photo && schedule.user.photo !== '-'
                            ? `${import.meta.env.VITE_STORAGE_URL}/img/avt/${schedule.user.photo}`
                            : `https://ui-avatars.com/api/?name=${schedule.user.name.replace(' ', '+')}&background=random&color=fff`
                        }
                        alt={schedule.user.name}
                        className="w-36 h-36 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-bold text-lg text-gray-800 uppercase">{schedule.user.name}</h3>
                    </div>
                ))
                ) : (
                <p className="col-span-3 text-gray-500">Tidak ada jadwal piket untuk hari ini.</p>
                )}
            </div>
          )}

          <Link
            to={`/detail?day=${days[dayIndex]}`}
            className="bg-gray-800 text-white font-bold px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors"
          >
            DETAIL PIKET
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};