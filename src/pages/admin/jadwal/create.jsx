import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import { swalMixin } from "../../../library/sweetalert";

export const CreateJadwalPage = () => {
    const [interns, setInterns] = useState([]);
    const [form, setForm] = useState({ user_id: '', days: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

    useEffect(() => {
        const fetchInterns = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
                    headers: { Authorization: `Bearer ${Cookies.get("token")}` }
                });
                setInterns(response.data.data.filter(user => user.role === 'intern'));
            } catch (error) {
                console.error("Failed to fetch interns:", error);
            }
        };
        fetchInterns();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/cods`, form, {
                headers: { Authorization: `Bearer ${Cookies.get("token")}` }
            });
            swalMixin("success", "New schedule added!");
            navigate("/admin/jadwal");
        } catch (error) {
            swalMixin("error", "Failed to add schedule.");
            console.error("Submit error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="font-semibold text-xl mb-6">Add New Schedule</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Intern Name</label>
                    <select name="user_id" value={form.user_id} onChange={handleChange} className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg" required>
                        <option value="">-- Select Intern --</option>
                        {interns.map(intern => <option key={intern.id} value={intern.id}>{intern.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Day</label>
                    <select name="days" value={form.days} onChange={handleChange} className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg" required>
                        <option value="">-- Select Day --</option>
                        {days.map(day => <option key={day} value={day}>{day}</option>)}
                    </select>
                </div>
                <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={loading} className="bg-blue-800 text-white px-6 py-2 rounded-lg">
                        {loading ? "Saving..." : "SAVE SCHEDULE"}
                    </button>
                    <Link to="/admin/jadwal" className="bg-gray-400 text-white px-6 py-2 rounded-lg">CANCEL</Link>
                </div>
            </form>
        </div>
    );
};