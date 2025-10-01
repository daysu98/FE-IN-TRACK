import { Sidebar } from "../../../layouts/sidebar";
import { HeaderA } from "../../../layouts/header";
import { Footer } from "../../../components/footer";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import { swalMixin } from "../../../library/sweetalert";

export const EditProgress = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    task: "",
    description: "",
    deadline: "",
    user_id: "",
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/job_interns/${id}`,
          { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
        );
        const data = res.data.data;
        setFormData({
          task: data.task,
          description: data.description,
          deadline: data.deadline,
          user_id: data.user_id,
        });
      } catch (error) {
        console.error("Gagal fetch progress:", error);
      }
    };
    fetchProgress();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/job_interns/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      );
      swalMixin("success", "Progress updated successfully!");
      navigate("/progress"); 
    } catch (error) {
      console.error("Gagal update progress:", error.response?.data || error);
      swalMixin("error", "Failed to update progress.");
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900">
      <HeaderA />
      <Sidebar />
      <main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
        <div className="bg-white p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Edit Progress</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Task</label>
              <input
                type="text"
                name="task"
                value={formData.task || ''}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline || ''}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>
            <input type="hidden" name="user_id" value={formData.user_id} />
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
              >
                Update
              </button>
              <Link
                to="/progress"
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};