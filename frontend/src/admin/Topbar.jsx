import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/topbar.css";

function Topbar() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        name: "Admin",
        email: "admin@gktsoftwaresolution.com",
        image: ""
    });

    useEffect(() => {

        const savedProfile =
            localStorage.getItem("adminProfile");

        if (savedProfile) {

            try {

                const parsedProfile =
                    JSON.parse(savedProfile);

                setProfile({
                    name: parsedProfile.name || "GKT TEAM",
                    email:
                        parsedProfile.email ||
                        "gktsoftwaresolution@gmail.com",
                    image:
                        parsedProfile.image || ""
                });

            } catch (error) {

                console.error(
                    "Failed to load admin profile:",
                    error
                );

            }

        }

    }, []);


    const logout = () => {

        localStorage.removeItem("token");

        navigate("/admin");

    };


    // Generate initials if no profile image exists
    const getInitials = (name) => {

        if (!name) return "A";

        const words = name.trim().split(" ");

        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }

        return (
            words[0].charAt(0) +
            words[words.length - 1].charAt(0)
        ).toUpperCase();

    };


    return (

        <header className="topbar">

            {/* =========================
                LEFT SIDE
            ========================= */}

            <div className="topbar-left">

                <div className="topbar-brand">

                    <h1 className="topbar-title">
                        GKT CRM
                    </h1>

                    <p className="topbar-subtitle">
                        Software Solution Management
                    </p>

                </div>

            </div>


            {/* =========================
                RIGHT SIDE
            ========================= */}

            <div className="topbar-right">

                {/* PROFILE */}

                <div className="topbar-profile">

                    {/* DP */}

                    <div className="profile-avatar">

                        {profile.image ? (

                            <img
                                src={profile.image}
                                alt={profile.name}
                            />

                        ) : (

                            <span>
                                {getInitials(profile.name)}
                            </span>

                        )}

                    </div>


                    {/* DETAILS */}

                    <div className="profile-info">

                        <span className="profile-name">
                            {profile.name}
                        </span>

                        <span className="profile-email">
                            {profile.email}
                        </span>

                        <span className="profile-role">
                            Administrator
                        </span>

                    </div>

                </div>


                {/* LOGOUT */}

                <button
                    className="logout-btn"
                    onClick={logout}
                >

                    <span className="logout-icon">
                        ↪
                    </span>

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        </header>

    );
}

export default Topbar;