import { HeaderA } from "../layouts/header";
import { Sidebar } from "./../layouts/sidebar";
import { Footer } from "../components/footer";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router";
import BackgroundImage from "../assets/img/background.png";
import DecorImage from "../assets/img/decor.png";
import { FaPencilAlt, FaRegCalendarCheck, FaFileAlt } from "react-icons/fa";
import Logo from "../assets/img/logo.png";

const AttendanceRecapItem = ({ letter, label, count }) => (
  <div className="text-center flex flex-col items-center">
    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl bg-[#4FD1C5]">
      {letter}
    </div>
    <span className="mt-2 text-sm font-semibold text-gray-800">{label}</span>
    <hr className="w-full my-2 border-gray-200" />
    <span className="text-sm text-gray-500 font-bold">
      {count} {label.toLowerCase()}
    </span>
  </div>
);

const AdminStaffProfile = ({ user, avatarUrl }) => (
  <div className="relative">
    <div
      className="h-48 w-full rounded-xl bg-[#4FD1C5] bg-cover bg-center"
      style={{ backgroundImage: `url(${DecorImage})` }}
    ></div>
    <div className="mx-auto w-[95%] -mt-24">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="relative shrink-0">
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-40 h-40 rounded-lg object-cover"
          />
          <Link
            to="/editprofile"
            className="absolute bottom-2 right-2 bg-white p-2 rounded-full cursor-pointer"
          >
            <FaPencilAlt size={12} />
          </Link>
        </div>
        <div className="flex-grow space-y-4 text-sm">
          <p>
            <strong className="w-32 inline-block font-semibold text-gray-800">
              Name
            </strong>{" "}
            : <span className="text-gray-600">{user.name}</span>
          </p>
          <p>
            <strong className="w-32 inline-block font-semibold text-gray-800">
              Email
            </strong>{" "}
            : <span className="text-gray-600">{user.email}</span>
          </p>
          <p>
            <strong className="w-32 inline-block font-semibold text-gray-800">
              Tanggal Bergabung
            </strong>{" "}
            : <span className="text-gray-600">{user.date}</span>
          </p>
          <p>
            <strong className="w-32 inline-block font-semibold text-gray-800">
              Role
            </strong>{" "}
            : <span className="text-gray-600 capitalize">{user.role}</span>
          </p>
        </div>
        <div className="bg-[#4FD1C5] w-full md:w-60 h-40 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${DecorImage})` }}
          ></div>
          <div className="relative flex items-center justify-center gap-3 text-white">
            <img src={Logo} alt="Logo" className="w-10" />
            <h1 className="text-xl font-bold">In Track</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const InternProfile = ({ user, avatarUrl, attendanceStats }) => (
  <>
    <div className="relative">
      <div
        className="h-48 w-full rounded-xl bg-[#4FD1C5] bg-cover bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      ></div>
      <div className="mx-auto w-[95%] -mt-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/editprofile" className="relative shrink-0">
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full cursor-pointer">
                <FaPencilAlt size={10} />
              </span>
            </Link>
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                {user.name || "Loading..."}
              </h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/attendancemg"
              className="flex items-center gap-2 bg-white font-semibold text-gray-800 px-4 py-2 rounded-lg text-sm"
            >
              <FaRegCalendarCheck className="text-[#4FD1C5]" />
              ATTENDANCE
            </Link>
            <Link
              to="/progressmg"
              className="flex items-center gap-2 bg-white font-semibold text-gray-800 px-4 py-2 rounded-lg text-sm"
            >
              <FaFileAlt className="text-[#4FD1C5]" />
              REPORT
            </Link>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-6 bg-white rounded-xl p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="font-bold text-gray-800">Profile Information</h4>
          <p className="text-sm text-gray-500 mt-2">
            {user.bio || "Bio not set."}
          </p>
          <hr className="my-4 border-gray-200" />
          <ul className="space-y-3 text-sm">
            <li className="flex">
              <strong className="w-32 font-semibold text-gray-800">
                Full Name:
              </strong>{" "}
              <span className="text-gray-600">{user.name}</span>
            </li>
            <li className="flex">
              <strong className="w-32 font-semibold text-gray-800">
                Email:
              </strong>{" "}
              <span className="text-gray-600">{user.email}</span>
            </li>
            <li className="flex">
              <strong className="w-32 font-semibold text-gray-800">
                Tanggal Bergabung:
              </strong>{" "}
              <span className="text-gray-600">{user.date}</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-800">Rekap Kehadiran Bulanan</h4>
          <p className="text-sm text-gray-500 mt-2">
            Status kehadiran digunakan untuk memantau kedisiplinan anak magang
            selama menjalani masa magang. Data ini mencakup jumlah hari
            kehadiran, izin, dan ketidakhadiran tanpa keterangan (alfa).
            Informasi ini akan menjadi bahan evaluasi dalam penilaian akhir
            program magang.
          </p>
          <hr className="my-4 border-gray-200" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <AttendanceRecapItem
              letter="H"
              label="Hadir"
              count={attendanceStats.hadir}
            />
            <AttendanceRecapItem
              letter="I"
              label="Ijin"
              count={attendanceStats.ijin}
            />
            <AttendanceRecapItem
              letter="S"
              label="Sakit"
              count={attendanceStats.sakit}
            />
            <AttendanceRecapItem
              letter="A"
              label="Alfa"
              count={attendanceStats.alfa}
            />
          </div>
        </div>
      </div>
    </div>
  </>
);

export const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [attendanceStats, setAttendanceStats] = useState({
    hadir: 0,
    ijin: 0,
    sakit: 0,
    alfa: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = Cookies.get("token");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/user`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const loggedInUser = res.data;
        setUser(loggedInUser);

        if (loggedInUser.role === "intern") {
          const attendanceRes = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/tmp_ia`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const userAttendances = attendanceRes.data.data.filter(
            (a) => a.user_id === loggedInUser.id
          );

          const stats = { hadir: 0, ijin: 0, sakit: 0, alfa: 0 };
          userAttendances.forEach((a) => {
            if (a.status === "Hadir") stats.hadir++;
            if (a.status === "Ijin") stats.ijin++;
            if (a.status === "Sakit") stats.sakit++;
            if (a.status === "Alpa") stats.alfa++;
          });
          setAttendanceStats(stats);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const avatarUrl =
    user.photo && user.photo !== "-"
      ? `${import.meta.env.VITE_STORAGE_URL}/img/avt/${user.photo}`
      : `https://ui-avatars.com/api/?name=${(
          user.name || "User"
        ).replace(" ", "+")}&background=random&color=fff`;

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <HeaderA />
      <Sidebar />
      <main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
        {user.role === "intern" ? (
          <InternProfile
            user={user}
            avatarUrl={avatarUrl}
            attendanceStats={attendanceStats}
          />
        ) : (
          <AdminStaffProfile user={user} avatarUrl={avatarUrl} />
        )}
      </main>
      <Footer />
    </div>
  );
};