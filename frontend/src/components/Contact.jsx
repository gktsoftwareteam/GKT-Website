import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import "../css/contact.css";

// =====================================================
// API URL
// =====================================================

const API_URL = process.env.REACT_APP_API_URL || "";

// =====================================================
// INITIAL FORM
// =====================================================

const INITIAL_FORM = {
    name: "",
    email: "",
    phone: "",
    service: "Software Development",
    message: "",
};

// =====================================================
// CONTACT COMPONENT
// =====================================================

function Contact() {
    const [form, setForm] = useState({
        ...INITIAL_FORM,
    });

    const [loading, setLoading] = useState(false);

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // VALIDATE FORM
    // =====================================================

    const validateForm = () => {
        if (!form.name.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Name Required",
                text: "Please enter your name.",
            });

            return false;
        }

        if (!form.email.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Email Required",
                text: "Please enter your email address.",
            });

            return false;
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(form.email.trim())) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Email",
                text: "Please enter a valid email address.",
            });

            return false;
        }

        if (!form.phone.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Phone Required",
                text: "Please enter your phone number.",
            });

            return false;
        }

        if (!form.service.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Service Required",
                text: "Please select a service.",
            });

            return false;
        }

        if (!form.message.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Message Required",
                text: "Please enter your message.",
            });

            return false;
        }

        return true;
    };

    // =====================================================
    // SUBMIT FORM
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        // =================================================
        // CHECK API URL
        // =================================================

        if (!API_URL) {
            console.error(
                "REACT_APP_API_URL is not configured."
            );

            Swal.fire({
                icon: "error",
                title: "Configuration Error",
                text:
                    "Backend API URL is not configured. Please contact the administrator.",
            });

            return;
        }

        try {
            setLoading(true);

            // =================================================
            // SEND ENQUIRY
            // =================================================

            const response = await axios.post(
                `${API_URL}/api/enquiries`,
                {
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    service: form.service.trim(),
                    message: form.message.trim(),
                }
            );

            console.log(
                "ENQUIRY RESPONSE:",
                response.data
            );

            // =================================================
            // SUCCESS
            // =================================================

            Swal.fire({
                icon: "success",
                title: "Enquiry Submitted!",
                text:
                    "Thank you for contacting us. Our team will get back to you soon.",
                confirmButtonText: "OK",
            });

            // =================================================
            // RESET FORM
            // =================================================

            setForm({
                ...INITIAL_FORM,
            });
        } catch (error) {
            console.error(
                "CONTACT FORM ERROR:",
                error.response?.data || error.message
            );

            let errorMessage =
                "Unable to submit your enquiry. Please try again.";

            if (error.response?.data?.detail) {
                if (
                    Array.isArray(
                        error.response.data.detail
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
                } else {
                    errorMessage =
                        error.response.data.detail;
                }
            }

            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text: errorMessage,
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
        <section
            className="contact-section"
            id="contact"
        >
            <div className="contact-container">

                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div className="contact-info">

                    <span className="contact-eyebrow">
                        GET IN TOUCH
                    </span>

                    <h2>
                        Let's Build Something
                        <span> Great Together.</span>
                    </h2>

                    <p>
                        Have a project in mind or looking
                        for the right technology solution?
                        Send us your requirements and our
                        team will get back to you.
                    </p>

                    {/* =============================================
                        CONTACT DETAILS
                    ============================================= */}

                    <div className="contact-details">

                        <div className="contact-detail-item">

                            <div className="contact-detail-icon">
                                ✉
                            </div>

                            <div>
                                <span>Email</span>

                                <strong>
                                    info@gktsoftwaresolution.com
                                </strong>
                            </div>

                        </div>

                        <div className="contact-detail-item">

                            <div className="contact-detail-icon">
                                ☎
                            </div>

                            <div>
                                <span>Phone</span>

                                <strong>
                                    +91 XXXXX XXXXX
                                </strong>
                            </div>

                        </div>

                        <div className="contact-detail-item">

                            <div className="contact-detail-icon">
                                📍
                            </div>

                            <div>
                                <span>Location</span>

                                <strong>
                                    Tamil Nadu, India
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    CONTACT FORM
                ================================================= */}

                <div className="contact-form-wrapper">

                    <form
                        className="contact-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        <div className="form-title">
                            <h3>
                                Send Us an Enquiry
                            </h3>

                            <p>
                                Tell us about your project
                                and requirements.
                            </p>
                        </div>

                        {/* =========================================
                            NAME
                        ========================================= */}

                        <div className="form-group">

                            <label htmlFor="contact-name">
                                Full Name
                            </label>

                            <input
                                id="contact-name"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                autoComplete="name"
                                disabled={loading}
                                required
                            />

                        </div>

                        {/* =========================================
                            EMAIL
                        ========================================= */}

                        <div className="form-group">

                            <label htmlFor="contact-email">
                                Email Address
                            </label>

                            <input
                                id="contact-email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                autoComplete="email"
                                disabled={loading}
                                required
                            />

                        </div>

                        {/* =========================================
                            PHONE
                        ========================================= */}

                        <div className="form-group">

                            <label htmlFor="contact-phone">
                                Phone Number
                            </label>

                            <input
                                id="contact-phone"
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                autoComplete="tel"
                                disabled={loading}
                                required
                            />

                        </div>

                        {/* =========================================
                            SERVICE
                        ========================================= */}

                        <div className="form-group">

                            <label htmlFor="contact-service">
                                Service
                            </label>

                            <select
                                id="contact-service"
                                name="service"
                                value={form.service}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            >
                                <option value="Software Development">
                                    Software Development
                                </option>

                                <option value="Web Development">
                                    Web Development
                                </option>

                                <option value="Mobile App Development">
                                    Mobile App Development
                                </option>

                                <option value="UI/UX Design">
                                    UI/UX Design
                                </option>

                                <option value="Cloud Solutions">
                                    Cloud Solutions
                                </option>

                                <option value="AI & Machine Learning">
                                    AI & Machine Learning
                                </option>

                                <option value="Digital Marketing">
                                    Digital Marketing
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </select>

                        </div>

                        {/* =========================================
                            MESSAGE
                        ========================================= */}

                        <div className="form-group">

                            <label htmlFor="contact-message">
                                Message
                            </label>

                            <textarea
                                id="contact-message"
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Tell us about your project..."
                                rows="6"
                                disabled={loading}
                                required
                            />

                        </div>

                        {/* =========================================
                            SUBMIT
                        ========================================= */}

                        <button
                            type="submit"
                            className="contact-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="submit-spinner">
                                        ⟳
                                    </span>

                                    Sending...
                                </>
                            ) : (
                                <>
                                    Send Enquiry
                                    <span>→</span>
                                </>
                            )}
                        </button>

                        {/* =========================================
                            PRIVACY TEXT
                        ========================================= */}

                        <p className="contact-form-note">
                            Your information is safe with us.
                            We will only use your details to
                            respond to your enquiry.
                        </p>

                    </form>

                </div>

            </div>
        </section>
    );
}

export default Contact;
