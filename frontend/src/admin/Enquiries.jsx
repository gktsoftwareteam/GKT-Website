import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "../css/enquiries.css";

const API_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [replyEnquiry, setReplyEnquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

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

      Swal.fire({
        icon: "error",
        title: "Unable to load enquiries",
        text:
          error.response?.data?.detail ||
          "Could not connect to the backend.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filteredEnquiries = enquiries.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      String(item.name || "")
        .toLowerCase()
        .includes(searchText) ||
      String(item.email || "")
        .toLowerCase()
        .includes(searchText) ||
      String(item.phone || "")
        .toLowerCase()
        .includes(searchText) ||
      String(item.service || "")
        .toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleView = (item) => {
    setSelectedEnquiry(item);
    setShowViewModal(true);
  };

  const handleReply = (item) => {
    setReplyEnquiry(item);
    setReplyMessage("");
  };

  const sendReply = async () => {
    if (!replyMessage.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Message required",
        text: "Please enter a reply message.",
      });
      return;
    }

    try {
      setSendingReply(true);

      await axios.post(
        `${API_URL}/enquiries/${replyEnquiry._id}/reply`,
        {
          message: replyMessage,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Reply sent",
        text: "Your reply has been sent successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      setReplyEnquiry(null);
      setReplyMessage("");
    } catch (error) {
      console.error(
        "REPLY ERROR:",
        error.response?.data || error.message
      );

      Swal.fire({
        icon: "error",
        title: "Reply failed",
        text:
          error.response?.data?.detail ||
          "Unable to send the reply.",
      });
    } finally {
      setSendingReply(false);
    }
  };

  const handleConvert = async (item) => {
    const result = await Swal.fire({
      title: "Convert to client?",
      text: `${item.name} will be added to Clients.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Convert",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await axios.post(
        `${API_URL}/enquiries/${item._id}/convert`
      );

      setEnquiries((previous) =>
        previous.filter(
          (enquiry) => enquiry._id !== item._id
        )
      );

      Swal.fire({
        icon: "success",
        title: "Converted!",
        text: "Enquiry has been converted to a client.",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        "CONVERT ERROR:",
        error.response?.data || error.message
      );

      Swal.fire({
        icon: "error",
        title: "Conversion failed",
        text:
          error.response?.data?.detail ||
          "Unable to convert enquiry.",
      });
    }
  };

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Delete enquiry?",
      text: `Delete enquiry from ${item.name}?`,
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
        `${API_URL}/enquiries/${item._id}`
      );

      setEnquiries((previous) =>
        previous.filter(
          (enquiry) => enquiry._id !== item._id
        )
      );

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Enquiry deleted successfully.",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        "DELETE ENQUIRY ERROR:",
        error.response?.data || error.message
      );

      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text:
          error.response?.data?.detail ||
          "Unable to delete enquiry.",
      });
    }
  };

  const updateStatus = async (id, status) => {
    setEnquiries((previous) =>
      previous.map((item) =>
        item._id === id
          ? { ...item, status }
          : item
      )
    );

    try {
      await axios.put(
        `${API_URL}/enquiries/${id}/status`,
        { status }
      );
    } catch (error) {
      console.error(
        "STATUS UPDATE ERROR:",
        error.response?.data || error.message
      );

      fetchEnquiries();

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

          <div className="enquiries-page">

            <div className="page-title">
              <h2>📩 Enquiries</h2>
              <p>
                Manage customer enquiries and convert
                leads into clients.
              </p>
            </div>

            <div className="toolbar">

              <input
                type="text"
                placeholder="Search enquiries..."
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
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Completed">
                  Completed
                </option>
                <option value="Waiting Client">
                  Waiting Client
                </option>
                <option value="Rejected">
                  Rejected
                </option>
              </select>

            </div>

            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Service</th>
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
                        Loading enquiries...
                      </td>
                    </tr>
                  ) : filteredEnquiries.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="no-data"
                      >
                        No enquiries found.
                      </td>
                    </tr>
                  ) : (
                    filteredEnquiries.map(
                      (item, index) => (
                        <tr key={item._id}>

                          <td>{index + 1}</td>

                          <td>{item.name}</td>

                          <td>{item.email}</td>

                          <td>{item.phone || "-"}</td>

                          <td>{item.service}</td>

                          <td>
                            <select
                              className="status-select"
                              value={
                                item.status || "New"
                              }
                              onChange={(e) =>
                                updateStatus(
                                  item._id,
                                  e.target.value
                                )
                              }
                            >
                              <option>New</option>
                              <option>
                                In Progress
                              </option>
                              <option>
                                Completed
                              </option>
                              <option>
                                Waiting Client
                              </option>
                              <option>
                                Rejected
                              </option>
                            </select>
                          </td>

                          <td>
                            <div className="action-buttons">

                              <button
                                className="view-btn"
                                onClick={() =>
                                  handleView(item)
                                }
                              >
                                View
                              </button>

                              <button
                                className="reply-btn"
                                onClick={() =>
                                  handleReply(item)
                                }
                              >
                                Reply
                              </button>

                              <button
                                className="convert-btn"
                                onClick={() =>
                                  handleConvert(item)
                                }
                              >
                                Convert
                              </button>

                              <button
                                className="delete-btn"
                                onClick={() =>
                                  handleDelete(item)
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

      {showViewModal && selectedEnquiry && (
        <div className="modal-overlay">

          <div className="modal">

            <h2>Enquiry Details</h2>

            <p>
              <strong>Name:</strong>{" "}
              {selectedEnquiry.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {selectedEnquiry.email}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {selectedEnquiry.phone || "-"}
            </p>

            <p>
              <strong>Service:</strong>{" "}
              {selectedEnquiry.service}
            </p>

            <p>
              <strong>Message:</strong>{" "}
              {selectedEnquiry.message}
            </p>

            <div className="modal-buttons">

              <button
                className="close-btn"
                onClick={() =>
                  setShowViewModal(false)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

      {replyEnquiry && (
        <div className="modal-overlay">

          <div className="modal">

            <h2>
              Reply to {replyEnquiry.name}
            </h2>

            <p>
              {replyEnquiry.email}
            </p>

            <textarea
              value={replyMessage}
              onChange={(e) =>
                setReplyMessage(e.target.value)
              }
              placeholder="Type your reply..."
            />

            <div className="modal-buttons">

              <button
                className="close-btn"
                onClick={() =>
                  setReplyEnquiry(null)
                }
                disabled={sendingReply}
              >
                Cancel
              </button>

              <button
                className="send-btn"
                onClick={sendReply}
                disabled={sendingReply}
              >
                {sendingReply
                  ? "Sending..."
                  : "Send Reply"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Enquiries;