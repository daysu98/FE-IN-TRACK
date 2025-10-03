import { useEffect, useState } from "react";
import { HeaderA } from "../../layouts/header";
import { Sidebar } from "../../layouts/sidebar";
import { Footer } from "../../components/footer";
import { Link } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import {
	FaUsers,
	FaMapMarkerAlt,
	FaBullhorn,
	FaArrowRight,
	FaFileAlt,
} from "react-icons/fa";
import Logo from "../../assets/img/logo.png";
import DecorImage from "../../assets/img/decor.png";

const StatCard = ({ title, value, icon, linkTo }) => (
	<div className="bg-white p-5 rounded-xl flex flex-col justify-between">
		<div className="flex justify-between items-start">
			<span className="text-gray-500 font-semibold">{title}</span>
			<span className="text-2xl text-white p-2 rounded-full bg-[#4FD1C5]">
				{icon}
			</span>
		</div>
		<div className="mt-4 text-center">
			<p className="text-3xl font-bold text-gray-800">
				{value[0]}{" "}
				<span className="text-2xl text-gray-500 font-medium">{value[1]}</span>
			</p>
		</div>
		<hr className="my-3 border-gray-200" />
		<Link
			to={linkTo}
			className="text-white hover:text-white/80 flex items-center justify-center gap-2 font-semibold text-sm bg-blue-500 w-full rounded-lg py-2 hover:bg-blue-600 mx-auto"
		>
			<span>Check It</span>
			<FaArrowRight />
		</Link>
	</div>
);

const WorkProgressItem = ({ task, subtitle, progress, status }) => {
	const isDone = status === "Done";
	const statusText = status === "Pending" ? "Progress" : status;
	const statusColor = isDone ? "text-green-500" : "text-gray-400";

	return (
		<div className="grid grid-cols-9 gap-3 items-center py-3">
			<div className="col-span-1">
				<div className="bg-[#4FD1C5] p-2 rounded-full">
					<FaFileAlt className="text-white text-sm mx-auto" />
				</div>
			</div>

			<div className="col-span-5 min-w-0 overflow-x-hidden">
				<p className="font-bold text-sm whitespace-nowrap text-gray-800 mb-1 animate-loop-marquee">
					{task}
				</p>
				<p className="text-xs text-gray-500 animate-loop-marquee whitespace-nowrap">
					{subtitle}
				</p>
			</div>

			<div className="col-span-3 mr-8">
				<div className="flex justify-start mb-1">
					<span className="text-sm font-semibold text-[#4FD1C5]">
						{progress}%
					</span>
				</div>

				<div className="w-full bg-gray-200 rounded-full h-2">
					<div
						className="bg-[#4FD1C5] h-2 rounded-full transition-all duration-300"
						style={{ width: `${progress}%` }}
					></div>
					<span
						className={`px-3 py-1 text-md font-bold rounded-md w-35 text-center inline-block ${statusColor}`}
					>
						{statusText}
					</span>
				</div>
			</div>
		</div>
	);
};

const StatusBadge = ({ status }) => {
	let text = status;
	let colorClass = "text-gray-400";
	if (status === "Hadir") {
		text = "Hadir";
		colorClass = "text-green-400";
	}
	if (status === "Ijin" || status === "Sakit") colorClass = "text-yellow-400";
	if (status === "Alpa") {
		text = "Alfa";
		colorClass = "text-red-400";
	}
	if (status === "Late") colorClass = "text-red-400";
	return (
		<span
			className={`px-3 py-1 text-md font-bold rounded-full w-20 text-center ${colorClass}`}
		>
			{text}
		</span>
	);
};

