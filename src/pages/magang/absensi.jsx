import { Sidebar } from "../../layouts/sidebar";
import { HeaderA } from "../../layouts/header";
import { Footer } from "../../components/footer";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { swalMixin } from "../../library/sweetalert";
import { FaChevronDown } from "react-icons/fa";

export const AttendanceIntern = () => {
	const [attendances, setAttendances] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const token = Cookies.get("token");

	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			const res = await axios.get(
				`${import.meta.env.VITE_API_BASE_URL}/api/tmp_ia`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setAttendances(res.data.data || []);
		} catch (error) {
			console.error("Gagal mengambil data absensi:", error);
		} finally {
			setLoading(false);
		}
	}, [token]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleAttendanceAction = async (status) => {
		setDropdownOpen(false);
		try {
			const res = await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}/api/attend_intern`,
				{ status },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			swalMixin(
				"success",
				res.data.message || `${status} recorded successfully!`
			);
			fetchData();
		} catch (error) {
			swalMixin(
				"error",
				error.response?.data?.message || `Failed to record ${status}.`
			);
		}
	};

	const handleCheckOut = async () => {
		try {
			const res = await axios.patch(
				`${import.meta.env.VITE_API_BASE_URL}/api/attendance/checkout`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			swalMixin("success", res.data.message || "Check-out successful!");
			fetchData();
		} catch (error) {
			swalMixin(
				"error",
				error.response?.data?.message || "Failed to check out."
			);
		}
	};

	const today = new Date().toISOString().split("T")[0];
	const todayAttendance = attendances.find((att) => att.tanggal === today);

	const showCheckIn = !todayAttendance;
	const showCheckOut =
		todayAttendance && todayAttendance.jam_masuk && !todayAttendance.jam_keluar;

	return (
		<div className="bg-gray-50 text-gray-900">
			<HeaderA />
			<Sidebar />
			<main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
				<div className="bg-white p-6 rounded-xl overflow-auto">
					<div className="flex justify-between items-center mb-6">
						<h3 className="text-xl font-bold">Attendance</h3>
						<div className="flex items-center gap-2">
							{showCheckIn && (
								<button
									onClick={() => handleAttendanceAction("Hadir")}
									className="bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg text-sm"
								>
									CHECK IN
								</button>
							)}
							{showCheckOut && (
								<button
									onClick={handleCheckOut}
									className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg text-sm"
								>
									CHECK OUT
								</button>
							)}
							<div className="relative">
								<button
									onClick={() => setDropdownOpen(!isDropdownOpen)}
									disabled={!showCheckIn}
									className="bg-black text-white font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
								>
									OTHERS <FaChevronDown size={12} />
								</button>
								{isDropdownOpen && (
									<div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg z-20">
										<button
											onClick={() => handleAttendanceAction("Ijin")}
											className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
										>
											Ijin
										</button>
										<button
											onClick={() => handleAttendanceAction("Sakit")}
											className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
										>
											Sakit
										</button>
									</div>
								)}
							</div>
						</div>
					</div>

					<table className="w-full text-sm">
						<thead className="text-xs text-gray-500 uppercase">
							<tr>
								<th className="py-3 px-6 text-left">DATE</th>
								<th className="py-3 px-6 text-left">CHECK IN</th>
								<th className="py-3 px-6 text-left">CHECK OUT</th>
								<th className="py-3 px-6 text-left">STATUS</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td colSpan="4" className="text-center py-10">
										Loading...
									</td>
								</tr>
							) : (
								attendances.map((item) => (
									<tr key={item.id} className="border-b border-gray-200">
										<td className="px-6 py-4 font-bold text-gray-800">
											{item.tanggal_iso}
										</td>
										<td className="px-6 py-4 font-bold text-gray-800">
											{item.jam_masuk || "-"}
										</td>
										<td className="px-6 py-4 font-bold text-gray-800">
											{item.jam_keluar || "-"}
										</td>
										<td className="px-6 py-4 font-bold text-gray-800">
											{item.status}
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
