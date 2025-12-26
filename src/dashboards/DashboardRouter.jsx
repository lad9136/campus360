import AdminDashboard from "./admin/AdminDashboard";
import PrincipalDashboard from "./principle/PrincipleDashboard";
import ExamCellDashboard from "./exam_cell/ExamCellDashboard";
import AdmissionDashboard from "./admission/AdmissionDashboard";
import ReceptionDashboard from "./reception/ReceptionDashboard";
import ScholarshipDashboard from "./scholarship/ScholarshipDashboard";
import AccountantDashboard from "./accountant/AccountantDashboard";
import LibraryDashboard from "./librarian/LibraryDashboard";
import HostelDashboard from "./hostel/HostelDashboard";
import GuardDashboard from "./guard/GuardDashboard";

export default function DashboardRouter({ role, onLogout }) {
  switch (role?.toLowerCase()) {
    case "principal":
      return <PrincipalDashboard onLogout={onLogout} />;

    case "admin":
      return <AdminDashboard onLogout={onLogout} />;

    case "exam_cell":
      return <ExamCellDashboard onLogout={onLogout} />;

    case "admission_officer":
      return <AdmissionDashboard onLogout={onLogout} />;

    case "receptionist":
      return <ReceptionDashboard onLogout={onLogout} />;

    case "scholarship_officer":
      return <ScholarshipDashboard onLogout={onLogout} />;

    case "accountant":
      return <AccountantDashboard onLogout={onLogout} />;

    case "library_officer":
      return <LibraryDashboard onLogout={onLogout} />;

    case "hostel_warden":
      return <HostelDashboard onLogout={onLogout} />;

    case "guard":
      return <GuardDashboard onLogout={onLogout} />;

    default:
      return (
        <div className="p-6 text-red-600 font-semibold">
          Unauthorized Access
        </div>
      );
  }
}