export const DashboardAdminPage = () => {
	const [stats, setStats] = useState({
		totalUsers: 0,
		attendanceToday: 0,
		totalProgress: 0,
	});
	const [recentAbsence, setRecentAbsence] = useState([]);
	const [workProgress, setWorkProgress] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const token = Cookies.get("token");
			try {
				const [usersRes, attendanceRes, progressRes] = await Promise.all([
					axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
					axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/intern_attends`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
					axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/job_interns`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
				]);

				const today = new Date().toISOString().split("T")[0];
				const todayAttendanceData = attendanceRes.data.data.filter(
					(a) => a.tanggal === today
				);

				setStats({
					totalUsers:
						usersRes.data.data.filter((u) => u.role === "intern").length || 0,
					attendanceToday:
						todayAttendanceData.filter((a) => a.status === "Hadir").length || 0,
					totalProgress:
						progressRes.data.data.filter((p) => p.status === "Done").length ||
						0,
				});

				setRecentAbsence(todayAttendanceData);
				setWorkProgress(progressRes.data.data);
			} catch (error) {
				console.error("Failed to fetch dashboard data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="bg-gray-50 text-gray-900">
			<HeaderA />
			<Sidebar />
			<main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
					<StatCard
						title="Total Users"
						value={[stats.totalUsers, "Intern"]}
						icon={<FaUsers />}
						linkTo="/users"
					/>
					<StatCard
						title="Attendance Today"
						value={[stats.attendanceToday, "Present"]}
						icon={<FaMapMarkerAlt />}
						linkTo="/attendance"
					/>
					<StatCard
						title="Total Progress"
						value={[stats.totalProgress, "Progress"]}
						icon={<FaBullhorn />}
						linkTo="/progress"
					/>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					<div className="bg-white p-6 rounded-xl flex flex-col md:flex-row items-center gap-6">
						<div className="flex-1 space-y-2">
							<span className="text-xs font-semibold text-gray-400">
								Built by D2B
							</span>
							<h3 className="text-xl font-bold text-gray-800 mt-2">
								Welcome to the InTrack Admin Panel
							</h3>
							<p className="text-sm text-gray-600 mt-2 mb-4">
								Panel ini dirancang untuk membantu Anda mengelola seluruh
								operasional program magang. Mulai dari manajemen data peserta
								magang, pencatatan absensi harian, hingga pemantauan laporan
								pekerjaan, semua alat yang Anda butuhkan tersedia di sini.
							</p>
							<Link
								to="#"
								className="font-bold text-sm text-gray-800 flex items-center gap-2"
							>
								Read more <FaArrowRight />
							</Link>
						</div>
						<div className="bg-[#4FD1C5] w-full md:w-60 h-48 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0">
							<div
								className="absolute inset-0 bg-cover bg-center"
								style={{ backgroundImage: `url(${DecorImage})` }}
							></div>
							<div className="relative flex items-center justify-center gap-3 text-white">
								<img src={Logo} alt="Logo" className="w-12" />
								<h1 className="text-2xl font-bold">In Track</h1>
							</div>
						</div>
					</div>
					<div className="bg-white p-6 rounded-xl">
						<h3 className="font-bold text-gray-800 mb-4">Work Progress</h3>
						<div className="space-y-4">
							{workProgress.slice(0, 3).map((p) => (
								<WorkProgressItem
									key={p.id}
									task={p.task}
									subtitle={p.description.substring(0, 20) + "..."}
									progress={p.status === "Done" ? 100 : 60}
									status={p.status}
								/>
							))}
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl overflow-auto">
					<h3 className="font-bold text-gray-800 mb-4">
						Today's Internship Absence
					</h3>
					<table className="w-full text-sm text-left text-gray-500">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50">
							<tr>
								<th scope="col" className="px-6 py-3">
									Intern's Name
								</th>
								<th scope="col" className="px-6 py-3">
									Date
								</th>
								<th scope="col" className="px-6 py-3">
									Check In Time
								</th>
								<th scope="col" className="px-6 py-3">
									Status
								</th>
							</tr>
						</thead>
						<tbody>
							{recentAbsence.length > 0 ? (
								recentAbsence.map((a) => (
									<tr className="bg-white border-b border-gray-200" key={a.id}>
										<td className="px-6 py-4">
											<p className="font-bold text-gray-800">{a.user.name}</p>
											<p className="text-xs text-gray-500">{a.user.email}</p>
										</td>
										<td className="px-6 py-4 font-medium text-gray-800">
											{a.tanggal_iso}
										</td>
										<td className="px-6 py-4 font-medium text-gray-800">
											{a.jam_masuk !== null ? a.jam_masuk : "-"}
										</td>
										<td className="px-6 py-4">
											<StatusBadge status={a.status} />
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="4" className="text-center py-6 text-gray-500">
										No attendance data for today.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</main>
			<Footer />
		</div>
	);
};
