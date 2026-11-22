import { useState } from "react";
import { api, readErrorMessage, readMessage } from "../../services/api";

interface UserRequest {
  name: string;
  username: string;
  password: string;
}

const AddUser = () => {
  const [formData, setFormData] = useState<UserRequest>({
    name: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      // POST /adduser - admin only, creates a USER account.
      const response = await api.post("/adduser", formData);

      setMessage(readMessage(response.data, "User created successfully."));
      setFormData({ name: "", username: "", password: "" });
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage(readErrorMessage(error, "Failed to add user."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Add User</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Username
          </label>

          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="At least 4 characters"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={4}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Add User"}
        </button>

        {message && (
          <p
            className={`text-center font-medium ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </section>
  );
};

export default AddUser;
