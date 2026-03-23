import React, { useState, useRef, useEffect, useContext } from "react";
import "./Profile.css";
import { apiRequest } from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const logout = async () => {
    try {
      const res = await apiRequest.post("/auth/logout");

      if (res.status === 200) {
        localStorage.removeItem("user");
        navigate("/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleExplore = () => {
    navigate("/explore-data");
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="profile-wrapper" ref={menuRef}>
      <div
        className="profile-container"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src="https://www.gravatar.com/avatar/?d=mp"
          alt="avatar"
          className="profile-avatar"
        />

        {/* Show username safely */}
        <span className="profile-username">
          {currentUser?.username || "User"}
        </span>
      </div>

      {isOpen && (
        <div className="profile-dropdown">
          {currentUser.isAdmin?<div className="dropdown-item" onClick={handleExplore}>
            Explore Data
          </div>:""}
          
          <div className="dropdown-item" onClick={logout}>
            Logout
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;