import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "../components/Icons";
import "../css/admin.css";
import Swal from "sweetalert2";

function Admin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const login = async (e) => {
  e.preventDefault();

  try {

    const response = await axios.post(
      "http://127.0.0.1:8000/api/admin/login",
       "https://gkt-website-git-main-gktsoftwareteams-projects.vercel.app",
      {
        email,
        password,
      }
    );

    // Save JWT token
    localStorage.setItem(
      "token",
      response.data.access_token
    );

   Swal.fire({
  title: "Welcome!",
  text: "Login successful.",
  icon: "success",
  timer: 1500,
  showConfirmButton: false
});

    navigate("../admin/Dashboard");

  } catch (error) {

    alert(
      error.response?.data?.detail || "Login Failed"
    );

  }
};

  return (
    <section className="admin">
      <div className="container admin__grid">

        {/* Left Side */}

        <div className="admin__info">

          <p className="eyebrow">Admin Portal</p>

          <h1>Welcome Back</h1>

          <p className="admin__lead">
            Login to manage customer enquiries, projects,
            quotations and your GKT Software Solution dashboard.
          </p>

          {/*  */}

        </div>

        {/* Right Side */}

        <div className="admin__form">

          <div className="admin__logo">

            <h2>GKT</h2>

            <p>Software Solution</p>

          </div>

          <h3>Admin Login</h3>

          <form onSubmit={login}>

            <div className="field">

              <label>Email</label>

              <input
                type="email"
                placeholder="admin@gkt.com"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />

            </div>

            <div className="field">

              <label>Password</label>

              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />

            </div>

            <button className="btn-login">

              Login

              <ArrowRightIcon />

            </button>

          </form>

        </div>

      </div>
    </section>
  );
};

export default Admin;