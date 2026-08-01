import React from "react";
import { Link } from "react-router-dom";
import "../css/not-found.css";

function NotFound() {
  return (
    <section className="not-found">
      <div className="container not-found__inner">
        <span className="not-found__code">404</span>
        <h1>This page went out of scope.</h1>
        <p>The page you're looking for doesn't exist or may have moved.</p>
        <Link to="/" className="btn btn-primary">
          Back to homepage
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
