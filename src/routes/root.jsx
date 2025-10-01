import { BrowserRouter, Route, Routes } from "react-router";
import { DashboardAdminPage } from "../pages/admin/dashboard";
import { DashboardStaffPage } from "../pages/staff/dashboard";
import { DashboardMgPage } from "../pages/magang/dashboard";
import { JadwalPage } from "../pages/magang/jadwal";
import { LoginPage } from "../pages/login";
import { RegisterPage } from "../pages/register";
import { UsersPage } from "../pages/admin/users/index";
import { AttendancePage } from "../pages/admin/attendance";
import { ProgressPage } from "../pages/admin/progres";
import { JadwalAdminPage } from "../pages/admin/jadwal";
import { DetailJadwalAdminPage } from "../pages/admin/jadwal/details";
import { Home } from "../pages/home";
import { ProfilePage } from "../pages/profile";
import { AboutPage } from "../pages/about";
import { AttendanceStaffPage } from "../pages/staff/attendance";
import { InternshipPage } from "../pages/staff/magang";
import { ProgressStaffPage } from "../pages/staff/progress/laporanm";
import { EditProfile } from "../pages/editprofil";
import { AttendanceIntern } from "../pages/magang/absensi";
import { CreateIntership } from "../pages/staff/magang/create";
import { EditInternship } from "../pages/staff/magang/edit";
import { DetailPage } from "../pages/magang/detail";
import { ProgresPageM } from "../pages/magang/progres";
import { InternshipDetailPage } from "../pages/staff/magang/detail";

export const RootRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/editprofile" element={<EditProfile />} />

        {/* Admin Routes */}
        <Route path="/dashboardadmin" element={<DashboardAdminPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/admin/jadwal" element={<JadwalAdminPage />} />
        <Route path="/admin/jadwal/details" element={<DetailJadwalAdminPage />} />

        {/* Staff Routes */}
        <Route path="/dashboardstaff" element={<DashboardStaffPage />} />
        <Route path="/attendances" element={<AttendanceStaffPage />} />
        <Route path="/magangs" element={<InternshipPage />} />
        <Route path="/internship/:id" element={<InternshipDetailPage />} />
        <Route path="/progresss" element={<ProgressStaffPage />} />
        <Route path="/createInternship" element={<CreateIntership />} />
        <Route path="/editInternship/:id" element={<EditInternship />} />

        {/* Intern Routes */}
        <Route path="/dashboardmg" element={<DashboardMgPage />} />
        <Route path="/attendancemg" element={<AttendanceIntern />} />
        <Route path="/progressmg" element={<ProgresPageM />} />
        <Route path="/jadwal" element={<JadwalPage />} />
        <Route path="/detail" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};