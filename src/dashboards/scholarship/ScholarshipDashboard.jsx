export default function ScholarshipDashboard({ onLogout }) {
  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <header className="bg-yellow-600 text-white p-4 rounded mb-6">
        <h1 className="text-xl font-bold">Scholarship Office</h1>
      </header>

      <div className="bg-white p-4 rounded shadow mb-6">
        Scholarship Applications, Verification, Disbursement
      </div>

      <button onClick={onLogout} className="bg-red-600 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
}
