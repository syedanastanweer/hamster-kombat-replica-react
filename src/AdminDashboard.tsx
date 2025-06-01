import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ADMIN_EMAIL = "devcodeanas@gmail.com";
const ADMIN_PASSWORD = "@Admin786";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        setUsers(userList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, [isAuthenticated]);

  const columns = [
    { name: "Name", selector: (row: User) => row.name, sortable: true },
    { name: "Username", selector: (row: User) => row.username, sortable: true },
    { name: "Email", selector: (row: User) => row.email, sortable: true },
    { name: "User ID", selector: (row: User) => row.id, sortable: false, wrap: true },
    { name: "Created At", selector: (row: User) => new Date(row.createdAt).toLocaleString(), sortable: true }
  ];

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    const blob = XLSX.write(wb, { bookType: "csv", type: "array" });
    saveAs(new Blob([blob]), "users.csv");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    const blob = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([blob]), "users.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Name", "Username", "Email", "User ID", "Created At"];
    const tableRows = users.map(u => [u.name, u.username, u.email, u.id, new Date(u.createdAt).toLocaleString()]);
    (doc as any).autoTable({ head: [tableColumn], body: tableRows });
    doc.save("users.pdf");
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-[#1d1d1d] p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-yellow-500 text-black font-bold py-2 rounded">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen py-10 px-4 flex justify-center text-white">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

        <div className="flex justify-end gap-2 mb-4">
          <button onClick={exportCSV} className="bg-blue-500 text-white px-3 py-1 rounded">Export CSV</button>
          <button onClick={exportExcel} className="bg-green-500 text-white px-3 py-1 rounded">Export Excel</button>
          <button onClick={exportPDF} className="bg-red-500 text-white px-3 py-1 rounded">Export PDF</button>
        </div>

        {loading ? (
          <p className="text-center">Loading users...</p>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            pagination
            highlightOnHover
            striped
            dense
            customStyles={{
              headCells: { style: { backgroundColor: "#333", color: "#fff" } },
              rows: { style: { backgroundColor: "#555", color: "#fff" } }
            }}
            noHeader
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
