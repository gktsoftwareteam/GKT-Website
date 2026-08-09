import React from "react";
import { NavLink, useLocation } from "react-router-dom";

import "../css/sidebar.css";

function Sidebar() {
    const location = useLocation();

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

    return (
        <aside className="sidebar">

            <div className="sidebar__logo">
                <div className="sidebar__logo-mark">
                    GKT
                </div>

                <div className="sidebar__logo-text">
                    <strong>GKT</strong>
                    <span>Software Solution</span>
                </div>
            </div>

            <div className="sidebar__menu">

                <p className="sidebar__label">
                    MAIN MENU
                </p>

                <nav>

                    {menuItems.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
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

            <div className="sidebar__bottom">

                <NavLink
                    to="/"
                    className="sidebar__website"
                >
                    ← Back to Website
                </NavLink>

                <button
                    className="sidebar__logout"
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("admin");
                        window.location.href = "/admin";
                    }}
                >
                    <span>↪</span>
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;