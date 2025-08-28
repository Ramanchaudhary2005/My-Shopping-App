import { useState } from "react";
import { Navbar } from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import "./signup.css"; 
import { loginLocal } from "../utils/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3900/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("🎉 Login successful! Redirecting...");
        try {
          const userId = data?.data?.user?._id;
          if (userId) {
            localStorage.setItem('userId', userId);
          }
          loginLocal();
        } catch {}
        setTimeout(() => {
          setLoading(false);
          // redirect to dashboard or home page
          navigate("/");
        }, 1000);
      } else {
        setLoading(false);
        setMessage(`❌ Login failed: ${data.message || "Invalid credentials"}`);
      }
    } catch (error) {
      setLoading(false);
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="signup-container">
        <div className="signup-card">
          <h2 className="signup-title">Login</h2>

          {/* Login Form */}
          <form className="signup-form" onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>

          {/* ✅ Message */}
          {message && <p style={{ marginTop: "15px" }}>{message}</p>}

          {/* ✅ Loader */}
          {loading && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <HashLoader color="#4F46E5" size={50} />
            </div>
          )}

          {/* ✅ Signup redirect */}
          <p style={{ marginTop: "20px" }}>
            Not registered?{" "}
            <button
              onClick={() => navigate("/signup")}
              style={{
                color: "blue",
                textDecoration: "underline",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Go to Signup
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export { LoginPage };
