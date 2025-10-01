import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import Logo from "../assets/img/logo.png";
import BackgroundImage from "../assets/img/background.png";

const InputField = ({ label, type, name, placeholder, value, onChange }) => (
	<div>
		<label className="block text-sm font-medium text-gray-700 mb-2">
			{label}
		</label>
		<input
			type={type}
			name={name}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]"
			required
		/>
	</div>
);

const Toggle = ({ label, name, checked, onChange }) => (
	<label htmlFor={name} className="flex items-center cursor-pointer">
		<div className="relative">
			<input
				id={name}
				name={name}
				type="checkbox"
				className="sr-only"
				checked={checked}
				onChange={onChange}
			/>
			<div
				className={`block w-12 h-6 rounded-full transition ${
					checked ? "bg-[#4FD1C5]" : "bg-gray-300"
				}`}
			></div>
			<div
				className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
					checked ? "translate-x-6" : "translate-x-0"
				}`}
			></div>
		</div>
		<div className="ml-3 text-gray-700 text-sm">{label}</div>
	</label>
);

export const LoginPage = () => {
	axios.defaults.withCredentials = true;
	axios.defaults.withXSRFToken = true;
	const navigate = useNavigate();
	const [form, setForm] = useState({
		email: "",
		password: "",
		remember: false,
	});
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			await axios.get(
				`${import.meta.env.VITE_API_BASE_URL}/sanctum/csrf-cookie`
			);

			const res = await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}/api/login`,
				form
			);

			const token = res.data?.token?.plainTextToken;
			const abilities = res.data?.token?.accessToken?.abilities || [];
			const user = res.data?.user;
			const role = user?.role || abilities[0] || "";

			Cookies.set("token", token, { expires: 7 });
			Cookies.set("role", role);
			Cookies.set("username", user?.name || "");
			Cookies.set("userId", user?.id || "");

			switch (role) {
				case "admin":
					navigate("/dashboardadmin");
					break;
				case "staff":
					navigate("/dashboardstaff");
					break;
				case "intern":
					navigate("/dashboardmg");
					break;
				default:
					navigate("/dashboardmg");
					break;
			}

			// if (role === "admin") navigate("/dashboardadmin");
			// else if (role === "staff") navigate("/dashboardstaff");
			// else if (role === "intern") navigate("/dashboardmg");
			// else navigate("/dashboardmg");
		} catch (err) {
			console.error("Login error:", err);
			setError("Email atau password salah.");
		}
	};

	return (
		<div className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-sans relative">
			<div className="absolute top-0 left-0 right-0 z-20 p-4 hidden md:flex justify-center">
				<nav className="w-[95%] max-w-7xl mx-auto bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-md flex justify-between items-center">
					<div className="flex items-center gap-2">
						<img src={Logo} alt="InTrack Logo" className="h-8 w-8" />
						<span className="font-bold text-xl text-gray-800">In Track</span>
					</div>
					<Link
						to="/register"
						className="font-semibold px-6 py-2 rounded-lg text-black hover:text-gray-700 transition-colors"
					>
						Sign Up
					</Link>
				</nav>
			</div>

			<div className="flex flex-col justify-center items-center p-8 bg-white">
				<div className="w-full max-w-sm">
					<h2 className="text-3xl font-bold text-[#4FD1C5] mb-2">
						Welcome Back
					</h2>
					<p className="text-sm text-gray-500 mb-8">
						Enter your email and password to sign in
					</p>

					{error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

					<form className="space-y-6" onSubmit={handleSubmit}>
						<InputField
							label="Email"
							type="email"
							name="email"
							placeholder="Your email address"
							value={form.email}
							onChange={handleChange}
						/>
						<InputField
							label="Password"
							type="password"
							name="password"
							placeholder="Your password"
							value={form.password}
							onChange={handleChange}
						/>
						<Toggle
							label="Remember me"
							name="remember"
							checked={form.remember}
							onChange={handleChange}
						/>
						<button
							type="submit"
							className="w-full bg-[#4FD1C5] text-white font-semibold py-3 rounded-lg hover:bg-[#46b8ad] transition"
						>
							SIGN IN
						</button>
					</form>
					<p className="text-sm text-gray-500 text-center mt-6">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="text-[#4FD1C5] font-semibold hover:underline"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>

			<div className="hidden md:flex relative items-center justify-center bg-[#4FD1C5] p-8">
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: `url(${BackgroundImage})` }}
				></div>
				<div className="relative text-center text-white">
					<img src={Logo} alt="Logo" className="w-24 mx-auto mb-4" />
					<h1 className="text-5xl font-bold">In Track</h1>
				</div>
			</div>
		</div>
	);
};
