import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import { supabase } from "../supabaseClient";

import "../css/Dashboard.css";

function Dashboard() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    // =====================================================
    // FETCH ENQUIRIES FROM SUPABASE
    // =====================================================

    const fetchEnquiries = async () => {
        try {
            setLoading(true);

            const { data, error } = await supabase
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
                "Error loading dashboard enquiries:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Unable to load dashboard",
                text:
                    error.message ||
                    "Unable to load enquiries from Supabase.",
            });

            setEnquiries([]);
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD
    // =====================================================

    useEffect(() => {
        fetchEnquiries();
    }, []);

    // =====================================================
    // STATISTICS
    // =====================================================

    const totalEnquiries = enquiries.length;

    const newEnquiries = enquiries.filter(
        (item) => item.status === "New"
    ).length;

    const inProgress = enquiries.filter(
        (item) => item.status === "In Progress"
    ).length;

    const completed = enquiries.filter(
        (item) => item.status === "Completed"
    ).length;

    const recentEnquiries = enquiries.slice(0, 5);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            <Sidebar />

            <div className="dashboard-main">

                <Topbar />

                <div className="dashboard-content">

                    <div className="dashboard-heading">

                        <h2>Dashboard</h2>

                        <p>
                            Overview of your customer enquiries
                            and business activity.
                        </p>

                    </div>

                    {/* ================= CARDS ================= */}

                    <div className="cards">

                        <div className="card">

                            <h3>Total Enquiries</h3>

                            <h1>
                                {loading
                                    ? "..."
                                    : totalEnquiries}
                            </h1>

                            <span>
                                All customer enquiries
                            </span>

                        </div>

                        <div className="card">

                            <h3>New</h3>

                            <h1>
                                {loading
                                    ? "..."
                                    : newEnquiries}
                            </h1>

                            <span>
                                New enquiries
                            </span>

                        </div>

                        <div className="card">

                            <h3>In Progress</h3>

                            <h1>
                                {loading
                                    ? "..."
                                    : inProgress}
                            </h1>

                            <span>
                                Active enquiries
                            </span>

                        </div>

                        <div className="card">

                            <h3>Completed</h3>

                            <h1>
                                {loading
                                    ? "..."
                                    : completed}
                            </h1>

                            <span>
                                Completed enquiries
                            </span>

                        </div>

                    </div>

                    {/* ================= RECENT ENQUIRIES ================= */}

                    <div className="table-section">

                        <div className="section-header">

                            <h3>
                                Recent Enquiries
                            </h3>

                        </div>

                        <div className="table-container">

                            <table>

                                <thead>

                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Service</th>
                                        <th>Status</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {loading ? (

                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="no-data"
                                            >
                                                Loading...
                                            </td>
                                        </tr>

                                    ) : recentEnquiries.length === 0 ? (

                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="no-data"
                                            >
                                                No enquiries available.
                                            </td>
                                        </tr>

                                    ) : (

                                        recentEnquiries.map(
                                            (item) => (

                                                <tr
                                                    key={item.id}
                                                >

                                                    <td>
                                                        {item.name ||
                                                            "-"}
                                                    </td>

                                                    <td>
                                                        {item.email ||
                                                            "-"}
                                                    </td>

                                                    <td>
                                                        {item.service ||
                                                            "-"}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={`status ${String(
                                                                item.status ||
                                                                    "New"
                                                            )
                                                                .toLowerCase()
                                                                .replace(
                                                                    /\s+/g,
                                                                    "-"
                                                                )}`}
                                                        >
                                                            {item.status ||
                                                                "New"}
                                                        </span>

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

export default Dashboard;