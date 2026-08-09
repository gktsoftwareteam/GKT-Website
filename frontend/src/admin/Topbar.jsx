import React from "react";
import { useLocation } from "react-router-dom";

import "../css/topbar.css";

function Topbar({ onMenuClick }) {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;

        if (path === "/admin/dashboard") {
            return "Dashboard";
        }

        if (path === "/admin/enquiries") {
            return "Enquiries";
        }

        if (path === "/admin/clients") {
            return "Clients";
        }

        if (path === "/admin/projects") {
            return "Projects";
        }

        if (path === "/admin/quotations") {
            return "Quotations";
        }

        if (path === "/admin/analytics") {
            return "Analytics";
        }

        if (path === "/admin/settings") {
            return "Settings";
        }

        return "Admin Panel";
    };

    const pageTitle = getPageTitle();

    return (
        <header className="topbar">

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="topbar__left">

                {/* Hamburger */}

                <button
                    type="button"
                    className="topbar__menu-btn"
                    onClick={onMenuClick}
                    aria-label="Open navigation menu"
                    aria-expanded="false"
                >

                    <span></span>
                    <span></span>
                    <span></span>

                </button>


                {/* Page Title */}

                <div className="topbar__title">

                    <h1>
                        {pageTitle}
                    </h1>

                    <p>
                        GKT Software Solution
                    </p>

                </div>

            </div>


            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="topbar__right">

                {/* Notification */}

                <button
                    type="button"
                    className="topbar__notification"
                    aria-label="Notifications"
                >
                    <span>
                        🔔
                    </span>

                    <b>
                        0
                    </b>
                </button>


                {/* Divider */}

                <div className="topbar__divider"></div>


                {/* Admin Profile */}

                <div className="topbar__profile">

                    <div className="topbar__avatar">
                        A
                    </div>

                    <div className="topbar__user">

                        <strong>
                            Admin
                        </strong>

                        <span>
                            Administrator
                        </span>

                    </div>

                </div>

            </div>

        </header>
    );
}

export default Topbar;