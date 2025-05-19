import React from "react";

const Login = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="pgbody">
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
