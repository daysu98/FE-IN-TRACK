import { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import { Sidebar } from "../../../layouts/sidebar";
import { HeaderA } from "../../../layouts/header";
import { Footer } from "../../../components/footer";
import { swalDialog, swalMixin } from "../../../library/sweetalert";
import { FaPen, FaTrash, FaPlus, FaChevronDown } from "react-icons/fa";
import { Modal } from "../../../components/modal";
import { UserForm } from "./UserForm";

export const UsersPage = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	// [MODIFIKASI DIMULAI]: State untuk modal, filter, dan add dropdown
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [defaultRole, setDefaultRole] = useState("intern");
	const [filterRole, setFilterRole] = useState("all");
	const [isAddDropdownOpen, setAddDropdownOpen] = useState(false);
	// [MODIFIKASI SELESAI]

	const fetchData = async () => {
		setLoading(true);
		try {
			const res = await axios.get(
				`${import.meta.env.VITE_API_BASE_URL}/api/users`,
				{
					headers: { Authorization: `Bearer ${Cookies.get("token")}` },
				}
			);
			setUsers(res.data.data);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

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
			fetchData(); // Re-fetch data
		} catch (error) {
			console.error(error);
			swalMixin("error", "Failed to delete user.");
		}
	};

	// [MODIFIKASI DIMULAI]: Logika untuk memfilter user
	const filteredUsers = users.filter((user) => {
		if (filterRole === "all") return true;
		return user.role === filterRole;
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
						onFormSubmit={fetchData}
						onClose={() => setIsModalOpen(false)}
						defaultRole={defaultRole}
					/>
				</Modal>

				<div className="bg-white p-6 rounded-xl overflow-auto">
					<h3 className="text-xl font-bold mb-2">Users</h3>
					<p className="text-gray-500 mb-6">Manage Interns & Staff</p>

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
								className="border rounded-lg p-2 text-sm cursor-pointer"
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
								className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 font-semibold text-sm flex items-center gap-2 cursor-pointer"
							>
								<FaPlus /> Add New <FaChevronDown size={12} />
							</button>
							{isAddDropdownOpen && (
								<div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-20">
									<button
										onClick={() => handleOpenModalForCreate("intern")}
										className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
									>
										Add Intern
									</button>
									<button
										onClick={() => handleOpenModalForCreate("staff")}
										className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
									>
										Add Staff
									</button>
								</div>
							)}
						</div>
						{/* [MODIFIKASI SELESAI] */}
					</div>

					<table className="w-full text-sm text-left">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50">
							<tr>
								<th className="py-3 px-6">NAME</th>
								<th className="py-3 px-6">EMAIL</th>
								<th className="py-3 px-6">ROLE</th>
								<th className="py-3 px-6">PHOTO</th>
								<th className="py-3 px-6">CREATED AT</th>
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
								filteredUsers.map((user) => (
									<tr key={user.id} className="border-b border-gray-200">
										<td className="px-6 py-4 font-bold text-gray-800">
											{user.name}
										</td>
										<td className="px-6 py-4 font-bold text-gray-800">
											{user.email}
										</td>
										<td className="px-6 py-4 font-bold text-gray-800">
											{user.role}
										</td>
										<td className="px-6 py-4">
											<img
												src={
													user.photo && user.photo !== "-"
														? `${import.meta.env.VITE_STORAGE_URL}/img/avt/${
																user.photo
														  }`
														: `https://ui-avatars.com/api/?name=${user.name.replace(
																" ",
																"+"
														  )}&background=random&color=fff`
												}
												alt="user-avatar"
												className="w-12 h-12 rounded-full object-cover"
											/>
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
