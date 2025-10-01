import { Sidebar } from "../../../layouts/sidebar";
import { HeaderA } from "../../../layouts/header";
import { Footer } from "../../../components/footer";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaChevronDown, FaEye, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import { swalDialog, swalMixin } from "/src/library/sweetalert.js";
import { Modal } from "/src/components/modal";
import { UserForm } from "/src/pages/admin/users/UserForm";

export const InternshipPage = () => {
	const [interns, setInterns] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [defaultRole, setDefaultRole] = useState("intern");
	const [filterRole, setFilterRole] = useState("all");
	const [isAddDropdownOpen, setAddDropdownOpen] = useState(false);

	const fetchInterns = async () => {
		setLoading(true);
		try {
			const res = await axios.get(
				`${import.meta.env.VITE_API_BASE_URL}/api/users`,
				{
					headers: { Authorization: `Bearer ${Cookies.get("token")}` },
				}
			);
			let users = [];
			if (Array.isArray(res.data)) {
				users = res.data;
			} else if (Array.isArray(res.data.data)) {
				users = res.data.data;
			}
			const filtered = users.filter((u) => u.role === "intern");
			setInterns(filtered);
		} catch (err) {
			console.error("Fetch users error:", err);
			setInterns([]);
		} finally {
			setLoading(false);
		}
	};

	const handleOpenModalForCreate = (role) => {
		setEditingUser(null);
		setDefaultRole(role);
		setIsModalOpen(true);
		setAddDropdownOpen(false);
	};

	const handleOpenModalForEdit = (user) => {
		setEditingUser(user);
		setIsModalOpen(true);
	};

	const handleDeleteUser = async (id) => {
		const confirm = await swalDialog(
			"Are you sure you want to delete this user?",
			"warning"
		);
		if (!confirm.isConfirmed) return;

		try {
			const response = await axios.delete(
				`${import.meta.env.VITE_API_BASE_URL}/api/users/${id}`,
				{
					headers: { Authorization: `Bearer ${Cookies.get("token")}` },
				}
			);
			swalMixin("success", response.data.message);
			fetchInterns(); // Re-fetch data
		} catch (error) {
			console.error(error);
			swalMixin("error", "Failed to delete user.");
		}
	};

	useEffect(() => {
		fetchInterns();
	}, []);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = interns.slice(indexOfFirstItem, indexOfLastItem);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);
	const totalPages = Math.ceil(interns.length / itemsPerPage);

	return (
		<div className="bg-gray-50 text-gray-900">
			<HeaderA />
			<Sidebar />
			<main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
				<Modal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					title={
						editingUser
							? "Edit User"
							: `Add New ${
									defaultRole.charAt(0).toUpperCase() + defaultRole.slice(1)
							  }`
					}
				>
					<UserForm
						userToEdit={editingUser}
						onFormSubmit={fetchInterns}
						onClose={() => setIsModalOpen(false)}
						defaultRole={defaultRole}
					/>
				</Modal>

				<div className="bg-white p-6 rounded-xl overflow-auto">
					<h3 className="text-xl font-bold mb-2">Internship</h3>
					<p className="text-gray-500 mb-6">Manage Internship</p>

					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
						{/* [MODIFIKASI DIMULAI]: Dropdown filter berdasarkan peran */}
						<div>
							<label
								htmlFor="roleFilter"
								className="text-sm font-medium text-gray-700"
							>
								Filter by Role:{" "}
							</label>
							<select
								id="roleFilter"
								value={filterRole}
								onChange={(e) => setFilterRole(e.target.value)}
								className="border rounded-lg p-2 text-sm"
							>
								<option value="all">All</option>
								<option value="intern">Intern</option>
								<option value="staff">Staff</option>
								<option value="admin">Admin</option>
							</select>
						</div>
						{/* [MODIFIKASI SELESAI] */}

						{/* [MODIFIKASI DIMULAI]: Tombol Add dengan pilihan */}
						<div className="relative">
							<button
								onClick={() => setAddDropdownOpen(!isAddDropdownOpen)}
								className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 font-semibold text-sm flex items-center gap-2"
							>
								<FaPlus /> Add New <FaChevronDown size={12} />
							</button>
							{isAddDropdownOpen && (
								<div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-20">
									<button
										onClick={() => handleOpenModalForCreate("intern")}
										className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
									>
										Add Intern
									</button>
								</div>
							)}
						</div>
						{/* [MODIFIKASI SELESAI] */}
					</div>

					{loading ? (
						<p className="text-center text-gray-500">Loading users...</p>
					) : interns.length === 0 ? (
						<p className="text-center text-gray-500">
							No internship users found.
						</p>
					) : (
						<>
							<table className="w-full text-sm text-left">
								<thead className="text-xs text-gray-700 uppercase bg-gray-50">
									<tr>
										<th className="py-3 px-6">NAME</th>
										<th className="py-3 px-6">EMAIL</th>
										<th className="py-3 px-6">ROLE</th>
										<th className="py-3 px-6">CREATED AT</th>
										<th className="py-3 px-6">ACTION</th>
									</tr>
								</thead>
								<tbody>
									{currentItems.map((user) => (
										<tr key={user.id} className="border-b border-gray-200">
											<td className="px-6 py-4 font-bold text-gray-800 hover:text-blue-600">
												<Link to={`/internship/${user.id}`}>{user.name}</Link>
											</td>
											<td className="px-6 py-4 font-bold text-gray-800">
												{user.email}
											</td>
											<td className="px-6 py-4 font-bold text-gray-800">
												{user.role}
											</td>
											<td className="px-6 py-4 font-bold text-gray-800">
												{user.date}
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center gap-4 text-sm">
													<button
														onClick={() => handleDeleteUser(user.id)}
														className="text-gray-500 hover:text-red-500 flex items-center gap-2 font-semibold"
													>
														<FaTrash color="red" /> DELETE
													</button>
													<button
														onClick={() => handleOpenModalForEdit(user)}
														className="text-gray-500 hover:text-blue-500 flex items-center gap-2 font-semibold"
													>
														<FaPen color="black" /> EDIT
													</button>
												</div>
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
						</>
					)}
				</div>
			</main>
			<Footer />
		</div>
	);
};
