import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "../components/Icons";
import "../css/admin.css";
import Swal from "sweetalert2";

// =====================================================
// API URL
// =====================================================

const API_URL = process.env.REACT_APP_API_URL || "";

// =====================================================
// ADMIN LOGIN
// =====================================================

function Admin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // =====================================================
    // LOGIN
    // =====================================================

    const login = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        // =================================================
        // CHECK API URL
        // =================================================

        if (!REACT_APP_API_URL) {
            Swal.fire({
                title: "Configuration Error",
                text:
                    "Backend API URL is not configured. Please contact the administrator.",
                icon: "error",
            });

            console.error(
                "REACT_APP_API_URL is not configured."
            );

            return;
        }

        // =================================================
        // VALIDATION
        // =================================================

        if (!email.trim()) {
            Swal.fire({
                title: "Email Required",
                text: "Please enter your email address.",
                icon: "warning",
            });

            return;
        }

        if (!password.trim()) {
            Swal.fire({
                title: "Password Required",
                text: "Please enter your password.",
                icon: "warning",
            });

            return;
        }

        try {
            setLoading(true);

            // =================================================
            // ADMIN LOGIN API
            // =================================================

            const response = await axios.post(
                `${REACT_APP_API_URL}/api/admin/login`,
                {
                    email: email.trim(),
                    password: password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    timeout: 15000,
                }
            );

            console.log(
                "ADMIN LOGIN RESPONSE:",
                response.data
            );

            // =================================================
            // GET TOKEN
            // =================================================

            const token =
                response.data?.access_token ||
                response.data?.token;

            if (!token) {
                throw new Error(
                    "Login succeeded but no access token was returned by the server."
                );
            }

            // =================================================
            // SAVE TOKEN
            // =================================================

            localStorage.setItem(
                "token",
                token
            );

            // Optional: save admin information
            if (response.data?.admin) {
                localStorage.setItem(
                    "admin",
                    JSON.stringify(
                        response.data.admin
                    )
                );
            }

            // =================================================
            // SUCCESS
            // =================================================

            await Swal.fire({
                title: "Welcome!",
                text: "Login successful.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            // =================================================
            // NAVIGATE
            // =================================================

            navigate("/admin/dashboard");

        } catch (error) {
            console.error(
                "ADMIN LOGIN ERROR:",
                error.response?.data || error.message
            );

            let errorMessage =
                "Invalid email or password.";

            // FastAPI validation errors
            if (
                Array.isArray(
                    error.response?.data?.detail
                )
            ) {
                errorMessage =
                    error.response.data.detail
                        .map((item) =>
                            item.msg
                                ? item.msg
                                : String(item)
                        )
                        .join(", ");
            }

            // FastAPI normal detail
            else if (
                error.response?.data?.detail
            ) {
                errorMessage =
                    error.response.data.detail;
            }

            // Network/CORS error
            else if (
                error.request &&
                !error.response
            ) {
                errorMessage =
                    "Unable to connect to the backend server. Please check the API URL, Render server and CORS configuration.";
            }

            // =================================================
            // ERROR ALERT
            // =================================================

            Swal.fire({
                title: "Login Failed",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "Try Again",
            });

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section className="admin">

            <div className="admin__grid">

                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div className="admin__info">

                    <p className="eyebrow">
                        Admin Portal
                    </p>

                    <h1>
                        Welcome Back
                    </h1>

                    <p className="admin__lead">
                        Login to manage customer
                        enquiries, projects,
                        quotations and your
                        GKT Software Solution
                        dashboard.
                    </p>

                </div>

                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div className="admin__form">

                    <div className="admin__logo">

                        <h2>
                            GKT
                        </h2>

                        <p>
                            Software Solution
                        </p>

                    </div>

                    <h3>
                        Admin Login
                    </h3>

                    <form onSubmit={login}>

                        {/* =========================================
                            EMAIL
                        ========================================= */}

                        <div className="field">

                            <label htmlFor="admin-email">
                                Email
                            </label>

                            <input
                                id="admin-email"
                                type="email"
                                placeholder="admin@gkt.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                autoComplete="email"
                                disabled={loading}
                                required
                            />

                        </div>

                        {/* =========================================
                            PASSWORD
                        ========================================= */}

                        <div className="field">

                            <label htmlFor="admin-password">
                                Password
                            </label>

                            <input
                                id="admin-password"
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                autoComplete="current-password"
                                disabled={loading}
                                required
                            />

                        </div>

                        {/* =========================================
                            LOGIN BUTTON
                        ========================================= */}

                        <button
                            className="btn-login"
                            type="submit"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span>
                                        Logging in...
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span>
                                        Login
                                    </span>

                                    <ArrowRightIcon />
                                </>
                            )}

                        </button>

                    </form>

                </div>

            </div>

        </section>
    );
}

export default Admin;
