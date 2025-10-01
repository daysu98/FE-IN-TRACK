import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { swalMixin } from "../../../library/sweetalert";

export const ProgressForm = () => {
	const [users, setUsers] = useState([]);
	const [form, setForm] = useState({
		user_id: "",
		task: "",
		description: "",
		deadline: "",
		status: "Pending",
	});
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await axios.get(
					`${import.meta.env.VITE_API_BASE_URL}/api/users`,
					{
						headers: { Authorization: `Bearer ${Cookies.get("token")}` },
					}
				);
				setUsers(res.data.data.filter((u) => u.role === "intern"));
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};
		fetchUsers();
	}, []);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}/api/job_interns`,
				form,
				{
					headers: { Authorization: `Bearer ${Cookies.get("token")}` },
				}
			);
			swalMixin("success", "New report added successfully!");
			navigate("/progress");
		} catch (error) {
			console.error("Create progress error:", error.response?.data || error);
			swalMixin("error", "Failed to create progress.");
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h2 className="font-semibold text-lg mb-6">Add New Progress Report</h2>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Intern's Name
					</label>
					<select
						name="user_id"
						value={form.user_id}
						onChange={handleChange}
						className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					>
						<option value="">-- Select Intern --</option>
						{users.map((u) => (
							<option key={u.id} value={u.id}>
								{u.name}
							</option>
						))}
					</select>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Task
					</label>
					<input
						type="text"
						name="task"
						value={form.task}
						onChange={handleChange}
						placeholder="Enter task . . ."
						className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Descriptions
					</label>
					<textarea
						name="description"
						value={form.description}
						onChange={handleChange}
						placeholder="Write here . . ."
						className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
						rows="3"
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
						className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>
				<div className="flex gap-4 pt-4">
					<button
						type="submit"
						className="bg-gradient-to-br from-blue-900 to-gray-800 text-white px-6 py-2 rounded-lg hover:bg-[#1e2240] transition"
					>
						ADD NEW
					</button>
					<Link
						to="/progress"
						className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
					>
						CANCEL
					</Link>
				</div>
			</form>
		</div>
	);
};
