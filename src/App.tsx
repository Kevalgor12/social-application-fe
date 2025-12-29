import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/user/Profile";
import UserPosts from "./pages/user/posts/Posts";
import Posts from "./pages/posts/Posts";
import Post from "./pages/posts/Post";
import PostAdd from "./pages/posts/PostAdd";
import PostEdit from "./pages/posts/PostEdit";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/me/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/posts" element={<Posts />} />
        <Route
          path="/posts/add"
          element={
            <ProtectedRoute>
              <PostAdd />
            </ProtectedRoute>
          }
        />
        <Route path="/posts/:id" element={<Post />} />{" "}
        <Route
          path="/posts/:id/edit"
          element={
            <ProtectedRoute>
              <PostEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/me/posts"
          element={
            <ProtectedRoute>
              <UserPosts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
