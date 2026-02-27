import React, { useState,useContext } from "react";
import { apiRequest } from "../../lib/apiRequest";
import {Link, useNavigate} from 'react-router-dom'

import { AuthContext } from "../../context/authContext";
import "./Login.css";

function Login() {
    const navigate=useNavigate()
    const {updateData}=useContext(AuthContext)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiRequest.post(`/auth/login`,formData);

      console.log("Login Success:", response.data);

      // Later: save token & redirect
      // localStorage.setItem("token", response.data.token);
      updateData(response.data)
      navigate("/home");

    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} >
        <h2>Login</h2>

        {error && <p>{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
         
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
          
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
         <Link to={"/register"}>Don't you have an account ?</Link>
      </form>
    </div>
  );
}



export default Login;