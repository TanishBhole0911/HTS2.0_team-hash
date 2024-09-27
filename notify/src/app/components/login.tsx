import React, { useState } from "react";
import "../styles/login.css"; // Import the CSS file
import "../styles/signup.css";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import Tiles from "../components/Tiles";
import { Flex } from "antd";
import { useDispatch } from "react-redux";
import { message } from "antd"; // Import message from antd
import { setUser } from "../../features/User/user-slice";
const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter
  const dispatch = useDispatch();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "username": "jayesh1",
        "password": "testpass"
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect
      };

      const response = await fetch("http://127.0.0.1:8000/login", requestOptions)
      if (!response.ok) {
        throw new Error("Failed to log in");
      }
      message.success("Login successful!"); // Show success message
      const userData = await fetch(`${process.env.NEXT_PUBLIC_API_FETCH_API}/get_user/${username}`);
      const data = await userData.json();
      console.log(data);
      dispatch(setUser(data));
      router.push("/Notes"); // Redirect to the next page immediately
    } catch (error) {
      console.error("Error during login:", error);
      setError("Failed to log in. Please check your details and try again.");
      message.error("Failed to log in. Please check your details and try again."); // Show error message
    }
  };

  return (<>
    <div id="container" style={{ filter: "blur(1.5px)" }}>
      <Tiles />
    </div>
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
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
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        <Flex justify="center" align="center" flex={1} vertical>
          <button type="submit" className="login-button">
            Login
          </button>
          <button
            type="button"
            className="redirect-button"
            onClick={() => router.push("/register")}
          >
            Don't have an account? Sign up
          </button>
        </Flex>
      </form>
    </div>
  </>
  );
};

export default Login;
