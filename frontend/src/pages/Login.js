import React from "react";

const Login = () => {
  const handleLogin = () => {
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    window.location.href = `${baseUrl}/auth/google`;
  };

  return (
    <div className="pgbody">
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
