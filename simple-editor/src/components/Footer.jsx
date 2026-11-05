import React from "react";

export default function Footer({ onUpload }) {
  return (
    <label 
      className="upload-btn" 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        gap: "4px", 
        padding: "10px 16px", 
        background: "#2a2a2a", 
        color: "#fff", 
        border: "1px dashed #00e5ff", 
        borderRadius: "8px", 
        cursor: "pointer",
        textAlign: "center",
        fontSize: "13px",
        fontWeight: "bold",
        transition: "all 0.2s ease"
      }}
    >
      <span style={{ fontSize: "16px" }}>📁</span>
      <span>+ Upload Footer</span>
      <span style={{ fontSize: "10px", color: "#aaa", fontWeight: "normal" }}>Vertical Layout</span>
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={onUpload}
      />
    </label>
  );
}