import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../css/quotations.css";

const API_URL = "http://127.0.0.1:8000/api";

const EMPTY_ITEM = {
  service: "",
  description: "",
  quantity: 1,
  unit_price: 0,
};

const EMPTY_FORM = {
  client_id: "",
  client_name: "",
  client_email: "",
  client_phone: "",
  project_name: "",
  quotation_date: "",
  valid_until: "",
  items: [{ ...EMPTY_ITEM }],
  discount: 0,
  gst_percentage: 18,
  notes: "",
  terms:
    "50% advance payment. Remaining 50% after project completion.",
  status: "Draft",
};

const STATUS_OPTIONS = [
  "Draft",
  "Sent",
  "Accepted",
  "Rejected",
  "Expired",
];

function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [clients, setClients] = useState([]);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);

  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchQuotations();
    fetchClients();
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/quotations`
      );

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

  const fetchClients = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/clients`
      );

      setClients(response.data || []);
    } catch (err) {
      console.error("FETCH CLIENTS ERROR:", err);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredQuotations = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return quotations;
    }

    return quotations.filter((quotation) => {
      return (
        quotation.quotation_number
          ?.toLowerCase()
          .includes(keyword) ||
        quotation.client_name
          ?.toLowerCase()
          .includes(keyword) ||
        quotation.project_name
          ?.toLowerCase()
          .includes(keyword) ||
        quotation.status
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [quotations, search]);

  // =====================================================
  // CLIENT SELECTION
  // =====================================================

  const handleClientChange = (e) => {
    const clientId = e.target.value;

    const client = clients.find(
      (item) => item._id === clientId
    );

    if (!client) {
      setForm((prev) => ({
        ...prev,
        client_id: "",
        client_name: "",
        client_email: "",
        client_phone: "",
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      client_id: client._id,
      client_name:
        client.company ||
        client.name ||
        client.contact ||
        "",
      client_email: client.email || "",
      client_phone: client.phone || "",
    }));
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // ITEM CHANGE
  // =====================================================

  const handleItemChange = (
    index,
    field,
    value
  ) => {
    setForm((prev) => {
      const items = [...prev.items];

      items[index] = {
        ...items[index],
        [field]: value,
      };

      return {
        ...prev,
        items,
      };
    });
  };

  // =====================================================
  // ADD ITEM
  // =====================================================

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          ...EMPTY_ITEM,
        },
      ],
    }));
  };

  // =====================================================
  // REMOVE ITEM
  // =====================================================

  const removeItem = (index) => {
    if (form.items.length === 1) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      items: prev.items.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  // =====================================================
  // CALCULATIONS
  // =====================================================

  const subtotal = useMemo(() => {
    return form.items.reduce(
      (total, item) => {
        const quantity =
          Number(item.quantity) || 0;

        const price =
          Number(item.unit_price) || 0;

        return total + quantity * price;
      },
      0
    );
  }, [form.items]);

  const discount = Math.min(
    Number(form.discount) || 0,
    subtotal
  );

  const taxableAmount =
    subtotal - discount;

  const gstAmount =
    taxableAmount *
    ((Number(form.gst_percentage) || 0) / 100);

  const grandTotal =
    taxableAmount + gstAmount;

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    const today = new Date();

    const validDate = new Date();
    validDate.setDate(today.getDate() + 14);

    setForm({
      ...EMPTY_FORM,

      quotation_date: formatDateForInput(
        today
      ),

      valid_until: formatDateForInput(
        validDate
      ),

      items: [{ ...EMPTY_ITEM }],
    });

    setEditingId(null);
  };

  // =====================================================
  // OPEN CREATE
  // =====================================================

  const handleAddQuotation = () => {
    setError("");
    setSuccess("");

    resetForm();

    setShowForm(true);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (quotation) => {
    setError("");
    setSuccess("");

    setEditingId(quotation._id);

    setForm({
      client_id: quotation.client_id || "",

      client_name:
        quotation.client_name || "",

      client_email:
        quotation.client_email || "",

      client_phone:
        quotation.client_phone || "",

      project_name:
        quotation.project_name || "",

      quotation_date:
        formatDateForInput(
          quotation.quotation_date
        ),

      valid_until:
        formatDateForInput(
          quotation.valid_until
        ),

      items:
        quotation.items?.length > 0
          ? quotation.items.map((item) => ({
              service:
                item.service || "",

              description:
                item.description || "",

              quantity:
                item.quantity || 1,

              unit_price:
                item.unit_price || 0,
            }))
          : [{ ...EMPTY_ITEM }],

      discount:
        quotation.discount || 0,

      gst_percentage:
        quotation.gst_percentage ?? 18,

      notes:
        quotation.notes || "",

      terms:
        quotation.terms || "",

      status:
        quotation.status || "Draft",
    });

    setShowForm(true);
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.client_name.trim()) {
      setError("Please select a client.");
      return;
    }

    if (!form.project_name.trim()) {
      setError("Please enter the project name.");
      return;
    }

    if (!form.items.length) {
      setError(
        "Please add at least one service."
      );
      return;
    }

    const hasInvalidItem = form.items.some(
      (item) =>
        !item.service.trim() ||
        Number(item.quantity) <= 0 ||
        Number(item.unit_price) < 0
    );

    if (hasInvalidItem) {
      setError(
        "Please enter valid service, quantity and price."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        client_id:
          form.client_id || null,

        client_name:
          form.client_name,

        client_email:
          form.client_email,

        client_phone:
          form.client_phone,

        project_name:
          form.project_name,

        quotation_date:
          form.quotation_date
            ? new Date(
                form.quotation_date
              ).toISOString()
            : null,

        valid_until:
          form.valid_until
            ? new Date(
                form.valid_until
              ).toISOString()
            : null,

        items: form.items.map(
          (item) => ({
            service:
              item.service,

            description:
              item.description,

            quantity:
              Number(item.quantity),

            unit_price:
              Number(item.unit_price),
          })
        ),

        discount:
          Number(form.discount) || 0,

        gst_percentage:
          Number(form.gst_percentage) || 0,

        notes:
          form.notes,

        terms:
          form.terms,

        status:
          form.status,
      };

      if (editingId) {
        await axios.put(
          `${API_URL}/quotations/${editingId}`,
          payload
        );

        setSuccess(
          "Quotation updated successfully."
        );
      } else {
        await axios.post(
          `${API_URL}/quotations`,
          payload
        );

        setSuccess(
          "Quotation created successfully."
        );
      }

      setShowForm(false);

      setEditingId(null);

      resetForm();

      await fetchQuotations();
    } catch (err) {
      console.error(
        "SAVE QUOTATION ERROR:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to save quotation."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quotation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/quotations/${id}`
      );

      setSuccess(
        "Quotation deleted successfully."
      );

      await fetchQuotations();
    } catch (err) {
      console.error(
        "DELETE QUOTATION ERROR:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to delete quotation."
      );
    }
  };

  // =====================================================
  // STATUS
  // =====================================================

  const handleStatusChange = async (
    quotation,
    status
  ) => {
    try {
      await axios.put(
        `${API_URL}/quotations/${quotation._id}/status`,
        {
          status,
        }
      );

      setQuotations((prev) =>
        prev.map((item) =>
          item._id === quotation._id
            ? {
                ...item,
                status,
              }
            : item
        )
      );

      setSuccess(
        "Quotation status updated."
      );
    } catch (err) {
      console.error(
        "STATUS UPDATE ERROR:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to update status."
      );
    }
  };

  // =====================================================
  // VIEW
  // =====================================================

  const handleView = (quotation) => {
    setSelectedQuotation(quotation);

    setShowView(true);
  };

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    ).format(Number(value) || 0);
  };

  return (
    <>
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />

        <div className="dashboard-content">
          <div className="quotations-page">

            {/* =====================================
                HEADER
            ====================================== */}

            <div className="quotations-header">

              <div>
                <span className="quotation-eyebrow">
                  GKT CRM
                </span>

                <h2>
                  Quotations
                </h2>

                <p>
                  Create, manage and track
                  project quotations.
                </p>
              </div>

              <button
                className="add-quotation-btn"
                onClick={
                  handleAddQuotation
                }
              >
                + Create Quotation
              </button>

            </div>

            {/* =====================================
                ALERTS
            ====================================== */}

            {error && (
              <div className="quotation-alert error">
                {error}
              </div>
            )}

            {success && (
              <div className="quotation-alert success">
                {success}
              </div>
            )}

            {/* =====================================
                SUMMARY
            ====================================== */}

            <div className="quotation-summary">

              <div className="summary-card">
                <span>
                  Total Quotations
                </span>

                <strong>
                  {quotations.length}
                </strong>
              </div>

              <div className="summary-card">
                <span>
                  Draft
                </span>

                <strong>
                  {
                    quotations.filter(
                      (q) =>
                        q.status === "Draft"
                    ).length
                  }
                </strong>
              </div>

              <div className="summary-card">
                <span>
                  Sent
                </span>

                <strong>
                  {
                    quotations.filter(
                      (q) =>
                        q.status === "Sent"
                    ).length
                  }
                </strong>
              </div>

              <div className="summary-card">
                <span>
                  Accepted
                </span>

                <strong>
                  {
                    quotations.filter(
                      (q) =>
                        q.status ===
                        "Accepted"
                    ).length
                  }
                </strong>
              </div>

              <div className="summary-card money">
                <span>
                  Quotation Value
                </span>

                <strong>
                  {formatCurrency(
                    quotations.reduce(
                      (sum, q) =>
                        sum +
                        Number(
                          q.grand_total || 0
                        ),
                      0
                    )
                  )}
                </strong>
              </div>

            </div>

            {/* =====================================
                SEARCH
            ====================================== */}

            <div className="quotation-toolbar">

              <input
                type="text"
                placeholder="Search quotation, client or project..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

              <button
                className="refresh-btn"
                onClick={
                  fetchQuotations
                }
              >
                ↻ Refresh
              </button>

            </div>

            {/* =====================================
                TABLE
            ====================================== */}

            <div className="quotation-table-container">

              <table className="quotation-table">

                <thead>
                  <tr>
                    <th>
                      Quote No.
                    </th>

                    <th>
                      Client
                    </th>

                    <th>
                      Project
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Total
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>
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
                      (quotation) => (
                        <tr
                          key={
                            quotation._id
                          }
                        >

                          <td>
                            <strong>
                              {
                                quotation.quotation_number
                              }
                            </strong>
                          </td>

                          <td>
                            <div className="client-cell">
                              <strong>
                                {
                                  quotation.client_name
                                }
                              </strong>

                              <small>
                                {
                                  quotation.client_email
                                }
                              </small>
                            </div>
                          </td>

                          <td>
                            {
                              quotation.project_name
                            }
                          </td>

                          <td>
                            {formatDate(
                              quotation.quotation_date
                            )}
                          </td>

                          <td>
                            <strong className="amount">
                              {formatCurrency(
                                quotation.grand_total
                              )}
                            </strong>
                          </td>

                          <td>

                            <select
                              className={`quote-status ${getStatusClass(
                                quotation.status
                              )}`}
                              value={
                                quotation.status
                              }
                              onChange={(e) =>
                                handleStatusChange(
                                  quotation,
                                  e.target.value
                                )
                              }
                            >

                              {STATUS_OPTIONS.map(
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
                                className="action-delete"
                                onClick={() =>
                                  handleDelete(
                                    quotation._id
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

      {/* =========================================
          CREATE / EDIT MODAL
      ========================================== */}

      {showForm && (
        <div className="quotation-modal-overlay">

          <div className="quotation-form-modal">

            <div className="quotation-modal-header">

              <div>
                <span>
                  GKT SOFTWARE SOLUTION
                </span>

                <h2>
                  {editingId
                    ? "Edit Quotation"
                    : "Create Quotation"}
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowForm(false)
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="quotation-form"
            >

              {/* CLIENT */}

              <div className="form-section">

                <h3>
                  Client Information
                </h3>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Select Client
                    </label>

                    <select
                      value={
                        form.client_id
                      }
                      onChange={
                        handleClientChange
                      }
                    >

                      <option value="">
                        Select existing client
                      </option>

                      {clients.map(
                        (client) => (
                          <option
                            key={
                              client._id
                            }
                            value={
                              client._id
                            }
                          >
                            {client.company ||
                              client.name ||
                              client.contact}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      Client Name
                    </label>

                    <input
                      name="client_name"
                      value={
                        form.client_name
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Client name"
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Email
                    </label>

                    <input
                      type="email"
                      name="client_email"
                      value={
                        form.client_email
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="client@email.com"
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Phone
                    </label>

                    <input
                      name="client_phone"
                      value={
                        form.client_phone
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="+91..."
                    />

                  </div>

                </div>

              </div>

              {/* PROJECT */}

              <div className="form-section">

                <h3>
                  Project Information
                </h3>

                <div className="form-grid">

                  <div className="form-group full">

                    <label>
                      Project Name
                    </label>

                    <input
                      name="project_name"
                      value={
                        form.project_name
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter project name"
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Quotation Date
                    </label>

                    <input
                      type="date"
                      name="quotation_date"
                      value={
                        form.quotation_date
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Valid Until
                    </label>

                    <input
                      type="date"
                      name="valid_until"
                      value={
                        form.valid_until
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                </div>

              </div>

              {/* SERVICES */}

              <div className="form-section">

                <div className="section-heading-row">

                  <h3>
                    Services
                  </h3>

                  <button
                    type="button"
                    className="add-item-btn"
                    onClick={addItem}
                  >
                    + Add Service
                  </button>

                </div>

                <div className="items-container">

                  {form.items.map(
                    (item, index) => (
                      <div
                        className="quotation-item"
                        key={index}
                      >

                        <div className="item-number">
                          {index + 1}
                        </div>

                        <div className="item-fields">

                          <div className="form-group">

                            <label>
                              Service
                            </label>

                            <input
                              value={
                                item.service
                              }
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "service",
                                  e.target.value
                                )
                              }
                              placeholder="Website Development"
                            />

                          </div>

                          <div className="form-group">

                            <label>
                              Description
                            </label>

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
                              placeholder="Service description"
                            />

                          </div>

                          <div className="form-group small">

                            <label>
                              Qty
                            </label>

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

                          </div>

                          <div className="form-group">

                            <label>
                              Unit Price
                            </label>

                            <input
                              type="number"
                              min="0"
                              value={
                                item.unit_price
                              }
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "unit_price",
                                  e.target.value
                                )
                              }
                            />

                          </div>

                          <div className="item-total">

                            <span>
                              Total
                            </span>

                            <strong>
                              {formatCurrency(
                                Number(
                                  item.quantity
                                ) *
                                  Number(
                                    item.unit_price
                                  )
                              )}
                            </strong>

                          </div>

                        </div>

                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() =>
                            removeItem(
                              index
                            )
                          }
                          disabled={
                            form.items.length ===
                            1
                          }
                        >
                          ×
                        </button>

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* TOTALS */}

              <div className="form-section totals-section">

                <div className="totals-grid">

                  <div className="form-group">

                    <label>
                      Discount (₹)
                    </label>

                    <input
                      type="number"
                      min="0"
                      name="discount"
                      value={
                        form.discount
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      GST (%)
                    </label>

                    <input
                      type="number"
                      min="0"
                      name="gst_percentage"
                      value={
                        form.gst_percentage
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  <div className="calculation-box">

                    <div>
                      <span>
                        Subtotal
                      </span>

                      <strong>
                        {formatCurrency(
                          subtotal
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Discount
                      </span>

                      <strong>
                        -{" "}
                        {formatCurrency(
                          discount
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Taxable Amount
                      </span>

                      <strong>
                        {formatCurrency(
                          taxableAmount
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        GST
                      </span>

                      <strong>
                        {formatCurrency(
                          gstAmount
                        )}
                      </strong>
                    </div>

                    <div className="grand-total">

                      <span>
                        Grand Total
                      </span>

                      <strong>
                        {formatCurrency(
                          grandTotal
                        )}
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

              {/* NOTES */}

              <div className="form-section">

                <h3>
                  Notes & Terms
                </h3>

                <div className="form-group">

                  <label>
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    rows="3"
                    value={
                      form.notes
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Additional notes..."
                  />

                </div>

                <div className="form-group">

                  <label>
                    Terms & Conditions
                  </label>

                  <textarea
                    name="terms"
                    rows="4"
                    value={
                      form.terms
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Payment terms..."
                  />

                </div>

              </div>

              {/* STATUS */}

              <div className="form-section">

                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      form.status
                    }
                    onChange={
                      handleChange
                    }
                  >

                    {STATUS_OPTIONS.map(
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

              {/* ACTIONS */}

              <div className="quotation-form-actions">

                <button
                  type="button"
                  className="quotation-cancel-btn"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="quotation-save-btn"
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

      {/* =========================================
          VIEW QUOTATION
      ========================================== */}

      {showView &&
        selectedQuotation && (
          <div className="quotation-modal-overlay">

            <div className="quotation-preview-modal">

              <div className="quotation-preview-header">

                <div>
                  <span>
                    GKT SOFTWARE SOLUTION
                  </span>

                  <h2>
                    QUOTATION
                  </h2>
                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setShowView(false)
                  }
                >
                  ×
                </button>

              </div>

              <div className="quotation-preview">

                <div className="preview-top">

                  <div>
                    <strong>
                      Quotation No.
                    </strong>

                    <p>
                      {
                        selectedQuotation.quotation_number
                      }
                    </p>
                  </div>

                  <div>
                    <strong>
                      Date
                    </strong>

                    <p>
                      {formatDate(
                        selectedQuotation.quotation_date
                      )}
                    </p>
                  </div>

                  <div>
                    <strong>
                      Valid Until
                    </strong>

                    <p>
                      {formatDate(
                        selectedQuotation.valid_until
                      )}
                    </p>
                  </div>

                </div>

                <div className="preview-client">

                  <h3>
                    Bill To
                  </h3>

                  <strong>
                    {
                      selectedQuotation.client_name
                    }
                  </strong>

                  <span>
                    {
                      selectedQuotation.client_email
                    }
                  </span>

                  <span>
                    {
                      selectedQuotation.client_phone
                    }
                  </span>

                  <span>
                    Project:{" "}
                    {
                      selectedQuotation.project_name
                    }
                  </span>

                </div>

                <div className="preview-items">

                  <table>

                    <thead>
                      <tr>
                        <th>
                          Service
                        </th>

                        <th>
                          Description
                        </th>

                        <th>
                          Qty
                        </th>

                        <th>
                          Price
                        </th>

                        <th>
                          Total
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {selectedQuotation.items?.map(
                        (item, index) => (
                          <tr key={index}>

                            <td>
                              {
                                item.service
                              }
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
                              {formatCurrency(
                                item.unit_price
                              )}
                            </td>

                            <td>
                              {formatCurrency(
                                item.total
                              )}
                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

                <div className="preview-bottom">

                  <div className="preview-notes">

                    <h4>
                      Notes
                    </h4>

                    <p>
                      {
                        selectedQuotation.notes ||
                        "No additional notes."
                      }
                    </p>

                    <h4>
                      Terms
                    </h4>

                    <p>
                      {
                        selectedQuotation.terms ||
                        "No terms specified."
                      }
                    </p>

                  </div>

                  <div className="preview-total-box">

                    <div>
                      <span>
                        Subtotal
                      </span>

                      <strong>
                        {formatCurrency(
                          selectedQuotation.subtotal
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Discount
                      </span>

                      <strong>
                        -{" "}
                        {formatCurrency(
                          selectedQuotation.discount
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        GST (
                        {
                          selectedQuotation.gst_percentage
                        }
                        %)
                      </span>

                      <strong>
                        {formatCurrency(
                          selectedQuotation.gst_amount
                        )}
                      </strong>
                    </div>

                    <div className="preview-grand-total">

                      <span>
                        Grand Total
                      </span>

                      <strong>
                        {formatCurrency(
                          selectedQuotation.grand_total
                        )}
                      </strong>

                    </div>

                  </div>

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

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


function formatDateForInput(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function getStatusClass(status) {
  return (
    status
      ?.toLowerCase()
      .replace(/\s+/g, "-") || "draft"
  );
}


export default Quotations;