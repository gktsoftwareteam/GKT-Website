import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../css/sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/admin");
  };

  return (
    <div className="sidebar">

      <div className="logo">
        <h2>GKT</h2>
        <span>Software Solution</span>
      </div>

      <ul>
          <li>
    <NavLink to="/">
      🏠 <span>Home</span>
    </NavLink>
  </li>

        <li>
          <NavLink to="/admin/dashboard">
            🏠 <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/enquiries">
            📩 <span>Enquiries</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/clients">
            👥 <span>Clients</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/projects">
            📁 <span>Projects</span>
          </NavLink>
        </li>
        <li>
  <Link to="/admin/quotations">
    📄 Quotations
  </Link>
</li>

        <li>
          <NavLink to="/admin/analytics">
            📊 <span>Analytics</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/settings">
            ⚙️ <span>Settings</span>
          </NavLink>
        </li>

      </ul>

      <button className="logout-btn" onClick={logout}>
        🚪 Logout
      </button>

    </div>
  );
}

export default Sidebar;