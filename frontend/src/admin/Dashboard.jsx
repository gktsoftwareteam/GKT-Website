import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "../css/Dashboard.css";

const API_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

function Dashboard() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/enquiries`
      );

      setEnquiries(response.data || []);
    } catch (error) {
      console.error(
        "Error loading dashboard enquiries:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Unable to load dashboard",
        text:
          error.response?.data?.detail ||
          "Unable to connect to the backend.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const totalEnquiries = enquiries.length;

  const newEnquiries = enquiries.filter(
    (item) => item.status === "New"
  ).length;

  const inProgress = enquiries.filter(
    (item) => item.status === "In Progress"
  ).length;

  const completed = enquiries.filter(
    (item) => item.status === "Completed"
  ).length;

  const recentEnquiries = enquiries.slice(-5).reverse();

  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar />

        <div className="dashboard-content">

          <div className="dashboard-heading">
            <h2>Dashboard</h2>
            <p>
              Overview of your customer enquiries and
              business activity.
            </p>
          </div>

          <div className="cards">

            <div className="card">
              <h3>Total Enquiries</h3>

              <h1>
                {loading ? "..." : totalEnquiries}
              </h1>

              <span>
                All customer enquiries
              </span>
            </div>

            <div className="card">
              <h3>New</h3>

              <h1>
                {loading ? "..." : newEnquiries}
              </h1>

              <span>
                New enquiries
              </span>
            </div>

            <div className="card">
              <h3>In Progress</h3>

              <h1>
                {loading ? "..." : inProgress}
              </h1>

              <span>
                Active enquiries
              </span>
            </div>

            <div className="card">
              <h3>Completed</h3>

              <h1>
                {loading ? "..." : completed}
              </h1>

              <span>
                Completed enquiries
              </span>
            </div>

          </div>

          <div className="table-section">

            <div className="section-header">
              <h3>Recent Enquiries</h3>
            </div>

            <div className="table-container">

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

                  {loading ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="no-data"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : recentEnquiries.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="no-data"
                      >
                        No enquiries available.
                      </td>
                    </tr>
                  ) : (
                    recentEnquiries.map((item) => (
                      <tr key={item._id}>

                        <td>
                          {item.name || "-"}
                        </td>

                        <td>
                          {item.email || "-"}
                        </td>

                        <td>
                          {item.service || "-"}
                        </td>

                        <td>
                          <span
                            className={`status ${String(
                              item.status || "New"
                            )
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {item.status || "New"}
                          </span>
                        </td>

                      </tr>
                    ))
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;