import AdminDashboard from "./admin/AdminDashboard";
import StudentDashboard from "./student/StudentDashboard";
import TeacherDashboard from "./teacher/TeacherDashboard";

export default function DashboardRouter({ role, onLogout }) {
  if (role === "admin") return <AdminDashboard onLogout={onLogout} />;
  if (role === "student") return <StudentDashboard onLogout={onLogout} />;
  if (role === "teacher") return <TeacherDashboard onLogout={onLogout} />;

  return (
    <div className="p-10 text-red-600">
      Unauthorized role
    </div>
  );
}
