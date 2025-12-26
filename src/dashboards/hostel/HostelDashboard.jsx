export default function HostelDashboard({ onLogout }) {
  return (
    <div className="min-h-screen bg-rose-50 p-6">
      <header className="bg-rose-700 text-white p-4 rounded mb-6">
        <h1 className="text-xl font-bold">Hostel Management</h1>
      </header>

      <div className="bg-white p-4 rounded shadow mb-6">
        Room Allocation, Attendance, Complaints
      </div>

      <button onClick={onLogout} className="bg-red-600 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
}
