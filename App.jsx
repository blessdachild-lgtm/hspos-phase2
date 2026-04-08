import React, { useState, useEffect, useCallback } from "react";

/* =========================
   GLOBAL LAYOUT LOCK (KEY)
========================= */
const appStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#0e0e0e",
  color: "#fff",
  fontFamily: "Inter, sans-serif",
  padding: "20px",
  boxSizing: "border-box"
};

const containerStyle = {
  width: "100%",
  maxWidth: "420px",        // 🔥 THIS MATCHES PHASE 1 WIDTH
  background: "#171717",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 0 40px rgba(0,0,0,0.5)"
};

const titleStyle = {
  fontSize: "22px",
  fontWeight: "600",
  marginBottom: "12px"
};

const textStyle = {
  fontSize: "14px",
  lineHeight: "1.5",
  opacity: 0.85
};

const buttonStyle = {
  marginTop: "20px",
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#ffffff",
  color: "#000",
  fontWeight: "600",
  cursor: "pointer"
};

/* =========================
   APP
========================= */

export default function App() {
  const [screen, setScreen] = useState("entry");

  if (screen === "entry") {
    return (
      <div style={appStyle}>
        <div style={containerStyle}>
          <div style={titleStyle}>HS-POS Phase 2</div>
          <div style={textStyle}>
            This is now using the SAME layout system as Phase 1.
          </div>

          <button style={buttonStyle} onClick={() => setScreen("dashboard")}>
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={appStyle}>
      <div style={containerStyle}>
        <div style={titleStyle}>Dashboard</div>

        <div style={textStyle}>
          Layout is now:
          <br />✔ centered
          <br />✔ readable width
          <br />✔ mobile consistent
          <br />✔ no overflow / no side scroll
        </div>

        <button style={buttonStyle} onClick={() => setScreen("entry")}>
          Back
        </button>
      </div>
    </div>
  );
}
