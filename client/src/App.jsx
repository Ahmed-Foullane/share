import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import AdminRoute from './components/AdminRoute';
import DarkModeInitializer from './components/DarkModeInitializer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ArticleList from './pages/articles/ArticleList';
import ArticleDetail from './pages/articles/ArticleDetail';
import ArticleForm from './pages/articles/ArticleForm';
import QuestionList from './pages/questions/QuestionList';
import QuestionDetail from './pages/questions/QuestionDetail';
import QuestionForm from './pages/questions/QuestionForm';
import ProfilePage from './pages/profile/ProfilePage';
import FriendsPage from './pages/friends/FriendsPage';
import MessagesPage from './pages/messages/MessagesPage';

import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/users/UserManagement';
import ArticleManagement from './pages/admin/articles/ArticleManagement';
import QuestionManagement from './pages/admin/questions/QuestionManagement';
import CategoryManagement from './pages/admin/categories/CategoryManagement';
import TagManagement from './pages/admin/tags/TagManagement';
import CommentManagement from './pages/admin/comments/CommentManagement';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-white">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="articles">
          <Route index element={<ProtectedRoute><ArticleList /></ProtectedRoute>} />
          <Route path=":id" element={<ProtectedRoute><ArticleDetail /></ProtectedRoute>} />
          <Route path="create" element={<ProtectedRoute><ArticleForm /></ProtectedRoute>} />
          <Route path="edit/:id" element={<ProtectedRoute><ArticleForm /></ProtectedRoute>} />
          <Route path="search" element={<ProtectedRoute><ArticleList /></ProtectedRoute>} />
        </Route>

        <Route path="questions">
          <Route index element={<ProtectedRoute><QuestionList /></ProtectedRoute>} />
          <Route path=":id" element={<ProtectedRoute><QuestionDetail /></ProtectedRoute>} />
          <Route path="create" element={<ProtectedRoute><QuestionForm /></ProtectedRoute>} />
          <Route path="edit/:id" element={<ProtectedRoute><QuestionForm /></ProtectedRoute>} />
          <Route path="search" element={<ProtectedRoute><QuestionList /></ProtectedRoute>} />
        </Route>

        <Route path="categories/:id" element={<ProtectedRoute><ArticleList /></ProtectedRoute>} />
        <Route path="tags/:id" element={<ProtectedRoute><ArticleList /></ProtectedRoute>} />

        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
        <Route path="messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />

        <Route path="admin">
          <Route index element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="users" element={<AdminRoute><UserManagement /></AdminRoute>} />
          <Route path="articles" element={<AdminRoute><ArticleManagement /></AdminRoute>} />
          <Route path="questions" element={<AdminRoute><QuestionManagement /></AdminRoute>} />
          <Route path="categories" element={<AdminRoute><CategoryManagement /></AdminRoute>} />
          <Route path="tags" element={<AdminRoute><TagManagement /></AdminRoute>} />
          <Route path="comments" element={<AdminRoute><CommentManagement /></AdminRoute>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DarkModeInitializer />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
