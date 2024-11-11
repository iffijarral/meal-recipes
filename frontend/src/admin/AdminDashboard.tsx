import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminHome from "./pages/AdminHome";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";

// Define the functional component with React.FC
const AdminDashboard: React.FC = () => {
  return (
    <div>      
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
