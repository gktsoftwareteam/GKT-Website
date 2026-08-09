import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import api from "../api";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "../css/quotations.css";

const API_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const EMPTY_QUOTATION = {
  client: "",
  email: "",
  project: "",
  amount: "",
  status: "Draft",
};

function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingQuotation, setEditingQuotation] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_QUOTATION);

  const fetchQuotations = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/quotations`
      );

      setQuotations(response.data || []);
    } catch (error) {
      console.error(
        "FETCH QUOTATIONS ERROR:",
        error.response?.data || error.message
      );

      Swal.fire({
        icon: "error",
        title: "Unable to load quotations",
        text:
          error.response?.data?.detail ||
          "Could not connect to the backend.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const filteredQuotations = quotations.filter(
    (quotation) => {
      const searchText =
        search.toLowerCase();

      return (
        String(quotation.client || "")
          .toLowerCase()
          .includes(searchText) ||
        String(quotation.email || "")
          .toLowerCase()
          .includes(searchText) ||
        String(quotation.project || "")
          .toLowerCase()
          .includes(searchText) ||
        String(quotation.status || "")
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setEditingQuotation(null);
    setForm(EMPTY_QUOTATION);
    setShowModal(true);
  };

  const openEditModal = (quotation) => {
    setEditingQuotation(quotation);

    setForm({
      client: quotation.client || "",
      email: quotation.email || "",
      project: quotation.project || "",
      amount: quotation.amount || "",
      status: quotation.status || "Draft",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingQuotation(null);
    setForm(EMPTY_QUOTATION);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.client.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Client required",
        text: "Please enter the client name.",
      });
      return;
    }

    if (!form.project.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Project required",
        text: "Please enter the project name.",
      });
      return;
    }

    try {
      setSaving(true);

      if (editingQuotation) {
        await axios.put(
          `${API_URL}/quotations/${editingQuotation._id}`,
          form
        );

        Swal.fire({
          icon: "success",
          title: "Quotation updated",
          text: "Quotation updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await axios.post(
          `${API_URL}/quotations`,
          form
        );

        Swal.fire({
          icon: "success",
          title: "Quotation created",
          text: "Quotation created successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      await fetchQuotations();
      closeModal();
    } catch (error) {
      console.error(
        "SAVE QUOTATION ERROR:",
        error.response?.data || error.message
      );

      Swal.fire({
        icon: "error",
        title: "Unable to save quotation",
        text:
          error.response?.data?.detail ||
          "Something went wrong.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (quotation) => {
    const result = await Swal.fire({
      title: "Delete quotation?",
      text: `Delete quotation for ${quotation.client}?`,
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
        `${API_URL}/quotations/${quotation._id}`
      );

      setQuotations((previous) =>
        previous.filter(
          (item) =>
            item._id !== quotation._id
        )
      );

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Quotation deleted successfully.",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        "DELETE QUOTATION ERROR:",
        error.response?.data || error.message
      );

      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text:
          error.response?.data?.detail ||
          "Unable to delete quotation.",
      });
    }
  };

  const updateStatus = async (
    quotation,
    status
  ) => {
    setQuotations((previous) =>
      previous.map((item) =>
        item._id === quotation._id
          ? { ...item, status }
          : item
      )
    );

    try {
      await axios.put(
        `${API_URL}/quotations/${quotation._id}/status`,
        { status }
      );
    } catch (error) {
      console.error(
        "QUOTATION STATUS ERROR:",
        error.response?.data || error.message
      );

      fetchQuotations();

      Swal.fire({
        icon: "error",
        title: "Status update failed",
        text:
          error.response?.data?.detail ||
          "Unable to update status.",
      });
    }
  };

  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar />

        <div className="dashboard-content">

          <div className="quotations-page">

            <div className="quotations-header">

              <div>
                <h2>🧾 Quotations</h2>

                <p>
                  Create and manage customer quotations.
                </p>
              </div>

              <button
                className="add-quotation-btn"
                onClick={openAddModal}
              >
                + Add Quotation
              </button>

            </div>

            <input
              className="quotation-search"
              type="text"
              placeholder="Search quotations..."
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
                    <th>Client</th>
                    <th>Email</th>
                    <th>Project</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="no-data"
                      >
                        Loading quotations...
                      </td>
                    </tr>
                  ) : filteredQuotations.length ===
                    0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="no-data"
                      >
                        No quotations found.
                      </td>
                    </tr>
                  ) : (
                    filteredQuotations.map(
                      (quotation, index) => (
                        <tr key={quotation._id}>

                          <td>
                            {index + 1}
                          </td>

                          <td>
                            {quotation.client || "-"}
                          </td>

                          <td>
                            {quotation.email || "-"}
                          </td>

                          <td>
                            {quotation.project || "-"}
                          </td>

                          <td>
                            ₹{quotation.amount || "0"}
                          </td>

                          <td>

                            <select
                              className="status-select"
                              value={
                                quotation.status ||
                                "Draft"
                              }
                              onChange={(e) =>
                                updateStatus(
                                  quotation,
                                  e.target.value
                                )
                              }
                            >
                              <option>
                                Draft
                              </option>

                              <option>
                                Sent
                              </option>

                              <option>
                                Accepted
                              </option>

                              <option>
                                Rejected
                              </option>
                            </select>

                          </td>

                          <td>

                            <div className="action-buttons">

                              <button
                                className="edit-btn"
                                onClick={() =>
                                  openEditModal(
                                    quotation
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="delete-btn"
                                onClick={() =>
                                  handleDelete(
                                    quotation
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
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

      {showModal && (
        <div className="modal-overlay">

          <div className="quotation-modal">

            <div className="modal-header">

              <h3>
                {editingQuotation
                  ? "Edit Quotation"
                  : "Add Quotation"}
              </h3>

              <button
                className="modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSave}>

              <div className="form-group">

                <label>
                  Client
                </label>

                <input
                  type="text"
                  name="client"
                  value={form.client}
                  onChange={handleChange}
                  placeholder="Client name"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="client@email.com"
                />

              </div>

              <div className="form-group">

                <label>
                  Project
                </label>

                <input
                  type="text"
                  name="project"
                  value={form.project}
                  onChange={handleChange}
                  placeholder="Project name"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="Quotation amount"
                  min="0"
                />

              </div>

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option>Draft</option>
                  <option>Sent</option>
                  <option>Accepted</option>
                  <option>Rejected</option>
                </select>

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingQuotation
                    ? "Save Changes"
                    : "Add Quotation"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Quotations;