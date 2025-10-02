import { HeaderA } from "../layouts/header";
import { Sidebar } from "../layouts/sidebar";
import { Footer } from "../components/footer";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { swalMixin } from "../library/sweetalert";
import { FaPencilAlt } from "react-icons/fa";

export const EditProfile = () => {
	const [user, setUser] = useState({});
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [bio, setBio] = useState("");
	const [photo, setPhoto] = useState(null);
	const [preview, setPreview] = useState(null);
	const navigate = useNavigate();

	const userRoles = Cookies.get("role");

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await axios.get(
					`${import.meta.env.VITE_API_BASE_URL}/api/user`,
					{ headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
				);
				const userData = res.data;
				setUser(userData);
				setName(userData.name || "");
				setEmail(userData.email || "");
				// setBio(userData.bio || "");
				if (userData.photo && userData.photo !== "-") {
					setPreview(
						`${import.meta.env.VITE_STORAGE_URL}/img/avt/${userData.photo}`
					);
				}
			} catch (error) {
				console.error("Failed to fetch profile:", error);
			}
		};
		fetchProfile();
	}, []);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 2 * 1024 * 1024) {
				swalMixin("error", "File size cannot exceed 2MB.");
				return;
			}
			setPhoto(file);
			setPreview(URL.createObjectURL(file));
		}
	};

	const handleSaveChanges = async (e) => {
		e.preventDefault();
		if (!user.id) {
			swalMixin("error", "User data not loaded yet.");
			return;
		}

		const formData = new FormData();
		if (name !== user.name) formData.append("name", name);
		if (email !== user.email) formData.append("email", email);
		if (bio !== user.bio) formData.append("bio", bio);
		if (photo) {
			formData.append("photo", photo);
		}

		if (formData.entries().next().done) {
			swalMixin("info", "No changes to save.");
			return;
		}

		// [MODIFIKASI DIMULAI]: Memilih endpoint API berdasarkan peran pengguna
		const userRole = Cookies.get("role");
		const endpoint =
			userRole === "intern" ? "/api/profile/update" : "/api/profile/updateS";
		// [MODIFIKASI SELESAI]

		try {
			await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, // Menggunakan endpoint dinamis
				formData,
				{
					headers: {
						Authorization: `Bearer ${Cookies.get("token")}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);
			swalMixin("success", "Profile updated successfully!");
			navigate("/profile");
		} catch (error) {
			console.error("Failed to update profile:", error.response?.data);
			swalMixin("error", "Failed to update profile.");
		}
	};

	const handleSavePicture = (e) => {
		e.preventDefault();
		handleSaveChanges(e);
	};

	switch (userRoles) {
		case "admin":
		case "staff":
			return (
				<div className="bg-gray-50 text-gray-900 min-h-screen">
					<HeaderA />
					<Sidebar />
					<main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
						<div className="bg-white rounded-xl p-8">
							<h2 className="text-2xl font-bold text-gray-800 mb-8">
								Edit Profile
							</h2>

							<form onSubmit={handleSaveChanges}>
								<input type="hidden" name="_method" value="PATCH" />
								<div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
									<div className="shrink-0">
										<img
											src={
												preview ||
												`https://ui-avatars.com/api/?name=${(
													name || "User"
												).replace(" ", "+")}&background=EBF4FF&color=7551FF`
											}
											alt="Profile Preview"
											className="w-36 h-36 rounded-lg object-cover border"
										/>
									</div>
									<div className="flex flex-col gap-3">
										<div className="flex items-center gap-3">
											<input
												type="file"
												id="photo-upload"
												className="hidden"
												onChange={handleFileChange}
												accept=".jpg,.jpeg,.png"
											/>
											<label
												htmlFor="photo-upload"
												className="cursor-pointer text-sm font-semibold text-cyan-500 border border-cyan-500 rounded-lg px-4 py-2 hover:bg-cyan-50 transition"
											>
												UPLOAD NEW PICTURE
											</label>
											<button
												onClick={handleSavePicture}
												className="text-sm font-semibold bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-900"
											>
												SAVE PICTURE
											</button>
										</div>
										<p className="text-xs text-gray-500">
											*Allowed JPG,JPEG or PNG. Maxsize of 2MB
										</p>
									</div>
								</div>

								<div className="space-y-6">
									<div>
										<label className="block text-sm font-semibold text-gray-600 mb-2">
											Nama
										</label>
										<div className="relative">
											<span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
												<FaPencilAlt />
											</span>
											<input
												type="text"
												value={name}
												onChange={(e) => setName(e.target.value)}
												className="w-full border rounded-lg p-3 pl-12 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 transition"
											/>
										</div>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-600 mb-2">
											Email
										</label>
										<div className="relative">
											<span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
												<FaPencilAlt />
											</span>
											<input
												type="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												className="w-full border rounded-lg p-3 pl-12 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 transition"
											/>
										</div>
									</div>
								</div>

								<div className="flex gap-3 mt-8">
									<button
										type="submit"
										className="bg-gray-800 text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-900 transition cursor-pointer"
									>
										SAVE CHANGES
									</button>
									<button
										type="button"
										onClick={() => navigate("/profile")}
										className="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 transition cursor-pointer"
									>
										CANCEL
									</button>
								</div>
							</form>
						</div>
					</main>
					<Footer />
				</div>
			);
		case "intern":
			return (
				<div className="bg-gray-50 text-gray-900 min-h-screen">
					<HeaderA />
					<Sidebar />
					<main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
						<div className="bg-white rounded-xl p-8">
							<h2 className="text-2xl font-bold text-gray-800 mb-8">
								Edit Profile
							</h2>

							<form onSubmit={handleSaveChanges}>
								<input type="hidden" name="_method" value="PATCH" />
								<div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
									<div className="shrink-0">
										<img
											src={
												preview ||
												`https://ui-avatars.com/api/?name=${(
													name || "User"
												).replace(" ", "+")}&background=EBF4FF&color=7551FF`
											}
											alt="Profile Preview"
											className="w-36 h-36 rounded-lg object-cover border"
										/>
									</div>
									<div className="flex flex-col gap-3">
										<div className="flex items-center gap-3">
											<input
												type="file"
												id="photo-upload"
												className="hidden"
												onChange={handleFileChange}
												accept=".jpg,.jpeg,.png"
											/>
											<label
												htmlFor="photo-upload"
												className="cursor-pointer text-sm font-semibold text-cyan-500 border border-cyan-500 rounded-lg px-4 py-2 hover:bg-cyan-50 transition"
											>
												UPLOAD NEW PICTURE
											</label>
											<button
												onClick={handleSavePicture}
												className="text-sm font-semibold bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-900"
											>
												SAVE PICTURE
											</button>
										</div>
										<p className="text-xs text-gray-500">
											*Allowed JPG,JPEG or PNG. Maxsize of 2MB
										</p>
									</div>
								</div>

								<div className="space-y-6">
									<div>
										<label className="block text-sm font-semibold text-gray-600 mb-2">
											Nama
										</label>
										<div className="relative">
											<span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
												<FaPencilAlt />
											</span>
											<input
												type="text"
												value={name}
												onChange={(e) => setName(e.target.value)}
												className="w-full border rounded-lg p-3 pl-12 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 transition"
											/>
										</div>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-600 mb-2">
											Email
										</label>
										<div className="relative">
											<span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
												<FaPencilAlt />
											</span>
											<input
												type="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												className="w-full border rounded-lg p-3 pl-12 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 transition"
											/>
										</div>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-600 mb-2">
											Bio
										</label>
										<textarea
											value={bio}
											onChange={(e) => setBio(e.target.value)}
											className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 transition"
											rows="4"
											placeholder="Tuliskan bio singkat Anda..."
										></textarea>
									</div>
								</div>

								<div className="flex gap-3 mt-8">
									<button
										type="submit"
										className="bg-gray-800 text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-900 transition cursor-pointer"
									>
										SAVE CHANGES
									</button>
									<button
										type="button"
										onClick={() => navigate("/profile")}
										className="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 transition cursor-pointer"
									>
										CANCEL
									</button>
								</div>
							</form>
						</div>
					</main>
					<Footer />
				</div>
			);
	}
};
