import { Navigate, Route, Routes } from "react-router-dom";
import LearnLayout from "../layouts/LearnLayout";
import LoginPage from "../pages/LoginPage";
import LearnDashboardPage from "../pages/LearnDashboardPage";
import LearnReviewPage from "../pages/LearnReviewPage";
import LearnTopicPage from "../pages/LearnTopicPage";
import LearnErrorsPage from "../pages/LearnErrorsPage";
import LearnHistoryPage from "../pages/LearnHistoryPage";
import LearnVocabularyListPage from "../pages/LearnVocabularyListPage";
import LearnVocabularyDetailPage from "../pages/LearnVocabularyDetailPage";
import LearnWeakWordsPage from "../pages/LearnWeakWordsPage";
import LearnStreakPage from "../pages/LearnStreakPage";
import LearnProfilePage from "../pages/LearnProfilePage";
import LearnLearningLabPage from "../pages/LearnLearningLabPage";
import LearnDailySummaryPage from "../pages/LearnDailySummaryPage";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/learn"
        element={
          <PrivateRoute>
            <LearnLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<LearnDashboardPage />} />
        <Route path="review" element={<LearnReviewPage />} />
        <Route path="vocabulary" element={<LearnVocabularyListPage />} />
        <Route path="vocabulary/:id" element={<LearnVocabularyDetailPage />} />
        <Route path="weak-words" element={<LearnWeakWordsPage />} />
        <Route path="streak" element={<LearnStreakPage />} />
        <Route path="topic" element={<LearnTopicPage />} />
        <Route path="errors" element={<LearnErrorsPage />} />
        <Route path="history" element={<LearnHistoryPage />} />
        <Route path="lab" element={<LearnLearningLabPage />} />
        <Route path="summary" element={<LearnDailySummaryPage />} />
        <Route path="profile" element={<LearnProfilePage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
      <Route path="/" element={<Navigate to="/learn/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/learn/dashboard" replace />} />
    </Routes>
  );
}
