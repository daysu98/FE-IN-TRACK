/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { HeaderA } from "../../../layouts/header";
import { Sidebar } from "../../../layouts/sidebar";
import { Footer } from "../../../components/footer";
import { FaTrash } from "react-icons/fa";
import { swalMixin } from "../../../library/sweetalert";

export const DetailJadwalAdminPage = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedDay, setSelectedDay] = useState("Senin");
    const [newTask, setNewTask] = useState("");
    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

    const fetchData = async (day) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/picket-tasks?day=${day}`, {
                headers: { Authorization: `Bearer ${Cookies.get("token")}` }
            });
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    };

    useEffect(() => {
        fetchData(selectedDay);
    }, [selectedDay]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/picket-tasks`, {
                day: selectedDay,
                task_description: newTask
            }, { headers: { Authorization: `Bearer ${Cookies.get("token")}` } });
            setNewTask("");
            fetchData(selectedDay);
        } catch (error) {
            swalMixin("error", "Failed to add task.");
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/picket-tasks/${id}`, {
                headers: { Authorization: `Bearer ${Cookies.get("token")}` }
            });
            fetchData(selectedDay);
        } catch (error) {
            swalMixin("error", "Failed to delete task.");
        }
    };

    return (
        <div className="bg-gray-50 text-gray-900 min-h-screen">
            <HeaderA />
            <Sidebar />
            <main className="md:ml-64 p-6 pt-24 transition-all min-h-screen">
                <div className="bg-white p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-4">Manage Picket Details</h3>
                    <div className="mb-4">
                        <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="w-full md:w-1/3 p-2 border rounded-lg">
                            {days.map(day => <option key={day} value={day}>{day}</option>)}
                        </select>
                    </div>
                    <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add new task description..."
                            className="flex-grow p-2 border rounded-lg"
                        />
                        <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold text-sm">Add Task</button>
                    </form>
                    <ul className="space-y-3 list-disc list-inside">
                        {tasks.map(task => (
                            <li key={task.id} className="flex justify-between items-center">
                                <span>{task.task_description}</span>
                                <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-700">
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
            <Footer />
        </div>
    );
};