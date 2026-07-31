import React from "react";
import { useState } from "react";
import { MailIcon, ArrowRightIcon } from "../components/Icons";
import "../css/admin.css";

function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e) => {
    e.preventDefault();

    console.log({
      email,
      password,
    });

    // Later:
    // axios.post("/api/admin/login",{email,password})
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
}

export default Admin;