import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="container">
      <div id="navlinks">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/articles">Articles</Link></li>
          {user && <li><Link to="/newpost">New Post</Link></li>}
        </ul>
      </div>
      <div id="loginbtn">
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <Link to={"/login"}>
            <button>Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
