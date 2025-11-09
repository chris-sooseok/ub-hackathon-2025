// src/auth/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const AuthContext = createContext(null);

async function fetch_me(signal) {
  const r = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
    method: 'GET',
    credentials: 'include', // send cookies (PHP session) with the request
    headers: { 'Accept': 'application/json' },
    signal // allows aborting the request if the component unmounts
  });
  if (!r.ok) throw new Error(`not authenticated`);
  return r.json();
}

export function AuthProvider({ children }) {
  const { pathname } = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch_me(ctrl.signal);
        setIsAuthenticated(Boolean(res?.authenticated));
      } catch {
        setIsAuthenticated(false);
      }
    })();
    return () => ctrl.abort();
  }, [pathname]);

  return (
    <AuthContext.Provider value={isAuthenticated}>
      {children}
    </AuthContext.Provider>
  );
}
