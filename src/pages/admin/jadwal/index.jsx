import { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import { HeaderA } from "../../../layouts/header";
import { Sidebar } from "../../../layouts/sidebar";
import { Footer } from "../../../components/footer";
import { swalDialog, swalMixin } from "../../../library/sweetalert";
import { FaPen, FaTrash } from "react-icons/fa";
import { Modal } from "../../../components/modal";
import { JadwalFormModal } from "./JadwalFormModal";

export const JadwalAdminPage = () => {
	const [schedules, setSchedules] = useState([]);
	// [MODIFIKASI DIMULAI]: State untuk modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingSchedule, setEditingSchedule] = useState(null);
	// [MODIFIKASI SELESAI]

	const fetchData = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_BASE_URL}/api/cods`,
				{
					headers: { Authorization: `Bearer ${Cookies.get("token")}` },
				}
			);
			setSchedules(response.data.data);
		} catch (error) {
			console.error("Failed to fetch schedules:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleOpenModalForCreate = () => {
		setEditingSchedule(null);
		setIsModalOpen(true);
	};

	const handleOpenModalForEdit = (schedule) => {
		setEditingSchedule(schedule);
		setIsModalOpen(true);
	};

	const handleDelete = async (id) => {
		const confirm = await swalDialog(
			"Are you sure you want to delete this schedule?",
			"warning"
		);
		if (!confirm.isConfirmed) return;

		try {
			await axios.delete(
				`${import.meta.env.VITE_API_BASE_URL}/api/cods/${id}`,
				{
					headers: { Authorization: `Bearer ${Cookies.get("token")}` },
				}
			);
			swalMixin("success", "Schedule deleted successfully");
			fetchData();
		} catch (error) {
			swalMixin("error", "Failed to delete schedule");
			console.error("Delete error:", error);
		}
	};

	return (
		<div className="bg-gray-50 text-gray-900">
			<HeaderA />
			<Sidebar />
			<main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
				<Modal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					title={editingSchedule ? "Edit Schedule" : "Add New Schedule"}
				>
					<JadwalFormModal
						scheduleToEdit={editingSchedule}
						onFormSubmit={fetchData}
						onClose={() => setIsModalOpen(false)}
					/>
				</Modal>

				<div className="bg-white p-6 rounded-xl">
					<div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
						<div>
							<h3 className="text-xl font-bold">Manage Cleaning Schedule</h3>
							<p className="text-gray-500">
								Add, edit, or delete intern schedules.
							</p>
						</div>
						<div className="flex gap-2">
							<Link
								to="/admin/jadwal/details"
								className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold text-sm"
							>
								MANAGE DETAILS
							</Link>
							<button
								onClick={handleOpenModalForCreate}
								className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 font-semibold text-sm cursor-pointer"
							>
								ADD NEW SCHEDULE
							</button>
						</div>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-sm text-left">
							<thead className="text-xs text-gray-700 uppercase bg-gray-50">
								<tr>
									<th className="py-3 px-6">INTERN'S NAME</th>
									<th className="py-3 px-6">DAY</th>
									<th className="py-3 px-6">ACTION</th>
								</tr>
							</thead>
							<tbody>
								{schedules.map((schedule) => (
									<tr key={schedule.id} className="border-b border-gray-200">
										<td className="px-6 py-4 font-bold text-gray-800">
											{schedule.user?.name || "N/A"}
										</td>
										<td className="px-6 py-4 font-bold text-gray-800">
											{schedule.days}
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-4 text-sm">
												<button
													onClick={() => handleDelete(schedule.id)}
													className="text-gray-500 hover:text-red-500 flex items-center gap-2 font-semibold cursor-pointer"
												>
													<FaTrash color="red" /> DELETE
												</button>
												<button
													onClick={() => handleOpenModalForEdit(schedule)}
													className="text-gray-500 hover:text-blue-500 flex items-center gap-2 font-semibold cursor-pointer"
												>
													<FaPen color="black" /> EDIT
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};
