import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import Cookies from "js-cookie";
import { swalMixin } from "../../../library/sweetalert";

const InputField = ({ label, name, type, value, onChange, disabled, error }) => (
    <div>
      <label className="block font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full border px-4 py-2 rounded disabled:bg-gray-100"
      />
      {error && <p className="text-red-500 text-sm">{error[0]}</p>}
    </div>
);

export const EditAttendance = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    user_id: "",
    tanggal: "",
    jam_masuk: "",
    jam_keluar: "",
    status: "",
  });
  const [users, setUsers] = useState([]);
  const [validationError, setValidationError] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookies.get("token");
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } });
        setUsers(res.data.data);
      } catch (err) { console.error("User fetch failed:", err); }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = Cookies.get("token");
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/intern_attends/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setForm(res.data.data);
      } catch (err) { console.error("Attendance fetch failed:", err); }
    };
    fetchAttendance();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => {
        const newForm = { ...prevForm, [name]: value };
        if (name === "status" && (value === "Ijin" || value === "Sakit" || value === "Alpa")) {
            newForm.jam_masuk = "";
            newForm.jam_keluar = "";
        }
        return newForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationError({});
    
    const payload = { ...form };
    if (payload.status !== "Hadir") {
        payload.jam_masuk = null;
        payload.jam_keluar = null;
    }

    try {
      const token = Cookies.get("token");
      await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/intern_attends/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      swalMixin("success", "Attendance updated!");
      navigate("/attendance");
    } catch (err) {
      if (err.response?.status === 422) {
        setValidationError(err.response.data.errors);
      } else {
        swalMixin("error", "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Edit Attendance</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium">User</label>
          <select name="user_id" value={form.user_id} onChange={handleChange} className="w-full border px-4 py-2 rounded" disabled>
            <option value="">-- Select user --</option>
            {users.map((user) => (<option key={user.id} value={user.id}>{user.name} ({user.email})</option>))}
          </select>
        </div>
        <InputField label="Status" name="status" type="text" value={form.status || ''} onChange={handleChange} error={validationError.status} />
        <InputField label="Tanggal" name="tanggal" type="date" value={form.tanggal || ""} onChange={handleChange} error={validationError.tanggal} />
        <InputField label="Check In" name="jam_masuk" type="time" value={form.jam_masuk || ""} onChange={handleChange} disabled={form.status !== 'Hadir'} error={validationError.jam_masuk} />
        <InputField label="Check Out" name="jam_keluar" type="time" value={form.jam_keluar || ""} onChange={handleChange} disabled={form.status !== 'Hadir'} error={validationError.jam_keluar} />
        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className={`bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {loading ? "Processing..." : "Update"}
          </button>
          <Link to="/attendance" className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Cancel</Link>
        </div>
      </form>
    </div>
  );
};