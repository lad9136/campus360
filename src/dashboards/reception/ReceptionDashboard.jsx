export default function ReceptionDashboard({ onLogout }) {
  return (
    <div className="min-h-screen bg-green-50 p-6">
      <header className="bg-green-700 text-white p-4 rounded mb-6">
        <h1 className="text-xl font-bold">Reception Desk</h1>
        <p className="text-sm">Student & Visitor Services</p>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">Degree Requests</div>
        <div className="bg-white p-4 rounded shadow">Bonafide Letters</div>
        <div className="bg-white p-4 rounded shadow">Visitor Log</div>
      </div>

      <section className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold">Profile Settings</h2>
      </section>

      <button onClick={onLogout} className="bg-red-600 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
}
