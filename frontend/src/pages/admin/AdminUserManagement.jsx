import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminNavbar from "../../components/AdminNavbar";
import {
  Users,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  Calendar,
  Shield,
  UserCheck,
  UserX,
  MoreVertical,
  RefreshCw,
  FileText,
} from "lucide-react";

export default function AdminUserManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showViewModal, setShowViewModal] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [updating, setUpdating] = useState(false);

  // Fetch users from database
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const response = await fetch("http://localhost:3000/api/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || data);
      } else {
        setMessage({ type: "error", text: "Failed to fetch users" });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDeleteUser = async (userId, userName) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const response = await fetch(`http://localhost:3000/api/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
        setMessage({ type: "success", text: `${userName} has been removed successfully.` });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: "Failed to delete user" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage({ type: "error", text: "Server error. Please try again." });
    }
    setShowDeleteModal(null);
  };

  // Toggle user block status
  const handleToggleBlock = async (userId, currentBlocked, userName) => {
    setUpdating(true);
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const response = await fetch(`http://localhost:3000/api/auth/users/${userId}/block`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isBlocked: !currentBlocked }),
      });

      if (response.ok) {
        setUsers(users.map((user) =>
          user._id === userId ? { ...user, isBlocked: !currentBlocked } : user
        ));
        setMessage({
          type: "success",
          text: `${userName} has been ${!currentBlocked ? "blocked" : "unblocked"}.`,
        });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      console.error("Error toggling block status:", error);
      setMessage({ type: "error", text: "Failed to update user status" });
    } finally {
      setUpdating(false);
    }
  };

  // Toggle admin status
  const handleToggleAdmin = async (userId, currentAdmin, userName) => {
    setUpdating(true);
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const response = await fetch(`http://localhost:3000/api/auth/users/${userId}/admin`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAdmin: !currentAdmin }),
      });

      if (response.ok) {
        setUsers(users.map((user) =>
          user._id === userId ? { ...user, isAdmin: !currentAdmin } : user
        ));
        setMessage({
          type: "success",
          text: `${userName} is now ${!currentAdmin ? "an admin" : "no longer an admin"}.`,
        });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      console.error("Error toggling admin status:", error);
      setMessage({ type: "error", text: "Failed to update admin status" });
    } finally {
      setUpdating(false);
    }
  };

  // Export users to CSV
  const exportToCSV = () => {
    const filtered = getFilteredUsers();
    const headers = ["Full Name", "Email", "Role", "Status", "Joined Date", "Last Login"];
    
    const csvData = filtered.map((user) => [
      user.fullName,
      user.email,
      user.isAdmin ? "Admin" : "Student",
      user.isBlocked ? "Blocked" : "Active",
      new Date(user.createdAt).toLocaleDateString(),
      user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter users based on search, role, and status
  const getFilteredUsers = () => {
    return users.filter((user) => {
      const matchesSearch =
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole =
        selectedRole === "all" ||
        (selectedRole === "admin" && user.isAdmin) ||
        (selectedRole === "student" && !user.isAdmin);
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && !user.isBlocked) ||
        (selectedStatus === "blocked" && user.isBlocked);
      return matchesSearch && matchesRole && matchesStatus;
    });
  };

  const filteredUsers = getFilteredUsers();
  const stats = {
    total: users.length,
    active: users.filter((u) => !u.isBlocked).length,
    blocked: users.filter((u) => u.isBlocked).length,
    admins: users.filter((u) => u.isAdmin).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar setSidebarOpen={setSidebarOpen} />
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="lg:pl-64 pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar setSidebarOpen={setSidebarOpen} />
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="lg:pl-64 pt-16">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage and monitor all platform users</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
              </div>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.active}</span>
              </div>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <UserX className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.blocked}</span>
              </div>
              <p className="text-sm text-gray-600">Blocked Users</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.admins}</span>
              </div>
              <p className="text-sm text-gray-600">Administrators</p>
            </div>
          </div>

          {/* Message Alert */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success" 
                ? "bg-green-50 border border-green-200 text-green-700" 
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              <AlertCircle size={20} />
              <span>{message.text}</span>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="student">Students</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
              <button
                onClick={fetchUsers}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-md transition flex items-center gap-2"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.fullName?.charAt(0) || "U"}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isAdmin 
                            ? "bg-purple-100 text-purple-700" 
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {user.isAdmin ? "Admin" : "Student"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                          user.isBlocked 
                            ? "bg-red-100 text-red-700" 
                            : "bg-green-100 text-green-700"
                        }`}>
                          {user.isBlocked ? <XCircle size={12} /> : <CheckCircle size={12} />}
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowViewModal(user)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleToggleBlock(user._id, user.isBlocked, user.fullName)}
                            disabled={updating}
                            className={`p-1 rounded transition ${
                              user.isBlocked 
                                ? "text-green-600 hover:bg-green-50" 
                                : "text-yellow-600 hover:bg-yellow-50"
                            }`}
                            title={user.isBlocked ? "Unblock User" : "Block User"}
                          >
                            {user.isBlocked ? <UserCheck size={18} /> : <UserX size={18} />}
                          </button>
                          <button
                            onClick={() => handleToggleAdmin(user._id, user.isAdmin, user.fullName)}
                            disabled={updating}
                            className={`p-1 rounded transition ${
                              user.isAdmin 
                                ? "text-purple-600 hover:bg-purple-50" 
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                            title={user.isAdmin ? "Remove Admin" : "Make Admin"}
                          >
                            <Shield size={18} />
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(user)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No users found matching your filters</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* View User Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
              <button onClick={() => setShowViewModal(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{showViewModal.fullName?.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{showViewModal.fullName}</h4>
                  <p className="text-sm text-gray-500">{showViewModal.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield size={16} className="text-gray-400" />
                <span className="text-gray-600">Role:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${showViewModal.isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                  {showViewModal.isAdmin ? "Administrator" : "Student"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle size={16} className="text-gray-400" />
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${showViewModal.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                  {showViewModal.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-gray-600">Joined:</span>
                <span className="text-gray-700">{new Date(showViewModal.createdAt).toLocaleString()}</span>
              </div>
              {showViewModal.lastLogin && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-gray-600">Last Login:</span>
                  <span className="text-gray-700">{new Date(showViewModal.lastLogin).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
            </div>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete <span className="font-semibold">{showDeleteModal.fullName}</span>?
            </p>
            <p className="text-gray-500 text-sm mb-6">
              This action cannot be undone. All user data will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteModal._id, showDeleteModal.fullName)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}