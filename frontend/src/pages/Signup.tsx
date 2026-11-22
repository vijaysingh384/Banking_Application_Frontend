import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { readErrorMessage } from "../services/api";

interface SignupForm {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignupForm>({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
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

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const message = await signup({
        name: formData.name,
        username: formData.username,
        password: formData.password,
      });

      // The backend creates the user but does not start a session.
      navigate("/login", {
        replace: true,
        state: { message },
      });
    } catch (err) {
      console.error(err);
      setError(readErrorMessage(err, "Unable to create your account."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto mt-20 bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Sign Up</h2>
      <p className="text-gray-500 mb-6">
        Create your profile to open accounts and apply for loans.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter Full Name"
          />
        </div>

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
            placeholder="Choose Username"
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
            minLength={4}
            autoComplete="new-password"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="At least 4 characters"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Confirm Password
          </label>

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={4}
            autoComplete="new-password"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Confirm Password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        {error && (
          <p className="text-center font-medium text-red-600">{error}</p>
        )}

        <p className="text-center text-gray-600">
          Already registered?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Signup;
