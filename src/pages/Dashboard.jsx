import { useState, useEffect } from "react";
import axios from "axios";
import AddMemberForm from "./AddMemberForm";
import AdminUserManagement from "./AdminUserManagement";
import AddTeamForm from "./AddTeamForm";
import { API_URL } from "../config";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [role, setRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editData, setEditData] = useState({ title: "", description: "", priority: "", due_date: "", assigned_to: "" });

useEffect(() => {
  const token = localStorage.getItem("token");

  // Fetch logged-in user info first
  axios.get(`${API_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then(res => {
    setRole(res.data.role);
    setCurrentUserId(res.data.id);

    //  Decide which API to call based on role
    let url;
    if (res.data.role === "admin" || res.data.role === "manager") {
      url = `${API_URL}/admin/tasks`;   // all tasks
    } else {
      url = `${API_URL}/member/tasks`;  // only assigned tasks
    }

    axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setTasks(res.data))
      .catch(() => alert("Failed to load tasks"));
  });

  // Fetch all users (for assigning tasks)
  axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then(res => setUsers(res.data));
}, []);



  const addTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(`${API_URL}/tasks`, {
        title: newTask,
        description,
        priority,
        due_date: dueDate,
        assigned_to: assignedTo || null,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([...tasks, res.data]);
      setNewTask(""); setDescription(""); setPriority("medium"); setDueDate(""); setAssignedTo("");
    } catch {
      alert("Failed to add task");
    }
  };


  // const updateStatus = async (taskId, newStatus) => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     const res = await axios.patch(`http://localhost:8000/api/tasks/${taskId}/status`, {
  //       status: newStatus,
  //     }, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setTasks(tasks.map(t => t.id === taskId ? res.data : t));
  //   } catch {
  //     alert("Invalid status transition");
  //   }
  // };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const saveTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.patch(`${API_URL}/tasks/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.map(t => t.id === id ? res.data : t));
      setEditingTask(null);
    } catch (err) {
      alert("Failed to update task");
      console.error(err.response?.data);
    }
  };


  // const softDelete = async (id) => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     const res = await axios.patch(`http://localhost:8000/api/tasks/${id}/status`, { status: "cancelled" }, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setTasks(tasks.map(t => t.id === id ? res.data : t));
  //   } catch {
  //     alert("Failed to delete task");
  //   }
  // };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8">Task Manager</h2>
        <nav className="flex flex-col gap-4">
          <a href="#manage-task" className="hover:text-indigo-400">Tasks</a>
          <a href="#" className="hover:text-indigo-400">Profile</a>
         
          {role === "admin" && (
            <>
              <a href="#add-member" className="hover:text-indigo-400">Add Member</a>
              <a href="#manage-users" className="hover:text-indigo-400">Manage Users</a>
            </>
          )}
          <button type="button" onClick={logout} className="text-left hover:text-indigo-400">Logout</button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-10 overflow-y-auto">
        <div id="manage-task">
          <h1 className="text-3xl font-bold mb-6">Add Tasks</h1>
          {/* Task Form */}
          <form onSubmit={addTask} className="space-y-3 mb-6">
            <input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Task title" className="border p-2 w-full" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="border p-2 w-full" />
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border p-2 w-full">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="border p-2 w-full" />
            {(role === "admin" || role === "manager") && (
              <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="border p-2 w-full">
                <option value="">Assign to...</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            )}
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2">Add Task</button>
          </form>

          {/* Manager/Admin Task Management Table */ }
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Tasks</h2>
            <div className="max-h-[40vh] overflow-y-auto border border-gray-200 rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Title</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Priority</th>
                    <th className="p-2">Due Date</th>
                    <th className="p-2">Assigned To</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks
                    .filter(task => {
                      // Show all tasks if admin/manager
                      if (role === "admin" || role === "manager") return true;
                      // Otherwise only show tasks assigned to current user
                      return task.assigned_to === currentUserId;
                    })
                    .map(task => (
                      <tr key={task.id} className="border-t">
                        <td className="p-2">
                          {role === "admin" && editingTask === task.id ? (
                            <input
                              value={editData.title}
                              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            />
                          ) : task.title}
                        </td>
                        <td className="p-2">
                          {role === "admin" && editingTask === task.id ? (
                            <input
                              value={editData.description}
                              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            />
                          ) : task.description}
                        </td>
                        <td className="p-2">
                          {role === "admin" && editingTask === task.id ? (
                            <select
                              value={editData.priority}
                              onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          ) : task.priority}
                        </td>
                        <td className="p-2">
                          {role === "admin" && editingTask === task.id ? (
                            <input
                              type="date"
                              value={editData.due_date}
                              onChange={(e) => setEditData({ ...editData, due_date: e.target.value })}
                            />
                          ) : task.due_date || "None"}
                        </td>
                        <td className="p-2">
                          {role === "admin" && editingTask === task.id ? (
                            <select
                              value={editData.assigned_to}
                              onChange={(e) => setEditData({ ...editData, assigned_to: e.target.value })}
                            >
                              <option value="">Unassigned</option>
                              {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                              ))}
                            </select>
                          ) : task.assigned_user?.name || "Unassigned"}
                        </td>
                        {/* <td className="p-2">{task.status}</td> */}
                        <td className="p-2">
                          {editingTask === task.id ? (
                            <select
                              value={editData.status}
                              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          ) : task.status}
                        </td>

                        <td className="p-2 flex gap-2">
                          {editingTask === task.id ? (
                            <button onClick={() => saveTask(task.id)} className="text-green-600">Save</button>
                          ) : (
                              <button
                                onClick={() => {
                                  setEditingTask(task.id);
                                  setEditData({
                                    title: task.title,
                                    description: task.description,
                                    priority: task.priority,
                                    due_date: task.due_date || "",
                                    assigned_to: task.assigned_user?.id || "",
                                    status: task.status,   
                                  });
                                }}
                                className="text-blue-600"
                              >
                                Edit
                              </button>
                          )}
                          {/* <button onClick={() => updateStatus(task.id, "completed")} className="text-indigo-600">Done</button>
                          <button onClick={() => softDelete(task.id)} className="text-red-600">Cancel</button> */}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Admin-only sections */}
        {role === "admin" && (
          <>
            <div id="add-team" className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Create New Team</h2>
              <AddTeamForm onTeamAdded={(newTeam) => {
                console.log("New team created:", newTeam);
              }} />
            </div>

            <div id="add-member" className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Add New Member</h2>
              <AddMemberForm onMemberAdded={(newUser) => setUsers([...users, newUser])} />
            </div>

            <div id="manage-users" className="mt-10">
              <AdminUserManagement users={users} setUsers={setUsers} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
