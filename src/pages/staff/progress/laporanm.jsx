import { Sidebar } from "../../../layouts/sidebar";
import { HeaderA } from "../../../layouts/header";
import { Footer } from "../../../components/footer";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaCheckCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";

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

export const ProgressStaffPage = () => {
	const [allProgress, setAllProgress] = useState([]);
	const [filteredProgress, setFilteredProgress] = useState([]);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

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

	useEffect(() => {
		const filtered = allProgress.filter((p) => {
			const progressDate = new Date(p.created_at);
			return (
				progressDate.getMonth() === currentDate.getMonth() &&
				progressDate.getFullYear() === currentDate.getFullYear()
			);
		});
		setFilteredProgress(filtered);
		setCurrentPage(1);
	}, [currentDate, allProgress]);

	const doneThisMonth = filteredProgress.filter(
		(p) => p.status === "Done"
	).length;

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredProgress.slice(
		indexOfFirstItem,
		indexOfLastItem
	);
	const totalPages = Math.ceil(filteredProgress.length / itemsPerPage);
	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<div className="bg-gray-50 text-gray-900">
			<HeaderA />
			<Sidebar />
			<main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
				<div className="bg-white p-6 rounded-xl">
					<div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
						<div>
							<h3 className="text-xl font-bold">Daily Work</h3>
							<div className="flex items-center gap-2 text-green-600 font-semibold mt-1">
								<FaCheckCircle />
								<span>{doneThisMonth} done this month</span>
							</div>
						</div>
					</div>
					<DateFilter
						currentDate={currentDate}
						setCurrentDate={setCurrentDate}
					/>
					<div className="overflow-x-auto">
						<table className="w-full text-sm text-left">
							<thead className="text-xs text-gray-700 uppercase bg-gray-50">
								<tr>
									<th className="py-3 px-6">INTERN'S NAME</th>
									<th className="py-3 px-6">TASK</th>
									<th className="py-3 px-6">DESCRIPTION</th>
									<th className="py-3 px-6">DEADLINE</th>
									<th className="py-3 px-6">MANAGE BY</th>
									<th className="py-3 px-6 text-center">STATUS</th>
								</tr>
							</thead>
							<tbody>
								{currentItems.length > 0 ? (
									currentItems.map((progres) => (
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
											<td className="px-6 py-4 font-bold text-gray-800">
												{progres.manage_by}
											</td>
											<td className="px-6 py-4 text-center">
												<span
													className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${
														progres.status === "Done"
															? "bg-green-500"
															: "bg-yellow-500"
													}`}
												>
													{progres.status}
												</span>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="6" className="text-center py-10 text-gray-500">
											No data available for this month.
										</td>
									</tr>
								)}
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
				</div>
			</main>
			<Footer />
		</div>
	);
};
