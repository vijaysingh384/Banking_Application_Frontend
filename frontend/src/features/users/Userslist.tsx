import { useEffect, useState } from "react";
import { api, readErrorMessage } from "../../services/api";

interface User {
  id: number;
  userId?: number;
  name: string;
  username: string;
  role: string;
}

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");

      setUsers(response.data.dtos ?? []);
    } catch (err) {
      console.error(err);
      setError(readErrorMessage(err, "Failed to load users."));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600">{error}</div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow-lg">
      <div className="px-6 py-4 border-b">
        <h2 className="text-2xl font-bold text-gray-700">Users List</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left">User ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Username</th>
              <th className="px-6 py-3 text-left">Role</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  No Users Found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="px-6 py-4">{user.userId ?? user.id}</td>

                  <td className="px-6 py-4">{user.name}</td>

                  <td className="px-6 py-4">{user.username}</td>

                  <td className="px-6 py-4">
                    <span className="uppercase font-semibold text-blue-600">
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UsersList;
