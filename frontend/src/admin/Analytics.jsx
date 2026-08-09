import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import { supabase } from "../supabaseClient";

import "../css/analytics.css";

function Analytics() {
    const [enquiries, setEnquiries] = useState([]);
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);

            const [
                enquiriesResponse,
                clientsResponse,
                projectsResponse,
            ] = await Promise.all([
                supabase
                    .from("enquiries")
                    .select("*"),

                supabase
                    .from("clients")
                    .select("*"),

                supabase
                    .from("projects")
                    .select("*"),
            ]);

            if (enquiriesResponse.error) {
                throw enquiriesResponse.error;
            }

            if (clientsResponse.error) {
                throw clientsResponse.error;
            }

            if (projectsResponse.error) {
                throw projectsResponse.error;
            }

            setEnquiries(enquiriesResponse.data || []);
            setClients(clientsResponse.data || []);
            setProjects(projectsResponse.data || []);

        } catch (error) {
            console.error(
                "ANALYTICS ERROR:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Unable to load analytics",
                text:
                    error.message ||
                    "Could not load analytics data.",
            });
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // ENQUIRY STATISTICS
    // =====================================================

    const totalEnquiries = enquiries.length;

    const newEnquiries = enquiries.filter(
        (item) => item.status === "New"
    ).length;

    const inProgressEnquiries = enquiries.filter(
        (item) => item.status === "In Progress"
    ).length;

    const completedEnquiries = enquiries.filter(
        (item) => item.status === "Completed"
    ).length;

    const waitingClient = enquiries.filter(
        (item) => item.status === "Waiting Client"
    ).length;

    const rejectedEnquiries = enquiries.filter(
        (item) => item.status === "Rejected"
    ).length;

    // =====================================================
    // CLIENT STATISTICS
    // =====================================================

    const totalClients = clients.length;

    const activeClients = clients.filter(
        (client) =>
            String(client.status || "Active")
                .toLowerCase() === "active"
    ).length;

    // =====================================================
    // PROJECT STATISTICS
    // =====================================================

    const totalProjects = projects.length;

    const pendingProjects = projects.filter(
        (project) =>
            project.status === "Pending"
    ).length;

    const activeProjects = projects.filter(
        (project) =>
            project.status === "In Progress"
    ).length;

    const completedProjects = projects.filter(
        (project) =>
            project.status === "Completed"
    ).length;

    // =====================================================
    // CONVERSION RATE
    // =====================================================

    const convertedEnquiries = enquiries.filter(
        (item) =>
            item.status === "Converted"
    ).length;

    const conversionRate =
        totalEnquiries > 0
            ? Math.round(
                  (convertedEnquiries /
                      totalEnquiries) *
                      100
              )
            : 0;

    return (
        <>
            <Sidebar />

            <div className="dashboard-main">
                <Topbar />

                <div className="dashboard-content">

                    <div className="analytics-page">

                        {/* HEADER */}

                        <div className="analytics-header">
                            <div>
                                <h2>📊 Analytics</h2>

                                <p>
                                    Overview of your business
                                    performance and activity.
                                </p>
                            </div>

                            <button
                                className="refresh-btn"
                                onClick={fetchAnalytics}
                                disabled={loading}
                            >
                                {loading
                                    ? "Loading..."
                                    : "↻ Refresh"}
                            </button>
                        </div>

                        {/* MAIN CARDS */}

                        <div className="analytics-cards">

                            <div className="analytics-card">
                                <span>
                                    Total Enquiries
                                </span>

                                <h2>
                                    {loading
                                        ? "..."
                                        : totalEnquiries}
                                </h2>

                                <small>
                                    All customer enquiries
                                </small>
                            </div>

                            <div className="analytics-card">
                                <span>
                                    Total Clients
                                </span>

                                <h2>
                                    {loading
                                        ? "..."
                                        : totalClients}
                                </h2>

                                <small>
                                    Active customers
                                </small>
                            </div>

                            <div className="analytics-card">
                                <span>
                                    Total Projects
                                </span>

                                <h2>
                                    {loading
                                        ? "..."
                                        : totalProjects}
                                </h2>

                                <small>
                                    All projects
                                </small>
                            </div>

                            <div className="analytics-card">
                                <span>
                                    Conversion Rate
                                </span>

                                <h2>
                                    {loading
                                        ? "..."
                                        : `${conversionRate}%`}
                                </h2>

                                <small>
                                    Enquiry to client
                                </small>
                            </div>

                        </div>

                        {/* TWO COLUMN SECTION */}

                        <div className="analytics-grid">

                            {/* ENQUIRIES */}

                            <div className="analytics-section">

                                <div className="section-header">
                                    <h3>
                                        📩 Enquiries
                                    </h3>
                                </div>

                                <div className="analytics-list">

                                    <div className="analytics-row">
                                        <span>
                                            New
                                        </span>

                                        <strong>
                                            {newEnquiries}
                                        </strong>
                                    </div>

                                    <div className="analytics-row">
                                        <span>
                                            In Progress
                                        </span>

                                        <strong>
                                            {inProgressEnquiries}
                                        </strong>
                                    </div>

                                    <div className="analytics-row">
                                        <span>
                                            Completed
                                        </span>

                                        <strong>
                                            {completedEnquiries}
                                        </strong>
                                    </div>

                                    <div className="analytics-row">
                                        <span>
                                            Waiting Client
                                        </span>

                                        <strong>
                                            {waitingClient}
                                        </strong>
                                    </div>

                                    <div className="analytics-row">
                                        <span>
                                            Rejected
                                        </span>

                                        <strong>
                                            {rejectedEnquiries}
                                        </strong>
                                    </div>

                                    <div className="analytics-row">
                                        <span>
                                            Converted
                                        </span>

                                        <strong>
                                            {convertedEnquiries}
                                        </strong>
                                    </div>

                                </div>
                            </div>

                            {/* PROJECTS */}

                            <div className="analytics-section">

                                <div className="section-header">
                                    <h3>
                                        📁 Projects
                                    </h3>
                                </div>

                                <div className="analytics-list">

                                    <div className="analytics-row">
                                        <span>
                                            Pending
                                        </span>

                                        <strong>
                                            {pendingProjects}
                                        </strong>
                                    </div>

                                    <div className="analytics-row">
                                        <span>
                                            In Progress
                                        </span>

                                        <strong>
                                            {activeProjects}
                                        </strong>
                                    </div>

                                    <div className="analytics-row">
                                        <span>
                                            Completed
                                        </span>

                                        <strong>
                                            {completedProjects}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* CLIENTS */}

                        <div className="analytics-section clients-analytics">

                            <div className="section-header">
                                <h3>
                                    👥 Clients
                                </h3>
                            </div>

                            <div className="analytics-list">

                                <div className="analytics-row">
                                    <span>
                                        Total Clients
                                    </span>

                                    <strong>
                                        {totalClients}
                                    </strong>
                                </div>

                                <div className="analytics-row">
                                    <span>
                                        Active Clients
                                    </span>

                                    <strong>
                                        {activeClients}
                                    </strong>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}

export default Analytics;