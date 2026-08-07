import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "../css/Dashboard.css";


function Dashboard() {

  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);


  // =====================================
  // CHECK LOGIN + FETCH ENQUIRIES
  // =====================================

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {

      navigate("/admin");

      return;

    }


    const fetchEnquiries = async () => {

      try {

        const response = await axios.get(
          "http://127.0.0.1:8000/api/enquiries"
        );


        setEnquiries(response.data);

      } catch (error) {

        console.error(
          "Error loading dashboard enquiries:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchEnquiries();

  }, [navigate]);


  // =====================================
  // DASHBOARD COUNTS
  // =====================================

  const totalEnquiries = enquiries.length;


  const newEnquiries = enquiries.filter(
    (item) => item.status === "New"
  ).length;


  const inProgressEnquiries = enquiries.filter(
    (item) => item.status === "In Progress"
  ).length;


  const completedEnquiries = enquiries.filter(
    (item) => item.status === "Completed"
  ).length;


  // =====================================
  // RECENT ENQUIRIES
  // =====================================

  const recentEnquiries = [...enquiries]
    .sort((a, b) => {

      const dateA = a.createdAt
        ? new Date(a.createdAt)
        : new Date(0);

      const dateB = b.createdAt
        ? new Date(b.createdAt)
        : new Date(0);

      return dateB - dateA;

    })
    .slice(0, 5);


  // =====================================
  // STATUS CLASS
  // =====================================

  const getStatusClass = (status) => {

    switch (status) {

      case "New":
        return "new";

      case "In Progress":
        return "progress";

      case "Completed":
        return "complete";

      case "Converted":
        return "converted";

      case "Waiting Client":
        return "waiting";

      case "Rejected":
        return "rejected";

      default:
        return "new";

    }

  };


  return (

    <div className="dashboard">

      <Sidebar />


      <div className="dashboard-main">

        <Topbar />


        <div className="dashboard-content">

          <h2>Dashboard</h2>


          {/* ==============================
              STATISTICS CARDS
          =============================== */}

          <div className="cards">


            <div className="card">

              <h3>Total Enquiries</h3>

              <h1>
                {loading ? "..." : totalEnquiries}
              </h1>

            </div>



            <div className="card">

              <h3>New</h3>

              <h1>
                {loading ? "..." : newEnquiries}
              </h1>

            </div>



            <div className="card">

              <h3>In Progress</h3>

              <h1>
                {loading ? "..." : inProgressEnquiries}
              </h1>

            </div>



            <div className="card">

              <h3>Completed</h3>

              <h1>
                {loading ? "..." : completedEnquiries}
              </h1>

            </div>


          </div>



          {/* ==============================
              RECENT ENQUIRIES
          =============================== */}

          <div className="table-section">

            <h3>Recent Enquiries</h3>


            {loading ? (

              <p>Loading enquiries...</p>

            ) : enquiries.length === 0 ? (

              <p>No enquiries found.</p>

            ) : (

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

                  {recentEnquiries.map((item) => (

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
                          className={`status ${getStatusClass(
                            item.status
                          )}`}
                        >

                          {item.status || "New"}

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>


        </div>

      </div>

    </div>

  );

}


export default Dashboard;