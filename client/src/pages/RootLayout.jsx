// src/layouts/RootLayout.jsx
import React, { useContext } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RootLayout() {
  const isAuthenticated = useContext(AuthContext); // boolean from AuthContext
  const { pathname } = useLocation();

  // while auth is unknown, don't redirect yet
  if (isAuthenticated === null) return null; // or a tiny loader if you want

  // If authenticated, block access to login/signup and send to landing
  if (isAuthenticated && (pathname === "/app/login" || pathname === "/app/signup")) {
    return <Navigate to="/app" replace />;
  }

  const publicPaths = ["/app", "/app/login", "/app/signup"];

  // If not authenticated, allow only public pages
  if (!isAuthenticated && !publicPaths.includes(pathname)) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}
