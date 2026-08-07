import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "../css/clients.css";


const API_URL = "http://127.0.0.1:8000/api";


const CLIENT_STATUSES = [
  "Active",
  "Pending",
  "Completed",
  "Inactive",
];


function Clients() {

  const [clients, setClients] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(false);

  const [editingClient, setEditingClient] = useState(null);

  const [viewingClient, setViewingClient] = useState(null);

  const [saving, setSaving] = useState(false);


  // =====================================================
  // FETCH CLIENTS
  // =====================================================

  const fetchClients = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        `${API_URL}/clients`
      );

      setClients(response.data);

    } catch (error) {

      console.error(
        "FETCH CLIENTS ERROR:",
        error
      );

      Swal.fire(
        "Error",
        "Unable to load clients.",
        "error"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchClients();

  }, []);


  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredClients = clients.filter((client) => {

    const searchText = search.toLowerCase();


    const matchesSearch =

      client.company
        ?.toLowerCase()
        .includes(searchText) ||

      client.contact
        ?.toLowerCase()
        .includes(searchText) ||

      client.email
        ?.toLowerCase()
        .includes(searchText) ||

      client.phone
        ?.toLowerCase()
        .includes(searchText) ||

      client.project
        ?.toLowerCase()
        .includes(searchText);


    const matchesStatus =

      statusFilter === "All" ||

      client.status === statusFilter;


    return matchesSearch && matchesStatus;

  });


  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (client) => {

    setEditingClient({
      ...client
    });

  };


  // =====================================================
  // EDIT FIELD
  // =====================================================

  const handleEditChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setEditingClient((prev) => ({

      ...prev,

      [name]: value

    }));

  };


  // =====================================================
  // SAVE CLIENT
  // =====================================================

  const handleSave = async () => {

    if (!editingClient) {

      return;

    }


    try {

      setSaving(true);


      await axios.put(

        `${API_URL}/clients/${editingClient._id}`,

        editingClient

      );


      // Update table immediately

      setClients((prev) =>

        prev.map((client) =>

          client._id === editingClient._id

            ? editingClient

            : client

        )

      );


      setEditingClient(null);


      Swal.fire({

        title: "Saved!",

        text: "Client updated successfully.",

        icon: "success",

        timer: 1300,

        showConfirmButton: false,

      });


      // Refresh from MongoDB

      await fetchClients();


    } catch (error) {

      console.error(
        "SAVE CLIENT ERROR:",
        error
      );


      Swal.fire(

        "Save Failed",

        error.response?.data?.detail ||
        "Unable to update client.",

        "error"

      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // STATUS UPDATE
  // =====================================================

  const updateStatus = async (_id, status) => {

    try {

      await axios.put(

        `${API_URL}/clients/${_id}`,

        {
          status
        }

      );


      setClients((prev) =>

        prev.map((client) =>

          client._id === _id

            ? {
                ...client,
                status
              }

            : client

        )

      );


    } catch (error) {

      console.error(
        "STATUS UPDATE ERROR:",
        error
      );


      Swal.fire(

        "Error",

        error.response?.data?.detail ||
        "Failed to update status.",

        "error"

      );


      fetchClients();

    }

  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (_id) => {

    const result = await Swal.fire({

      title: "Delete Client?",

      text: "This client will be permanently removed.",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#ef4444",

      confirmButtonText: "Delete",

      cancelButtonText: "Cancel",

    });


    if (!result.isConfirmed) {

      return;

    }


    try {

      await axios.delete(

        `${API_URL}/clients/${_id}`

      );


      setClients((prev) =>

        prev.filter(
          (client) =>
            client._id !== _id
        )

      );


      Swal.fire({

        title: "Deleted",

        text: "Client deleted successfully.",

        icon: "success",

        timer: 1300,

        showConfirmButton: false,

      });


    } catch (error) {

      console.error(
        "DELETE CLIENT ERROR:",
        error
      );


      Swal.fire(

        "Error",

        error.response?.data?.detail ||
        "Failed to delete client.",

        "error"

      );

    }

  };


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {

    return (
      status
        ?.toLowerCase()
        .replace(/\s+/g, "-")
      || "active"
    );

  };


  return (

    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar />

        <div className="dashboard-content">

          <div className="clients-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="clients-header">

              <div>

                <h2>
                  👥 Clients
                </h2>

                <p>
                  Manage your customers and projects.
                </p>

              </div>


              <div className="clients-count">

                {clients.length}

                <span>
                  Total Clients
                </span>

              </div>

            </div>


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <div className="clients-toolbar">

              <input

                className="clients-search"

                type="text"

                placeholder="Search company, contact, email, phone..."

                value={search}

                onChange={(e) =>
                  setSearch(e.target.value)
                }

              />


              <select

                className="clients-filter"

                value={statusFilter}

                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }

              >

                <option value="All">
                  All Status
                </option>

                {CLIENT_STATUSES.map(
                  (status) => (

                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="clients-table-container">

              <table className="clients-table">

                <thead>

                  <tr>

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
                        colSpan="7"
                        className="clients-empty"
                      >
                        Loading clients...
                      </td>

                    </tr>

                  ) : filteredClients.length > 0 ? (

                    filteredClients.map(
                      (client) => (

                        <tr key={client._id}>

                          <td className="client-company">

                            {client.company ||
                              "-"}

                          </td>


                          <td>

                            {client.contact ||
                              "-"}

                          </td>


                          <td>

                            {client.email ||
                              "-"}

                          </td>


                          <td>

                            {client.phone ||
                              "-"}

                          </td>


                          <td>

                            {client.project ||
                              "-"}

                          </td>


                          <td>

                            <select

                              className={`client-status ${getStatusClass(
                                client.status
                              )}`}

                              value={
                                client.status ||
                                "Active"
                              }

                              onChange={(e) =>
                                updateStatus(
                                  client._id,
                                  e.target.value
                                )
                              }

                            >

                              {CLIENT_STATUSES.map(
                                (status) => (

                                  <option
                                    key={status}
                                    value={status}
                                  >
                                    {status}
                                  </option>

                                )
                              )}

                            </select>

                          </td>


                          <td>

                            <div className="client-actions">

                              <button

                                className="client-view-btn"

                                onClick={() =>
                                  setViewingClient(
                                    client
                                  )
                                }

                              >
                                View
                              </button>


                              <button

                                className="client-edit-btn"

                                onClick={() =>
                                  handleEdit(
                                    client
                                  )
                                }

                              >
                                Edit
                              </button>


                              <button

                                className="client-delete-btn"

                                onClick={() =>
                                  handleDelete(
                                    client._id
                                  )
                                }

                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="7"
                        className="clients-empty"
                      >
                        No clients found.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>


          {/* =================================================
              EDIT CLIENT MODAL
          ================================================= */}

          {editingClient && (

            <div

              className="clients-modal-overlay"

              onClick={() =>
                setEditingClient(null)
              }

            >

              <div

                className="clients-modal"

                onClick={(e) =>
                  e.stopPropagation()
                }

              >

                <div className="clients-modal-header">

                  <div>

                    <span>
                      CLIENT MANAGEMENT
                    </span>

                    <h2>
                      Edit Client
                    </h2>

                  </div>


                  <button

                    className="clients-close-btn"

                    onClick={() =>
                      setEditingClient(null)
                    }

                  >
                    ✕
                  </button>

                </div>


                <div className="clients-modal-body">

                  <div className="client-form-grid">

                    <div className="client-form-group">

                      <label>
                        Company
                      </label>

                      <input

                        name="company"

                        value={
                          editingClient.company ||
                          ""
                        }

                        onChange={
                          handleEditChange
                        }

                      />

                    </div>


                    <div className="client-form-group">

                      <label>
                        Contact
                      </label>

                      <input

                        name="contact"

                        value={
                          editingClient.contact ||
                          ""
                        }

                        onChange={
                          handleEditChange
                        }

                      />

                    </div>


                    <div className="client-form-group">

                      <label>
                        Email
                      </label>

                      <input

                        type="email"

                        name="email"

                        value={
                          editingClient.email ||
                          ""
                        }

                        onChange={
                          handleEditChange
                        }

                      />

                    </div>


                    <div className="client-form-group">

                      <label>
                        Phone
                      </label>

                      <input

                        name="phone"

                        value={
                          editingClient.phone ||
                          ""
                        }

                        onChange={
                          handleEditChange
                        }

                      />

                    </div>


                    <div className="client-form-group">

                      <label>
                        Project
                      </label>

                      <input

                        name="project"

                        value={
                          editingClient.project ||
                          ""
                        }

                        onChange={
                          handleEditChange
                        }

                      />

                    </div>


                    <div className="client-form-group">

                      <label>
                        Status
                      </label>

                      <select

                        name="status"

                        value={
                          editingClient.status ||
                          "Active"
                        }

                        onChange={
                          handleEditChange
                        }

                      >

                        {CLIENT_STATUSES.map(
                          (status) => (

                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>

                          )
                        )}

                      </select>

                    </div>

                  </div>


                  <div className="clients-modal-actions">

                    <button

                      className="clients-cancel-btn"

                      onClick={() =>
                        setEditingClient(null)
                      }

                    >
                      Cancel

                    </button>


                    <button

                      className="clients-save-btn"

                      onClick={handleSave}

                      disabled={saving}

                    >

                      {saving
                        ? "Saving..."
                        : "Save"}

                    </button>

                  </div>

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              VIEW CLIENT MODAL
          ================================================= */}

          {viewingClient && (

            <div

              className="clients-modal-overlay"

              onClick={() =>
                setViewingClient(null)
              }

            >

              <div

                className="clients-modal"

                onClick={(e) =>
                  e.stopPropagation()
                }

              >

                <div className="clients-modal-header">

                  <div>

                    <span>
                      CLIENT DETAILS
                    </span>

                    <h2>
                      {viewingClient.company ||
                        viewingClient.contact}
                    </h2>

                  </div>


                  <button

                    className="clients-close-btn"

                    onClick={() =>
                      setViewingClient(null)
                    }

                  >
                    ✕
                  </button>

                </div>


                <div className="clients-modal-body">

                  <div className="client-details-grid">

                    <div>
                      <label>Company</label>
                      <p>
                        {viewingClient.company ||
                          "-"}
                      </p>
                    </div>

                    <div>
                      <label>Contact</label>
                      <p>
                        {viewingClient.contact ||
                          "-"}
                      </p>
                    </div>

                    <div>
                      <label>Email</label>
                      <p>
                        {viewingClient.email ||
                          "-"}
                      </p>
                    </div>

                    <div>
                      <label>Phone</label>
                      <p>
                        {viewingClient.phone ||
                          "-"}
                      </p>
                    </div>

                    <div>
                      <label>Project</label>
                      <p>
                        {viewingClient.project ||
                          "-"}
                      </p>
                    </div>

                    <div>
                      <label>Status</label>
                      <p>

                        <span
                          className={`client-status-badge ${getStatusClass(
                            viewingClient.status
                          )}`}
                        >
                          {viewingClient.status ||
                            "Active"}
                        </span>

                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}


export default Clients;