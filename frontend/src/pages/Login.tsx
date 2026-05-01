import { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
  const isAdmin = localStorage.getItem("isAdmin");

    if (isAdmin) {
      nav("/dashboard", { replace: true });
    }
  }, [nav]);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("isAdmin", "true");
        nav("/dashboard", { replace: true });
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Server error. Try again");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white rounded-2xl shadow-xl w-[360px] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-center p-6">
          <h2 className="text-2xl font-semibold">Sign In</h2>
          <p className="text-sm mt-1">
            Enter your credentials to access your account
          </p>
        </div>

        <div className="p-6">

          <input
            className="w-full border rounded-full px-4 py-2 mb-4 outline-none"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full border rounded-full px-4 py-2 mb-2 outline-none"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">
              {error}
            </p>
          )}

          <div className="flex justify-between text-sm mb-4">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <span className="text-indigo-500 cursor-pointer">
              Forgot password?
            </span>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-2 rounded-full font-medium hover:opacity-90"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm mt-4">
            Not a member?{" "}
            <span className="text-indigo-500 cursor-pointer">
              Signup now
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}