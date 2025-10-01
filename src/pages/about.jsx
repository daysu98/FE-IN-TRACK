import { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import { HeaderA } from "../layouts/header";
import { Sidebar } from "../layouts/sidebar";
import { Footer } from "../components/footer";
import { FaPencilAlt } from "react-icons/fa";
import BackgroundImage from "../assets/img/background.png";
import DecorImage from "../assets/img/decor.png";
import Logo from "../assets/img/logo.png";

const roleDescriptions = {
  admin: {
    title: "Welcome to the InTrack Admin Panel",
    paragraphs: [
      "Panel ini dirancang sebagai pusat kendali utama untuk membantu Anda dalam mengelola seluruh operasional program magang dengan lebih terstruktur dan efisien. Di dalamnya tersedia berbagai fitur penting yang mendukung proses administrasi dan pemantauan, mulai dari manajemen data peserta magang, pencatatan absensi harian, hingga pemantauan laporan pekerjaan secara berkala.",
      "Gunakan menu di sidebar untuk navigasi cepat ke berbagai modul, seperti Data User Magang untuk mengelola informasi peserta, Absensi Harian untuk mencatat kehadiran setiap hari, dan Laporan Progress untuk meninjau perkembangan tugas dan hasil kerja peserta magang. Setiap modul dirancang untuk memberikan kemudahan dalam pengelolaan data dan membantu memastikan setiap peserta mengikuti program dengan baik.",
      "Pastikan seluruh data selalu diperbarui secara rutin agar proses monitoring dan evaluasi dapat berjalan dengan akurat, transparan, dan tepat waktu. Dengan sistem ini, diharapkan pengelolaan program magang dapat berlangsung lebih efektif, profesional, dan memberikan dampak yang optimal bagi seluruh pihak yang terlibat.",
    ]
  },
  staff: {
    title: "Welcome to the InTrack Staff Panel",
    paragraphs: [
      "Panel ini dirancang sebagai pusat kendali utama untuk membantu Anda dalam mengelola seluruh operasional program magang dengan lebih terstruktur dan efisien. Di dalamnya tersedia berbagai fitur penting yang mendukung proses administrasi dan pemantauan, mulai dari manajemen data peserta magang, pencatatan absensi harian, hingga pemantauan laporan pekerjaan secara berkala.",
      "Gunakan menu di sidebar untuk navigasi cepat ke berbagai modul, seperti Data User Magang untuk mengelola informasi peserta, Absensi Harian untuk mencatat kehadiran setiap hari, dan Laporan Progress untuk meninjau perkembangan tugas dan hasil kerja peserta magang. Setiap modul dirancang untuk memberikan kemudahan dalam pengelolaan data dan membantu memastikan setiap peserta mengikuti program dengan baik.",
      "Pastikan seluruh data selalu diperbarui secara rutin agar proses monitoring dan evaluasi dapat berjalan dengan akurat, transparan, dan tepat waktu. Dengan sistem ini, diharapkan pengelolaan program magang dapat berlangsung lebih efektif, profesional, dan memberikan dampak yang optimal bagi seluruh pihak yang terlibat.",
    ]
  },
  intern: {
    title: "Welcome to the InTrack Intern Panel",
    paragraphs: [
      "Selamat datang di panel personal Anda! Halaman ini dirancang untuk memberikan Anda akses mudah ke semua informasi dan fitur yang relevan selama periode magang. Anda dapat memantau jadwal, mencatat kehadiran, serta melaporkan kemajuan pekerjaan harian Anda melalui platform ini.",
      "Manfaatkan menu navigasi di sidebar untuk mengakses berbagai fitur utama. Di bagian 'Attendance', Anda dapat melakukan check-in dan check-out setiap hari. Pada modul 'Daily Work', Anda bisa melihat tugas yang diberikan serta mengirimkan laporan progress pekerjaan Anda. Jangan lupa juga untuk selalu memeriksa 'Jadwal Piket' agar tidak terlewat.",
      "Pastikan Anda selalu memperbarui data dan laporan secara berkala. Kedisiplinan dan keaktifan Anda dalam menggunakan sistem ini akan menjadi bagian dari penilaian kinerja selama program magang. Semoga pengalaman magang Anda menyenangkan dan bermanfaat!",
    ]
  },
};


export const AboutPage = () => {
  const [user, setUser] = useState({});
  const userRole = Cookies.get("role") || "intern";
  const content = roleDescriptions[userRole] || roleDescriptions.intern;

  useEffect(() => {
    const fetchProfile = async () => {
      const token = Cookies.get("token");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/user`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const avatarUrl = user.photo && user.photo !== '-' 
    ? `${import.meta.env.VITE_STORAGE_URL}/img/avt/${user.photo}` 
    : `https://ui-avatars.com/api/?name=${(user.name || 'User').replace(' ', '+')}&background=EBF4FF&color=7551FF`;

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <HeaderA />
      <Sidebar />
      <main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
        <div className="relative">
            <div 
                className="h-48 w-full rounded-xl bg-[#4FD1C5] bg-cover bg-center"
                style={{ backgroundImage: `url(${BackgroundImage})` }}
            ></div>
            <div className="mx-auto w-[95%] -mt-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link to="/editprofile" className="relative shrink-0">
                            <img src={avatarUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                            <span className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full cursor-pointer shadow">
                                <FaPencilAlt size={10} />
                            </span>
                        </Link>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">{user.name || 'Loading...'}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-6 bg-white rounded-xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="flex-1 space-y-4">
                    <span className="text-xs font-semibold text-gray-400">Built by DtwoB</span>
                    <h3 className="text-xl font-bold text-gray-800 mt-2">{content.title}</h3>
                    {content.paragraphs.map((p, index) => (
                        <p key={index} className="text-sm text-gray-600 leading-relaxed">
                            {p}
                        </p>
                    ))}
                </div>
                <div className="bg-[#4FD1C5] w-full h-full rounded-xl flex items-center justify-center relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${DecorImage})` }}></div>
                    <div className="relative flex items-center justify-center gap-4 text-white">
                        <img src={Logo} alt="Logo" className="w-18" />
                        <h1 className="text-7xl font-bold">In Track</h1>
                    </div>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};