// src/pages/LoginPage.jsx
import React, { useRef, useState } from "react";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Adjust the URL to your backend route
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // tell server we send JSON
        credentials: "include",                          // send cookies for session auth
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!res.ok) {
        // Try to read server error message; fall back to a generic one
        const data = await res.json().catch(() => ({}));
        setServerError(data.error || data.message || "Login failed. Check your email or password.");
        return;
      }

      // Success: you can redirect or refresh app state here
      console.log("login success");
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
      </form>
    </div>
  );
}
