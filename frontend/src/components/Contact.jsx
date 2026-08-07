import React, { useState } from "react";
import axios from "axios";
import useReveal from "./useReveal";
import { MailIcon, PhoneIcon, PinIcon, ArrowRightIcon, CheckIcon } from "./Icons";
import "../css/contact.css";

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

  const handleChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));

  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
};

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) {
      next.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!form.message.trim()) next.message = "Tell us a little about your project.";
    return next;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const nextErrors = validate();

  if (Object.keys(nextErrors).length > 0) {
    setErrors(nextErrors);
    return;
  }

  setErrors({});

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/enquiries",
      form
    );

    console.log(response.data);

    alert("Enquiry submitted successfully!");

    setSubmitted(true);
    setForm(INITIAL_STATE);

  } catch (error) {
    console.log("ERROR:");
    console.log(error.response?.data);

    alert("Something went wrong.");
  }
};

  return (
    <section className="section contact" id="contact" ref={ref}>
      <div className="container contact__grid">
        <div className="contact__info reveal">
          <p className="eyebrow">Contact Us</p>
          <h2>Let's build something worth shipping</h2>
          <p className="contact__lead">
            Tell us about your product and timeline — we'll reply with next
            steps and, if it's a fit, a free scoping call.
          </p>

          <ul className="contact__details">
            <li>
              <span className="contact__icon"><MailIcon /></span>
              <div>
                <strong>Email</strong>
                <span>gktsoftwaresolution@gmail.com</span>
              </div>
            </li>
            <li>
              <span className="contact__icon"><PhoneIcon /></span>
              <div>
                <strong>Phone</strong>
                <span>+91 8778341227 </span>
              </div>
            </li>
            <li>
              <span className="contact__icon"><PinIcon /></span>
              <div>
                <strong>Work Place</strong>
                <span>Avadi, Chennai-600054, TamilNadu</span>
              </div>
            </li>
          </ul>
        </div>

        <form className="contact__form reveal reveal-delay-1" onSubmit={handleSubmit} noValidate>
          {submitted && (
            <div className="contact__success" role="status">
              <CheckIcon /> Thanks — your message is in. We'll be in touch within one business day.
            </div>
          )}

          <div className="contact__field">
  <label htmlFor="name">Full name</label>
  <input
    id="name"
    name="name"
    type="text"
    value={form.name}
    onChange={handleChange}
    aria-invalid={Boolean(errors.name)}
  />
  {errors.name && (
    <span className="contact__error">{errors.name}</span>
  )}
</div>

<div className="contact__field">
  <label htmlFor="email">Work email</label>
  <input
    id="email"
    name="email"
    type="email"
    value={form.email}
    onChange={handleChange}
    aria-invalid={Boolean(errors.email)}
  />
  {errors.email && (
    <span className="contact__error">{errors.email}</span>
  )}
</div>

<div className="contact__field">
  <label htmlFor="phone">Contact number</label>
  <input
    id="phone"
    name="phone"
    type="tel"
    value={form.phone}
    onChange={handleChange}
    aria-invalid={Boolean(errors.phone)}
  />
  {errors.phone && (
    <span className="contact__error">{errors.phone}</span>
  )}
</div>

          <div className="contact__field">
            <label htmlFor="service">Service you need</label>
            <select id="service" name="service" value={form.service} onChange={handleChange}>
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
            <label htmlFor="message">Project details</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              placeholder="What are you trying to build?"
              aria-invalid={Boolean(errors.message)}
            />
            {errors.message && <span className="contact__error">{errors.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary contact__submit">
            Send Message <ArrowRightIcon />
          </button>
        </form>
      </div>
    </section>
  );
}
export default Contact;
