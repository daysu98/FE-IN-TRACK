/* eslint-disable no-unused-vars */
import { Sidebar } from "../../../layouts/sidebar";
import { HeaderA } from "../../../layouts/header";
import { Footer } from "../../../components/footer";
import { Link } from "react-router";
import {
	FaPen,
	FaTrash,
	FaCheckCircle,
	FaChevronLeft,
	FaChevronRight,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { swalDialog, swalMixin } from "../../../library/sweetalert";
import { Modal } from "../../../components/modal";
import { ProgressFormModal } from "./ProgressFormModal";

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
	const years = [2023, 2024, 2025, 2026];
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
		<div className="flex justify-center items-center gap-4 my-4 relative z-20">
			<button
				onClick={handlePrevMonth}
				className="p-2 rounded-lg hover:bg-gray-100"
			>
				<FaChevronLeft size={14} className="text-gray-600" />
			</button>
			<div className="flex items-center gap-4 font-semibold text-gray-700">
				<div className="relative">
					<span
						onClick={() => setMonthOpen(!isMonthOpen)}
						className="cursor-pointer hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
					>
						{months[currentDate.getMonth()]}
					</span>
					{isMonthOpen && (
						<ul className="absolute top-full mt-2 w-32 bg-white border rounded-lg shadow-lg">
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
						className="cursor-pointer hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
					>
						{currentDate.getFullYear()}
					</span>
					{isYearOpen && (
						<ul className="absolute top-full mt-2 w-24 bg-white border rounded-lg shadow-lg">
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
			</div>
			<button
				onClick={handleNextMonth}
				className="p-2 rounded-lg hover:bg-gray-100"
			>
				<FaChevronRight size={14} className="text-gray-600" />
			</button>
		</div>
	);
};

export const ProgressPage = () => {
	const [allProgress, setAllProgress] = useState([]);
	const [currentDate, setCurrentDate] = useState(new Date());

	// [MODIFIKASI DIMULAI]: State untuk modal dan filter status
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingProgress, setEditingProgress] = useState(null);
	const [statusFilter, setStatusFilter] = useState("all");
	// [MODIFIKASI SELESAI]

	const fetchData = async () => {
		try {
			const res = await axios.get(
				`${import.meta.env.VITE_API_BASE_URL}/api/job_intern`,
				{ headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
			);
			setAllProgress(res.data.data);
		} catch (error) {
			console.error("Error fetching progress data:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleOpenModalForCreate = () => {
		setEditingProgress(null);
		setIsModalOpen(true);
	};

	const handleOpenModalForEdit = (progress) => {
		setEditingProgress(progress);
		setIsModalOpen(true);
	};

	const handleMarkAsDone = async (id) => {
		try {
			await axios.patch(
				`${import.meta.env.VITE_API_BASE_URL}/api/job_interns/${id}`,
				{ status: "Done" },
				{ headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
			);
			swalMixin("success", "Status updated to Done!");
			fetchData();
		} catch (error) {
			swalMixin("error", "Failed to update status.");
		}
	};

	const handleDeleteProgress = async (id) => {
		const confirm = await swalDialog("Are you sure?", "warning");
		if (!confirm.isConfirmed) return;
		try {
			await axios.delete(
				`${import.meta.env.VITE_API_BASE_URL}/api/job_interns/${id}`,
				{ headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
			);
			swalMixin("success", "Progress deleted.");
			fetchData();
		} catch (error) {
			swalMixin("error", "Failed to delete progress.");
		}
	};

	// [MODIFIKASI DIMULAI]: Logika untuk memfilter progres berdasarkan tanggal dan status
	const filteredProgress = allProgress
		.filter((p) => {
			const progressDate = new Date(p.created_at);
			return (
				progressDate.getMonth() === currentDate.getMonth() &&
				progressDate.getFullYear() === currentDate.getFullYear()
			);
		})
		.filter((p) => {
			if (statusFilter === "all") return true;
			return p.status === statusFilter;
		});
	// [MODIFIKASI SELESAI]

	const doneThisMonth = filteredProgress.filter(
		(p) => p.status === "Done"
	).length;

	return (
		<div className="bg-gray-50 text-gray-900">
			<HeaderA />
			<Sidebar />
			<main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
				<Modal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					title={editingProgress ? "Edit Progress" : "Add New Progress"}
				>
					<ProgressFormModal
						progressToEdit={editingProgress}
						onFormSubmit={fetchData}
						onClose={() => setIsModalOpen(false)}
					/>
				</Modal>

				<div className="bg-white p-6 rounded-xl">
					<div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
						<div>
							<h3 className="text-xl font-bold">Daily Work</h3>
							<div className="flex items-center gap-2 text-green-600 font-semibold mt-1">
								<FaCheckCircle />
								<span>{doneThisMonth} done this month</span>
							</div>
						</div>
						<button
							onClick={handleOpenModalForCreate}
							className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 font-semibold text-sm"
						>
							ADD A NEW REPORT
						</button>
					</div>

					<div className="flex flex-col md:flex-row justify-between items-center">
						<DateFilter
							currentDate={currentDate}
							setCurrentDate={setCurrentDate}
						/>
						{/* [MODIFIKASI DIMULAI]: Dropdown filter status */}
						<div>
							<label
								htmlFor="statusFilter"
								className="text-sm font-medium text-gray-700"
							>
								Filter by Status:{" "}
							</label>
							<select
								id="statusFilter"
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="border rounded-lg p-2 text-sm"
							>
								<option value="all">All</option>
								<option value="Pending">Pending</option>
								<option value="Done">Done</option>
							</select>
						</div>
						{/* [MODIFIKASI SELESAI] */}
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-sm text-left">
							<thead className="text-xs text-gray-700 uppercase bg-gray-50">
								<tr>
									<th className="py-3 px-6">INTERN'S NAME</th>
									<th className="py-3 px-6">TASK</th>
									<th className="py-3 px-6">DESCRIPTION</th>
									<th className="py-3 px-6">DEADLINE</th>
									<th className="py-3 px-6 text-center">STATUS</th>
									<th className="py-3 px-6">MANAGE BY</th>
									<th className="py-3 px-6">ACTION</th>
								</tr>
							</thead>
							<tbody>
								{filteredProgress.length > 0 ? (
									filteredProgress.map((progres) => (
										<tr key={progres.id} className="border-b border-gray-200">
											<td className="px-6 py-4 font-bold text-gray-800">
												{progres.user?.name}
											</td>
											<td className="px-6 py-4 font-bold text-gray-800">
												{progres.task}
											</td>
											<td className="px-6 py-4 font-bold text-gray-800 max-w-xs truncate">
												{progres.description}
											</td>
											<td className="px-6 py-4 font-bold text-gray-800">
												{progres.deadline_iso}
											</td>
											{/* [MODIFIKASI DIMULAI]: Logika baru untuk tampilan status */}
											<td className="px-6 py-4 text-center">
												{progres.status === "Pending" ? (
													<button
														onClick={() => handleMarkAsDone(progres.id)}
														className="font-semibold px-4 py-1 rounded-md text-sm text-white bg-yellow-500 hover:bg-yellow-600"
													>
														Pending
													</button>
												) : (
													<span className="font-semibold px-4 py-1 rounded-md text-sm text-white bg-green-500">
														Done
													</span>
												)}
											</td>
											{/* [MODIFIKASI SELESAI] */}
											<td className="px-6 py-4 font-bold text-gray-800">
												{progres.manage_by}
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center gap-4 text-sm">
													<button
														onClick={() => handleDeleteProgress(progres.id)}
														className="text-gray-500 hover:text-red-500 flex items-center gap-2 font-semibold"
													>
														<FaTrash color="red" /> DELETE
													</button>
													<button
														onClick={() => handleOpenModalForEdit(progres)}
														className="text-gray-500 hover:text-blue-500 flex items-center gap-2 font-semibold"
													>
														<FaPen color="black" /> EDIT
													</button>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="7" className="text-center py-10 text-gray-500">
											No data available for this filter.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};
