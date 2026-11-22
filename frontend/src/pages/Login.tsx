import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { readErrorMessage } from "../services/api";

interface LoginForm {
  username: string;
  password: string;
}

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const routeState = location.state as
    | { from?: string; message?: string }
    | null;

  const redirectTo = routeState?.from ?? "/profile";
  const infoMessage = routeState?.message ?? "";

  const [formData, setFormData] = useState<LoginForm>({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const user = await login(formData);
      navigate(user.isAdmin ? "/users" : redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
      setError(readErrorMessage(err, "Invalid username or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto mt-20 bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Login</h2>
      <p className="text-gray-500 mb-6">
        Sign in to manage your accounts and loans.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Username
          </label>

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="username"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter Username"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter Password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {error && (
          <p className="text-center font-medium text-red-600">{error}</p>
        )}

        {!error && infoMessage && (
          <p className="text-center font-medium text-green-600">
            {infoMessage}
          </p>
        )}

        <p className="text-center text-gray-600">
          New to the bank?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold">
            Create an account
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
