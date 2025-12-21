export default function TeacherDashboard({ onLogout }) {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
      <button
        onClick={onLogout}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
