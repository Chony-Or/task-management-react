import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function AddMemberForm({ onMemberAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("team_member");
  const [teamId, setTeamId] = useState("");
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${API_URL}/teams`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setTeams(res.data.data || res.data))
    .catch(() => console.error("Failed to load teams"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(`${API_URL}/users`, {
        name, email, password, role, team_id: teamId
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Member added successfully!");
      setName(""); setEmail(""); setPassword(""); setRole("team_member"); setTeamId("");
      if (onMemberAdded) onMemberAdded(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add member");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="border p-2 w-full" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-2 w-full" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border p-2 w-full" />
      <select value={role} onChange={(e) => setRole(e.target.value)} className="border p-2 w-full">
        <option value="team_member">Team Member</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>

      {/* Team dropdown */}
      <select value={teamId} onChange={(e) => setTeamId(e.target.value)} className="border p-2 w-full">
        <option value="">Select team...</option>
        {teams.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>

      <button type="submit" className="bg-green-600 text-white px-4 py-2">Add Member</button>
    </form>
  );
}
