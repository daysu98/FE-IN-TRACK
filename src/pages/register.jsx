import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import Logo from "../assets/img/logo.png";
import BackgroundImage from "../assets/img/background.png";
import axios from "axios";
import Cookies from "js-cookie";
import { swalMixin } from "../library/sweetalert";

const InputField = ({ label, type, name, placeholder, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]"
      required
    />
    {error && <p className="text-sm text-red-500 mt-1">{error[0]}</p>}
  </div>
);

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "intern",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (form.password !== form.password_confirmation) {
      setErrors({
        password_confirmation: ["Password confirmation does not match."],
      });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/register`,
        form
      );
      const { token, user } = res.data;
      Cookies.set("token", token, { expires: 1 });
      Cookies.set("user", JSON.stringify(user), { expires: 1 });
      swalMixin("success", "Register successful!");
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        swalMixin("error", "Register failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <section className="bg-[#4FD1C5] relative text-white w-full h-[50vh] flex flex-col items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${BackgroundImage})` }}>
        </div>
        <div className="absolute top-0 left-0 right-0 p-6">
            <div className="container mx-auto flex items-center gap-2">
                <img src={Logo} alt="InTrack Logo" className="h-8 w-8" />
                <span className="font-bold text-xl">InTrack</span>
            </div>
        </div>
        <div className="relative text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome!</h1>
            <p className="max-w-2xl mx-auto text-base md:text-lg">
                Masuk atau buat akun untuk mengakses fitur seperti pendaftaran, absensi, dan pelaporan progres magang. Platform ini gratis dan mudah digunakan oleh peserta, staff, dan admin.
            </p>
        </div>
      </section>

      <section className="relative z-10 -mt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="bg-white w-full max-w-lg mx-auto p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Register</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <InputField 
                label="Name"
                type="text"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
              />
              <InputField 
                label="Email"
                type="email"
                name="email"
                placeholder="Your email address"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />
              <InputField 
                label="Password"
                type="password"
                name="password"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
              />
               <InputField 
                label="Confirm Password"
                type="password"
                name="password_confirmation"
                placeholder="Confirm your password"
                value={form.password_confirmation}
                onChange={handleChange}
                error={errors.password_confirmation}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]"
                >
                  <option value="intern">Intern</option>
                  <option value="staff">Staff</option>
                </select>
                {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role[0]}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4FD1C5] text-white py-3 rounded-lg font-semibold hover:bg-[#46b8ad] transition disabled:opacity-60"
              >
                {loading ? "Processing..." : "SIGN UP"}
              </button>
            </form>
            <p className="text-sm text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-[#4FD1C5] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};