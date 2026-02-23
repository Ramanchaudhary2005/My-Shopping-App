import { useState } from "react";
import { Navbar } from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import "./signup.css";
import { loginLocal } from "../utils/auth";

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSignupSuccess(false);
    setUserExists(false);

    try {
      const response = await fetch("http://localhost:3900/api/v1/otps/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("OTP sent successfully. Check your email.");
        setStep(2);
      } else {
        setMessage(`Failed to send OTP: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSignupSuccess(false);
    setUserExists(false);

    try {
      const response = await fetch("http://localhost:3900/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Signup successful. Auto-login and redirecting...");
        setSignupSuccess(true);

        try {
          const token = data?.data?.token;
          const userData = data?.data?.user;

          if (token) {
            loginLocal(token, userData);
            setTimeout(() => {
              navigate("/");
            }, 1500);
          }
        } catch (error) {
          console.error("Error during auto-login:", error);
          setMessage("Signup successful. Please login.");
        }
      } else if (data.message && data.message.includes("already exists")) {
        setMessage("Signup failed: User already exists with this email.");
        setUserExists(true);
      } else {
        setMessage(`Signup failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleGoToLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  return (
    <div>
      <Navbar />
      <div className="signup-container">
        <div className="signup-card">
          <h2 className="signup-title">Signup</h2>

          {step === 1 && (
            <form className="signup-form" onSubmit={handleEmailSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Send OTP</button>
            </form>
          )}

          {step === 2 && (
            <form className="signup-form" onSubmit={handleSignupSubmit}>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Complete Signup</button>
              <p className="otp-message">
                OTP has been sent to <strong>{email}</strong>. Please check your inbox.
              </p>
            </form>
          )}

          {message && (
            <p style={{ marginTop: "15px" }}>
              {message}{" "}
              {(signupSuccess || userExists) && (
                <button
                  onClick={handleGoToLogin}
                  style={{
                    color: "blue",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Go to Login
                </button>
              )}
            </p>
          )}

          {loading && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <HashLoader color="#4F46E5" size={50} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { SignupPage };
