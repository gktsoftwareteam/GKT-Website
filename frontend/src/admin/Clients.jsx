import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import Swal from "sweetalert2";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import { supabase } from "../lib/supabase";

import "../css/clients.css";

function Clients() {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] =
        useState(true);

    const fetchClients = useCallback(
        async () => {
            try {
                setLoading(true);

                const {
                    data,
                    error,
                } = await supabase
                    .from("clients")
                    .select("*")
                    .order("created_at", {
                        ascending: false,
                    });

                if (error) {
                    throw error;
                }

                setClients(data || []);
            } catch (error) {
                console.error(
                    "FETCH CLIENTS ERROR:",
                    error
                );

                Swal.fire({
                    icon: "error",
                    title: "Unable to load clients",
                    text:
                        error.message ||
                        "Could not load clients.",
                });
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

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

    const handleDelete = async (client) => {
        const result =
            await Swal.fire({
                title: "Delete client?",
                text:
                    `Delete ${
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
            const {
                error,
            } = await supabase
                .from("clients")
                .delete()
                .eq("id", client.id);

            if (error) {
                throw error;
            }

            setClients((previous) =>
                previous.filter(
                    (item) =>
                        item.id !== client.id
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
                error
            );

            Swal.fire({
                icon: "error",
                title: "Delete failed",
                text:
                    error.message ||
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
                                    Manage your converted
                                    customers and active
                                    clients.
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
                                            (
                                                client,
                                                index
                                            ) => (
                                                <tr
                                                    key={
                                                        client.id
                                                    }
                                                >

                                                    <td>
                                                        {index + 1}
                                                    </td>

                                                    <td>
                                                        {
                                                            client.company ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            client.contact ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            client.email ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            client.phone ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            client.project ||
                                                            "-"
                                                        }
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
                                                            {
                                                                client.status ||
                                                                "Active"
                                                            }
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