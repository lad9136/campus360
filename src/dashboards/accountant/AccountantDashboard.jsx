export default function AccountantDashboard({ onLogout }) {
  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <header className="bg-orange-700 text-white p-4 rounded mb-6">
        <h1 className="text-xl font-bold">Accounts Department</h1>
      </header>

      <div className="bg-white p-4 rounded shadow mb-6">
        Fees, Payments, Financial Reports
      </div>

      <button onClick={onLogout} className="bg-red-600 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
}
