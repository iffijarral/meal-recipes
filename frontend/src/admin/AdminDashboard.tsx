import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminHome from "./pages/AdminHome.js";

// Define the functional component with React.FC
const AdminDashboard: React.FC = () => {
  return (
    <div>      
      <Routes>
        <Route path="/" element={<AdminHome />} />        
      </Routes>
    </div>
  );
};

export default AdminDashboard;
