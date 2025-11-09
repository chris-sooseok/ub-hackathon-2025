// src/pages/SignupPage.jsx
import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // add Link for the redirect UI
import styles from "./SignupPage.module.css";
import { validateEmail, validatePassword, validateConfirmPassword } from "./signup-page-util";

export default function SignupPage() {
  const [values, setValues] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const refs = {
    email: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");

    const nextErrors = {
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirmPassword: validateConfirmPassword(values.confirmPassword, values.password),
    };
    setErrors(nextErrors);

    const firstInvalid = Object.entries(nextErrors).find(([, msg]) => msg)?.[0];
    if (firstInvalid) {
      refs[firstInvalid].current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const req = fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // sends JSON body
        credentials: "include",                          // include cookies for session auth
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      });
      const minDelay = new Promise((r) => setTimeout(r, 2000)); // ensure 2s "Creating..."

      const [res] = await Promise.all([req, minDelay]);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(data.error || data.message || "Signup failed. Check your entries and try again.");
        return;
      }

      navigate("/app/login", { replace: true }); // go to login after success
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <h1 className={styles.title}>Sign up</h1>

        {serverError && (
          <p role="alert" className={styles.error} aria-live="assertive">
            {serverError}
          </p>
        )}

        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          ref={refs.email}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={`${styles.input} ${errors.email ? styles.inputInvalid : ""}`}
          value={values.email}
          onChange={handleChange}
          aria-invalid={!!errors.email}
          aria-describedby="email-error"
          required
        />
        {errors.email && (
          <p id="email-error" role="alert" className={styles.error}>
            {errors.email}
          </p>
        )}

        <label htmlFor="password" className={styles.label}>Password</label>
        <input
          ref={refs.password}
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          className={`${styles.input} ${errors.password ? styles.inputInvalid : ""}`}
          value={values.password}
          onChange={handleChange}
          aria-invalid={!!errors.password}
          aria-describedby="password-error"
          minLength={8}
          required
        />
        {errors.password && (
          <p id="password-error" role="alert" className={styles.error}>
            {errors.password}
          </p>
        )}

        <label htmlFor="confirmPassword" className={styles.label}>Confirm password</label>
        <input
          ref={refs.confirmPassword}
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          className={`${styles.input} ${errors.confirmPassword ? styles.inputInvalid : ""}`}
          value={values.confirmPassword}
          onChange={handleChange}
          aria-invalid={!!errors.confirmPassword}
          aria-describedby="confirmPassword-error"
          required
        />
        {errors.confirmPassword && (
          <p id="confirmPassword-error" role="alert" className={styles.error}>
            {errors.confirmPassword}
          </p>
        )}

        <button className={styles.button} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create account"}
        </button>

        {/* login redirect below the button */}
        <p className={styles.meta}>
          Already have an account?{" "}
          <Link to="/app/login" className={styles.metaLink}>Log in</Link>
        </p>
      </form>
    </div>
  );
}
