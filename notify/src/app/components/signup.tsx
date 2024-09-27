import React, { useState } from "react";
import "../styles/signup.css"; // Import the CSS file
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import Tiles from "./Tiles";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Typography } from "antd";
const { Title } = Typography;
const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }

      const data = await response.json();
      console.log("Signup successful:", data);
      // Handle successful signup (e.g., redirect to login page)
      router.push("/login"); // Redirect to the login page immediately
    } catch (error) {
      console.error("Error during signup:", error);
      if (error instanceof Error) {
        setError(
          error.message ||
          "Failed to sign up. Please check your details and try again."
        );
      } else {
        setError("Failed to sign up. Please check your details and try again.");
      }
    }
  };

  return (
    <>
      <div id="container">
        <Tiles />
      </div>
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <Title style={{ textAlign: "center" }}>Sign Up</Title>
          {error && <div className="error-message">{error}</div>}
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : <EyeOutlined />}
              </button>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🙈" : <EyeOutlined />}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <button type="submit" className="signup-button">
              Register
            </button>
            <button
              type="button"
              className="redirect-button"
              onClick={() => router.push("/login")}
            >
              Already have an account? Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signup;
