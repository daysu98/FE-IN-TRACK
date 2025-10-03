import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import Cookies from "js-cookie";
import axios from "axios";
import {
	FaSearch,
	FaChevronDown,
	FaUserCog,
	FaSignOutAlt,
	FaUser,
	FaTasks,
	FaCalendarCheck,
} from "react-icons/fa";

export const HeaderA = () => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState({});
	const location = useLocation();
	const navigate = useNavigate();
	const params = useParams();

	const [searchQuery, setSearchQuery] = useState("");
	// [MODIFIKASI DIMULAI]: Mengubah state 'results' dan 'showDropdown'
	const [results, setResults] = useState({
		users: [],
		progress: [],
		attendance: [],
	});
	const [showDropdown, setShowDropdown] = useState(false);
	// [MODIFIKASI SELESAI]
	const [debounceTimeout, setDebounceTimeout] = useState(null);

	useEffect(() => {
		const fetchCurrentUser = async () => {
			try {
				const res = await axios.get(
					`${import.meta.env.VITE_API_BASE_URL}/api/user`,
					{
						headers: { Authorization: `Bearer ${Cookies.get("token")}` },
					}
				);
				setCurrentUser(res.data);
			} catch (error) {
				console.error("Failed to fetch current user:", error);
			}
		};
		fetchCurrentUser();
	}, []);

	const pageTitle = () => {
		const pageTitles = {
			"/dashboardadmin": "Dashboard",
			"/dashboardstaff": "Dashboard",
			"/dashboardmg": "Dashboard",
			"/users": "Users",
			"/magang": "Magang",
			"/attendance": "Attendance",
			"/progress": "Daily Work Report",
			"/profile": "Profile",
			"/about": "About Us",
			"/editprofile": "Edit Profile",
			"/attendancemg": "Attendance",
			"/progressmg": "Daily Work Report",
			"/attendances": "Attendance",
			"/progresss": "Daily Work Report",
			"/magangs": "Internship",
			"/jadwal": "Jadwal Piket",
			"/admin/jadwal": "Jadwal Piket",
			"/admin/jadwal/details": "Jadwal Piket",
			"/internship/:id": "View Intern",
		};

		let currentPage = pageTitles[location.pathname] || "Pages";
		if (!currentPage && params.id) {
			currentPage = pageTitles["/internship/:id"];
		}

		return currentPage || "Pages";
	};

	const username = currentUser.name || "Guest";

	const avatarUrl =
		currentUser.photo && currentUser.photo !== "-"
			? `${import.meta.env.VITE_STORAGE_URL}/img/avt/${currentUser.photo}`
			: `https://ui-avatars.com/api/?name=${username.replace(
					" ",
					"+"
			  )}&background=random&color=fff`;

	const handleLogout = () => {
		Cookies.remove("token");
		Cookies.remove("role");
		Cookies.remove("username");
		Cookies.remove("userId");
		navigate("/login");
	};

	// [MODIFIKASI DIMULAI]: Mengubah logika pencarian
	const handleSearchChange = (e) => {
		const query = e.target.value;
		setSearchQuery(query);

		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}

		if (query.length < 2) {
			setShowDropdown(false);
			setResults({ users: [], progress: [], attendance: [] });
			return;
		}

		const newTimeout = setTimeout(async () => {
			try {
				const res = await axios.get(
					`${import.meta.env.VITE_API_BASE_URL}/api/search?search=${query}`,
					{
						headers: { Authorization: `Bearer ${Cookies.get("token")}` },
						Accept: "application/json",
					}
				);

				const searchData = res.data.search || [];
				const categorizedResults = {
					users: searchData.filter((item) => item.email),
					// Anda bisa menambahkan logika filter untuk progress dan attendance di sini jika diperlukan
				};

				setResults(categorizedResults);
				setShowDropdown(true);
			} catch (err) {
				console.error(err);
				setResults({ users: [], progress: [], attendance: [] });
			}
		}, 500);

		setDebounceTimeout(newTimeout);
	};
	// [MODIFIKASI SELESAI]

	return (
		<header className="bg-gray-50 fixed top-0 left-0 right-0 z-10 md:ml-64">
			<div className="flex justify-between items-center p-6">
				<div>
					<p className="text-sm text-gray-400">Pages / {pageTitle()}</p>
					<h1 className="text-xl font-bold text-gray-800">{pageTitle()}</h1>
				</div>
				<div className="flex items-center gap-4">
					<div className="relative">
						<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
							<FaSearch />
						</span>
						<input
							type="text"
							placeholder="Type here..."
							value={searchQuery}
							onChange={handleSearchChange}
							onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
							className="bg-white rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]"
						/>
						{/* [MODIFIKASI DIMULAI]: Menambahkan UI dropdown untuk hasil pencarian */}
						{showDropdown && (
							<div className="absolute mt-2 w-72 bg-white border rounded-lg shadow-xl z-50">
								{results.users.length > 0 && (
									<div>
										<h4 className="text-xs uppercase text-gray-400 px-4 py-2">
											Users
										</h4>
										<ul>
											{results.users.slice(0, 5).map((user) => (
												<li
													key={`user-${user.id}`}
													className="px-4 py-2 hover:bg-gray-100"
												>
													<Link
														to={`/users`}
														className="flex items-center gap-3"
													>
														<FaUser className="text-gray-400" />
														<div>
															<p className="text-sm font-semibold">
																{user.name}
															</p>
															<p className="text-xs text-gray-500">
																{user.email}
															</p>
														</div>
													</Link>
												</li>
											))}
										</ul>
									</div>
								)}

								{results.users.length === 0 && (
									<p className="p-4 text-sm text-gray-500">No results found.</p>
								)}
							</div>
						)}
						{/* [MODIFIKASI SELESAI] */}
					</div>
					<div className="relative">
						<button
							onClick={() => setDropdownOpen(!dropdownOpen)}
							className="flex items-center gap-2 text-gray-600"
						>
							<img
								src={avatarUrl}
								alt="Avatar"
								className="w-8 h-8 rounded-full object-cover"
							/>
							<span className="hidden sm:block font-semibold">{username}</span>
							<FaChevronDown size={12} />
						</button>
						{dropdownOpen && (
							<div className="absolute right-0 mt-3 w-48 bg-white border rounded-lg py-2 z-50">
								<Link
									to="/profile"
									className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
								>
									<FaUserCog /> View Profile
								</Link>
								<button
									onClick={handleLogout}
									className="flex items-center gap-3 w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
								>
									<FaSignOutAlt /> Log Out
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};
