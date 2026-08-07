import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "../css/clients.css";

const API_URL =
  process.env.API_URL || "http://127.0.0.1:8000/api";

function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/clients`
      );

      setClients(response.data || []);
    } catch (error) {
      console.error(
        "FETCH CLIENTS ERROR:",
        error.response?.data || error.message
      );

      Swal.fire({
        icon: "error",
        title: "Unable to load clients",
        text:
          error.response?.data?.detail ||
          "Could not connect to the backend.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) => {
    const searchText = search.toLowerCase();

    return (
      String(client.company || "")
        .toLowerCase()
        .includes(searchText) ||
      String(client.contact || "")
        .toLowerCase()
        .includes(searchText) ||
      String(client.email || "")
        .toLowerCase()
        .includes(searchText) ||
      String(client.phone || "")
        .toLowerCase()
        .includes(searchText) ||
      String(client.project || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  const handleView = (client) => {
    Swal.fire({
      title: client.company || "Client Details",
      html: `
        <div style="text-align:left">
          <p><strong>Contact:</strong> ${client.contact || "-"}</p>
          <p><strong>Email:</strong> ${client.email || "-"}</p>
          <p><strong>Phone:</strong> ${client.phone || "-"}</p>
          <p><strong>Project:</strong> ${client.project || "-"}</p>
          <p><strong>Status:</strong> ${client.status || "-"}</p>
        </div>
      `,
      confirmButtonText: "Close",
    });
  };

  const handleDelete = async (client) => {
    const result = await Swal.fire({
      title: "Delete client?",
      text: `Delete ${client.company || client.contact}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/clients/${client._id}`
      );

      setClients((previous) =>
        previous.filter(
          (item) => item._id !== client._id
        )
      );

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Client deleted successfully.",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        "DELETE CLIENT ERROR:",
        error.response?.data || error.message
      );

      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text:
          error.response?.data?.detail ||
          "Unable to delete client.",
      });
    }
  };

  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar />

        <div className="dashboard-content">

          <div className="clients-page">

            <div className="clients-header">
              <div>
                <h2>👥 Clients</h2>
                <p>
                  Manage your converted customers and
                  active clients.
                </p>
              </div>
            </div>

            <input
              className="search-box"
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Company</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="no-data"
                      >
                        Loading clients...
                      </td>
                    </tr>
                  ) : filteredClients.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="no-data"
                      >
                        No clients found.
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map(
                      (client, index) => (
                        <tr key={client._id}>

                          <td>{index + 1}</td>

                          <td>
                            {client.company || "-"}
                          </td>

                          <td>
                            {client.contact || "-"}
                          </td>

                          <td>
                            {client.email || "-"}
                          </td>

                          <td>
                            {client.phone || "-"}
                          </td>

                          <td>
                            {client.project || "-"}
                          </td>

                          <td>
                            <span
                              className={`status ${String(
                                client.status || "Active"
                              )
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            >
                              {client.status || "Active"}
                            </span>
                          </td>

                          <td>
                            <div className="action-buttons">

                              <button
                                className="view-btn"
                                onClick={() =>
                                  handleView(client)
                                }
                              >
                                View
                              </button>

                              <button
                                className="delete-btn"
                                onClick={() =>
                                  handleDelete(client)
                                }
                              >
                                Delete
                              </button>

                            </div>
                          </td>

                        </tr>
                      )
                    )
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

export default Clients;
