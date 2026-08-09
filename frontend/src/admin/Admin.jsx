import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import api from "../api";

import { ArrowRightIcon } from "../components/Icons";
import "../css/admin.css";

function Admin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        if (!email.trim()) {
            Swal.fire({
                title: "Email Required",
                text: "Please enter your email address.",
                icon: "warning",
            });
            return;
        }

        if (!password) {
            Swal.fire({
                title: "Password Required",
                text: "Please enter your password.",
                icon: "warning",
            });
            return;
        }

        try {
            setLoading(true);

            console.log(
                "Sending admin login request..."
            );

            const response = await api.post(
                "/api/admin/login",
                {
                    email: email.trim(),
                    password: password,
                }
            );

            console.log(
                "ADMIN LOGIN RESPONSE:",
                response.data
            );

            const token =
                response.data?.access_token ||
                response.data?.token;

            if (!token) {
                throw new Error(
                    "No access token returned by backend."
                );
            }

            localStorage.setItem(
                "token",
                token
            );

            if (response.data?.admin) {
                localStorage.setItem(
                    "admin",
                    JSON.stringify(
                        response.data.admin
                    )
                );
            }

            await Swal.fire({
                title: "Welcome!",
                text: "Login successful.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/admin/dashboard");

        } catch (error) {
            console.error(
                "ADMIN LOGIN ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            let errorMessage =
                "Invalid email or password.";

            if (
                Array.isArray(
                    error.response?.data?.detail
                )
            ) {
                errorMessage =
                    error.response.data.detail
                        .map(
                            (item) =>
                                item?.msg ||
                                String(item)
                        )
                        .join(", ");
            } else if (
                error.response?.data?.detail
            ) {
                errorMessage = String(
                    error.response.data.detail
                );
            } else if (
                error.request &&
                !error.response
            ) {
                errorMessage =
                    "Unable to connect to the backend server. Please check the Render server and CORS configuration.";
            }

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

    return (
        <section className="admin">

            <div className="admin__grid">

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

                <div className="admin__form">

                    <div className="admin__logo">
                        <h2>GKT</h2>

                        <p>
                            Software Solution
                        </p>
                    </div>

                    <h3>
                        Admin Login
                    </h3>

                    <form onSubmit={login}>

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

                        <button
                            className="btn-login"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span>
                                    Logging in...
                                </span>
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