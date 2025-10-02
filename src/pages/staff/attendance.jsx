import { Sidebar } from "../../layouts/sidebar";
import { HeaderA } from "../../layouts/header";
import { Footer } from "../../components/footer";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const AttendanceStaffPage = () => {
	const [attendances, setAttendance] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	const fetchData = async () => {
		try {
			const res = await axios.get(
				`${import.meta.env.VITE_API_BASE_URL}/api/intern_attend`,
				{ headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
			);
			setAttendance(res.data.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

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

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = attendances.slice(indexOfFirstItem, indexOfLastItem);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	const totalPages = Math.ceil(attendances.length / itemsPerPage);

	return (
		<div className="bg-gray-50 text-gray-900">
			<HeaderA />
			<Sidebar />
			<main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
				<div className="bg-white p-6 rounded-xl overflow-auto">
					<div className="flex justify-between items-center mb-6">
						<div>
							<h3 className="text-xl font-bold mb-2">ATTENDANCE</h3>
							<p className="text-gray-500">View intern attendance records.</p>
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
							</tr>
						</thead>
						<tbody>
							{currentItems.map((attendance) => (
								<tr key={attendance.id} className="border-b border-gray-200">
									<td className="px-6 py-4 font-bold text-gray-800">
										{attendance.user.name}
									</td>
									<td className="px-6 py-4 font-bold text-gray-800">
										{attendance.tanggal_iso}
									</td>
									<td className="px-6 py-4 font-bold text-gray-800">
										{attendance.jam_masuk !== null ? attendance.jam_masuk : "-"}
									</td>
									<td className="px-6 py-4 font-bold text-gray-800">
										{attendance.jam_keluar !== null
											? attendance.jam_keluar
											: "-"}
									</td>
									<td className="px-6 py-4 font-bold text-gray-800">
										<StatusBadge status={attendance.status} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{totalPages > 1 && (
						<div className="flex justify-end items-center mt-4">
							<button
								onClick={() => paginate(currentPage - 1)}
								disabled={currentPage === 1}
								className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
							>
								Previous
							</button>
							<span className="text-sm text-gray-700 mx-4">
								Page {currentPage} of {totalPages}
							</span>
							<button
								onClick={() => paginate(currentPage + 1)}
								disabled={currentPage === totalPages}
								className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
							>
								Next
							</button>
						</div>
					)}
				</div>
			</main>
			<Footer />
		</div>
	);
};
