import { useState,  useEffect} from "react";
import { supabase } from "@/lib/supabase";

export default function SetupPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  
 useEffect(() => {
  async function waitForSession() {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      setSessionReady(true);
    } else {
      setError("Invite link is invalid or already used.");
    }
  }

  waitForSession();
}, []);



  const handleSetPassword = async () => {
        const strongPassword =
         /^(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

      if (!strongPassword.test(password)) {
       setError(
         "Password must be 8+ chars, include uppercase, number & special symbol"
        );
       return;
     }


    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    // 1. Update auth password
    const { error: authError } = await supabase.auth.updateUser({
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Activate profile
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase
      .from("profiles")
      .update({ status: "active" })
      .eq("id", user.id);

    // 3. Redirect to dashboard
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white rounded shadow w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Set Your Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          className="w-full border px-3 py-2 rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border px-3 py-2 rounded mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        <button
  onClick={handleSetPassword}
  disabled={loading || !sessionReady}
  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
>
  {!sessionReady
    ? "Preparing secure session..."
    : loading
    ? "Setting password..."
    : "Save Password"}
</button>


      </div>
    </div>
  );
}
