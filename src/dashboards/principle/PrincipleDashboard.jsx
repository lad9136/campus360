import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

/* ================= ROLE ACCESS MAP ================= */
const ROLE_ACCESS = {
  principal: [
    "Department Management",
    "Add Roles",
    "Create Subject",
    "Assign Subject & Batch",
    "Attendance Overview",
    "Notices",
    "Academic Calendar",
    "Profile Management",
  ],
};

/* ================= SIDEBAR ITEM ================= */
function SidebarItem({ title, onClick, active, closeSidebar }) {
  return (
    <button
      onClick={() => {
        onClick();
        closeSidebar?.();
      }}
      className={`w-full text-left px-4 py-2 rounded-lg transition ${
        active
          ? "bg-emerald-600 text-white"
          : "text-emerald-100 hover:bg-emerald-700/40"
      }`}
    >
      {title}
    </button>
  );
}

export default function PrincipalDashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState("Department Management");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ================= DEPARTMENT STATE (COPIED AS IS) ================= */
  const [departments, setDepartments] = useState([]);
  const [deptSearch, setDeptSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const emptyDeptForm = {
    department_id: "",
    department_name: "",
  };

  const [deptFormData, setDeptFormData] = useState(emptyDeptForm);
  const [editingDeptId, setEditingDeptId] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments().finally(() => setLoading(false));
  }, []);

  async function fetchDepartments() {
    const { data } = await supabase.from("departments").select("*");
    setDepartments(data || []);
  }

  /* ===== CREATE ===== */
  async function handleCreateDepartment() {
    const exists = departments.some(
      (d) =>
        d.department_id.toLowerCase() ===
        deptFormData.department_id.trim().toLowerCase()
    );

    if (exists) {
      alert("Department already exists.");
      return;
    }

    const { error } = await supabase.from("departments").insert([
      {
        ...deptFormData,
        created_at: new Date(),
        updated_at: null,
      },
    ]);

    if (!error) {
      fetchDepartments();
      setDeptFormData(emptyDeptForm);
      alert("Department added");
    }
  }

  /* ===== UPDATE ===== */
  async function handleUpdateDepartment() {
    const { error } = await supabase
      .from("departments")
      .update({
        department_id: deptFormData.department_id,
        department_name: deptFormData.department_name,
        updated_at: new Date(),
      })
      .eq("department_id", editingDeptId);

    if (!error) {
      fetchDepartments();
      setShowEditModal(false);
      setDeptFormData(emptyDeptForm);
      setEditingDeptId(null);
      alert("Department updated");
    }
  }

  /* ===== DELETE ===== */
  async function handleDeleteDepartment(department_id) {
    const confirmDelete = window.confirm(
      "Deleting this department will remove all linked records. Continue?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("departments")
      .delete()
      .eq("department_id", department_id);

    if (!error) fetchDepartments();
  }

  const filteredDepartments = departments.filter((d) =>
    `${d.department_id} ${d.department_name}`
      .toLowerCase()
      .includes(deptSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-semibold">
        Loading Principal Dashboard...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="h-screen flex bg-stone-100 overflow-hidden">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72
          bg-linear-to-b from-emerald-900 to-emerald-800
          text-white flex flex-col
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
        `}
      >
        <div className="px-6 py-5 text-xl font-bold border-b border-emerald-700">
          Principal Console
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
         {ROLE_ACCESS.principal.map((item) => (
         <SidebarItem
           key={item}
           title={item}
           active={activeSection === item}
           onClick={() => setActiveSection(item)}
           closeSidebar={() => setSidebarOpen(false)}
          />
))}

        </nav>

        <div className="p-4 border-t border-emerald-700">
          <button
            onClick={onLogout}
            className="w-full bg-rose-600 py-2 rounded-lg hover:bg-rose-700"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-8 md:ml-72 overflow-y-auto">
        {/* MOBILE HEADER */}
        <div className="md:hidden flex items-center mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded hover:bg-stone-200"
          >
            ☰
          </button>
          <h1 className="ml-3 text-lg font-semibold text-emerald-900">
            Principal Dashboard
          </h1>
        </div>

        {/* ================= DEPARTMENT UI (UNCHANGED LOGIC) ================= */}
        {activeSection === "Department Management" && (
          <>
            <h2 className="text-2xl font-semibold text-emerald-900 mb-6">
              Department Management
            </h2>

            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                Add Department
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="border px-3 py-2 rounded"
                  placeholder="Department ID"
                  value={deptFormData.department_id}
                  onChange={(e) =>
                    setDeptFormData({
                      ...deptFormData,
                      department_id: e.target.value,
                    })
                  }
                />

                <input
                  className="border px-3 py-2 rounded"
                  placeholder="Department Name"
                  value={deptFormData.department_name}
                  onChange={(e) =>
                    setDeptFormData({
                      ...deptFormData,
                      department_name: e.target.value,
                    })
                  }
                />

                <button
                  onClick={handleCreateDepartment}
                  className="col-span-2 bg-emerald-600 text-white py-2 rounded-lg"
                >
                  Add Department
                </button>
              </div>
            </div>

            <input
              className="mb-6 w-full border px-3 py-2 rounded"
              placeholder="Search Department"
              value={deptSearch}
              onChange={(e) => setDeptSearch(e.target.value)}
            />

            <div className="grid gap-4">
              {filteredDepartments.map((d) => (
                <div
                  key={d.department_id}
                  className="bg-white rounded-xl shadow p-4 flex justify-between"
                >
                  <div>
                    <p className="text-sm text-gray-500">
                      Department ID
                    </p>
                    <p className="font-semibold">
                      {d.department_id}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Department Name
                    </p>
                    <p>{d.department_name}</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setDeptFormData(d);
                        setEditingDeptId(d.department_id);
                        setShowEditModal(true);
                      }}
                      className="text-emerald-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteDepartment(d.department_id)
                      }
                      className="text-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}


        {/* ================= CREATE SUBJECT UI ================= */}
        {activeSection === "Create Subject" && (
  <>
    <h2 className="text-2xl font-semibold text-emerald-900 mb-6">
      Subject Creation & Assignment
    </h2>

    {/* CREATE SUBJECT */}
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        Create Subject
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <input className="border px-3 py-2 rounded" placeholder="Subject Code" />
        <input className="border px-3 py-2 rounded" placeholder="Subject Name" />

        <select className="border px-3 py-2 rounded">
          <option>Select Department</option>
        </select>

        <select className="border px-3 py-2 rounded">
          <option>Select Semester</option>
        </select>

        <button className="col-span-2 bg-emerald-600 text-white py-2 rounded-lg">
          Create Subject
        </button>
      </div>
    </div>

    {/* ASSIGN SUBJECT */}
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        Assign Subject
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <select className="border px-3 py-2 rounded">
          <option>Select Subject</option>
        </select>

        <select className="border px-3 py-2 rounded">
          <option>Select Batch</option>
        </select>

        <select className="border px-3 py-2 rounded col-span-2">
          <option>Select Active Teacher</option>
        </select>

        <button className="col-span-2 bg-amber-500 text-white py-2 rounded-lg">
          Assign Subject
        </button>
      </div>
    </div>
  </>
)}

     
     {/* ================= ATTENDANCE OVERVIEW UI ================= */}
     {activeSection === "Attendance Overview" && (
  <>
    <h2 className="text-2xl font-semibold text-emerald-900 mb-6">
      Attendance Overview
    </h2>

    {/* FILTER BAR */}
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <div className="grid grid-cols-4 gap-4">
        <select className="border px-3 py-2 rounded">
          <option>Select Department</option>
        </select>

        <select className="border px-3 py-2 rounded">
          <option>Select Batch</option>
        </select>

        <select className="border px-3 py-2 rounded">
          <option>Select Role</option>
          <option>Student</option>
          <option>Teacher</option>
        </select>

        <input type="date" className="border px-3 py-2 rounded" />
      </div>
    </div>

    {/* ATTENDANCE SUMMARY */}
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-sm text-slate-500">Total Present</p>
        <p className="text-3xl font-bold text-emerald-600">92%</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-sm text-slate-500">Total Absent</p>
        <p className="text-3xl font-bold text-rose-600">8%</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-sm text-slate-500">Low Attendance Alerts</p>
        <p className="text-3xl font-bold text-amber-500">6</p>
      </div>
    </div>

    {/* TABLE PLACEHOLDER */}
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">
        Attendance Records
      </h3>

      <div className="text-slate-500 text-sm">
        Attendance records table will appear here.
      </div>
    </div>
  </>
)}

      {/* ================= ACADEMIC CALENDAR UI ================= */}
      {activeSection === "Academic Calendar" && (
  <>
    <h2 className="text-2xl font-semibold text-emerald-900 mb-6">
      Academic Calendar
    </h2>

    {/* CREATE EVENT */}
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        Create Academic Event
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <input
          className="border px-3 py-2 rounded col-span-2"
          placeholder="Event Title (e.g. Semester End Exam)"
        />

        <select className="border px-3 py-2 rounded">
          <option>Apply To</option>
          <option>Entire Institute</option>
          <option>Specific Department</option>
          <option>Specific Batch</option>
        </select>

        <select className="border px-3 py-2 rounded">
          <option>Select Department / Batch</option>
        </select>

        <input type="date" className="border px-3 py-2 rounded" />
        <input type="date" className="border px-3 py-2 rounded" />

        <textarea
          className="border px-3 py-2 rounded col-span-2"
          rows={3}
          placeholder="Event Description"
        />

        <button className="col-span-2 bg-emerald-600 text-white py-2 rounded-lg">
          Publish Event
        </button>
      </div>
    </div>

    {/* CALENDAR LIST */}
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        Published Academic Events
      </h3>

      <div className="space-y-3">
        <div className="border rounded-lg p-4 flex justify-between">
          <div>
            <p className="font-semibold">Internal Assessment – I</p>
            <p className="text-sm text-slate-500">
              10 Aug 2025 – 15 Aug 2025 | All Departments
            </p>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
            Active
          </span>
        </div>
      </div>
    </div>
  </>
)}
 
      
       {/* ================= NOTICE BROADCASTING UI ================= */}
      {activeSection === "Notices" && (
  <>
    <h2 className="text-2xl font-semibold text-emerald-900 mb-6">
      Notice Broadcasting
    </h2>

    {/* CREATE NOTICE */}
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        Create Notice
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <input
          className="border px-3 py-2 rounded col-span-2"
          placeholder="Notice Title"
        />

        <select className="border px-3 py-2 rounded">
          <option>Target Audience</option>
          <option>All Users</option>
          <option>Teachers Only</option>
          <option>Students Only</option>
        </select>

        <select className="border px-3 py-2 rounded">
          <option>Department / Batch (Optional)</option>
        </select>

        <select className="border px-3 py-2 rounded">
          <option>Priority</option>
          <option>Normal</option>
          <option>High</option>
          <option>Urgent</option>
        </select>

        <input type="date" className="border px-3 py-2 rounded" />

        <textarea
          className="border px-3 py-2 rounded col-span-2"
          rows={4}
          placeholder="Notice Description"
        />

        <button className="col-span-2 bg-amber-500 text-white py-2 rounded-lg">
          Publish Notice
        </button>
      </div>
    </div>

    {/* NOTICE LIST */}
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        Published Notices
      </h3>

      <div className="space-y-3">
        <div className="border rounded-lg p-4">
          <p className="font-semibold">
            Holiday Declaration – Independence Day
          </p>
          <p className="text-sm text-slate-500">
            Target: All Users | Priority: High
          </p>
        </div>
      </div>
    </div>
  </>
)}


       {/* ================= PROFILE MANAGEMENT UI ================= */}
        {activeSection === "Profile Management" && (
  <>
    <h2 className="text-2xl font-semibold text-emerald-900 mb-6">
      Profile Management
    </h2>

    {/* PROFILE INFO */}
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        Principal Information
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <input className="border px-3 py-2 rounded" placeholder="Full Name" />
        <input className="border px-3 py-2 rounded" placeholder="Designation" />

        <input
          className="border px-3 py-2 rounded col-span-2 bg-slate-100 cursor-not-allowed"
          value="Logged-in Principal Email"
          disabled
        />

        <input
          className="border px-3 py-2 rounded"
          placeholder="Contact Number"
        />

        <input
          className="border px-3 py-2 rounded"
          placeholder="Office Location"
        />

        <button className="col-span-2 bg-emerald-600 text-white py-2 rounded-lg">
          Save Profile
        </button>
      </div>
    </div>

    {/* PASSWORD CHANGE */}
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-rose-600">
        Change Password
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="password"
          className="border px-3 py-2 rounded col-span-2"
          placeholder="Current Password"
        />

        <input
          type="password"
          className="border px-3 py-2 rounded"
          placeholder="New Password"
        />

        <input
          type="password"
          className="border px-3 py-2 rounded"
          placeholder="Confirm New Password"
        />

        <p className="col-span-2 text-xs text-slate-500">
          Password must be at least 8 characters and include a special symbol.
        </p>

        <button className="col-span-2 bg-rose-600 text-white py-2 rounded-lg">
          Update Password
        </button>
      </div>
    </div>
  </>
)}

      </main>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl w-96 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Edit Department
            </h3>

            <input
              className="border px-3 py-2 rounded w-full mb-3"
              value={deptFormData.department_id}
              onChange={(e) =>
                setDeptFormData({
                  ...deptFormData,
                  department_id: e.target.value,
                })
              }
            />

            <input
              className="border px-3 py-2 rounded w-full mb-4"
              value={deptFormData.department_name}
              onChange={(e) =>
                setDeptFormData({
                  ...deptFormData,
                  department_name: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateDepartment}
                className="px-4 py-2 bg-emerald-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
