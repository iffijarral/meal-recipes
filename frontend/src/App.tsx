import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import VerifyEmailSuccess from "./pages/VerifyEmailSuccess";
import VerifyEmailFailed from "./pages/VerifyEmailFailed";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import AuthRedirect from "./components/AuthRedirect";
import Logout from "./components/Logout";

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRedirect>
              <Signup />
            </AuthRedirect>
          }
        />

        <Route path="/verify-email-success" element={<VerifyEmailSuccess />} />
        <Route path="/verify-email-failed" element={<VerifyEmailFailed />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  </AuthProvider>

);

export default App;
