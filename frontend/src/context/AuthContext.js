import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/auth/user`,
          { withCredentials: true }
        );
        setUser(response.data);
      } catch (err) {
        console.log("Not authenticated");
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    await axios.get(
      `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/auth/logout`,
      { withCredentials: true }
    );
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
