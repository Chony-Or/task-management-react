import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function AdminUserManagement({ users, setUsers }) {
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "", role: "", team_id: "" });
  const [teams, setTeams] = useState([]);

  // Fetch teams once
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${API_URL}/teams`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setTeams(res.data.data || res.data)) // handle both array and {data: []}
    .catch(() => console.error("Failed to load teams"));
  }, []);

  const saveUser = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `${API_URL}/users/${id}`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(u => u.id === id ? res.data : u));
      setEditingUser(null);
    } catch {
      alert("Failed to update user");
    }
  };

  const toggleActive = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.patch(
        `${API_URL}/users/${id}/toggle-active`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(u => u.id === id ? res.data : u));
    } catch {
      alert("Failed to toggle active status");
    } 
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <div className="max-h-[40vh] overflow-y-auto border border-gray-200 rounded-lg">
      
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Team</th>
              <th className="p-2">Active</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t">
                {/* Name */}
                <td className="p-2">
                  {editingUser === user.id ? (
                    <input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  ) : user.name}
                </td>

                {/* Email */}
                <td className="p-2">
                  {editingUser === user.id ? (
                    <input
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                  ) : user.email}
                </td>

                {/* Role */}
                <td className="p-2">
                  {editingUser === user.id ? (
                    <select
                      value={editData.role}
                      onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                    >
                      <option value="team_member">Team Member</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : user.role}
                </td>

                {/* Team dropdown */}
              <td className="p-2">
              {editingUser === user.id ? (
                  <select
                  value={editData.team_id}
                  onChange={(e) => setEditData({ ...editData, team_id: e.target.value })}
                  >
                  <option value="">Select team...</option>
                  {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                  </select>
              ) : user.team?.name || "Unassigned"}
              </td>


                {/* Active */}
                <td className="p-2">{user.is_active ? "Yes" : "No"}</td>

                {/* Actions */}
                <td className="p-2 flex gap-2">
                  {editingUser === user.id ? (
                    <button onClick={() => saveUser(user.id)} className="text-green-600">Save</button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingUser(user.id);
                        setEditData({
                          name: user.name,
                          email: user.email,
                          role: user.role,
                          team_id: user.team_id || "",
                        });
                      }}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                  )}
                  <button onClick={() => toggleActive(user.id)} className="text-red-600">
                    {user.is_active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
