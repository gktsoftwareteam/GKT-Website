import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../css/enquiries.css";

function Enquiries() {
  // ==========================================
  // STATES
  // ==========================================

  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);

  // View modal
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showView, setShowView] = useState(false);

  // Reply modal
  const [showReply, setShowReply] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyEmail, setReplyEmail] = useState("");

  // Loading buttons
  const [replyLoading, setReplyLoading] = useState(false);
  const [convertLoading, setConvertLoading] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // ==========================================
  // API URL
  // ==========================================

  const API_URL = "http://127.0.0.1:8000/api";

  // ==========================================
  // FETCH ENQUIRIES
  // ==========================================

  const fetchEnquiries = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/enquiries`
      );

      setEnquiries(response.data || []);
    } catch (error) {
      console.error(
        "FETCH ENQUIRIES ERROR:",
        error.response?.data || error.message
      );

      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(
        `${API_URL}/enquiries/${id}/status`,
        {
          status: status,
        }
      );

      // Immediately update UI
      setEnquiries((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                status: status,
              }
            : item
        )
      );

      // Refresh from backend
      await fetchEnquiries();

    } catch (error) {
      console.error(
        "STATUS UPDATE ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
          "Failed to update status"
      );
    }
  };

  // ==========================================
  // CONVERT TO CLIENT
  // ==========================================

  const handleConvert = async (id) => {
    try {
      setConvertLoading(id);

      await axios.post(
        `${API_URL}/enquiries/${id}/convert`
      );

      // Immediately change status in UI
      setEnquiries((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                status: "Converted",
              }
            : item
        )
      );

      // Refresh table automatically
      await fetchEnquiries();

    } catch (error) {
      console.error(
        "CONVERT ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
          "Failed to convert enquiry"
      );
    } finally {
      setConvertLoading(null);
    }
  };

  // ==========================================
  // DELETE ENQUIRY
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(id);

      await axios.delete(
        `${API_URL}/enquiries/${id}`
      );

      // Remove immediately
      setEnquiries((prev) =>
        prev.filter((item) => item._id !== id)
      );

    } catch (error) {
      console.error(
        "DELETE ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
          "Failed to delete enquiry"
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // ==========================================
  // OPEN VIEW MODAL
  // ==========================================

  const handleView = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowView(true);
  };

  // ==========================================
  // OPEN REPLY MODAL
  // ==========================================

  const handleReply = (enquiry) => {
    setSelectedEnquiry(enquiry);

    setReplyEmail(enquiry.email || "");

    setReplyMessage("");

    setShowReply(true);
  };

  // ==========================================
  // CLOSE REPLY MODAL
  // ==========================================

  const closeReply = () => {
    setShowReply(false);

    setReplyMessage("");

    setReplyEmail("");

    setSelectedEnquiry(null);
  };

  // ==========================================
  // SEND REPLY
  // ==========================================

  const handleSendReply = async () => {
    if (!replyEmail.trim()) {
      alert("Customer email is required.");
      return;
    }

    if (!replyMessage.trim()) {
      alert("Please enter a reply message.");
      return;
    }

    try {
      setReplyLoading(true);

      const response = await axios.post(
        `${API_URL}/enquiries/reply`,
        {
          email: replyEmail,
          message: replyMessage,
        }
      );

      console.log(
        "REPLY RESPONSE:",
        response.data
      );

      alert("Reply sent successfully!");

      closeReply();

    } catch (error) {
      console.error(
        "REPLY ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
          "Failed to send reply"
      );
    } finally {
      setReplyLoading(false);
    }
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    if (!status) {
      return "new";
    }

    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(date).toLocaleString(
        "en-IN",
        {
          dateStyle: "medium",
          timeStyle: "short",
        }
      );
    } catch {
      return "-";
    }
  };

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredEnquiries = enquiries.filter(
    (enquiry) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        enquiry.name
          ?.toLowerCase()
          .includes(searchText) ||
        enquiry.email
          ?.toLowerCase()
          .includes(searchText) ||
        enquiry.phone
          ?.toLowerCase()
          .includes(searchText) ||
        enquiry.service
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        enquiry.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <>
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />

        <div className="enquiries-page">

          {/* =====================================
              PAGE HEADER
          ===================================== */}

          <div className="page-title">
            <h2>Customer Enquiries</h2>

            <p>
              Manage customer enquiries,
              replies and conversions.
            </p>
          </div>

          {/* =====================================
              TOOLBAR
          ===================================== */}

          <div className="toolbar">

            <input
              type="text"
              placeholder="Search by name, email, phone or service..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">
                All Status
              </option>

              <option value="New">
                New
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Waiting Client">
                Waiting Client
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Converted">
                Converted
              </option>

              <option value="Rejected">
                Rejected
              </option>
            </select>

          </div>

          {/* =====================================
              TABLE
          ===================================== */}

          <div className="table-container">

            {loading ? (
              <div className="no-data">
                Loading enquiries...
              </div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="no-data">
                No enquiries found.
              </div>
            ) : (
              <table>

                <thead>
                  <tr>

                    <th>Name</th>

                    <th>Email</th>

                    <th>Phone</th>

                    <th>Service</th>

                    <th>Date</th>

                    <th>Status</th>

                    <th>Actions</th>

                  </tr>
                </thead>

                <tbody>

                  {filteredEnquiries.map(
                    (enquiry) => {

                      const isConverted =
                        enquiry.status ===
                        "Converted";

                      return (
                        <tr
                          key={enquiry._id}
                        >

                          {/* NAME */}
                          <td>
                            <strong>
                              {enquiry.name}
                            </strong>
                          </td>

                          {/* EMAIL */}
                          <td>
                            {enquiry.email}
                          </td>

                          {/* PHONE */}
                          <td>
                            {enquiry.phone ||
                              "-"}
                          </td>

                          {/* SERVICE */}
                          <td>
                            {enquiry.service ||
                              "-"}
                          </td>

                          {/* DATE */}
                          <td>
                            {formatDate(
                              enquiry.createdAt
                            )}
                          </td>

                          {/* STATUS */}
                          <td>

                            <select
                              className={`status-dropdown ${getStatusClass(
                                enquiry.status
                              )}`}
                              value={
                                enquiry.status ||
                                "New"
                              }
                              onChange={(e) =>
                                handleStatusChange(
                                  enquiry._id,
                                  e.target.value
                                )
                              }
                            >

                              <option value="New">
                                New
                              </option>

                              <option value="In Progress">
                                In Progress
                              </option>

                              <option value="Waiting Client">
                                Waiting Client
                              </option>

                              <option value="Completed">
                                Completed
                              </option>

                              <option value="Converted">
                                Converted
                              </option>

                              <option value="Rejected">
                                Rejected
                              </option>

                            </select>

                          </td>

                          {/* ACTIONS */}
                          <td>

                            <div className="action-buttons">

                              {/* VIEW */}
                              <button
                                type="button"
                                className="view-btn"
                                onClick={() =>
                                  handleView(
                                    enquiry
                                  )
                                }
                              >
                                View
                              </button>

                              {/* REPLY */}
                              <button
                                type="button"
                                className="reply-btn"
                                onClick={() =>
                                  handleReply(
                                    enquiry
                                  )
                                }
                              >
                                Reply
                              </button>

                              {/* CONVERT */}
                              <button
                                type="button"
                                className={`convert-btn ${
                                  isConverted
                                    ? "converted-btn"
                                    : ""
                                }`}
                                disabled={
                                  isConverted ||
                                  convertLoading ===
                                    enquiry._id
                                }
                                onClick={() =>
                                  handleConvert(
                                    enquiry._id
                                  )
                                }
                              >
                                {isConverted
                                  ? "Converted"
                                  : convertLoading ===
                                    enquiry._id
                                  ? "Converting..."
                                  : "Convert"}
                              </button>

                              {/* DELETE */}
                              <button
                                type="button"
                                className="delete-btn"
                                disabled={
                                  deleteLoading ===
                                  enquiry._id
                                }
                                onClick={() =>
                                  handleDelete(
                                    enquiry._id
                                  )
                                }
                              >
                                {deleteLoading ===
                                enquiry._id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>
            )}

          </div>

        </div>
      </div>

      {/* =========================================
          VIEW MODAL
      ========================================= */}

      {showView &&
        selectedEnquiry && (
          <div
            className="modal-overlay"
            onClick={() =>
              setShowView(false)
            }
          >

            <div
              className="modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="modal-header">

                <h2>
                  Enquiry Details
                </h2>

                <button
                  type="button"
                  className="close-btn"
                  onClick={() =>
                    setShowView(false)
                  }
                >
                  ×
                </button>

              </div>

              <div className="modal-body">

                <div className="info-row">
                  <strong>Name:</strong>
                  <span>
                    {selectedEnquiry.name}
                  </span>
                </div>

                <div className="info-row">
                  <strong>Email:</strong>
                  <span>
                    {selectedEnquiry.email}
                  </span>
                </div>

                <div className="info-row">
                  <strong>Phone:</strong>
                  <span>
                    {selectedEnquiry.phone ||
                      "-"}
                  </span>
                </div>

                <div className="info-row">
                  <strong>Service:</strong>
                  <span>
                    {selectedEnquiry.service ||
                      "-"}
                  </span>
                </div>

                <div className="info-row">
                  <strong>Status:</strong>

                  <span
                    className={`status-badge ${getStatusClass(
                      selectedEnquiry.status
                    )}`}
                  >
                    {selectedEnquiry.status ||
                      "New"}
                  </span>
                </div>

                <div className="info-row">
                  <strong>Date:</strong>
                  <span>
                    {formatDate(
                      selectedEnquiry.createdAt
                    )}
                  </span>
                </div>

                <div className="message-box">

                  <h3>
                    Project Details
                  </h3>

                  <p>
                    {selectedEnquiry.message ||
                      "No message provided."}
                  </p>

                </div>

              </div>

            </div>

          </div>
        )}

      {/* =========================================
          REPLY MODAL
      ========================================= */}

      {showReply &&
        selectedEnquiry && (
          <div
            className="modal-overlay"
            onClick={closeReply}
          >

            <div
              className="modal reply-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="modal-header">

                <h2>
                  Reply to Customer
                </h2>

                <button
                  type="button"
                  className="close-btn"
                  onClick={closeReply}
                >
                  ×
                </button>

              </div>

              <div className="modal-body">

                {/* CUSTOMER EMAIL */}

                <div className="reply-field">

                  <label>
                    Customer Email
                  </label>

                  <input
                    type="email"
                    value={replyEmail}
                    onChange={(e) =>
                      setReplyEmail(
                        e.target.value
                      )
                    }
                    placeholder="customer@example.com"
                  />

                </div>

                {/* CUSTOMER MESSAGE */}

                <div className="original-message">

                  <h4>
                    Customer Message
                  </h4>

                  <p>
                    {selectedEnquiry.message ||
                      "No message available."}
                  </p>

                </div>

                {/* REPLY MESSAGE */}

                <div className="reply-field">

                  <label>
                    Your Reply
                  </label>

                  <textarea
                    className="reply-textarea"
                    rows="7"
                    value={replyMessage}
                    onChange={(e) =>
                      setReplyMessage(
                        e.target.value
                      )
                    }
                    placeholder="Write your reply to the customer..."
                  />

                </div>

                {/* ACTIONS */}

                <div className="reply-actions">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeReply}
                    disabled={replyLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="send-btn"
                    onClick={
                      handleSendReply
                    }
                    disabled={replyLoading}
                  >
                    {replyLoading
                      ? "Sending..."
                      : "Send Reply"}
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

    </>
  );
}

export default Enquiries;