import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { swalMixin } from "../../../library/sweetalert";

const InputField = ({ label, type, name, value, onChange, error }) => (
	<div>
		<label className="block text-sm font-medium text-gray-700">{label}</label>
		<input
			type={type}
			name={name}
			value={value}
			onChange={onChange}
			className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
		/>
		{error && <span className="text-red-500 text-sm mt-1">{error[0]}</span>}
	</div>
);

export const UserForm = ({
	userToEdit,
	onFormSubmit,
	onClose,
	defaultRole,
}) => {
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		password_confirmation: "",
		role: defaultRole || "intern",
		photo: null,
	});
	const [preview, setPreview] = useState(null);
	const [validationError, setValidationError] = useState({});
	const [loading, setLoading] = useState(false);

	const role = Cookies.get("role");

	useEffect(() => {
		if (userToEdit) {
			setForm({
				name: userToEdit.name || "",
				email: userToEdit.email || "",
				role: userToEdit.role || "intern",
				password: "",
				password_confirmation: "",
				photo: null,
			});
			if (userToEdit.photo && userToEdit.photo !== "-") {
				setPreview(
					`${import.meta.env.VITE_STORAGE_URL}/img/avt/${userToEdit.photo}`
				);
			} else {
				setPreview(null);
			}
		} else {
			setForm({
				name: "",
				email: "",
				password: "",
				password_confirmation: "",
				role: defaultRole || "intern",
				photo: null,
			});
			setPreview(null);
		}
	}, [userToEdit, defaultRole]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setForm((prev) => ({ ...prev, photo: file }));
			setPreview(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setValidationError({});

		const formData = new FormData();
		Object.keys(form).forEach((key) => {
			if (form[key]) formData.append(key, form[key]);
		});

		let url = `${import.meta.env.VITE_API_BASE_URL}/api/users`;
		if (userToEdit) {
			url += `/${userToEdit.id}`;
			formData.append("_method", "PUT");
		}

		try {
			await axios.post(url, formData, {
				headers: { Authorization: `Bearer ${Cookies.get("token")}` },
			});
			swalMixin(
				"success",
				userToEdit ? "User updated successfully!" : "User created successfully!"
			);
			onFormSubmit();
			onClose();
		} catch (error) {
			if (error.response && error.response.status === 422) {
				setValidationError(error.response.data.errors);
			} else {
				swalMixin("error", "An unexpected error occurred.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<InputField
				label="Name"
				type="text"
				name="name"
				value={form.name}
				onChange={handleChange}
				error={validationError.name}
			/>
			<InputField
				label="Email"
				type="email"
				name="email"
				value={form.email}
				onChange={handleChange}
				error={validationError.email}
			/>
			{role === "staff" ? (
				<span></span>
			) : (
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Role
					</label>
					<select
						name="role"
						value={form.role}
						onChange={handleChange}
						className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
						disabled={!!userToEdit}
					>
						<option value="intern">Intern</option>
						<option value="staff">Staff</option>
						<option value="admin">Admin</option>
					</select>
					{validationError.role && (
						<span className="text-red-500 text-sm mt-1">
							{validationError.role[0]}
						</span>
					)}
				</div>
			)}
			<InputField
				label={userToEdit ? "New Password (Optional)" : "Password"}
				type="password"
				name="password"
				value={form.password}
				onChange={handleChange}
				error={validationError.password}
			/>
			<InputField
				label="Confirm Password"
				type="password"
				name="password_confirmation"
				value={form.password_confirmation}
				onChange={handleChange}
			/>
			<div>
				<label className="block text-sm font-medium text-gray-700">Photo</label>
				{preview && (
					<img
						src={preview}
						alt="Preview"
						className="w-24 h-24 rounded-full object-cover my-2"
					/>
				)}
				<input
					type="file"
					name="photo"
					onChange={handleFileChange}
					className="w-full text-sm"
				/>
				{validationError.photo && (
					<span className="text-red-500 text-sm mt-1">
						{validationError.photo[0]}
					</span>
				)}
			</div>
			<div className="flex justify-end gap-4 pt-4">
				<button
					type="button"
					onClick={onClose}
					className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg cursor-pointer"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={loading}
					className="bg-gray-800 text-white px-4 py-2 rounded-lg disabled:opacity-50 cursor-pointer"
				>
					{loading ? "Saving..." : userToEdit ? "Update User" : "Create User"}
				</button>
			</div>
		</form>
	);
};
