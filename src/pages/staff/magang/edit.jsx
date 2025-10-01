/* eslint-disable no-unused-vars */
import axios from "axios";
import { swalMixin } from "../../../library/sweetalert";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import Cookies from "js-cookie";

const InputField = ({ label, type, name, value, onChange, error }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <span className="text-red-500 text-sm block mt-1">{error[0]}</span>}
    </div>
);

export const EditInternship = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "intern",
    password: "",
    password_confirmation: "",
    photo: null,
  });
  const [preview, setPreview] = useState(null);
  const [validationError, setValidationError] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/${id}`, {
            headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        });
        const user = res.data.data;
        setForm({
          name: user.name,
          email: user.email,
          role: user.role,
        });
        if (user.photo && user.photo !== '-') {
            setPreview(`${import.meta.env.VITE_STORAGE_URL}/img/avt/${user.photo}`);
        }
      } catch (err) {
        swalMixin("error", "Failed to load user data");
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({...prev, photo: file}));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationError({});

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("role", form.role);
    if (form.password) {
        formData.append("password", form.password);
        formData.append("password_confirmation", form.password_confirmation);
    }
    if (form.photo) {
        formData.append("photo", form.photo);
    }
    formData.append("_method", "PUT");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
      swalMixin("success", res.data.message);
      navigate("/magangs");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setValidationError(error.response.data.errors);
      } else {
        swalMixin("error", "Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="font-semibold text-xl mb-6">Edit Internship</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField label="Name" type="text" name="name" value={form.name || ''} onChange={handleChange} error={validationError.name} />
        <InputField label="Email" type="email" name="email" value={form.email || ''} onChange={handleChange} error={validationError.email} />
        <InputField label="New Password (Optional)" type="password" name="password" value={form.password || ''} onChange={handleChange} error={validationError.password} />
        <InputField label="Confirm New Password" type="password" name="password_confirmation" value={form.password_confirmation || ''} onChange={handleChange} />
        <div>
            <label className="block text-sm font-medium text-gray-700">Photo</label>
            {preview && <img src={preview} alt="Preview" className="w-24 h-24 rounded-full object-cover my-2"/>}
            <input type="file" name="photo" onChange={handleFileChange} className="w-full text-sm"/>
            {validationError.photo && <span className="text-red-500 text-sm block mt-1">{validationError.photo[0]}</span>}
        </div>
        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className={`bg-blue-800 text-white px-6 py-2 rounded-lg transition ${loading && "opacity-60 cursor-not-allowed"}`}>
            {loading ? "Updating..." : "UPDATE INTERNSHIP"}
          </button>
          <Link to="/magangs" className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition">CANCEL</Link>
        </div>
      </form>
    </div>
  );
};