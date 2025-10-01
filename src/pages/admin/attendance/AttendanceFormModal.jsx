import { useState, useEffect } from "react";
import axios from "axios";
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

export const AttendanceFormModal = ({ attendanceToEdit, onFormSubmit, onClose }) => {
  const [form, setForm] = useState({
    user_id: "",
    tanggal: "",
    jam_masuk: "",
    jam_keluar: "",
    status: "Hadir",
  });
  const [users, setUsers] = useState([]);
  const [validationError, setValidationError] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookies.get("token");
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.data.filter(u => u.role === 'intern'));
      } catch (err) {
        console.error("User fetch failed:", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (attendanceToEdit) {
      setForm({
        user_id: attendanceToEdit.user_id || "",
        tanggal: attendanceToEdit.tanggal || "",
        jam_masuk: attendanceToEdit.jam_masuk || "",
        jam_keluar: attendanceToEdit.jam_keluar || "",
        status: attendanceToEdit.status || "Hadir",
      });
    } else {
      setForm({
        user_id: "",
        tanggal: new Date().toISOString().split("T")[0],
        jam_masuk: "",
        jam_keluar: "",
        status: "Hadir",
      });
    }
  }, [attendanceToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const newForm = { ...prev, [name]: value };
      if (name === "status" && value !== "Hadir") {
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

    let url = `${import.meta.env.VITE_API_BASE_URL}/api/intern_attends`;
    let method = "post";

    if (attendanceToEdit) {
      url += `/${attendanceToEdit.id}`;
      method = "patch";
    }

    try {
      await axios({ method, url, data: form, headers: { Authorization: `Bearer ${Cookies.get("token")}` } });
      swalMixin("success", attendanceToEdit ? "Attendance updated!" : "Attendance created!");
      onFormSubmit();
      onClose();
    } catch (err) {
      if (err.response?.status === 422) {
        setValidationError(err.response.data.errors);
      } else {
        swalMixin("error", "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block font-medium">User</label>
        <select
          name="user_id"
          value={form.user_id}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          disabled={!!attendanceToEdit}
        >
          <option value="">-- Select Intern --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {validationError.user_id && (
          <p className="text-red-500 text-sm">{validationError.user_id}</p>
        )}
      </div>
      <div>
        <label className="block font-medium">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="Hadir">Hadir</option>
          <option value="Ijin">Ijin</option>
          <option value="Sakit">Sakit</option>
          <option value="Alpa">Alpa</option>
        </select>
      </div>
      <InputField
        label="Tanggal"
        name="tanggal"
        type="date"
        value={form.tanggal || ""}
        onChange={handleChange}
        error={validationError.tanggal}
      />
      <InputField
        label="Check In"
        name="jam_masuk"
        type="time"
        value={form.jam_masuk || ""}
        onChange={handleChange}
        disabled={form.status !== "Hadir"}
        error={validationError.jam_masuk}
      />
      <InputField
        label="Check Out"
        name="jam_keluar"
        type="time"
        value={form.jam_keluar || ""}
        onChange={handleChange}
        disabled={form.status !== "Hadir"}
        error={validationError.jam_keluar}
      />
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </div>
    </form>
  );
};