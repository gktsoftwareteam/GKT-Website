import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import { supabase } from "../supabaseClient";

import "../css/quotations.css";

const EMPTY_QUOTATION = {
    client: "",
    email: "",
    project: "",
    amount: "",
    status: "Draft",
    notes: "",
};

function Quotations() {
    const [quotations, setQuotations] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const [editingQuotation, setEditingQuotation] =
        useState(null);

    const [form, setForm] =
        useState({ ...EMPTY_QUOTATION });

    const [saving, setSaving] =
        useState(false);

    // =====================================================
    // FETCH QUOTATIONS
    // =====================================================

    const fetchQuotations = async () => {
        try {
            setLoading(true);

            const { data, error } = await supabase
                .from("quotations")
                .select("*")
                .order("created_at", {
                    ascending: false,
                });

            if (error) {
                throw error;
            }

            setQuotations(data || []);

        } catch (error) {
            console.error(
                "FETCH QUOTATIONS ERROR:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Unable to load quotations",
                text:
                    error.message ||
                    "Could not load quotations.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotations();
    }, []);

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredQuotations =
        quotations.filter((quotation) => {

            const searchText =
                search.toLowerCase().trim();

            if (!searchText) {
                return true;
            }

            return (
                String(
                    quotation.client || ""
                )
                    .toLowerCase()
                    .includes(searchText) ||

                String(
                    quotation.email || ""
                )
                    .toLowerCase()
                    .includes(searchText) ||

                String(
                    quotation.project || ""
                )
                    .toLowerCase()
                    .includes(searchText) ||

                String(
                    quotation.status || ""
                )
                    .toLowerCase()
                    .includes(searchText)
            );
        });

    // =====================================================
    // INPUT
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // ADD
    // =====================================================

    const openAddModal = () => {
        setEditingQuotation(null);

        setForm({
            ...EMPTY_QUOTATION,
        });

        setShowModal(true);
    };

    // =====================================================
    // EDIT
    // =====================================================

    const openEditModal = (quotation) => {
        setEditingQuotation(quotation);

        setForm({
            client: quotation.client || "",
            email: quotation.email || "",
            project: quotation.project || "",
            amount: quotation.amount || "",
            status: quotation.status || "Draft",
            notes: quotation.notes || "",
        });

        setShowModal(true);
    };

    // =====================================================
    // CLOSE
    // =====================================================

    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowModal(false);

        setEditingQuotation(null);

        setForm({
            ...EMPTY_QUOTATION,
        });
    };

    // =====================================================
    // SAVE
    // =====================================================

    const handleSave = async (e) => {
        e.preventDefault();

        if (!form.client.trim()) {
            Swal.fire(
                "Client Required",
                "Please enter the client name.",
                "warning"
            );

            return;
        }

        if (!form.email.trim()) {
            Swal.fire(
                "Email Required",
                "Please enter the client email.",
                "warning"
            );

            return;
        }

        if (!form.project.trim()) {
            Swal.fire(
                "Project Required",
                "Please enter the project name.",
                "warning"
            );

            return;
        }

        try {
            setSaving(true);

            if (editingQuotation) {

                const { error } =
                    await supabase
                        .from("quotations")
                        .update({
                            client:
                                form.client.trim(),

                            email:
                                form.email.trim(),

                            project:
                                form.project.trim(),

                            amount:
                                Number(
                                    form.amount || 0
                                ),

                            status:
                                form.status,

                            notes:
                                form.notes.trim(),
                        })
                        .eq(
                            "id",
                            editingQuotation.id
                        );

                if (error) {
                    throw error;
                }

                Swal.fire({
                    icon: "success",
                    title: "Quotation Updated",
                    timer: 1500,
                    showConfirmButton: false,
                });

            } else {

                const { error } =
                    await supabase
                        .from("quotations")
                        .insert([
                            {
                                client:
                                    form.client.trim(),

                                email:
                                    form.email.trim(),

                                project:
                                    form.project.trim(),

                                amount:
                                    Number(
                                        form.amount || 0
                                    ),

                                status:
                                    form.status,

                                notes:
                                    form.notes.trim(),
                            },
                        ]);

                if (error) {
                    throw error;
                }

                Swal.fire({
                    icon: "success",
                    title: "Quotation Added",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }

            closeModal();

            await fetchQuotations();

        } catch (error) {
            console.error(
                "SAVE QUOTATION ERROR:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Save Failed",
                text:
                    error.message ||
                    "Unable to save quotation.",
            });
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // DELETE
    // =====================================================

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
            const { error } =
                await supabase
                    .from("quotations")
                    .delete()
                    .eq(
                        "id",
                        quotation.id
                    );

            if (error) {
                throw error;
            }

            setQuotations((previous) =>
                previous.filter(
                    (item) =>
                        item.id !== quotation.id
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
                error
            );

            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text:
                    error.message ||
                    "Unable to delete quotation.",
            });
        }
    };

    // =====================================================
    // STATUS
    // =====================================================

    const updateStatus = async (
        quotation,
        status
    ) => {

        const oldStatus =
            quotation.status;

        setQuotations((previous) =>
            previous.map((item) =>
                item.id === quotation.id
                    ? {
                          ...item,
                          status,
                      }
                    : item
            )
        );

        try {
            const { error } =
                await supabase
                    .from("quotations")
                    .update({
                        status,
                    })
                    .eq(
                        "id",
                        quotation.id
                    );

            if (error) {
                throw error;
            }

        } catch (error) {

            setQuotations((previous) =>
                previous.map((item) =>
                    item.id === quotation.id
                        ? {
                              ...item,
                              status: oldStatus,
                          }
                        : item
                )
            );

            Swal.fire({
                icon: "error",
                title: "Status Update Failed",
                text:
                    error.message ||
                    "Unable to update quotation status.",
            });
        }
    };

    return (
        <>
            <Sidebar />

            <div className="dashboard-main">

                <Topbar />

                <div className="dashboard-content">

                    <div className="quotations-page">

                        <div className="quotations-header">

                            <div>
                                <h2>
                                    🧾 Quotations
                                </h2>

                                <p>
                                    Create and manage
                                    customer quotations.
                                </p>
                            </div>

                            <button
                                className="add-quotation-btn"
                                onClick={
                                    openAddModal
                                }
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
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                        <div className="table-container">

                            <table>

                                <thead>
                                    <tr>
                                        <th>
                                            S.No
                                        </th>

                                        <th>
                                            Client
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Project
                                        </th>

                                        <th>
                                            Amount
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
                                                Loading
                                                quotations...
                                            </td>
                                        </tr>
                                    ) : filteredQuotations.length ===
                                      0 ? (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="no-data"
                                            >
                                                No quotations
                                                found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredQuotations.map(
                                            (
                                                quotation,
                                                index
                                            ) => (
                                                <tr
                                                    key={
                                                        quotation.id
                                                    }
                                                >

                                                    <td>
                                                        {index +
                                                            1}
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {
                                                                quotation.client
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {
                                                            quotation.email
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            quotation.project
                                                        }
                                                    </td>

                                                    <td>
                                                        ₹
                                                        {Number(
                                                            quotation.amount ||
                                                                0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </td>

                                                    <td>
                                                        <select
                                                            className="quotation-status"
                                                            value={
                                                                quotation.status ||
                                                                "Draft"
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                updateStatus(
                                                                    quotation,
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        >
                                                            <option value="Draft">
                                                                Draft
                                                            </option>

                                                            <option value="Sent">
                                                                Sent
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

            {/* MODAL */}

            {showModal && (
                <div className="modal-overlay">

                    <div className="modal">

                        <div className="modal-header">

                            <h3>
                                {editingQuotation
                                    ? "Edit Quotation"
                                    : "Add Quotation"}
                            </h3>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={
                                    closeModal
                                }
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={
                                handleSave
                            }
                        >

                            <div className="form-group">
                                <label>
                                    Client
                                </label>

                                <input
                                    type="text"
                                    name="client"
                                    value={
                                        form.client
                                    }
                                    onChange={
                                        handleChange
                                    }
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
                                    value={
                                        form.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Client email"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Project
                                </label>

                                <input
                                    type="text"
                                    name="project"
                                    value={
                                        form.project
                                    }
                                    onChange={
                                        handleChange
                                    }
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
                                    min="0"
                                    value={
                                        form.amount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Quotation amount"
                                />
                            </div>

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
                                    <option value="Draft">
                                        Draft
                                    </option>

                                    <option value="Sent">
                                        Sent
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

                            <div className="form-group">
                                <label>
                                    Notes
                                </label>

                                <textarea
                                    name="notes"
                                    rows="4"
                                    value={
                                        form.notes
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Quotation notes..."
                                />
                            </div>

                            <div className="modal-buttons">

                                <button
                                    type="button"
                                    className="close-btn"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={
                                        saving
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={
                                        saving
                                    }
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
        </>
    );
}

export default Quotations;