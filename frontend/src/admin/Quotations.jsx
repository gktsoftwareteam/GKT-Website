import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../css/quotations.css";

const API_URL = "http://127.0.0.1:8000/api/quotations";

const EMPTY_FORM = {
  client_name: "",
  company_name: "",
  client_email: "",
  client_phone: "",
  project_name: "",
  validity_days: 15,
  discount: 0,
  gst_percentage: 18,
  status: "Draft",
  terms:
    "1. This quotation is valid for the specified validity period.\n" +
    "2. Payment terms will be discussed and agreed upon before project commencement.\n" +
    "3. Any additional requirements outside the agreed scope may be charged separately.\n" +
    "4. Project timelines depend on timely client feedback and approvals.",
  items: [
    {
      description: "",
      quantity: 1,
      rate: 0,
    },
  ],
};

function Quotations() {
  const [quotations, setQuotations] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // =========================================================
  // LOAD QUOTATIONS
  // =========================================================

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      setQuotations(response.data || []);
    } catch (err) {
      console.error("FETCH QUOTATIONS ERROR:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load quotations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredQuotations = useMemo(() => {
    return quotations.filter((quotation) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        quotation.quotation_number
          ?.toLowerCase()
          .includes(searchText) ||
        quotation.client_name
          ?.toLowerCase()
          .includes(searchText) ||
        quotation.company_name
          ?.toLowerCase()
          .includes(searchText) ||
        quotation.project_name
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        quotation.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quotations, search, statusFilter]);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // ITEM CHANGE
  // =========================================================

  const handleItemChange = (index, field, value) => {
    setForm((prev) => {
      const items = [...prev.items];

      items[index] = {
        ...items[index],
        [field]:
          field === "quantity" || field === "rate"
            ? Number(value)
            : value,
      };

      return {
        ...prev,
        items,
      };
    });
  };

  // =========================================================
  // ADD ITEM
  // =========================================================

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: "",
          quantity: 1,
          rate: 0,
        },
      ],
    }));
  };

  // =========================================================
  // REMOVE ITEM
  // =========================================================

  const removeItem = (index) => {
    setForm((prev) => {
      if (prev.items.length === 1) {
        return prev;
      }

      return {
        ...prev,
        items: prev.items.filter(
          (_, itemIndex) => itemIndex !== index
        ),
      };
    });
  };

  // =========================================================
  // CALCULATE TOTALS
  // =========================================================

  const calculatedTotals = useMemo(() => {
    const subtotal = form.items.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;

      return sum + quantity * rate;
    }, 0);

    const discount = Number(form.discount) || 0;

    const gstPercentage =
      Number(form.gst_percentage) || 0;

    const taxableAmount = Math.max(
      subtotal - discount,
      0
    );

    const gstAmount =
      (taxableAmount * gstPercentage) / 100;

    const total = taxableAmount + gstAmount;

    return {
      subtotal,
      discount,
      taxableAmount,
      gstPercentage,
      gstAmount,
      total,
    };
  }, [
    form.items,
    form.discount,
    form.gst_percentage,
  ]);

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,
      items: [
        {
          description: "",
          quantity: 1,
          rate: 0,
        },
      ],
    });

    setEditingId(null);
    setError("");
  };

  // =========================================================
  // OPEN CREATE
  // =========================================================

  const handleCreate = () => {
    resetForm();
    setShowForm(true);
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (quotation) => {
    setEditingId(quotation._id);

    setForm({
      client_name: quotation.client_name || "",
      company_name: quotation.company_name || "",
      client_email: quotation.client_email || "",
      client_phone: quotation.client_phone || "",
      project_name: quotation.project_name || "",
      validity_days: quotation.validity_days || 15,
      discount: quotation.discount || 0,
      gst_percentage:
        quotation.gst_percentage ?? 18,
      status: quotation.status || "Draft",
      terms: quotation.terms || "",
      items:
        quotation.items?.length > 0
          ? quotation.items.map((item) => ({
              description:
                item.description || "",
              quantity:
                Number(item.quantity) || 1,
              rate:
                Number(item.rate) || 0,
            }))
          : [
              {
                description: "",
                quantity: 1,
                rate: 0,
              },
            ],
    });

    setShowForm(true);
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    if (!form.client_name.trim()) {
      alert("Please enter client name.");
      return false;
    }

    if (!form.client_email.trim()) {
      alert("Please enter client email.");
      return false;
    }

    if (!form.project_name.trim()) {
      alert("Please enter project name.");
      return false;
    }

    const invalidItem = form.items.some(
      (item) =>
        !item.description.trim() ||
        Number(item.quantity) <= 0 ||
        Number(item.rate) < 0
    );

    if (invalidItem) {
      alert(
        "Please enter valid details for all billing items."
      );
      return false;
    }

    return true;
  };

  // =========================================================
  // SAVE / UPDATE
  // =========================================================

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...form,

        validity_days:
          Number(form.validity_days) || 15,

        discount:
          Number(form.discount) || 0,

        gst_percentage:
          Number(form.gst_percentage) || 18,

        items: form.items.map((item) => ({
          description: item.description,
          quantity: Number(item.quantity),
          rate: Number(item.rate),
        })),
      };

      if (editingId) {
        await axios.put(
          `${API_URL}/${editingId}`,
          payload
        );

        alert("Quotation updated successfully.");
      } else {
        const response = await axios.post(
          API_URL,
          payload
        );

        alert(
          `Quotation ${response.data.quotation_number} created successfully.`
        );
      }

      setShowForm(false);
      resetForm();

      await fetchQuotations();
    } catch (err) {
      console.error("SAVE QUOTATION ERROR:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to save quotation."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // VIEW
  // =========================================================

  const handleView = (quotation) => {
    setSelectedQuotation(quotation);
    setShowPreview(true);
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (quotation) => {
    const confirmed = window.confirm(
      `Delete quotation ${quotation.quotation_number}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/${quotation._id}`
      );

      setQuotations((prev) =>
        prev.filter(
          (item) => item._id !== quotation._id
        )
      );

      alert("Quotation deleted successfully.");
    } catch (err) {
      console.error("DELETE QUOTATION ERROR:", err);

      alert(
        err.response?.data?.detail ||
          "Failed to delete quotation."
      );
    }
  };

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  const handleStatusChange = async (
    quotation,
    newStatus
  ) => {
    try {
      await axios.put(
        `${API_URL}/${quotation._id}/status`,
        null,
        {
          params: {
            status: newStatus,
          },
        }
      );

      setQuotations((prev) =>
        prev.map((item) =>
          item._id === quotation._id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );
    } catch (err) {
      console.error(
        "UPDATE QUOTATION STATUS ERROR:",
        err
      );

      alert(
        err.response?.data?.detail ||
          "Failed to update status."
      );
    }
  };

  // =========================================================
  // DOWNLOAD PDF
  // =========================================================

  const handleDownloadPDF = async (quotation) => {
    try {
      const response = await axios.get(
        `${API_URL}/${quotation._id}/pdf`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob(
        [response.data],
        {
          type: "application/pdf",
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `${quotation.quotation_number || "quotation"}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(
        "DOWNLOAD PDF ERROR:",
        err
      );

      alert("Failed to download quotation PDF.");
    }
  };

  // =========================================================
  // PRINT
  // =========================================================

  const handlePrint = (quotation) => {
    const printWindow =
      window.open(
        "",
        "_blank",
        "width=900,height=700"
      );

    if (!printWindow) {
      alert(
        "Please allow pop-ups to print the quotation."
      );
      return;
    }

    const itemsHTML =
      quotation.items
        ?.map(
          (item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${escapeHTML(
                item.description || ""
              )}</td>
              <td>${item.quantity}</td>
              <td>₹${Number(
                item.rate || 0
              ).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}</td>
              <td>₹${Number(
                item.amount ||
                  Number(item.quantity || 0) *
                    Number(item.rate || 0)
              ).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}</td>
            </tr>
          `
        )
        .join("") || "";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${quotation.quotation_number}</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #1e293b;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }

          .header h1 {
            color: #2563eb;
            margin: 0;
          }

          .header p {
            margin: 6px 0;
            color: #64748b;
          }

          h2 {
            text-align: right;
          }

          .info {
            background: #f8fafc;
            padding: 20px;
            margin-bottom: 25px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }

          th {
            background: #2563eb;
            color: white;
            padding: 12px;
            text-align: left;
          }

          td {
            padding: 12px;
            border: 1px solid #e2e8f0;
          }

          .totals {
            width: 350px;
            margin-left: auto;
            margin-top: 20px;
          }

          .total {
            font-size: 20px;
            font-weight: bold;
            color: #2563eb;
          }

          .terms {
            margin-top: 35px;
            white-space: pre-line;
          }
        </style>
      </head>

      <body>

        <div class="header">
          <h1>GKT SOFTWARE SOLUTION</h1>

          <p>
            Software Development • Web Development • AI Solutions
          </p>

          <p>
            Avadi, Chennai - 600054, Tamil Nadu
            | +91 8778341227
            | gktsoftwaresolution@gmail.com
          </p>
        </div>

        <h2>QUOTATION</h2>

        <div class="info">
          <p>
            <strong>Quotation No:</strong>
            ${quotation.quotation_number || "-"}
          </p>

          <p>
            <strong>Client:</strong>
            ${escapeHTML(
              quotation.client_name || "-"
            )}
          </p>

          <p>
            <strong>Company:</strong>
            ${escapeHTML(
              quotation.company_name || "-"
            )}
          </p>

          <p>
            <strong>Email:</strong>
            ${escapeHTML(
              quotation.client_email || "-"
            )}
          </p>

          <p>
            <strong>Phone:</strong>
            ${escapeHTML(
              quotation.client_phone || "-"
            )}
          </p>

          <p>
            <strong>Project:</strong>
            ${escapeHTML(
              quotation.project_name || "-"
            )}
          </p>
        </div>

        <h3>PROJECT BILLING</h3>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div class="totals">

          <p>
            Subtotal:
            ₹${Number(
              quotation.subtotal || 0
            ).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </p>

          <p>
            Discount:
            - ₹${Number(
              quotation.discount || 0
            ).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </p>

          <p>
            Taxable Amount:
            ₹${Number(
              quotation.taxable_amount || 0
            ).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </p>

          <p>
            GST (${quotation.gst_percentage || 0}%):
            ₹${Number(
              quotation.gst_amount || 0
            ).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </p>

          <p class="total">
            TOTAL:
            ₹${Number(
              quotation.total || 0
            ).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </p>

        </div>

        <div class="terms">
          <h3>TERMS & CONDITIONS</h3>
          ${escapeHTML(
            quotation.terms || ""
          )}
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>

      </body>
      </html>
    `);

    printWindow.document.close();
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />

        <div className="dashboard-content">

          <div className="quotations-page">

            {/* HEADER */}

            <div className="quotations-header">

              <div>
                <p className="quotation-eyebrow">
                  GKT CRM
                </p>

                <h2>
                  Quotations
                </h2>

                <p>
                  Create, manage and send
                  professional project quotations.
                </p>
              </div>

              <button
                className="add-quotation-btn"
                onClick={handleCreate}
              >
                + Create Quotation
              </button>

            </div>

            {/* ERROR */}

            {error && (
              <div className="quotation-error">
                {error}
              </div>
            )}

            {/* TOOLBAR */}

            <div className="quotation-toolbar">

              <input
                type="text"
                placeholder="Search quotation, client or project..."
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

                <option value="Draft">
                  Draft
                </option>

                <option value="Sent">
                  Sent
                </option>

                <option value="Viewed">
                  Viewed
                </option>

                <option value="Accepted">
                  Accepted
                </option>

                <option value="Rejected">
                  Rejected
                </option>

                <option value="Expired">
                  Expired
                </option>
              </select>

            </div>

            {/* TABLE */}

            <div className="quotation-table-container">

              <table>

                <thead>
                  <tr>
                    <th>Quotation</th>
                    <th>Client</th>
                    <th>Project</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="table-message"
                      >
                        Loading quotations...
                      </td>
                    </tr>
                  ) : filteredQuotations.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="table-message"
                      >
                        No quotations found.
                      </td>
                    </tr>
                  ) : (
                    filteredQuotations.map(
                      (quotation) => (
                        <tr
                          key={quotation._id}
                        >

                          <td>
                            <strong className="quotation-number">
                              {quotation.quotation_number ||
                                "-"}
                            </strong>
                          </td>

                          <td>
                            <strong>
                              {quotation.client_name ||
                                "-"}
                            </strong>

                            <small>
                              {quotation.company_name ||
                                ""}
                            </small>
                          </td>

                          <td>
                            {quotation.project_name ||
                              "-"}
                          </td>

                          <td>
                            <strong className="amount">
                              ₹
                              {Number(
                                quotation.total || 0
                              ).toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                }
                              )}
                            </strong>
                          </td>

                          <td>

                            <select
                              className={`quotation-status ${getStatusClass(
                                quotation.status
                              )}`}
                              value={
                                quotation.status ||
                                "Draft"
                              }
                              onChange={(e) =>
                                handleStatusChange(
                                  quotation,
                                  e.target.value
                                )
                              }
                            >

                              <option value="Draft">
                                Draft
                              </option>

                              <option value="Sent">
                                Sent
                              </option>

                              <option value="Viewed">
                                Viewed
                              </option>

                              <option value="Accepted">
                                Accepted
                              </option>

                              <option value="Rejected">
                                Rejected
                              </option>

                              <option value="Expired">
                                Expired
                              </option>

                            </select>

                          </td>

                          <td>
                            {formatDate(
                              quotation.createdAt
                            )}
                          </td>

                          <td>

                            <div className="quotation-actions">

                              <button
                                className="action-view"
                                onClick={() =>
                                  handleView(
                                    quotation
                                  )
                                }
                              >
                                View
                              </button>

                              <button
                                className="action-edit"
                                onClick={() =>
                                  handleEdit(
                                    quotation
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="action-pdf"
                                onClick={() =>
                                  handleDownloadPDF(
                                    quotation
                                  )
                                }
                              >
                                PDF
                              </button>

                              <button
                                className="action-print"
                                onClick={() =>
                                  handlePrint(
                                    quotation
                                  )
                                }
                              >
                                Print
                              </button>

                              <button
                                className="action-delete"
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

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      {showForm && (
        <div
          className="quotation-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              setShowForm(false);
            }
          }}
        >

          <div className="quotation-form-modal">

            <div className="quotation-modal-header">

              <div>
                <span>
                  {editingId
                    ? "EDIT QUOTATION"
                    : "NEW QUOTATION"}
                </span>

                <h2>
                  {editingId
                    ? "Update Quotation"
                    : "Create Quotation"}
                </h2>
              </div>

              <button
                className="modal-close"
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSave}>

              {/* CLIENT */}

              <div className="form-section">

                <div className="section-title">
                  Client Information
                </div>

                <div className="form-grid">

                  <div className="form-group">
                    <label>
                      Client Name *
                    </label>

                    <input
                      name="client_name"
                      value={form.client_name}
                      onChange={handleChange}
                      placeholder="Client name"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Company Name
                    </label>

                    <input
                      name="company_name"
                      value={form.company_name}
                      onChange={handleChange}
                      placeholder="Company name"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Email *
                    </label>

                    <input
                      type="email"
                      name="client_email"
                      value={form.client_email}
                      onChange={handleChange}
                      placeholder="client@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Phone
                    </label>

                    <input
                      name="client_phone"
                      value={form.client_phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div className="form-group full">
                    <label>
                      Project Name *
                    </label>

                    <input
                      name="project_name"
                      value={form.project_name}
                      onChange={handleChange}
                      placeholder="Project name"
                    />
                  </div>

                </div>

              </div>

              {/* BILLING */}

              <div className="form-section">

                <div className="section-heading-row">

                  <div className="section-title">
                    Itemized Billing
                  </div>

                  <button
                    type="button"
                    className="add-item-btn"
                    onClick={addItem}
                  >
                    + Add Item
                  </button>

                </div>

                <div className="items-header">

                  <span>
                    Description
                  </span>

                  <span>
                    Qty
                  </span>

                  <span>
                    Rate
                  </span>

                  <span>
                    Amount
                  </span>

                  <span>
                  </span>

                </div>

                {form.items.map(
                  (item, index) => {

                    const amount =
                      Number(
                        item.quantity
                      ) *
                      Number(
                        item.rate
                      );

                    return (
                      <div
                        className="item-row"
                        key={index}
                      >

                        <input
                          value={
                            item.description
                          }
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Service / Description"
                        />

                        <input
                          type="number"
                          min="1"
                          value={
                            item.quantity
                          }
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                        />

                        <input
                          type="number"
                          min="0"
                          value={
                            item.rate
                          }
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "rate",
                              e.target.value
                            )
                          }
                        />

                        <div className="item-amount">
                          ₹
                          {amount.toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                            }
                          )}
                        </div>

                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() =>
                            removeItem(index)
                          }
                          disabled={
                            form.items.length ===
                            1
                          }
                        >
                          ×
                        </button>

                      </div>
                    );
                  }
                )}

              </div>

              {/* TOTALS */}

              <div className="quotation-financial-section">

                <div className="financial-left">

                  <div className="form-group">
                    <label>
                      Discount
                    </label>

                    <input
                      type="number"
                      min="0"
                      name="discount"
                      value={form.discount}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      GST %
                    </label>

                    <input
                      type="number"
                      min="0"
                      name="gst_percentage"
                      value={
                        form.gst_percentage
                      }
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Validity Days
                    </label>

                    <input
                      type="number"
                      min="1"
                      name="validity_days"
                      value={
                        form.validity_days
                      }
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <div className="totals-box">

                  <div>
                    <span>
                      Subtotal
                    </span>

                    <strong>
                      ₹
                      {calculatedTotals.subtotal.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Discount
                    </span>

                    <strong>
                      - ₹
                      {calculatedTotals.discount.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Taxable Amount
                    </span>

                    <strong>
                      ₹
                      {calculatedTotals.taxableAmount.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      GST (
                      {
                        calculatedTotals.gstPercentage
                      }
                      %)
                    </span>

                    <strong>
                      ₹
                      {calculatedTotals.gstAmount.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </strong>
                  </div>

                  <div className="grand-total">

                    <span>
                      TOTAL
                    </span>

                    <strong>
                      ₹
                      {calculatedTotals.total.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </strong>

                  </div>

                </div>

              </div>

              {/* TERMS */}

              <div className="form-section">

                <div className="section-title">
                  Terms & Conditions
                </div>

                <textarea
                  name="terms"
                  rows="6"
                  value={form.terms}
                  onChange={handleChange}
                  placeholder="Enter terms and conditions..."
                />

              </div>

              {/* BUTTONS */}

              <div className="quotation-form-actions">

                <button
                  type="button"
                  className="form-cancel-btn"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="form-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Quotation"
                    : "Save Quotation"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =====================================================
          PREVIEW MODAL
      ===================================================== */}

      {showPreview &&
        selectedQuotation && (
          <div
            className="quotation-modal-overlay"
            onMouseDown={(e) => {
              if (
                e.target === e.currentTarget
              ) {
                setShowPreview(false);
              }
            }}
          >

            <div className="quotation-preview-modal">

              <div className="preview-toolbar">

                <div>
                  <span>
                    QUOTATION PREVIEW
                  </span>

                  <h2>
                    {
                      selectedQuotation.quotation_number
                    }
                  </h2>
                </div>

                <div className="preview-actions">

                  <button
                    onClick={() =>
                      handleDownloadPDF(
                        selectedQuotation
                      )
                    }
                    className="preview-pdf-btn"
                  >
                    Download PDF
                  </button>

                  <button
                    onClick={() =>
                      handlePrint(
                        selectedQuotation
                      )
                    }
                    className="preview-print-btn"
                  >
                    Print
                  </button>

                  <button
                    onClick={() =>
                      setShowPreview(false)
                    }
                    className="preview-close-btn"
                  >
                    Close
                  </button>

                </div>

              </div>

              <div className="quotation-paper">

                <div className="paper-header">

                  <h1>
                    GKT SOFTWARE SOLUTION
                  </h1>

                  <p>
                    Software Development • Web
                    Development • AI Solutions
                  </p>

                  <p>
                    Avadi, Chennai - 600054,
                    Tamil Nadu
                  </p>

                  <p>
                    +91 8778341227 |
                    gktsoftwaresolution@gmail.com
                  </p>

                </div>

                <div className="paper-title">
                  QUOTATION
                </div>

                <div className="paper-info">

                  <div>
                    <strong>
                      Quotation No
                    </strong>

                    <span>
                      {
                        selectedQuotation.quotation_number
                      }
                    </span>
                  </div>

                  <div>
                    <strong>
                      Project
                    </strong>

                    <span>
                      {
                        selectedQuotation.project_name
                      }
                    </span>
                  </div>

                  <div>
                    <strong>
                      Client
                    </strong>

                    <span>
                      {
                        selectedQuotation.client_name
                      }
                    </span>
                  </div>

                  <div>
                    <strong>
                      Company
                    </strong>

                    <span>
                      {
                        selectedQuotation.company_name ||
                        "-"
                      }
                    </span>
                  </div>

                  <div>
                    <strong>
                      Email
                    </strong>

                    <span>
                      {
                        selectedQuotation.client_email
                      }
                    </span>
                  </div>

                  <div>
                    <strong>
                      Phone
                    </strong>

                    <span>
                      {
                        selectedQuotation.client_phone ||
                        "-"
                      }
                    </span>
                  </div>

                </div>

                <h3>
                  PROJECT BILLING
                </h3>

                <table className="preview-items-table">

                  <thead>
                    <tr>
                      <th>#</th>
                      <th>
                        Description
                      </th>
                      <th>
                        Qty
                      </th>
                      <th>
                        Rate
                      </th>
                      <th>
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {selectedQuotation.items?.map(
                      (item, index) => (
                        <tr
                          key={index}
                        >

                          <td>
                            {index + 1}
                          </td>

                          <td>
                            {
                              item.description
                            }
                          </td>

                          <td>
                            {
                              item.quantity
                            }
                          </td>

                          <td>
                            ₹
                            {Number(
                              item.rate || 0
                            ).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                              }
                            )}
                          </td>

                          <td>
                            ₹
                            {Number(
                              item.amount ||
                                Number(
                                  item.quantity ||
                                    0
                                ) *
                                  Number(
                                    item.rate ||
                                      0
                                  )
                            ).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                              }
                            )}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

                <div className="preview-total-box">

                  <div>
                    <span>
                      Subtotal
                    </span>

                    <strong>
                      ₹
                      {Number(
                        selectedQuotation.subtotal ||
                          0
                      ).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Discount
                    </span>

                    <strong>
                      - ₹
                      {Number(
                        selectedQuotation.discount ||
                          0
                      ).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Taxable Amount
                    </span>

                    <strong>
                      ₹
                      {Number(
                        selectedQuotation.taxable_amount ||
                          0
                      ).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      GST (
                      {
                        selectedQuotation.gst_percentage ||
                        0
                      }
                      %)
                    </span>

                    <strong>
                      ₹
                      {Number(
                        selectedQuotation.gst_amount ||
                          0
                      ).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </strong>
                  </div>

                  <div className="preview-grand-total">

                    <span>
                      TOTAL
                    </span>

                    <strong>
                      ₹
                      {Number(
                        selectedQuotation.total ||
                          0
                      ).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </strong>

                  </div>

                </div>

                <div className="preview-terms">

                  <h3>
                    TERMS & CONDITIONS
                  </h3>

                  <p>
                    {selectedQuotation.terms ||
                      "No terms specified."}
                  </p>

                </div>

                <div className="paper-footer">
                  Thank you for choosing GKT
                  Software Solution.
                </div>

              </div>

            </div>

          </div>
        )}

    </>
  );
}

// =========================================================
// HELPERS
// =========================================================

function formatDate(date) {
  if (!date) {
    return "-";
  }

  try {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return "-";
  }
}

function getStatusClass(status) {
  if (!status) {
    return "draft";
  }

  return status
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default Quotations;