export default function ExamCellDashboard({ onLogout }) {
  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <header className="bg-purple-700 text-white p-4 rounded mb-6">
        <h1 className="text-xl font-bold">Exam Cell Dashboard</h1>
        <p className="text-sm">Examinations & Evaluation Control</p>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">Exam Schedule</div>
        <div className="bg-white p-4 rounded shadow">Hall Tickets</div>
        <div className="bg-white p-4 rounded shadow">Result Processing</div>
      </div>

      <section className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Profile Settings</h2>
        <p className="text-sm text-gray-600">Update password & contact info</p>
      </section>

      <button
        onClick={onLogout}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
