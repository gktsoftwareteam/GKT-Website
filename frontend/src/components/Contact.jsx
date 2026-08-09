import React, { useState } from "react";
import Swal from "sweetalert2";

import { supabase } from "../lib/supabase";

import "../css/contact.css";

const INITIAL_FORM = {
    name: "",
    email: "",
    phone: "",
    service: "Software Development",
    message: "",
};

function Contact() {
    const [form, setForm] =
        useState({
            ...INITIAL_FORM,
        });

    const [loading, setLoading] =
        useState(false);

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!form.name.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Name Required",
                text:
                    "Please enter your name.",
            });

            return false;
        }

        if (!form.email.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Email Required",
                text:
                    "Please enter your email address.",
            });

            return false;
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailRegex.test(
                form.email.trim()
            )
        ) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Email",
                text:
                    "Please enter a valid email address.",
            });

            return false;
        }

        if (!form.phone.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Phone Required",
                text:
                    "Please enter your phone number.",
            });

            return false;
        }

        if (!form.service.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Service Required",
                text:
                    "Please select a service.",
            });

            return false;
        }

        if (!form.message.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Message Required",
                text:
                    "Please enter your message.",
            });

            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const {
                error,
            } = await supabase
                .from("enquiries")
                .insert({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    service:
                        form.service.trim(),
                    message:
                        form.message.trim(),
                    status: "New",
                });

            if (error) {
                throw error;
            }

            await Swal.fire({
                icon: "success",
                title:
                    "Enquiry Submitted!",
                text:
                    "Thank you for contacting us. Our team will get back to you soon.",
                confirmButtonText:
                    "OK",
            });

            setForm({
                ...INITIAL_FORM,
            });
        } catch (error) {
            console.error(
                "CONTACT FORM ERROR:",
                error
            );

            let errorMessage =
                "Unable to submit your enquiry. Please try again.";

            if (error?.message) {
                errorMessage =
                    error.message;
            }

            Swal.fire({
                icon: "error",
                title:
                    "Submission Failed",
                text: errorMessage,
                confirmButtonText:
                    "Try Again",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            className="contact-section"
            id="contact"
        >

            <div className="contact-container">

                <div className="contact-info">

                    <span className="contact-eyebrow">
                        GET IN TOUCH
                    </span>

                    <h2>
                        Let's Build Something
                        <span>
                            {" "}
                            Great Together.
                        </span>
                    </h2>

                    <p className="contact-description">
                        Have a project in mind or
                        looking for the right
                        technology solution? Send
                        us your requirements and
                        our team will get back to
                        you.
                    </p>

                    <div className="contact-details">

                        <div className="contact-detail-item">

                            <div className="contact-detail-icon">
                                ✉
                            </div>

                            <div>
                                <span>
                                    Email
                                </span>

                                <strong>
                                    gktsoftwaresolution@gmail.com
                                </strong>
                            </div>

                        </div>

                        <div className="contact-detail-item">

                            <div className="contact-detail-icon">
                                ☎
                            </div>

                            <div>
                                <span>
                                    Phone
                                </span>

                                <strong>
                                    +91 87783 41227
                                </strong>
                            </div>

                        </div>

                        <div className="contact-detail-item">

                            <div className="contact-detail-icon">
                                📍
                            </div>

                            <div>
                                <span>
                                    Location
                                </span>

                                <strong>
                                    Tamil Nadu, India
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="contact-form-wrapper">

                    <form
                        className="contact-form"
                        onSubmit={
                            handleSubmit
                        }
                        noValidate
                    >

                        <div className="form-title">

                            <h3>
                                Send Us an Enquiry
                            </h3>

                            <p>
                                Tell us about your
                                project and
                                requirements.
                            </p>

                        </div>

                        <div className="form-group">

                            <label htmlFor="contact-name">
                                Full Name
                            </label>

                            <input
                                id="contact-name"
                                type="text"
                                name="name"
                                value={
                                    form.name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter your name"
                                autoComplete="name"
                                disabled={
                                    loading
                                }
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="contact-email">
                                Email Address
                            </label>

                            <input
                                id="contact-email"
                                type="email"
                                name="email"
                                value={
                                    form.email
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter your email"
                                autoComplete="email"
                                disabled={
                                    loading
                                }
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="contact-phone">
                                Phone Number
                            </label>

                            <input
                                id="contact-phone"
                                type="tel"
                                name="phone"
                                value={
                                    form.phone
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter your phone number"
                                autoComplete="tel"
                                disabled={
                                    loading
                                }
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="contact-service">
                                Service
                            </label>

                            <select
                                id="contact-service"
                                name="service"
                                value={
                                    form.service
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    loading
                                }
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

                        <div className="form-group">

                            <label htmlFor="contact-message">
                                Message
                            </label>

                            <textarea
                                id="contact-message"
                                name="message"
                                value={
                                    form.message
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Tell us about your project..."
                                rows="6"
                                disabled={
                                    loading
                                }
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="contact-submit-btn"
                            disabled={
                                loading
                            }
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

                                    <span>
                                        →
                                    </span>
                                </>
                            )}

                        </button>

                        <p className="contact-form-note">
                            Your information is
                            safe with us. We will
                            only use your details
                            to respond to your
                            enquiry.
                        </p>

                    </form>

                </div>

            </div>

        </section>
    );
}

export default Contact;