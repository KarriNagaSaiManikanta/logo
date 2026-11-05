import React, { useRef, useState } from "react";

export default function ImageCrop({ image, onCancel, onApply }) {
  const imageRef = useRef(null);
  const stageRef = useRef(null);
  const startRef = useRef(null);

  const [selection, setSelection] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  // Zoom & Pan States
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Animation Duration State (in seconds)
  const [animDuration, setAnimDuration] = useState("1.5");

  // Handle Zoom In / Zoom Out with boundary caps
  const handleZoom = (newZoom) => {
    const clampedZoom = Math.min(Math.max(newZoom, 1), 3); // Max 3x zoom, Min 1x
    setZoom(clampedZoom);
    if (clampedZoom === 1) {
      setPan({ x: 0, y: 0 });
    }
  };

  // Get cursor position relative to the actual image with zoom transform calculation
  const getPosition = (e) => {
    const rect = stageRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    return {
      x: Math.max(0, Math.min(rawX, rect.width)),
      y: Math.max(0, Math.min(rawY, rect.height))
    };
  };

  // Start selection
  const startCrop = (e) => {
    if (!imageRef.current) return;

    e.preventDefault();
    stageRef.current.setPointerCapture(e.pointerId);

    const pos = getPosition(e);
    startRef.current = pos;

    setSelection({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0
    });

    setDragging(true);
  };

  // Drag selection
  const moveCrop = (e) => {
    if (!dragging || !startRef.current) return;

    const pos = getPosition(e);
    const start = startRef.current;

    setSelection({
      x: Math.min(start.x, pos.x),
      y: Math.min(start.y, pos.y),
      width: Math.abs(pos.x - start.x),
      height: Math.abs(pos.y - start.y)
    });
  };

  // Stop selection
  const stopCrop = (e) => {
    if (!dragging) return;

    setDragging(false);
    startRef.current = null;

    if (stageRef.current?.hasPointerCapture(e.pointerId)) {
      stageRef.current.releasePointerCapture(e.pointerId);
    }
  };

  // Apply crop with accurate Zoom scale scaling
  const applyCrop = () => {
    if (!selection || selection.width < 5 || selection.height < 5) {
      alert("Please select an image area first");
      return;
    }

    setLoading(true);

    try {
      const img = imageRef.current;
      const rect = stageRef.current.getBoundingClientRect();

      const scaleX = img.naturalWidth / rect.width;
      const scaleY = img.naturalHeight / rect.height;

      const sx = Math.round(selection.x * scaleX);
      const sy = Math.round(selection.y * scaleY);
      const sw = Math.round(selection.width * scaleX);
      const sh = Math.round(selection.height * scaleY);

      const canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        img,
        sx,
        sy,
        sw,
        sh,
        0,
        0,
        sw,
        sh
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          alert("Crop failed");
          setLoading(false);
          return;
        }

        const croppedUrl = URL.createObjectURL(blob);
        onApply(croppedUrl);
      }, "image/png");

    } catch (error) {
      console.error("Crop error:", error);
      alert("Image crop failed");
      setLoading(false);
    }
  };

  return (
    <div className="crop-overlay">
      {/* Dynamic Inline CSS for White Shadow & Blink Animation with Custom Duration */}
      <style>{`
        @keyframes borderBlink {
          0% { 
            border-color: #00e5ff; 
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 20px 5px rgba(255, 255, 255, 0.8), 0 0 10px rgba(0, 229, 255, 0.9); 
          }
          50% { 
            border-color: #ff007f; 
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 30px 10px rgba(255, 255, 255, 1), 0 0 15px rgba(255, 0, 127, 0.9); 
          }
          100% { 
            border-color: #00e5ff; 
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 20px 5px rgba(255, 255, 255, 0.8), 0 0 10px rgba(0, 229, 255, 0.9); 
          }
        }
        .animated-crop-selection {
          animation: borderBlink ${animDuration}s infinite ease-in-out;
        }
      `}</style>

      <div className="crop-box" style={{ background: "#1a1a1a", color: "#fff", padding: "20px", borderRadius: "12px" }}>
        <h3>Free Image Crop</h3>

        <p className="crop-info" style={{ fontSize: "13px", color: "#aaa" }}>
          Click and drag anywhere on the image to crop
        </p>

        {/* Toolbar: Zoom & Animation Speed Controls */}
        <div 
          className="zoom-toolbar" 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "12px", 
            marginBottom: "12px",
            flexWrap: "wrap"
          }}
        >
          {/* Zoom controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button 
              type="button" 
              onClick={() => handleZoom(zoom - 0.25)} 
              disabled={zoom <= 1}
              style={{ padding: "4px 8px", cursor: "pointer" }}
            >
              🔍 -
            </button>
            
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => handleZoom(parseFloat(e.target.value))}
              style={{ width: "90px", cursor: "pointer" }}
            />

            <button 
              type="button" 
              onClick={() => handleZoom(zoom + 0.25)} 
              disabled={zoom >= 3}
              style={{ padding: "4px 8px", cursor: "pointer" }}
            >
              🔍 +
            </button>
            <span style={{ fontSize: "11px", color: "#ccc" }}>{Math.round(zoom * 100)}%</span>
          </div>

          {/* Animation Duration Dropdown */}
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#ddd" }}>
            Blink Time:
            <select
              value={animDuration}
              onChange={(e) => setAnimDuration(e.target.value)}
              style={{ padding: "4px 6px", background: "#333", color: "#fff", border: "1px solid #555", borderRadius: "4px" }}
            >
              <option value="0.5">0.5s (Fast)</option>
              <option value="1">1.0s</option>
              <option value="1.5">1.5s (Default)</option>
              <option value="2.5">2.5s (Slow)</option>
              <option value="4">4.0s (Very Slow)</option>
            </select>
          </label>

          {zoom > 1 && (
            <button 
              type="button" 
              onClick={() => handleZoom(1)} 
              style={{ padding: "4px 8px", fontSize: "11px", borderRadius: "4px" }}
            >
              Reset Zoom
            </button>
          )}
        </div>

        {/* Stage Wrapper with Animated Transform Container */}
        <div 
          className="crop-stage-wrapper" 
          style={{ overflow: "hidden", position: "relative", borderRadius: "12px" }}
        >
          <div
            className="free-crop-stage"
            ref={stageRef}
            onPointerDown={startCrop}
            onPointerMove={moveCrop}
            onPointerUp={stopCrop}
            onPointerCancel={stopCrop}
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: "center center",
              transition: dragging ? "none" : "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
              position: "relative",
              cursor: dragging ? "crosshair" : "default"
            }}
          >
            <img
              ref={imageRef}
              src={image}
              alt="Crop preview"
              draggable="false"
              style={{ 
                display: "block", 
                width: "100%", 
                height: "auto", 
                userSelect: "none", 
                borderRadius: "12px" // Applied 12px border radius to the image itself!
              }}
            />

            {selection && (
              <div
                className="crop-selection animated-crop-selection"
                style={{
                  position: "absolute",
                  border: "2px dashed",
                  backgroundColor: "rgba(0, 229, 255, 0.12)",
                  borderRadius: "12px", // Matching 12px border radius for selection box
                  pointerEvents: "none",
                  left: `${selection.x}px`,
                  top: `${selection.y}px`,
                  width: `${selection.width}px`,
                  height: `${selection.height}px`
                }}
              />
            )}
          </div>
        </div>

        <div className="crop-buttons" style={{ marginTop: "15px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ padding: "6px 12px", cursor: "pointer" }}>
            Cancel
          </button>

          <button onClick={() => setSelection(null)} style={{ padding: "6px 12px", cursor: "pointer" }}>
            Reset Selection
          </button>

          <button
            onClick={applyCrop}
            disabled={loading}
            style={{ padding: "6px 14px", background: "#007acc", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            {loading ? "Applying..." : "Apply Crop"}
          </button>
        </div>
      </div>
    </div>
  );
}