import React, { useState } from "react";
import "./login.css";

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [dark, setDark] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Allowed domains
  const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "email.com"];

  const isValidEmail = (email) => {
    if (!email.includes("@")) return false;
    const [_, domain] = email.split("@");
    return allowedDomains.includes(domain);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!isValidEmail(email)) {
      newErrors.email =
        "Please use gmail.com, yahoo.com, outlook.com, or email.com";
    }
    if (password.length < 8) {
      newErrors.password = "Password should be at least 8 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // Here you’d call backend API (login or signup)
      setTimeout(() => {
        onLogin?.();
      }, 1000);
    }
  };

  return (
    <div className={`login-page ${dark ? "dark" : ""}`}>
      {/* 🌙 Dark Mode Toggle */}
      <label className="switch">
        <input
          type="checkbox"
          checked={dark}
          onChange={() => setDark(!dark)}
        />
        <span className="slider"></span>
      </label>

      {/* 🧾 Login/Signup Card */}
      <div className="login-wrapper">
        <form onSubmit={handleSubmit} noValidate>
          <h2>{isLogin ? "Login to MULLAI" : "Sign Up for MULLAI"}</h2>

          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
            />
            <label>Email Address</label>
            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
            />
            <label>Password</label>
            <span
              className="toggle"
              onClick={() => setShowPassword(!showPassword)}
              title="Show/Hide Password"
            >
              👁
            </span>
            {errors.password && (
              <small className="error">{errors.password}</small>
            )}
          </div>

          {!isLogin && (
            <div className="input-group">
              <input type="text" placeholder="Full Name" required />
              <label>Full Name</label>
            </div>
          )}

          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>

          <div className="toggle-link">
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </span>
          </div>
        </form>
      </div>

      {/* 🎉 Success Toast */}
      {showToast && (
        <div className="toast show">
          {isLogin ? "Login successful!" : "Signup successful!"}
        </div>
      )}
    </div>
  );
}

export default Login;