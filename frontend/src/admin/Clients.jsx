import React, {
    useEffect,
    useState,
} from "react";

import Swal from "sweetalert2";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import api from "../api";

import "../css/clients.css";

function Clients() {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // =====================================================
    // FETCH CLIENTS
    // =====================================================

    const fetchClients = async () => {
        try {
            setLoading(true);

            const response =
                await api.get("/clients");

            console.log(
                "CLIENTS RESPONSE:",
                response.data
            );

            setClients(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            console.error(
                "FETCH CLIENTS ERROR:",
                error.response?.data ||
                    error.message
            );

            if (
                error.response?.status === 401
            ) {
                Swal.fire({
                    icon: "warning",
                    title: "Session expired",
                    text: "Please login again.",
                });

                localStorage.removeItem(
                    "token"
                );

                window.location.href =
                    "/admin";

                return;
            }

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

    // =====================================================
    // LOAD
    // =====================================================

    useEffect(() => {
        fetchClients();
    }, []);

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredClients =
        clients.filter((client) => {
            const searchText =
                search.toLowerCase().trim();

            return (
                String(
                    client.company || ""
                )
                    .toLowerCase()
                    .includes(searchText) ||
                String(
                    client.contact || ""
                )
                    .toLowerCase()
                    .includes(searchText) ||
                String(
                    client.email || ""
                )
                    .toLowerCase()
                    .includes(searchText) ||
                String(
                    client.phone || ""
                )
                    .toLowerCase()
                    .includes(searchText) ||
                String(
                    client.project || ""
                )
                    .toLowerCase()
                    .includes(searchText)
            );
        });

    // =====================================================
    // VIEW
    // =====================================================

    const handleView = (client) => {
        Swal.fire({
            title:
                client.company ||
                "Client Details",

            html: `
                <div style="text-align:left">
                    <p>
                        <strong>Contact:</strong>
                        ${client.contact || "-"}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${client.email || "-"}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${client.phone || "-"}
                    </p>

                    <p>
                        <strong>Project:</strong>
                        ${client.project || "-"}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${client.status || "Active"}
                    </p>
                </div>
            `,

            confirmButtonText: "Close",
        });
    };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (client) => {
        const result =
            await Swal.fire({
                title: "Delete client?",
                text: `Delete ${
                    client.company ||
                    client.contact
                }?`,
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
            await api.delete(
                `/clients/${client._id}`
            );

            setClients((previous) =>
                previous.filter(
                    (item) =>
                        item._id !==
                        client._id
                )
            );

            Swal.fire({
                icon: "success",
                title: "Deleted",
                text:
                    "Client deleted successfully.",
                timer: 1400,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                "DELETE CLIENT ERROR:",
                error.response?.data ||
                    error.message
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
        <>
            <Sidebar />

            <div className="dashboard-main">

                <Topbar />

                <div className="dashboard-content">

                    <div className="clients-page">

                        <div className="clients-header">

                            <div>
                                <h2>
                                    👥 Clients
                                </h2>

                                <p>
                                    Manage your
                                    converted
                                    customers and
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
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                        <div className="table-container">

                            <table>

                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>
                                            Company
                                        </th>
                                        <th>
                                            Contact
                                        </th>
                                        <th>
                                            Email
                                        </th>
                                        <th>
                                            Phone
                                        </th>
                                        <th>
                                            Project
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
                                                colSpan="8"
                                                className="no-data"
                                            >
                                                Loading clients...
                                            </td>
                                        </tr>
                                    ) : filteredClients.length ===
                                      0 ? (
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
                                            (
                                                client,
                                                index
                                            ) => (
                                                <tr
                                                    key={
                                                        client._id ||
                                                        index
                                                    }
                                                >

                                                    <td>
                                                        {index +
                                                            1}
                                                    </td>

                                                    <td>
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
                                                        <span
                                                            className={`status ${String(
                                                                client.status ||
                                                                    "Active"
                                                            )
                                                                .toLowerCase()
                                                                .replace(
                                                                    /\s+/g,
                                                                    "-"
                                                                )}`}
                                                        >
                                                            {client.status ||
                                                                "Active"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="action-buttons">

                                                            <button
                                                                className="view-btn"
                                                                onClick={() =>
                                                                    handleView(
                                                                        client
                                                                    )
                                                                }
                                                            >
                                                                View
                                                            </button>

                                                            <button
                                                                className="delete-btn"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        client
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

export default Clients;