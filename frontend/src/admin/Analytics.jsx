import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../css/analytics.css";

const API_URL = process.env.REACT_APP_API_URL;

function Analytics() {
    const [analytics, setAnalytics] = useState({
        totalEnquiries: 0,
        totalClients: 0,
        totalProjects: 0,
        revenue: 0,

        newEnquiries: 0,
        inProgressEnquiries: 0,
        completedEnquiries: 0,
        convertedEnquiries: 0,

        pendingProjects: 0,
        activeProjects: 0,
        completedProjects: 0,

        monthlyEnquiries: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${REACT_APP_API_URL}/api/analytics`
            );

            const data = response.data || {};

            setAnalytics({
                totalEnquiries:
                    data.totalEnquiries ??
                    data.total_enquiries ??
                    0,

                totalClients:
                    data.totalClients ??
                    data.total_clients ??
                    0,

                totalProjects:
                    data.totalProjects ??
                    data.total_projects ??
                    0,

                revenue:
                    data.revenue ??
                    0,

                newEnquiries:
                    data.newEnquiries ??
                    data.new_enquiries ??
                    0,

                inProgressEnquiries:
                    data.inProgressEnquiries ??
                    data.in_progress_enquiries ??
                    0,

                completedEnquiries:
                    data.completedEnquiries ??
                    data.completed_enquiries ??
                    0,

                convertedEnquiries:
                    data.convertedEnquiries ??
                    data.converted_enquiries ??
                    0,

                pendingProjects:
                    data.pendingProjects ??
                    data.pending_projects ??
                    0,

                activeProjects:
                    data.activeProjects ??
                    data.active_projects ??
                    0,

                completedProjects:
                    data.completedProjects ??
                    data.completed_projects ??
                    0,

                monthlyEnquiries:
                    Array.isArray(data.monthlyEnquiries)
                        ? data.monthlyEnquiries
                        : Array.isArray(data.monthly_enquiries)
                        ? data.monthly_enquiries
                        : [],
            });

        } catch (err) {
            console.error("Analytics Error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to load analytics data."
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchAnalytics();
    }, []);


    /* =====================================================
       CALCULATIONS
    ===================================================== */

    const enquiryConversionRate =
        analytics.totalEnquiries > 0
            ? Math.round(
                (analytics.convertedEnquiries /
                    analytics.totalEnquiries) *
                100
            )
            : 0;


    const enquiryCompletionRate =
        analytics.totalEnquiries > 0
            ? Math.round(
                (analytics.completedEnquiries /
                    analytics.totalEnquiries) *
                100
            )
            : 0;


    const maxMonthlyValue =
        analytics.monthlyEnquiries.length > 0
            ? Math.max(
                ...analytics.monthlyEnquiries.map(
                    (item) =>
                        Number(
                            item.count ??
                            item.value ??
                            item.total ??
                            0
                        )
                ),
                1
            )
            : 1;


    const getMonthName = (item) => {
        if (item.month) {
            return item.month;
        }

        if (item.label) {
            return item.label;
        }

        return "";
    };


    const getMonthValue = (item) => {
        return Number(
            item.count ??
            item.value ??
            item.total ??
            0
        );
    };


    const formatRevenue = (value) => {
        const amount = Number(value) || 0;

        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(1)}Cr`;
        }

        if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(1)}L`;
        }

        if (amount >= 1000) {
            return `₹${(amount / 1000).toFixed(1)}K`;
        }

        return `₹${amount.toLocaleString("en-IN")}`;
    };


    return (
        <>
            <Sidebar />

            <div className="dashboard-main">

                <Topbar />

                <div className="dashboard-content">

                    <div className="analytics-page">

                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div className="analytics-header">

                            <div>
                                <span className="analytics-eyebrow">
                                    BUSINESS OVERVIEW
                                </span>

                                <h2>Analytics</h2>

                                <p>
                                    Track your enquiries, clients,
                                    projects and business performance.
                                </p>
                            </div>

                            <button
                                className="refresh-btn"
                                onClick={fetchAnalytics}
                                disabled={loading}
                            >
                                <span className={loading ? "spin" : ""}>
                                    ↻
                                </span>

                                {loading ? "Refreshing..." : "Refresh"}
                            </button>

                        </div>


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (
                            <div className="analytics-error">
                                <div className="error-icon">!</div>

                                <div>
                                    <strong>
                                        Unable to load analytics
                                    </strong>

                                    <p>{error}</p>
                                </div>

                                <button onClick={fetchAnalytics}>
                                    Try Again
                                </button>
                            </div>
                        )}


                        {/* =================================================
                            KPI CARDS
                        ================================================= */}

                        <div className="analytics-kpis">

                            <div className="kpi-card enquiries-card">

                                <div className="kpi-top">
                                    <div className="kpi-icon">
                                        ✉
                                    </div>

                                    <span className="kpi-label">
                                        ENQUIRIES
                                    </span>
                                </div>

                                <div className="kpi-value">
                                    {loading
                                        ? "—"
                                        : analytics.totalEnquiries}
                                </div>

                                <div className="kpi-bottom">
                                    <span className="kpi-positive">
                                        {analytics.newEnquiries}
                                    </span>

                                    <span>
                                        new enquiries
                                    </span>
                                </div>

                            </div>


                            <div className="kpi-card clients-card">

                                <div className="kpi-top">
                                    <div className="kpi-icon">
                                        👥
                                    </div>

                                    <span className="kpi-label">
                                        CLIENTS
                                    </span>
                                </div>

                                <div className="kpi-value">
                                    {loading
                                        ? "—"
                                        : analytics.totalClients}
                                </div>

                                <div className="kpi-bottom">
                                    <span className="kpi-positive">
                                        Active
                                    </span>

                                    <span>
                                        client accounts
                                    </span>
                                </div>

                            </div>


                            <div className="kpi-card projects-card">

                                <div className="kpi-top">
                                    <div className="kpi-icon">
                                        ◈
                                    </div>

                                    <span className="kpi-label">
                                        PROJECTS
                                    </span>
                                </div>

                                <div className="kpi-value">
                                    {loading
                                        ? "—"
                                        : analytics.totalProjects}
                                </div>

                                <div className="kpi-bottom">
                                    <span className="kpi-progress">
                                        {analytics.activeProjects}
                                    </span>

                                    <span>
                                        active projects
                                    </span>
                                </div>

                            </div>


                            <div className="kpi-card revenue-card">

                                <div className="kpi-top">
                                    <div className="kpi-icon">
                                        ₹
                                    </div>

                                    <span className="kpi-label">
                                        REVENUE
                                    </span>
                                </div>

                                <div className="kpi-value">
                                    {loading
                                        ? "—"
                                        : formatRevenue(
                                            analytics.revenue
                                        )}
                                </div>

                                <div className="kpi-bottom">
                                    <span className="kpi-revenue">
                                        Current
                                    </span>

                                    <span>
                                        recorded revenue
                                    </span>
                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            MAIN ANALYTICS GRID
                        ================================================= */}

                        <div className="analytics-grid">

                            {/* =============================================
                                MONTHLY CHART
                            ============================================= */}

                            <div className="analytics-panel monthly-panel">

                                <div className="panel-header">

                                    <div>
                                        <h3>
                                            Monthly Enquiries
                                        </h3>

                                        <p>
                                            Enquiry activity throughout
                                            the year
                                        </p>
                                    </div>

                                    <span className="panel-badge">
                                        Yearly
                                    </span>

                                </div>


                                <div className="bar-chart">

                                    {analytics.monthlyEnquiries.length === 0 ? (

                                        <div className="chart-empty">
                                            <div>
                                                No monthly enquiry data
                                                available
                                            </div>
                                        </div>

                                    ) : (

                                        analytics.monthlyEnquiries.map(
                                            (item, index) => {

                                                const value =
                                                    getMonthValue(item);

                                                const height =
                                                    Math.max(
                                                        (value /
                                                            maxMonthlyValue) *
                                                        100,
                                                        4
                                                    );

                                                return (
                                                    <div
                                                        className="chart-column"
                                                        key={
                                                            item.month ||
                                                            item.label ||
                                                            index
                                                        }
                                                    >

                                                        <div className="chart-value">
                                                            {value}
                                                        </div>

                                                        <div className="bar-track">

                                                            <div
                                                                className="chart-bar"
                                                                style={{
                                                                    height: `${height}%`,
                                                                }}
                                                            />

                                                        </div>

                                                        <span className="chart-label">
                                                            {getMonthName(item)}
                                                        </span>

                                                    </div>
                                                );
                                            }
                                        )
                                    )}

                                </div>

                            </div>


                            {/* =============================================
                                ENQUIRY OVERVIEW
                            ============================================= */}

                            <div className="analytics-panel">

                                <div className="panel-header">

                                    <div>
                                        <h3>
                                            Enquiry Overview
                                        </h3>

                                        <p>
                                            Current enquiry status
                                        </p>
                                    </div>

                                </div>


                                <div className="status-list">

                                    <div className="status-row">

                                        <div className="status-info">

                                            <span className="status-dot new-dot" />

                                            <span>
                                                New
                                            </span>

                                        </div>

                                        <strong>
                                            {analytics.newEnquiries}
                                        </strong>

                                    </div>


                                    <div className="status-row">

                                        <div className="status-info">

                                            <span className="status-dot progress-dot" />

                                            <span>
                                                In Progress
                                            </span>

                                        </div>

                                        <strong>
                                            {analytics.inProgressEnquiries}
                                        </strong>

                                    </div>


                                    <div className="status-row">

                                        <div className="status-info">

                                            <span className="status-dot completed-dot" />

                                            <span>
                                                Completed
                                            </span>

                                        </div>

                                        <strong>
                                            {analytics.completedEnquiries}
                                        </strong>

                                    </div>


                                    <div className="status-row">

                                        <div className="status-info">

                                            <span className="status-dot converted-dot" />

                                            <span>
                                                Converted
                                            </span>

                                        </div>

                                        <strong>
                                            {analytics.convertedEnquiries}
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            BOTTOM GRID
                        ================================================= */}

                        <div className="analytics-bottom-grid">

                            {/* =============================================
                                CONVERSION
                            ============================================= */}

                            <div className="analytics-panel conversion-panel">

                                <div className="panel-header">

                                    <div>
                                        <h3>
                                            Conversion Rate
                                        </h3>

                                        <p>
                                            Enquiries converted into clients
                                        </p>
                                    </div>

                                </div>


                                <div className="conversion-content">

                                    <div
                                        className="conversion-circle"
                                        style={{
                                            "--progress":
                                                `${enquiryConversionRate * 3.6}deg`,
                                        }}
                                    >
                                        <div className="conversion-inner">
                                            <strong>
                                                {enquiryConversionRate}%
                                            </strong>

                                            <span>
                                                Conversion
                                            </span>
                                        </div>
                                    </div>


                                    <div className="conversion-details">

                                        <div>
                                            <span>
                                                Total enquiries
                                            </span>

                                            <strong>
                                                {analytics.totalEnquiries}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Converted
                                            </span>

                                            <strong>
                                                {analytics.convertedEnquiries}
                                            </strong>
                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* =============================================
                                PROJECT OVERVIEW
                            ============================================= */}

                            <div className="analytics-panel project-overview">

                                <div className="panel-header">

                                    <div>
                                        <h3>
                                            Project Overview
                                        </h3>

                                        <p>
                                            Current project distribution
                                        </p>
                                    </div>

                                </div>


                                <div className="project-stats">

                                    <div className="project-stat pending-project">

                                        <span className="project-stat-number">
                                            {analytics.pendingProjects}
                                        </span>

                                        <span className="project-stat-label">
                                            Pending
                                        </span>

                                    </div>


                                    <div className="project-stat active-project">

                                        <span className="project-stat-number">
                                            {analytics.activeProjects}
                                        </span>

                                        <span className="project-stat-label">
                                            Active
                                        </span>

                                    </div>


                                    <div className="project-stat completed-project">

                                        <span className="project-stat-number">
                                            {analytics.completedProjects}
                                        </span>

                                        <span className="project-stat-label">
                                            Completed
                                        </span>

                                    </div>

                                </div>


                                <div className="project-total">

                                    <span>
                                        Total projects
                                    </span>

                                    <strong>
                                        {analytics.totalProjects}
                                    </strong>

                                </div>

                            </div>


                            {/* =============================================
                                PERFORMANCE
                            ============================================= */}

                            <div className="analytics-panel performance-panel">

                                <div className="panel-header">

                                    <div>
                                        <h3>
                                            Performance
                                        </h3>

                                        <p>
                                            Overall business indicators
                                        </p>
                                    </div>

                                </div>


                                <div className="performance-item">

                                    <div className="performance-top">
                                        <span>
                                            Enquiry completion
                                        </span>

                                        <strong>
                                            {enquiryCompletionRate}%
                                        </strong>
                                    </div>

                                    <div className="performance-track">
                                        <div
                                            className="performance-fill blue"
                                            style={{
                                                width: `${enquiryCompletionRate}%`,
                                            }}
                                        />
                                    </div>

                                </div>


                                <div className="performance-item">

                                    <div className="performance-top">
                                        <span>
                                            Client conversion
                                        </span>

                                        <strong>
                                            {enquiryConversionRate}%
                                        </strong>
                                    </div>

                                    <div className="performance-track">
                                        <div
                                            className="performance-fill green"
                                            style={{
                                                width: `${enquiryConversionRate}%`,
                                            }}
                                        />
                                    </div>

                                </div>


                                <div className="performance-item">

                                    <div className="performance-top">
                                        <span>
                                            Project completion
                                        </span>

                                        <strong>
                                            {analytics.totalProjects > 0
                                                ? Math.round(
                                                    (analytics.completedProjects /
                                                        analytics.totalProjects) *
                                                    100
                                                )
                                                : 0}
                                            %
                                        </strong>
                                    </div>

                                    <div className="performance-track">
                                        <div
                                            className="performance-fill purple"
                                            style={{
                                                width: `${
                                                    analytics.totalProjects > 0
                                                        ? Math.round(
                                                            (analytics.completedProjects /
                                                                analytics.totalProjects) *
                                                            100
                                                        )
                                                        : 0
                                                }%`,
                                            }}
                                        />
                                    </div>

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