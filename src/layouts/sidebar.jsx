import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import Cookies from "js-cookie";
import { FaBars, FaHome, FaUsers, FaUserCircle } from "react-icons/fa";
import {
	IoMdMegaphone,
	IoIosInformationCircle,
	IoIosLogOut,
} from "react-icons/io";
import { ImLocation2 } from "react-icons/im";
import { GiBroom } from "react-icons/gi";
import Logo from "../assets/img/logo.png";

export const Sidebar = () => {
	const location = useLocation();
	// const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const userRole = Cookies.get("role");

	const menuByRole = {
		admin: [
			{ to: "/dashboardadmin", label: "Dashboard", icon: <FaHome /> },
			{ to: "/users", label: "Users", icon: <FaUsers /> },
			{ to: "/attendance", label: "Attendance", icon: <ImLocation2 /> },
			{ to: "/progress", label: "Daily Work", icon: <IoMdMegaphone /> },
			{ to: "/admin/jadwal", label: "Jadwal Piket", icon: <GiBroom /> },
		],
		staff: [
			{ to: "/dashboardstaff", label: "Dashboard", icon: <FaHome /> },
			{ to: "/magangs", label: "Internship", icon: <FaUsers /> },
			{ to: "/attendances", label: "Attendance", icon: <ImLocation2 /> },
			{ to: "/progresss", label: "Daily Work", icon: <IoMdMegaphone /> },
		],
		intern: [
			{ to: "/dashboardmg", label: "Dashboard", icon: <FaHome /> },
			{ to: "/jadwal", label: "Jadwal Piket", icon: <FaUsers /> },
			{ to: "/attendancemg", label: "Attendance", icon: <ImLocation2 /> },
			{ to: "/progressmg", label: "Daily Work", icon: <IoMdMegaphone /> },
		],
	};

	// const accountPages = [
	// 	{ to: "/profile", label: "Profile", icon: <FaUserCircle /> },
	// 	{ to: "/about", label: "About", icon: <IoIosInformationCircle /> },
	// ];

	const mainLinks = menuByRole[userRole] || [];

	// const handleLogout = () => {
	// 	Cookies.remove("token");
	// 	Cookies.remove("role");
	// 	Cookies.remove("username");
	// 	Cookies.remove("userId");
	// 	navigate("/login");
	// };

	useEffect(() => {
		setIsOpen(false);
	}, [location.pathname]);

	return (
		<>
			<button
				className="md:hidden p-4 text-gray-700 z-50 fixed"
				onClick={() => setIsOpen(!isOpen)}
			>
				<FaBars size={24} />
			</button>

			<div
				className={`bg-gray-50 fixed top-0 left-0 z-40 h-screen w-64 p-6 transition-transform duration-300 ease-in-out transform ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				} md:translate-x-0 flex flex-col`}
			>
				<div className="flex items-center gap-4 mb-6">
					<img src={Logo} alt="Logo" className="h-10 w-8" />
					<div>
						<span className="font-bold text-lg text-gray-800">DASHBOARD</span>
						<span className="text-sm text-gray-500 capitalize block">
							{userRole || "Guest"}
						</span>
					</div>
				</div>

				<hr className="my-2 mx-2 border-gray-200" />

				<ul className="space-y-3 mt-4 flex-grow">
					{mainLinks.map(({ to, icon, label }) => {
						const isActive = location.pathname === to;
						return (
							<li key={to}>
								<Link
									to={to}
									className={`flex items-center gap-4 p-2 rounded-lg transition-colors ${
										isActive ? "bg-white shadow-md" : "hover:bg-gray-100"
									}`}
								>
									<span
										className={`p-2 rounded-full text-lg ${
											isActive ? "bg-[#4FD1C5] text-white" : "text-[#4FD1C5]"
										}`}
									>
										{icon}
									</span>
									<span
										className={`font-semibold text-sm ${
											isActive ? "text-gray-800" : "text-gray-500"
										}`}
									>
										{label}
									</span>
								</Link>
							</li>
						);
					})}

					{/* [MODIFIKASI DIMULAI]: Menu Account Pages hanya akan muncul untuk peran 'staff' */}
					{/* {userRole === "staff" && (
            <>
              <li className="pt-4">
                <span className="text-xs font-bold text-gray-400 uppercase px-2">
                  Account Pages
                </span>
              </li>

              {accountPages.map(({ to, icon, label }) => {
                const isActive = location.pathname === to;
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      className={`flex items-center gap-4 p-2 rounded-lg transition-colors ${
                        isActive ? "bg-white shadow-md" : "hover:bg-gray-100"
                      }`}
                    >
                      <span
                        className={`p-2 rounded-full text-lg ${
                          isActive
                            ? "bg-[#4FD1C5] text-white"
                            : "text-[#4FD1C5]"
                        }`}
                      >
                        {icon}
                      </span>
                      <span
                        className={`font-semibold text-sm ${
                          isActive ? "text-gray-800" : "text-gray-500"
                        }`}
                      >
                        {label}
                      </span>
                    </Link>
                  </li>
                );
              })}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 p-2 rounded-lg transition-colors w-full hover:bg-gray-100"
                >
                  <span className="p-2 rounded-full text-lg text-[#4FD1C5]">
                    <IoIosLogOut />
                  </span>
                  <span className="font-semibold text-sm text-gray-500">
                    Log Out
                  </span>
                </button>
              </li>
            </>
          )} */}
					{/* [MODIFIKASI SELESAI] */}
				</ul>
			</div>

			{isOpen && (
				<div
					className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
					onClick={() => setIsOpen(false)}
				/>
			)}
		</>
	);
};
