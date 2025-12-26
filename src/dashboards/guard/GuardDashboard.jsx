export default function GuardDashboard({ onLogout }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-gray-800 text-white p-4 rounded mb-6">
        <h1 className="text-xl font-bold">Security Dashboard</h1>
      </header>

      <div className="bg-white p-4 rounded shadow mb-6">
        Entry Logs, Visitor Records, Alerts
      </div>

      <button onClick={onLogout} className="bg-red-600 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
}
