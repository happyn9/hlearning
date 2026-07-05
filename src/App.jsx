import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/Home/HomePage";
import Onboarding from "./Pages/Onboarding";
import CourseInfo from "./Pages/CourseInfo";
import Course from "./Pages/Course";
import Dashboard from "./Pages/Dashboard/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import TuitionDash from "./Pages/Tuition/TuitionDash";
import WorkspaceLayout from "./Pages/workspace/WorkspaceLayout";
import Form from "./Components/Form/Form";
import WorkspaceOnboarding from "./Pages/workspace/WorkspaceOnboarding";
import ProfilePage from "./Components/Home/ProfileModal";
import WorkspaceGate from "./Pages/workspace/WorkspaceGate";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import TeacherDashboard from "./Pages/Teach/TeacherDashboard";
import { Toaster } from "react-hot-toast";
import PaymentCallback from "./Pages/PaymentCallback";
import Dashboardtuition from "./Pages/Tuition/dash/Dashboardtuition";
import Hblog from "./Pages/Hblog";

function App() {

  
  return (
    <div>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/hblog" element={<Hblog />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />

        <Route path="/auth" element={<Form />} />
        <Route path="/workspace/onboarding" element={<WorkspaceOnboarding />} />

        <Route path="/workspace/:id" element={<WorkspaceLayout />} />
        <Route path="/workspace" element={<WorkspaceGate />} />
        <Route path="/tuition_dashboard/:label/hlearning" element={<Dashboardtuition />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        <Route path="/myprofile" element={<ProfilePage />} />

        <Route
          path="/admin/dashboard"
          element={
           <ProtectedRoute role="admin">
            <AdminDashboard />
           </ProtectedRoute>
          }
        />

        <Route
          path="/mydashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/info/:id"
          element={
              <CourseInfo />
          }
        />

        <Route
          path="/tuition/learning"
          element={
              <TuitionDash />
          }
        />

        <Route
          path="/course/:id"
          element={
            <ProtectedRoute>
              <Course />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;