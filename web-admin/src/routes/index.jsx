import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import VocabularyPage from "../pages/VocabularyPage";
import ReviewPage from "../pages/ReviewPage";
import ErrorPage from "../pages/ErrorPage";
import TopicPage from "../pages/TopicPage";
import StreakPage from "../pages/StreakPage";
import PhaseKPage from "../pages/PhaseKPage";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/errors" element={<ErrorPage />} />
        <Route path="/topics" element={<TopicPage />} />
        <Route path="/streak" element={<StreakPage />} />
        <Route path="/phase-k" element={<PhaseKPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
