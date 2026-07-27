import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function AddTeamForm({ onTeamAdded }) {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(`${API_URL}/teams`, {
        name,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Team created successfully!");
      setName("");
      if (onTeamAdded) onTeamAdded(res.data); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create team");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Team name"
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">
        Create Team
      </button>
    </form>
  );
}
