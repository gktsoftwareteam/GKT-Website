import React from "react";
import { NavLink } from "react-router-dom";

import "../css/sidebar.css";

function Sidebar({ isOpen, onClose }) {
    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: "▣",
        },
        {
            name: "Enquiries",
            path: "/admin/enquiries",
            icon: "✉",
        },
        {
            name: "Clients",
            path: "/admin/clients",
            icon: "♙",
        },
        {
            name: "Projects",
            path: "/admin/projects",
            icon: "▤",
        },
        {
            name: "Quotations",
            path: "/admin/quotations",
            icon: "₹",
        },
        {
            name: "Analytics",
            path: "/admin/analytics",
            icon: "▥",
        },
        {
            name: "Settings",
            path: "/admin/settings",
            icon: "⚙",
        },
    ];

    const handleNavigation = () => {
        if (onClose) {
            onClose();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");

        window.location.href = "/admin";
    };

    return (
        <>
            {/* =================================================
                MOBILE OVERLAY
            ================================================= */}

            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
                className={`sidebar ${
                    isOpen ? "sidebar--open" : ""
                }`}
            >

                {/* =================================================
                    LOGO
                ================================================= */}

                <div className="sidebar__logo">

                    <div className="sidebar__logo-mark">
                        GKT
                    </div>

                    <div className="sidebar__logo-text">

                        <strong>
                            GKT
                        </strong>

                        <span>
                            Software Solution
                        </span>

                    </div>

                    {/* Mobile Close Button */}

                    <button
                        type="button"
                        className="sidebar__close"
                        onClick={onClose}
                        aria-label="Close sidebar"
                    >
                        ×
                    </button>

                </div>


                {/* =================================================
                    MENU
                ================================================= */}

                <div className="sidebar__menu">

                    <p className="sidebar__label">
                        MAIN MENU
                    </p>

                    <nav>

                        {menuItems.map((item) => (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={handleNavigation}
                                className={({ isActive }) =>
                                    `sidebar__link ${
                                        isActive
                                            ? "sidebar__link--active"
                                            : ""
                                    }`
                                }
                            >

                                <span className="sidebar__icon">
                                    {item.icon}
                                </span>

                                <span>
                                    {item.name}
                                </span>

                            </NavLink>

                        ))}

                    </nav>

                </div>


                {/* =================================================
                    BOTTOM
                ================================================= */}

                <div className="sidebar__bottom">

                    <NavLink
                        to="/"
                        className="sidebar__website"
                        onClick={handleNavigation}
                    >
                        ← Back to Website
                    </NavLink>

                    <button
                        type="button"
                        className="sidebar__logout"
                        onClick={handleLogout}
                    >

                        <span>
                            ↪
                        </span>

                        Logout

                    </button>

                </div>

            </aside>
        </>
    );
}

export default Sidebar;