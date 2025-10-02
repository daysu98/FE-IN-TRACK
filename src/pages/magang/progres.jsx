/* eslint-disable no-unused-vars */
import { Sidebar } from "../../layouts/sidebar";
import { HeaderA } from "../../layouts/header";
import { Footer } from "../../components/footer";
import { useState, useEffect } from "react";
import { FaCheckCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { swalMixin } from "../../library/sweetalert";
import { Modal } from "../../components/modal";
import { IoIosArrowDown } from "react-icons/io";

const DoneButton = ({ onClick }) => (
	<div className="relative group flex justify-center">
		<button
			onClick={onClick}
			className="font-semibold px-4 py-1 rounded-md text-sm text-white bg-green-500 cursor-pointer"
		>
			Done
		</button>
		<span className="absolute bottom-full mb-2 w-max bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
			*Click to mark as done
		</span>
	</div>
);

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
						className="cursor-pointer hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 inline-flex items-center gap-x-2"
					>
						{months[currentDate.getMonth()]}
						<IoIosArrowDown />
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
						className="cursor-pointer hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 inline-flex items-center gap-x-2"
					>
						{currentDate.getFullYear()}
						<IoIosArrowDown />
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

const CreateProgressForm = ({ onClose, onCreated, staffList }) => {
	const [form, setForm] = useState({
		task: "",
		description: "",
		deadline: "",
		manage_by: "",
	});

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}/api/intern_job`,
				form,
				{ headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
			);
			swalMixin("success", "New report added successfully!");
			onCreated();
			onClose();
		} catch (error) {
			console.error("Create progress error:", error.response?.data || error);
			swalMixin("error", "Failed to create progress.");
		}
	};

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Manage By
				</label>
				<select
					name="manage_by"
					value={form.manage_by}
					onChange={handleChange}
					className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
					required
				>
					<option value="">-- Select Staff --</option>
					{staffList.map((staff) => (
						<option key={staff.id} value={staff.name}>
							{staff.name}
						</option>
					))}
				</select>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700">Task</label>
				<input
					type="text"
					name="task"
					value={form.task}
					onChange={handleChange}
					className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
					required
				/>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Description
				</label>
				<textarea
					name="description"
					value={form.description}
					onChange={handleChange}
					rows="3"
					className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
					required
				/>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Deadline
				</label>
				<input
					type="date"
					name="deadline"
					value={form.deadline}
					onChange={handleChange}
					className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
					required
				/>
			</div>
			<div className="flex justify-end gap-3 pt-4">
				<button
					type="button"
					onClick={onClose}
					className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
				>
					Cancel
				</button>
				<button
					type="submit"
					className="bg-gray-800 text-white px-4 py-2 rounded-lg"
				>
					Submit Report
				</button>
			</div>
		</form>
	);
};

export const ProgresPageM = () => {
	const [allProgress, setAllProgress] = useState([]);
	const [filteredProgress, setFilteredProgress] = useState([]);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [staffList, setStaffList] = useState([]);

	const fetchData = async () => {
		try {
			const res = await axios.get(
				`${import.meta.env.VITE_API_BASE_URL}/api/tmp_ji`,
				{ headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
			);
			setAllProgress(res.data.data || []);
		} catch (error) {
			console.error("Error fetching progress data:", error);
		}
	};

	const fetchStaff = async () => {
		try {
			// [MODIFIKASI 1 DIMULAI]: Mengubah endpoint API untuk mengambil daftar staff
			const res = await axios.get(
				`${import.meta.env.VITE_API_BASE_URL}/api/staff-list`,
				{ headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
			);
			// [MODIFIKASI 2 DIMULAI]: Menghapus filter karena API sudah mengembalikan data staff saja
			setStaffList(res.data);
		} catch (error) {
			console.error("Error fetching staff list:", error);
		}
	};

	useEffect(() => {
		fetchData();
		fetchStaff();
	}, []);

	useEffect(() => {
		const filtered = allProgress.filter((p) => {
			const progressDate = new Date(p.created_at);
			return (
				progressDate.getMonth() === currentDate.getMonth() &&
				progressDate.getFullYear() === currentDate.getFullYear()
			);
		});
		setFilteredProgress(filtered);
	}, [currentDate, allProgress]);

	const handleMarkAsDone = async (id) => {
		try {
			await axios.patch(
				`${import.meta.env.VITE_API_BASE_URL}/api/job_intern/${id}`,
				{ status: "Done" },
				{ headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
			);
			swalMixin("success", "Task marked as Done!");
			fetchData();
		} catch (error) {
			swalMixin("error", "Failed to update status.");
		}
	};

	const doneThisMonth = filteredProgress.filter(
		(p) => p.status === "Done"
	).length;

	return (
		<div className="bg-gray-50 text-gray-900">
			<HeaderA />
			<Sidebar />
			<main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
				{/* <Modal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					title="Add New Progress Report"
				>
					<CreateProgressForm
						onClose={() => setIsModalOpen(false)}
						onCreated={fetchData}
						staffList={staffList}
					/>
				</Modal> */}

				<div className="bg-white p-6 rounded-xl">
					<div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
						<div>
							<h3 className="text-xl font-bold">Daily Work</h3>
							<div className="flex items-center gap-2 text-green-600 font-semibold mt-1">
								<FaCheckCircle />
								<span>{doneThisMonth} done this month</span>
							</div>
						</div>
						{/* <button
							onClick={() => setIsModalOpen(true)}
							className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 font-semibold text-sm"
						>
							ADD A NEW REPORT
						</button> */}
					</div>
					<DateFilter
						currentDate={currentDate}
						setCurrentDate={setCurrentDate}
					/>
					<div className="overflow-x-auto">
						<table className="w-full text-sm text-left">
							<thead className="text-xs text-gray-700 uppercase bg-gray-50">
								<tr>
									<th className="py-3 px-6">MANAGE BY</th>
									<th className="py-3 px-6">TASK</th>
									<th className="py-3 px-6">DESCRIPTION</th>
									<th className="py-3 px-6">DEADLINE</th>
									<th className="py-3 px-6 text-center">TOMBOL</th>
								</tr>
							</thead>
							<tbody>
								{filteredProgress.length > 0 ? (
									filteredProgress.map((item) => (
										<tr key={item.id} className="border-b border-gray-200">
											<td className="px-6 py-4 font-bold text-gray-800">
												{item.manage_by}
											</td>
											<td className="px-6 py-4 font-bold text-gray-800">
												{item.task}
											</td>
											<td className="px-6 py-4 font-bold text-gray-800 max-w-xs truncate">
												{item.description}
											</td>
											<td className="px-6 py-4 font-bold text-gray-800">
												{item.deadline_iso}
											</td>
											<td className="px-6 py-4 text-center">
												{item.status === "Pending" && (
													<DoneButton
														onClick={() => handleMarkAsDone(item.job_intern_id)}
													/>
												)}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="5" className="text-center py-10 text-gray-500">
											No data available for this month.
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
