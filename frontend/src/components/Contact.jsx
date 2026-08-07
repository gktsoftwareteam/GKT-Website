import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useReveal from "./useReveal";

import {
  MailIcon,
  PhoneIcon,
  PinIcon,
  ArrowRightIcon,
  CheckIcon,
} from "./Icons";

import "../css/contact.css";

const API_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const INITIAL_STATE = {
  name: "",
  email: "",
  phone: "",
  service: "Software Development",
  message: "",
};

function Contact() {
  const ref = useReveal();

  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Please enter your email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Please enter your contact number.";
    }

    if (!form.message.trim()) {
      nextErrors.message =
        "Tell us a little about your project.";
    }

    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/enquiries`,
        form
      );

      console.log("Enquiry response:", response.data);

      setSubmitted(true);
      setForm(INITIAL_STATE);

      Swal.fire({
        icon: "success",
        title: "Enquiry Submitted!",
        text: "Thank you. We will contact you shortly.",
        confirmButtonText: "Great",
      });
    } catch (error) {
      console.error(
        "ENQUIRY ERROR:",
        error.response?.data || error.message
      );

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error.response?.data?.detail ||
          "Unable to submit your enquiry. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact" ref={ref}>
      <div className="container contact__grid">

        <div className="contact__info reveal">
          <p className="eyebrow">Contact Us</p>

          <h2>Let's build something worth shipping</h2>

          <p>
            Tell us about your product and timeline — we'll reply
            with next steps and, if it's a fit, a free scoping call.
          </p>

          <ul className="contact__details">

            <li>
              <span className="contact__icon">
                <MailIcon />
              </span>

              <div>
                <strong>Email</strong>
                <span>
                  gktsoftwaresolution@gmail.com
                </span>
              </div>
            </li>

            <li>
              <span className="contact__icon">
                <PhoneIcon />
              </span>

              <div>
                <strong>Phone</strong>
                <span>+91 8778341227</span>
              </div>
            </li>

            <li>
              <span className="contact__icon">
                <PinIcon />
              </span>

              <div>
                <strong>Work Place</strong>
                <span>
                  Avadi, Chennai-600054, TamilNadu
                </span>
              </div>
            </li>

          </ul>
        </div>

        <form
          className="contact__form reveal reveal-delay-1"
          onSubmit={handleSubmit}
          noValidate
        >

          {submitted && (
            <div
              className="contact__success"
              role="status"
            >
              <CheckIcon />
              Thanks — your message is in. We'll be in
              touch within one business day.
            </div>
          )}

          <div className="contact__field">

            <label htmlFor="name">
              Full name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              aria-invalid={Boolean(errors.name)}
            />

            {errors.name && (
              <span className="contact__error">
                {errors.name}
              </span>
            )}

          </div>

          <div className="contact__field">

            <label htmlFor="email">
              Work email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              aria-invalid={Boolean(errors.email)}
            />

            {errors.email && (
              <span className="contact__error">
                {errors.email}
              </span>
            )}

          </div>

          <div className="contact__field">

            <label htmlFor="phone">
              Contact number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              aria-invalid={Boolean(errors.phone)}
            />

            {errors.phone && (
              <span className="contact__error">
                {errors.phone}
              </span>
            )}

          </div>

          <div className="contact__field">

            <label htmlFor="service">
              Service you need
            </label>

            <select
              id="service"
              name="service"
              value={form.service}
              onChange={handleChange}
            >
              <option>Software Development</option>
              <option>Web Development</option>
              <option>Mobile App Development</option>
              <option>UI/UX Design</option>
              <option>Cloud Solutions</option>
              <option>Data Analytics</option>
              <option>AI Solutions</option>
              <option>IT Consulting</option>
            </select>

          </div>

          <div className="contact__field">

            <label htmlFor="message">
              Project details
            </label>

            <textarea
              id="message"
              name="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              placeholder="What are you trying to build?"
              aria-invalid={Boolean(errors.message)}
            />

            {errors.message && (
              <span className="contact__error">
                {errors.message}
              </span>
            )}

          </div>

          <button
            type="submit"
            className="btn btn-primary contact__submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}

            {!loading && <ArrowRightIcon />}
          </button>

        </form>

      </div>
    </section>
  );
}

export default Contact;