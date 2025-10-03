import { useEffect, useState } from "react";
import { HeaderA } from "../../layouts/header";
import { Sidebar } from "../../layouts/sidebar";
import { Footer } from "../../components/footer";
import { Link } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import {
	FaRegCalendarAlt,
	FaTasks,
	FaClipboardCheck,
	FaArrowRight,
	FaFileAlt,
} from "react-icons/fa";
import Logo from "../../assets/img/logo.png";
import DecorImage from "../../assets/img/decor.png";

const StatCard = ({
	title,
	value,
	icon,
	linkTo,
	valueTextColor,
	iconBgColor,
}) => (
	<div className="bg-white p-5 rounded-xl flex flex-col justify-between">
		<div className="flex justify-between items-start">
			<span className="text-gray-500 font-semibold">{title}</span>
			<span className={`text-2xl text-white p-2 rounded-full ${iconBgColor}`}>
				{icon}
			</span>
		</div>
		<div className="mt-4 text-center">
			<p className={`text-3xl font-bold ${valueTextColor}`}>{value}</p>
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
	const statusColor = isDone ? "text-green-500" : "text-gray-500";

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
	return (
		<span
			className={`px-3 py-1 text-md font-bold rounded-full w-20 text-center ${colorClass}`}
		>
			{text}
		</span>
	);
};

export const DashboardMgPage = () => {
	const [absensi, setAbsensi] = useState([]);
	const [pekerjaan, setPekerjaan] = useState([]);
	const [jadwal, setJadwal] = useState("-");

	useEffect(() => {
		const fetchData = async () => {
			const token = Cookies.get("token");
			try {
				const [absensiRes, pekerjaanRes, jadwalRes] = await Promise.all([
					axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tmp_ia`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
					axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tmp_ji`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
					axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/cod`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
				]);

				setAbsensi(absensiRes.data.data || []);
				setPekerjaan(pekerjaanRes.data.data || []);

				const dayNames = [
					"Minggu",
					"Senin",
					"Selasa",
					"Rabu",
					"Kamis",
					"Jumat",
					"Sabtu",
				];
				const todayName = dayNames[new Date().getDay()];
				const jadwalHariIni = jadwalRes.data.data.find(
					(j) => j.user_id === Cookies.get("userId") && j.days === todayName
				);
				setJadwal(jadwalHariIni ? jadwalHariIni.days : "Libur");
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
			}
		};
		fetchData();
	}, []);

	const totalWorkDone = pekerjaan.filter((p) => p.status === "Done").length;
	const today = new Date().toISOString().split("T")[0];
	const absensiHariIni = absensi.find((a) => a.tanggal === today);

	const getStatusTextColor = (status) => {
		switch (status) {
			case "Hadir":
				return "text-green-500";
			case "Alpa":
				return "text-red-500";
			case "Ijin":
			case "Sakit":
				return "text-yellow-500";
			default:
				return "text-gray-800";
		}
	};

	const getStatusIconBg = (status) => {
		switch (status) {
			case "Hadir":
				return "bg-green-400";
			case "Alpa":
				return "bg-red-400";
			case "Ijin":
			case "Sakit":
				return "bg-yellow-400";
			default:
				return "bg-gray-400";
		}
	};

	const getStatusText = (status) => {
		if (status === "Hadir") return "Hadir";
		if (status === "Alpa") return "Alfa";
		return status || "Alfa";
	};

	return (
		<div className="bg-gray-50 text-gray-900">
			<HeaderA />
			<Sidebar />
			<main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
					<StatCard
						title="Jadwal Piket"
						value={jadwal}
						icon={<FaRegCalendarAlt />}
						linkTo="/jadwal"
						valueTextColor="text-gray-800"
						iconBgColor="bg-[#4FD1C5]"
					/>
					<StatCard
						title="Attendance Today"
						value={getStatusText(absensiHariIni?.status)}
						icon={<FaClipboardCheck />}
						linkTo="/attendancemg"
						valueTextColor={getStatusTextColor(
							absensiHariIni?.status || "Alpa"
						)}
						iconBgColor={getStatusIconBg(absensiHariIni?.status || "Alpa")}
					/>
					<StatCard
						title="Total Work"
						value={`${totalWorkDone} Task`}
						icon={<FaTasks />}
						linkTo="/progressmg"
						valueTextColor="text-gray-800"
						iconBgColor="bg-[#4FD1C5]"
					/>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					<div className="bg-white p-6 rounded-xl flex flex-col md:flex-row items-center gap-6">
						<div className="flex-1 space-y-2">
							<span className="text-xs font-semibold text-gray-400">
								Built by D2B
							</span>
							<h3 className="text-xl font-bold text-gray-800 mt-2">
								Welcome to the InTrack Intern Panel
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
							{pekerjaan.slice(0, 3).map((p) => (
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
					<h3 className="font-bold text-gray-800 mb-4">Monthly Absence</h3>
					<table className="w-full text-sm text-left text-gray-500">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50">
							<tr>
								<th scope="col" className="px-6 py-3">
									Date
								</th>
								<th scope="col" className="px-6 py-3">
									Check In Time
								</th>
								<th scope="col" className="px-6 py-3">
									Check Out Time
								</th>
								<th scope="col" className="px-6 py-3">
									Status
								</th>
							</tr>
						</thead>
						<tbody>
							{absensi.slice(0, 6).map((a) => (
								<tr className="bg-white border-b border-gray-200" key={a.id}>
									<td className="px-6 py-4 font-bold text-gray-800">
										{a.tanggal_iso}
									</td>
									<td className="px-6 py-4 font-bold text-gray-800">
										{a.jam_masuk ||
											(a.status === "Ijin" || a.status === "Sakit"
												? a.status
												: "-")}
									</td>
									<td className="px-6 py-4 font-bold text-gray-800">
										{a.jam_keluar ||
											(a.status === "Ijin" || a.status === "Sakit"
												? a.status
												: "-")}
									</td>
									<td className="px-6 py-4">
										<StatusBadge status={a.status} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</main>
			<Footer />
		</div>
	);
};
