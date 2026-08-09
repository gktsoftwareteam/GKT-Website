import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import Swal from "sweetalert2";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import { supabase } from "../lib/supabase";

import "../css/enquiries.css";

function Enquiries() {
    const [enquiries, setEnquiries] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState("All");

    const [loading, setLoading] =
        useState(true);

    const fetchEnquiries = useCallback(
        async () => {
            try {
                setLoading(true);

                const {
                    data,
                    error,
                } = await supabase
                    .from("enquiries")
                    .select("*")
                    .order("created_at", {
                        ascending: false,
                    });

                if (error) {
                    throw error;
                }

                setEnquiries(data || []);
            } catch (error) {
                console.error(
                    "FETCH ENQUIRIES ERROR:",
                    error
                );

                Swal.fire({
                    icon: "error",
                    title: "Unable to load enquiries",
                    text:
                        error.message ||
                        "Could not load enquiries.",
                });
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchEnquiries();
    }, [fetchEnquiries]);

    const filteredEnquiries =
        enquiries.filter((item) => {
            const searchText =
                search.toLowerCase().trim();

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

            return (
                matchesSearch &&
                matchesStatus
            );
        });

    const handleView = (item) => {
        Swal.fire({
            title:
                item.name ||
                "Enquiry Details",

            html: `
                <div style="text-align:left">
                    <p>
                        <strong>Name:</strong>
                        ${item.name || "-"}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${item.email || "-"}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${item.phone || "-"}
                    </p>

                    <p>
                        <strong>Service:</strong>
                        ${item.service || "-"}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${item.status || "New"}
                    </p>

                    <p>
                        <strong>Message:</strong>
                        ${item.message || "-"}
                    </p>
                </div>
            `,

            confirmButtonText: "Close",
        });
    };

    const handleReply = (item) => {
        const subject = encodeURIComponent(
            "Re: Your enquiry - GKT Software Solution"
        );

        const body = encodeURIComponent(
            `Hello ${item.name || ""},\n\n\nRegards,\nGKT Software Solution`
        );

        window.location.href =
            `mailto:${item.email}?subject=${subject}&body=${body}`;
    };

    const handleConvert = async (item) => {
        const result =
            await Swal.fire({
                title: "Convert to client?",
                text:
                    `${item.name} will be added to Clients.`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Convert",
                cancelButtonText: "Cancel",
            });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const {
                data: existingClients,
                error: existingError,
            } = await supabase
                .from("clients")
                .select("id")
                .eq("email", item.email)
                .limit(1);

            if (existingError) {
                throw existingError;
            }

            if (
                existingClients &&
                existingClients.length > 0
            ) {
                Swal.fire({
                    icon: "warning",
                    title: "Already a client",
                    text:
                        "A client with this email already exists.",
                });

                return;
            }

            const {
                error: clientError,
            } = await supabase
                .from("clients")
                .insert({
                    company: item.name,
                    contact: item.name,
                    email: item.email,
                    phone: item.phone,
                    project: item.service,
                    status: "Active",
                });

            if (clientError) {
                throw clientError;
            }

            const {
                error: enquiryError,
            } = await supabase
                .from("enquiries")
                .update({
                    status: "Converted",
                })
                .eq("id", item.id);

            if (enquiryError) {
                throw enquiryError;
            }

            setEnquiries((previous) =>
                previous.map((enquiry) =>
                    enquiry.id === item.id
                        ? {
                              ...enquiry,
                              status: "Converted",
                          }
                        : enquiry
                )
            );

            Swal.fire({
                icon: "success",
                title: "Converted!",
                text:
                    "Enquiry has been converted to a client.",
                timer: 1600,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                "CONVERT ERROR:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Conversion failed",
                text:
                    error.message ||
                    "Unable to convert enquiry.",
            });
        }
    };

    const handleDelete = async (item) => {
        const result =
            await Swal.fire({
                title: "Delete enquiry?",
                text:
                    `Delete enquiry from ${item.name}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText:
                    "Yes, delete",
                cancelButtonText:
                    "Cancel",
            });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const {
                error,
            } = await supabase
                .from("enquiries")
                .delete()
                .eq("id", item.id);

            if (error) {
                throw error;
            }

            setEnquiries((previous) =>
                previous.filter(
                    (enquiry) =>
                        enquiry.id !== item.id
                )
            );

            Swal.fire({
                icon: "success",
                title: "Deleted",
                text:
                    "Enquiry deleted successfully.",
                timer: 1400,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                "DELETE ENQUIRY ERROR:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Delete failed",
                text:
                    error.message ||
                    "Unable to delete enquiry.",
            });
        }
    };

    const updateStatus = async (
        id,
        status
    ) => {
        const previousEnquiries =
            enquiries;

        setEnquiries((previous) =>
            previous.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          status,
                      }
                    : item
            )
        );

        try {
            const {
                error,
            } = await supabase
                .from("enquiries")
                .update({
                    status,
                })
                .eq("id", id);

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error(
                "STATUS UPDATE ERROR:",
                error
            );

            setEnquiries(
                previousEnquiries
            );

            Swal.fire({
                icon: "error",
                title: "Status update failed",
                text:
                    error.message ||
                    "Unable to update status.",
            });
        }
    };

    return (
        <>
            <Sidebar />

            <div className="dashboard-main">

                <Topbar />

                <div className="dashboard-content">

                    <div className="enquiries-page">

                        <div className="page-title">

                            <h2>
                                📩 Enquiries
                            </h2>

                            <p>
                                Manage customer enquiries
                                and convert leads into
                                clients.
                            </p>

                        </div>

                        <div className="toolbar">

                            <input
                                type="text"
                                placeholder="Search enquiries..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
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

                                <option value="Pending">
                                    Pending
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

                                <option value="Converted">
                                    Converted
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
                                            (
                                                item,
                                                index
                                            ) => (
                                                <tr
                                                    key={
                                                        item.id
                                                    }
                                                >

                                                    <td>
                                                        {index + 1}
                                                    </td>

                                                    <td>
                                                        {item.name}
                                                    </td>

                                                    <td>
                                                        {item.email}
                                                    </td>

                                                    <td>
                                                        {item.phone || "-"}
                                                    </td>

                                                    <td>
                                                        {item.service}
                                                    </td>

                                                    <td>

                                                        <select
                                                            className="status-select"
                                                            value={
                                                                item.status ||
                                                                "New"
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                updateStatus(
                                                                    item.id,
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

                                                            <option value="Pending">
                                                                Pending
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

                                                            <option value="Converted">
                                                                Converted
                                                            </option>

                                                        </select>

                                                    </td>

                                                    <td>

                                                        <div className="action-buttons">

                                                            <button
                                                                className="view-btn"
                                                                onClick={() =>
                                                                    handleView(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                View
                                                            </button>

                                                            <button
                                                                className="reply-btn"
                                                                onClick={() =>
                                                                    handleReply(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                Reply
                                                            </button>

                                                            <button
                                                                className="convert-btn"
                                                                onClick={() =>
                                                                    handleConvert(
                                                                        item
                                                                    )
                                                                }
                                                                disabled={
                                                                    item.status ===
                                                                    "Converted"
                                                                }
                                                            >
                                                                {item.status ===
                                                                "Converted"
                                                                    ? "Converted"
                                                                    : "Convert"}
                                                            </button>

                                                            <button
                                                                className="delete-btn"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        item
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
        </>
    );
}

export default Enquiries;