"use client";

const TOKEN_KEY = "otro_admin_token";

declare global {
  interface Window {
    __otroAdminTokenMemory?: string | null;
  }
}

function getMemoryToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.__otroAdminTokenMemory ?? null;
}

function setMemoryToken(token: string | null) {
  if (typeof window === "undefined") return;
  window.__otroAdminTokenMemory = token;
}

export function readAdminToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const token = window.sessionStorage.getItem(TOKEN_KEY);
    if (token) return token;
  } catch {
    /* blocked storage */
  }

  try {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token) return token;
  } catch {
    /* blocked storage */
  }

  return getMemoryToken();
}

export function writeAdminToken(token: string) {
  setMemoryToken(token);

  try {
    window.sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* blocked storage */
  }

  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* blocked storage */
  }
}

export function clearAdminToken() {
  setMemoryToken(null);

  try {
    window.sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* blocked storage */
  }

  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* blocked storage */
  }
}
