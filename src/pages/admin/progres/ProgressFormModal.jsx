/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { swalMixin } from "../../../library/sweetalert";

export const ProgressFormModal = ({ progressToEdit, onFormSubmit, onClose }) => {
  const [form, setForm] = useState({
    user_id: "",
    task: "",
    description: "",
    deadline: "",
    status: "Pending",
  });
  const [users, setUsers] = useState([]);
  const [validationError, setValidationError] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        });
        setUsers(res.data.data.filter((u) => u.role === "intern"));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (progressToEdit) {
      setForm({
        user_id: progressToEdit.user_id || "",
        task: progressToEdit.task || "",
        description: progressToEdit.description || "",
        deadline: progressToEdit.deadline || "",
        status: progressToEdit.status || "Pending",
      });
    } else {
      setForm({
        user_id: "",
        task: "",
        description: "",
        deadline: "",
        status: "Pending",
      });
    }
  }, [progressToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let url = `${import.meta.env.VITE_API_BASE_URL}/api/job_interns`;
    let method = "post";
    if (progressToEdit) {
      url += `/${progressToEdit.id}`;
      method = "patch";
    }

    try {
      await axios({ method, url, data: form, headers: { Authorization: `Bearer ${Cookies.get("token")}` } });
      swalMixin("success", progressToEdit ? "Progress updated!" : "Progress created!");
      onFormSubmit();
      onClose();
    } catch (error) {
      swalMixin("error", "Failed to save progress.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Intern's Name</label>
        <select
          name="user_id"
          value={form.user_id}
          onChange={handleChange}
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
          required
          disabled={!!progressToEdit}
        >
          <option value="">-- Select Intern --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Task</label>
        <input
          type="text"
          name="task"
          value={form.task}
          onChange={handleChange}
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="3"
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Deadline</label>
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Progress"}
        </button>
      </div>
    </form>
  );
};