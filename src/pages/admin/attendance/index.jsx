/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Sidebar } from "../../../layouts/sidebar";
import { HeaderA } from "../../../layouts/header";
import { Footer } from "../../../components/footer";
import { swalDialog, swalMixin } from "../../../library/sweetalert";
import {
	FaPen,
	FaTrash,
	FaPrint,
	FaChevronLeft,
	FaChevronRight,
} from "react-icons/fa";
import { Modal } from "../../../components/modal";
import { AttendanceFormModal } from "./AttendanceFormModal";
import { IoIosArrowDown } from "react-icons/io";

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

// [MODIFIKASI DIMULAI]: Komponen filter tanggal baru yang lebih smooth
const DateFilter = ({ currentDate, setCurrentDate }) => {
	const [isMonthOpen, setMonthOpen] = useState(false);
	const [isYearOpen, setYearOpen] = useState(false);
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const years = Array.from(
		{ length: 5 },
		(_, i) => new Date().getFullYear() - i
	);

	const handlePrevMonth = () =>
		setCurrentDate(
			(prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
		);
	const handleNextMonth = () =>
		setCurrentDate(
			(prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
		);

	const selectMonth = (monthIndex) => {
		setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
		setMonthOpen(false);
	};

	const selectYear = (year) => {
		setCurrentDate(new Date(year, currentDate.getMonth(), 1));
		setYearOpen(false);
	};

	return (
		<div className="flex items-center gap-2 font-semibold text-gray-700">
			<button
				onClick={handlePrevMonth}
				className="p-2 rounded-lg hover:bg-gray-100"
			>
				<FaChevronLeft size={12} />
			</button>
			<div className="relative">
				<span
					onClick={() => setMonthOpen(!isMonthOpen)}
					className="cursor-pointer p-2 inline-flex items-center gap-x-2"
				>
					{months[currentDate.getMonth()]}
					<IoIosArrowDown />
				</span>
				{isMonthOpen && (
					<ul className="absolute top-full mt-2 w-32 bg-white border rounded-lg shadow-lg z-[1000]">
						{months.map((month, index) => (
							<li
								key={month}
								onClick={() => selectMonth(index)}
								className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
							>
								{month}
							</li>
						))}
					</ul>
				)}
			</div>
			<div className="relative">
				<span
					onClick={() => setYearOpen(!isYearOpen)}
					className="cursor-pointer p-2 inline-flex items-center gap-x-2"
				>
					{currentDate.getFullYear()}
					<IoIosArrowDown />
				</span>
				{isYearOpen && (
					<ul className="absolute top-full mt-2 w-24 bg-white border rounded-lg shadow-lg z-[1000]">
						{years.map((year) => (
							<li
								key={year}
								onClick={() => selectYear(year)}
								className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
							>
								{year}
							</li>
						))}
					</ul>
				)}
			</div>
			<button
				onClick={handleNextMonth}
				className="p-2 rounded-lg hover:bg-gray-100"
			>
				<FaChevronRight size={12} />
			</button>
		</div>
	);
};
// [MODIFIKASI SELESAI]

export const AttendancePage = () => {
	const [attendances, setAttendances] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingAttendance, setEditingAttendance] = useState(null);

	// [MODIFIKASI DIMULAI]: State untuk filter tanggal baru
	const [currentDate, setCurrentDate] = useState(new Date());
	// [MODIFIKASI SELESAI]

	const fetchData = async () => {
		setLoading(true);
		try {
			const res = await axios.get(
				`${import.meta.env.VITE_API_BASE_URL}/api/intern_attends`,
				{ headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
			);
			setAttendances(res.data.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleOpenModalForCreate = () => {
		setEditingAttendance(null);
		setIsModalOpen(true);
	};

	const handleOpenModalForEdit = (attendance) => {
		setEditingAttendance(attendance);
		setIsModalOpen(true);
	};

	const handleDeleteAttendance = async (id) => {
		const confirm = await swalDialog("Are you sure?", "warning");
		if (!confirm.isConfirmed) return;
		try {
			await axios.delete(
				`${import.meta.env.VITE_API_BASE_URL}/api/intern_attends/${id}`,
				{ headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
			);
			swalMixin("success", "Attendance deleted.");
			fetchData();
		} catch (error) {
			swalMixin("error", "Failed to delete attendance.");
		}
	};

	const handlePrintRecap = async () => {
		try {
			const year = currentDate.getFullYear();
			const month = currentDate.getMonth() + 1;
			const response = await axios.get(
				`${import.meta.env.VITE_API_BASE_URL}/api/recap-pdf/${year}/${month}`,
				{
					headers: { Authorization: `Bearer ${Cookies.get("token")}` },
					responseType: "blob",
				}
			);
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			const monthName = new Date(year, month - 1).toLocaleString("id-ID", {
				month: "long",
			});
			link.setAttribute("download", `Rekap Absensi-${monthName}-${year}.pdf`);
			document.body.appendChild(link);
			link.click();
			link.remove();
		} catch (error) {
			swalMixin("error", "Failed to generate PDF recap.");
			console.error("PDF generation error:", error);
		}
	};

	// [MODIFIKASI DIMULAI]: Logika untuk memfilter absensi berdasarkan bulan dan tahun
	const filteredAttendances = attendances.filter((att) => {
		const attDate = new Date(att.tanggal);
		return (
			attDate.getMonth() === currentDate.getMonth() &&
			attDate.getFullYear() === currentDate.getFullYear()
		);
	});
	// [MODIFIKASI SELESAI]

	return (
		<div className="bg-gray-50 text-gray-900">
			<HeaderA />
			<Sidebar />
			<main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
				<Modal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					title={editingAttendance ? "Edit Attendance" : "Create Attendance"}
				>
					<AttendanceFormModal
						attendanceToEdit={editingAttendance}
						onFormSubmit={fetchData}
						onClose={() => setIsModalOpen(false)}
					/>
				</Modal>

				<div className="bg-white p-6 rounded-xl overflow-auto z-[100]">
					<div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
						<div>
							<h3 className="text-xl font-bold mb-2">ATTENDANCE</h3>
							<p className="text-gray-500">Manage Attandance</p>
						</div>
						<div className="flex items-center gap-2">
							<DateFilter
								currentDate={currentDate}
								setCurrentDate={setCurrentDate}
							/>
							<button
								onClick={handlePrintRecap}
								className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold text-sm flex items-center gap-2 cursor-pointer"
							>
								<FaPrint /> Print Recap
							</button>
							<button
								onClick={handleOpenModalForCreate}
								className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 font-semibold text-sm cursor-pointer"
							>
								ADD NEW
							</button>
						</div>
					</div>
					<table className="w-full text-sm text-left">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50">
							<tr>
								<th className="py-3 px-6">NAME</th>
								<th className="py-3 px-6">DATE</th>
								<th className="py-3 px-6">CHECK IN</th>
								<th className="py-3 px-6">CHECK OUT</th>
								<th className="py-3 px-6">KETERANGAN</th>
								<th className="py-3 px-6">ACTION</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td colSpan="6" className="text-center py-10">
										Loading...
									</td>
								</tr>
							) : (
								filteredAttendances.map((attendance) => (
									<tr key={attendance.id} className="border-b border-gray-200">
										<td className="px-6 py-4 font-bold text-gray-800">
											{attendance.user.name}
										</td>
										<td className="px-6 py-4 font-bold text-gray-800">
											{attendance.tanggal_iso}
										</td>
										<td className="px-6 py-4 font-bold text-gray-800">
											{attendance.jam_masuk !== null
												? attendance.jam_masuk
												: "-"}
										</td>
										<td className="px-6 py-4 font-bold text-gray-800">
											{attendance.jam_keluar !== null
												? attendance.jam_keluar
												: "-"}
										</td>
										<td className="px-6 py-4 font-bold text-gray-800">
											<StatusBadge status={attendance.status} />
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-4 text-sm">
												<button
													onClick={() => handleDeleteAttendance(attendance.id)}
													className="text-gray-500 hover:text-red-500 flex items-center gap-2 font-semibold"
												>
													<FaTrash color="red" />
													DELETE
												</button>
												<button
													onClick={() => handleOpenModalForEdit(attendance)}
													className="text-gray-500 hover:text-blue-500 flex items-center gap-2 font-semibold"
												>
													<FaPen color="black" />
													EDIT
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</main>
			<Footer />
		</div>
	);
};
