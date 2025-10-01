import axios from "axios";
import { swalMixin } from "../../../library/sweetalert";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Cookies from "js-cookie";

export const CreateIntership = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  });
  const [validationError, setValidationError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/users`;
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    try {
      const res = await axios.post(url, formData, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
      swalMixin("success", `${res.data.message}`);
      navigate("/magangs");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 422) {
        setValidationError(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="font-semibold text-xl mb-6">Add New User</h2>

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

        <InputField
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          error={validationError.password}
        />

        <InputField
          label="Password Confirmation"
          type="password"
          name="password_confirmation"
          value={form.password_confirmation}
          onChange={handleChange}
          error={validationError.password_confirmation}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Role</option>
            <option value="intern">Intern</option>
          </select>
          {validationError.role && (
            <span className="text-red-500 text-sm block mt-1">
              {validationError.role}
            </span>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "opacity-60 cursor-not-allowed" : ""
            } bg-gradient-to-br from-blue-900 to-gray-800 text-white px-6 py-2 rounded-lg hover:bg-[#1e2240] transition`}
          >
            {loading ? "Processing..." : "ADD NEW"}
          </button>
          <Link
            to="/magangs"
            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
          >
            CANCEL
          </Link>
        </div>
      </form>
    </div>
  );
};

const InputField = ({ label, type, name, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder="Write here . . . ."
      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {error && <span className="text-red-500 text-sm block mt-1">{error}</span>}
  </div>
);