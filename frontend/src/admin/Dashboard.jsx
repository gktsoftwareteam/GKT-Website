import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../css/Dashboard.css"

function Dashboard() {
  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar />

        <div className="dashboard-content">

          <h2>Dashboard</h2>

          <div className="cards">

            <div className="card">
              <h3>Total Enquiries</h3>
              <h1>25</h1>
            </div>

            <div className="card">
              <h3>New</h3>
              <h1>8</h1>
            </div>

            <div className="card">
              <h3>In Progress</h3>
              <h1>10</h1>
            </div>

            <div className="card">
              <h3>Completed</h3>
              <h1>7</h1>
            </div>

          </div>

          <div className="table-section">

            <h3>Recent Enquiries</h3>

            <table>

              <thead>

                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Service</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                <tr>
                  <td>Karthik</td>
                  <td>karthik@gmail.com</td>
                  <td>Website</td>
                  <td><span className="status new">New</span></td>
                </tr>

                <tr>
                  <td>John</td>
                  <td>john@gmail.com</td>
                  <td>Mobile App</td>
                  <td><span className="status progress">Progress</span></td>
                </tr>

                <tr>
                  <td>Rahul</td>
                  <td>rahul@gmail.com</td>
                  <td>AI</td>
                  <td><span className="status complete">Completed</span></td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;