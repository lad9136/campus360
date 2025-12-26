export default function AdmissionDashboard({ onLogout }) {
  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <header className="bg-blue-700 text-white p-4 rounded mb-6">
        <h1 className="text-xl font-bold">Admission Office</h1>
        <p className="text-sm">Student Admission Management</p>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">New Applications</div>
        <div className="bg-white p-4 rounded shadow">Document Verification</div>
        <div className="bg-white p-4 rounded shadow">Student Onboarding</div>
      </div>

      <section className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Profile</h2>
        <p className="text-sm">Change password / personal info</p>
      </section>

      <button onClick={onLogout} className="bg-red-600 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
}
