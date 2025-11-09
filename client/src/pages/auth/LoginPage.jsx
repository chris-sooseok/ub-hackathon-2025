// src/pages/LoginPage.jsx
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";  // useNavigate: programmatic redirect
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate(); // gives you the navigate() function

  const refs = {
    email: useRef(null),
    password: useRef(null),
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(data.error || data.message || "Login failed. Check your email or password.");
        return;
      }

      // redirect to your landing page on success
      navigate("/app", { replace: true }); // change "/app" if your landing route differs
    } catch (err) {
      setServerError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <h1 className={styles.title}>Log in</h1>

        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          ref={refs.email}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={styles.input}
          value={values.email}
          onChange={handleChange}
        />

        <label htmlFor="password" className={styles.label}>Password</label>
        <input
          ref={refs.password}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className={styles.input}
          value={values.password}
          onChange={handleChange}
        />

        {serverError && (
          <p role="alert" className={styles.error}>
            {serverError}
          </p>
        )}

        <button className={styles.button} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>

        <p className={styles.meta}>
          Don’t have an account?{" "}
          <Link to="/app/signup" className={styles.metaLink}>Sign up</Link>
        </p>
      </form>
    </div>
  );
}
