/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { swalMixin } from "../../../library/sweetalert";

export const JadwalFormModal = ({ scheduleToEdit, onFormSubmit, onClose }) => {
  const [interns, setInterns] = useState([]);
  const [form, setForm] = useState({ user_id: "", days: "" });
  const [loading, setLoading] = useState(false);
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users`,
          {
            headers: { Authorization: `Bearer ${Cookies.get("token")}` },
          }
        );
        setInterns(
          response.data.data.filter((user) => user.role === "intern")
        );
      } catch (error) {
        console.error("Failed to fetch interns:", error);
      }
    };
    fetchInterns();
  }, []);

  useEffect(() => {
    if (scheduleToEdit) {
      setForm({
        user_id: scheduleToEdit.user_id || "",
        days: scheduleToEdit.days || "",
      });
    } else {
      setForm({ user_id: "", days: "" });
    }
  }, [scheduleToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    let url = `${import.meta.env.VITE_API_BASE_URL}/api/cods`;
    let method = "post";
    if (scheduleToEdit) {
      url += `/${scheduleToEdit.id}`;
      method = "put";
    }

    try {
      await axios({method, url, data: form, headers: { Authorization: `Bearer ${Cookies.get("token")}` }});
      swalMixin("success", scheduleToEdit ? "Schedule updated!" : "New schedule added!");
      onFormSubmit();
      onClose();
    } catch (error) {
      swalMixin("error", "Failed to save schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Intern Name</label>
        <select
          name="user_id"
          value={form.user_id}
          onChange={handleChange}
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
          required
        >
          <option value="">-- Select Intern --</option>
          {interns.map((intern) => (
            <option key={intern.id} value={intern.id}>{intern.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Day</label>
        <select
          name="days"
          value={form.days}
          onChange={handleChange}
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
          required
        >
          <option value="">-- Select Day --</option>
          {days.map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-800 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Schedule"}
        </button>
      </div>
    </form>
  );
};