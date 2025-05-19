import { useContext } from "react";
import AuthContext from "./context/AuthContext";

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import Login from "./pages/Login";
import NewPostPage from "./pages/NewPostPage";
import ArticlesListPage from "./pages/ArticlesListPage";
import ArticlePage from "./pages/ArticlePage";

const AllRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/articles" element={<ArticlesListPage />} />
      <Route path="/articles/:name" element={<ArticlePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/newpost" element={user ? <NewPostPage /> : <Login />} />
    </Routes>
  );
};

export default AllRoutes;
