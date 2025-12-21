import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState("departments");

  /* ================= DEPARTMENT STATE ================= */
  const [departments, setDepartments] = useState([]);
  const [deptSearch, setDeptSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const emptyDeptForm = {
    department_id: "",
    department_name: "",
  };

  const [deptFormData, setDeptFormData] = useState(emptyDeptForm);
  const [editingDeptId, setEditingDeptId] = useState(null);

  /* ================= BATCH STATE ================= */
const [batches, setBatches] = useState([]);
const [batchSearch, setBatchSearch] = useState("");
const [showBatchEditModal, setShowBatchEditModal] = useState(false);

const emptyBatchForm = {
  batch_id: "",
  department_id: "",
  batch_program: "",
  admission_month_and_year: "",
  year_of_admission: "",
  division_in_admission_year: "",
};

const [batchFormData, setBatchFormData] = useState(emptyBatchForm);
const [editingBatchId, setEditingBatchId] = useState(null);


  /* ================= FETCH ================= */
  useEffect(() => {
    fetchDepartments();
    fetchBatches();
  }, []);

  async function fetchDepartments() {
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setDepartments(data || []);
  }

  async function fetchBatches() {
  const { data, error } = await supabase
    .from("batches")
    .select("*")
    .order("created_at", { ascending: false });

  if (!error) setBatches(data || []);
}
  
  /* ================= DEPARTMENT FORM HANDLERS ================= */
  /* ================= DEPARTMENT CREATE ================= */
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

  /* ================= DEPARTMENT UPDATE ================= */
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

  /* ================= DEPARTMENT DELETE ================= */
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

  /* ================= DEPARTMENT FILTER ================= */
  const filteredDepartments = departments.filter((d) =>
    `${d.department_id} ${d.department_name}`
      .toLowerCase()
      .includes(deptSearch.toLowerCase())
  );

    /* ================= BATCH FORM HANDLERS ================= */
    /* ================= BATCH CREATE ================= */
    async function handleCreateBatch() {
      const exists = batches.some(
        (b) => b.batch_id === batchFormData.batch_id
      );
          if (
        !batchFormData.batch_id ||
        !batchFormData.department_id ||
        !batchFormData.batch_program ||
        !batchFormData.admission_year
      ) {
        alert("Please fill all required batch fields");
        return;
      }

      if (exists) {
        alert("Batch already exists.");
        return;
      }

      const { error } = await supabase.from("batches").insert([
            {
              ...batchFormData,
              admission_year: Number(batchFormData.admission_year),
              created_at: new Date(),
              updated_at: null,
            },
          ]);

          if (error) {
            console.error(error);
            alert(error.message);
            return;
          }

          fetchBatches();
          setBatchFormData(emptyBatchForm);
          alert("Batch added");
        }

      /* ================= BATCH UPDATE ================= */
    async function handleUpdateBatch() {
      const { error } = await supabase
        .from("batches")
        .update({
          ...batchFormData,
          updated_at: new Date(),
        })
        .eq("batch_id", editingBatchId);

      if (!error) {
        fetchBatches();
        setShowBatchEditModal(false);
        setBatchFormData(emptyBatchForm);
        setEditingBatchId(null);
        alert("Batch updated");
      }
    }

      /* ================= BATCH DELETE ================= */
    async function handleDeleteBatch(batch_id) {
      const confirmDelete = window.confirm(
        "If you delete the batch then all the student info within the batch will vanish from the database"
      );
      if (!confirmDelete) return;

      const { error } = await supabase
        .from("batches")
        .delete()
        .eq("batch_id", batch_id);

      if (!error) fetchBatches();
    }

    /* ================= BATCH FILTER ================= */
    const filteredBatches = batches.filter((b) =>
      `${b.batch_id}`.includes(batchSearch)
    );

/*========s======== SIDEBAR ITEM COMPONENT ================= */
    function SidebarItem({ title, onClick, active }) {
      return (
        <button
          onClick={onClick}
          className={`w-full text-left px-4 py-2 rounded ${
            active ? "bg-blue-600" : "hover:bg-slate-700"
          }`}
        >
          {title}
        </button>
      );
    }

  /* ================= DEPARTMENT UI ================= */
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col">
        <div className="px-6 py-5 text-xl font-bold border-b border-slate-700">
          Campus360 Admin
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <SidebarItem
            title="Department Management"
            active={activeSection === "departments"}
            onClick={() => setActiveSection("departments")}
          />

          <SidebarItem
            title="Batch Management"
            active={activeSection === "batches"}
            onClick={() => setActiveSection("batches")}
          />

          <SidebarItem
            title="Add User"
            active={activeSection === "add-user"}
            onClick={() => setActiveSection("add-user")}
          />

          <SidebarItem
            title="Global Notice"
            active={activeSection === "global-notice"}
            onClick={() => setActiveSection("global-notice")}
          />

          <SidebarItem
            title="Data Backup"
            active={activeSection === "data-backup"}
            onClick={() => setActiveSection("data-backup")}
          />

          <SidebarItem
            title="Complaints & Messages"
            active={activeSection === "complaints"}
            onClick={() => setActiveSection("complaints")}
          />

          <SidebarItem
            title="Audit Logs"
            active={activeSection === "audit-logs"}
            onClick={() => setActiveSection("audit-logs")}
          />

          <SidebarItem
            title="Profile Settings"
            active={activeSection === "profile-settings"}
            onClick={() => setActiveSection("profile-settings")}
          />
        </nav>


        <div className="p-4 border-t border-slate-700">
          <button
            onClick={onLogout}
            className="w-full bg-red-600 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
<main className="flex-1 p-8">
  {activeSection === "departments" && (
    <>
      {/* HEADER */}
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Department Management
      </h2>

      {/* ADD DEPARTMENT BOARD */}
      <div className="bg-white rounded shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Add Department</h3>
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
            className="col-span-2 bg-blue-600 text-white py-2 rounded"
          >
            Add Department
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search by Department ID or Name"
        value={deptSearch}
        onChange={(e) => setDeptSearch(e.target.value)}
        className="mb-6 w-full border px-3 py-2 rounded"
      />

      {/* DEPARTMENT LIST */}
      <div className="grid gap-4">
        {filteredDepartments.map((d) => (
          <div
            key={d.department_id}
            className="bg-white rounded shadow p-4 flex justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">Department ID</p>
              <p className="font-semibold">{d.department_id}</p>

              <p className="text-sm text-gray-500 mt-1">Department Name</p>
              <p>{d.department_name}</p>

              <p className="text-xs text-gray-500 mt-2">
                Created: {new Date(d.created_at).toLocaleString()}
                {d.updated_at && (
                  <> | Updated: {new Date(d.updated_at).toLocaleString()}</>
                )}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setDeptFormData(d);
                  setEditingDeptId(d.department_id);
                  setShowEditModal(true);
                }}
                className="text-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteDepartment(d.department_id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )}

  {/* ================= BATCH UI ================= */}
    {activeSection === "batches" && (
      <>
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Batch Management
        </h2>

        {/* ADD BATCH BOARD */}
        <div className="bg-white rounded shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Batch</h3>

          <div className="grid grid-cols-2 gap-4">
            <input className="border px-3 py-2 rounded"
              placeholder="Batch ID"
              value={batchFormData.batch_id}
              onChange={(e)=>setBatchFormData({...batchFormData,batch_id:e.target.value})}
            />

            {/* Department Selection */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Department
                </label>

                {departments.length === 0 ? (
                  <div className="border border-red-300 bg-red-50 text-red-700 text-sm px-3 py-2 rounded">
                    No department is available or created. Please add a department first.
                  </div>
                ) : (
                  <select
                    className="border px-3 py-2 rounded w-full"
                    value={batchFormData.department_id}
                    onChange={(e) =>
                      setBatchFormData({
                        ...batchFormData,
                        department_id: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Department</option>

                    {departments.map((dept) => (
                      <option
                        key={dept.department_id}
                        value={dept.department_id}
                      >
                        {dept.department_id} – {dept.department_name}
                      </option>
                    ))}
                  </select>
                )}
              </div>


            <input className="border px-3 py-2 rounded"
              placeholder="Program (BE / B.Tech)"
              value={batchFormData.batch_program}
              onChange={(e)=>setBatchFormData({...batchFormData,batch_program:e.target.value})}
            />

            <input className="border px-3 py-2 rounded"
              placeholder="Admission Year"
              value={batchFormData.admission_year}
              onChange={(e)=>setBatchFormData({...batchFormData,admission_year:e.target.value})}
            />
            
              <input className="border px-3 py-2 rounded col-span-2"
              placeholder="Division in Admission Year"
              value={batchFormData.division_in_admission_year}
              onChange={(e)=>setBatchFormData({...batchFormData,division_in_admission_year:e.target.value})}
            />
            

            <div className="col-span-2">
  <label className="block text-sm font-medium text-slate-700 mb-1">
    Batch Status
  </label>

  <p className="text-xs text-slate-500 mb-2">
    Select whether this batch is currently active or inactive.
  </p>

  <div className="flex gap-4">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="batch_status"
        value="active"
        checked={batchFormData.batch_status === "active"}
        onChange={(e) =>
          setBatchFormData({
            ...batchFormData,
            batch_status: e.target.value,
          })
        }
      />
            <span className="text-sm text-green-700 font-medium">Active</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="batch_status"
              value="inactive"
              checked={batchFormData.batch_status === "inactive"}
              onChange={(e) =>
                setBatchFormData({
                  ...batchFormData,
                  batch_status: e.target.value,
                })
              }
            />
            <span className="text-sm text-red-700 font-medium">Inactive</span>
          </label>
        </div>
      </div>

            <button
              onClick={handleCreateBatch}
              className="col-span-2 bg-blue-600 text-white py-2 rounded"
            >
              Add Batch
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <input
          className="mb-6 w-full border px-3 py-2 rounded"
          placeholder="Search by Batch ID"
          value={batchSearch}
          onChange={(e)=>setBatchSearch(e.target.value)}
        />

        {/* BATCH LIST (SAME CARD DESIGN) */}
        <div className="grid gap-4">
          {filteredBatches.map((b)=>(
            <div key={b.batch_id}
              className="bg-white rounded shadow p-4 flex justify-between">
              <div>
                <p className="font-semibold">Batch ID: {b.batch_id}</p>
                <p className="text-sm">
                  Dept: {b.department_id} | {b.batch_program}
                </p>
                <p className="text-sm mt-1">
                  Status:
                  <span
                    className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                      b.batch_status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {b.batch_status}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Created: {new Date(b.created_at).toLocaleString()}
                  {b.updated_at && (
                    <> | Updated: {new Date(b.updated_at).toLocaleString()}</>
                  )}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  className="text-blue-600"
                  onClick={()=>{
                    setBatchFormData(b);
                    setEditingBatchId(b.batch_id);
                    setShowBatchEditModal(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="text-red-600"
                  onClick={()=>handleDeleteBatch(b.batch_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
</main>

      {/* DEPARTMENT EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded shadow w-96 p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Department</h3>

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
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    
    {/* ================= BATCH EDIT MODAL ================= */}
    {showBatchEditModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        <div className="bg-white rounded shadow w-96 p-6">
          <h3 className="text-lg font-semibold mb-4">Edit Batch</h3>

          <input className="border px-3 py-2 rounded w-full mb-3"
            value={batchFormData.batch_program}
            onChange={(e)=>setBatchFormData({...batchFormData,batch_program:e.target.value})}
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={()=>setShowBatchEditModal(false)}
              className="px-4 py-2 border rounded"
            >
              No
            </button>
            <button
              onClick={handleUpdateBatch}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
     )}
    </div>
    );   

    /* ================= HELPERS ================= */

}