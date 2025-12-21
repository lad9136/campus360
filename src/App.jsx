import { useState, useEffect} from "react";
import { Menu, X, LogIn, Eye, EyeOff } from "lucide-react";
import { loginUser, logoutUser,getCurrentSession} from "./auth/authService";
import DashboardRouter from "./dashboards/DashboardRouter";

export default function App() {
  /* -------------------- UI STATE -------------------- */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  /* -------------------- AUTH STATE -------------------- */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // session = { user, role }
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  useEffect(() => {
    async function restoreSession() {
      const existingSession = await getCurrentSession();

      if (existingSession) {
        setSession(existingSession);
      }

      setAuthLoading(false);
    }

      restoreSession();
    }, []);


  /* -------------------- LOGIN -------------------- */
  const handleLogin = async () => {
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    setError("");

    try {
      const sessionData = await loginUser(email, password);
      setSession(sessionData);
      setShowLoginForm(false);
      setSidebarOpen(false);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };


  /* -------------------- LOGOUT -------------------- */
  const handleLogout = async () => {
    await logoutUser();
    setSession(null);
  };

  /* -------------------- ROLE DASHBOARD -------------------- */
   if (authLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
      Loading...
    </div>
  );
  }

  if (session) {
    return (
      <DashboardRouter
        role={session.role}
        onLogout={handleLogout}
      />
    );
  }

  /* -------------------- PUBLIC HOMEPAGE -------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-blue-600 text-white shadow">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-lg font-bold">GV Acharya Institute</div>

          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a>Home</a>
            <a>About</a>
            <a>Courses</a>
            <a>Admissions</a>
            <a>Placements</a>
            <a>Campus360</a>
          </nav>

          <button
            onClick={() => setSidebarOpen(true)}
            className="w-11 h-11 flex items-center justify-center rounded-lg border-2 border-black/40 text-black/70 hover:border-black"
          >
            <Menu />
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-blue-800">
          Welcome to GV Acharya Institute
        </h1>
      </main>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => {
              setSidebarOpen(false);
              setShowLoginForm(false);
            }}
          />

          <aside className="fixed right-0 top-0 h-full w-72 bg-white z-50 shadow-xl p-6">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-lg font-bold text-blue-800">Menu</h2>
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  setShowLoginForm(false);
                }}
              >
                <X />
              </button>
            </div>

            <button
              onClick={() => setShowLoginForm(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              Login
            </button>
          </aside>
        </>
      )}

      {/* LOGIN MODAL */}
      {showLoginForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => setShowLoginForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
              Login
            </h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-4 py-2 mb-3"
            />

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-4 py-2 pr-10"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

              {/*log in button*/}
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className={`w-full py-2 rounded text-white ${
                  isLoggingIn
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </button>


            {error && (
              <p className="text-red-500 text-sm text-center mt-3">
                {error}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
