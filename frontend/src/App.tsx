import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import NotFound from "./pages/NotFound.js";
import VerifyEmailSuccess from "./pages/VerifyEmailSuccess.js";
import VerifyEmailFailed from "./pages/VerifyEmailFailed.js";
import { AuthProvider } from "./context/AuthContext.js";
import PrivateRoute from "./components/PrivateRoute.js";
import AuthRedirect from "./components/AuthRedirect.js";
import Logout from "./components/Logout.js";
import Template from "./admin/components/Template.js";
import AdminHome from "./admin/pages/AdminHome.js";
import Meals from "./admin/pages/Meals.js";
import MealForm from "./admin/components/MealForm.js";
import MainLayout from "./components/MainLayout.js";
import UserList from "./admin/components/UserList.js";
import ForgotPassword from "./pages/ForgotPassword.js";
import UpdateUser from "./admin/components/UpdateUser.js";



const App: React.FC = () => (
  <Router>
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} /> {/* Default child */}
        </Route>
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
        <Route
          path="/forgot-password"
          element={
            <AuthRedirect>
              <ForgotPassword />
            </AuthRedirect>
          }
        />
        <Route path="/verify-email-success" element={<VerifyEmailSuccess />} />
        <Route path="/verify-email-failed" element={<VerifyEmailFailed />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Template />}>
            <Route index element={<AdminHome />} />
            <Route path="meals" element={<Meals />} />
            <Route path="new-meal" element={<MealForm />} />
            <Route path="edit-meal/:mealId" element={<MealForm />} />
            <Route path="users" element={<UserList />} />
            <Route path="edit-user/:userId" element={<UpdateUser />} />
          </Route>
        </Route>

        {/* Catch-All for Unknown Routes */}
        <Route path="*" element={<NotFound />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </AuthProvider>
  </Router>

);

export default App;
