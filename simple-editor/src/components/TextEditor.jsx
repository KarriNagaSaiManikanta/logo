import React, { useRef, useEffect } from "react";

// =====================================
// TEXT TOOLBAR (Default Export)
// =====================================

export default function TextEditor({
  texts = [],
  setTexts,
  selected,
  setSelected
}) {
  // జనరిక్ టెక్స్ట్ యాడ్ చేసే ఫంక్షన్
  const addTextPreset = (type) => {
    const id = Date.now();
    let newTextObj = {
      id,
      x: 50,
      y: 50,
      rotation: 0,
      fontStyle: "normal",
      fontFamily: "'Noto Serif Telugu', serif" // డిఫాల్ట్‌గా Noto Serif Telugu సెట్ చేయబడింది
    };

    if (type === "title") {
      newTextObj = {
        ...newTextObj,
        value: "శీర్షిక (Title) ఇక్కడ రాయండి",
        size: 42,
        color: "#ffffff",
        fontWeight: "bold",
        backgroundColor: "transparent"
      };
    } else if (type === "description") {
      newTextObj = {
        ...newTextObj,
        value: "వివరాలు (Description) ఇక్కడ టైప్ చేయండి...",
        size: 18,
        color: "#dddddd",
        fontWeight: "normal",
        backgroundColor: "transparent"
      };
    } else if (type === "cta") {
      newTextObj = {
        ...newTextObj,
        value: "Click Here",
        size: 14,
        color: "#ffffff",
        fontWeight: "bold",
        backgroundColor: "#007acc"
      };
    } else {
      newTextObj = {
        ...newTextObj,
        value: "మీ Text ఇక్కడ టైప్ చేయండి",
        size: 28,
        color: "#ffffff",
        fontWeight: "normal",
        backgroundColor: "transparent"
      };
    }

    setTexts(prev => [...(prev || []), newTextObj]);
    setSelected(id);
  };

  const safeTexts = Array.isArray(texts) ? texts : [];
  const current = safeTexts.find(t => t.id === selected);

  const update = (changes) => {
    setTexts(prev =>
      (prev || []).map(t => (t.id === selected ? { ...t, ...changes } : t))
    );
  };

  const deleteText = () => {
    setTexts(prev => (prev || []).filter(t => t.id !== selected));
    setSelected(null);
  };

  // సైజ్ ఆప్షన్స్
  const fontSizes = [6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72, 96, 120];

  return (
    <div className="text-editor" style={{ padding: "12px", background: "#1e1e1e", color: "#fff", borderRadius: "6px" }}>
      {/* 3 Types of Text Preset Buttons */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
        <button 
          onClick={() => addTextPreset("title")}
          style={{ padding: "8px 14px", background: "#007acc", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}
        >
          + Add Title
        </button>
        <button 
          onClick={() => addTextPreset("description")}
          style={{ padding: "8px 14px", background: "#3a3a3a", color: "#fff", border: "1px solid #555", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
        >
          + Add Description
        </button>
        <button 
          onClick={() => addTextPreset("cta")}
          style={{ padding: "8px 14px", background: "#e5a100", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}
        >
          + Add CTA Button
        </button>
      </div>

      {current && (
        <div className="text-controls" style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "12px" }}>
          
          {/* Text Input */}
          <input
            type="text"
            value={current.value}
            placeholder="Enter text"
            onChange={e => update({ value: e.target.value })}
            style={{ padding: "8px", borderRadius: "4px", background: "#2a2a2a", color: "#fff", border: "1px solid #444", fontSize: "14px", fontFamily: current.fontFamily }}
          />

          {/* Controls Row 1: Size Dropdown, Bold, Italic, Font Family */}
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
            
            {/* Font Size Dropdown */}
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
              Size:
              <select
                value={current.size}
                onChange={e => update({ size: Number(e.target.value) })}
                style={{ padding: "4px 8px", background: "#2a2a2a", color: "#fff", border: "1px solid #555", borderRadius: "4px" }}
              >
                {fontSizes.map(sz => (
                  <option key={sz} value={sz}>{sz}px</option>
                ))}
              </select>
            </label>

            {/* Bold Button */}
            <button
              onClick={() => update({ fontWeight: current.fontWeight === "bold" ? "normal" : "bold" })}
              style={{
                padding: "4px 10px",
                background: current.fontWeight === "bold" ? "#007acc" : "#2a2a2a",
                color: "#fff",
                border: "1px solid #555",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              B
            </button>

            {/* Italic Button */}
            <button
              onClick={() => update({ fontStyle: current.fontStyle === "italic" ? "normal" : "italic" })}
              style={{
                padding: "4px 10px",
                background: current.fontStyle === "italic" ? "#007acc" : "#2a2a2a",
                color: "#fff",
                border: "1px solid #555",
                borderRadius: "4px",
                cursor: "pointer",
                fontStyle: "italic"
              }}
            >
              I
            </button>

            {/* Font Family Dropdown with Noto Serif Telugu */}
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
              Font:
              <select
                value={current.fontFamily || "'Noto Serif Telugu', serif"}
                onChange={e => update({ fontFamily: e.target.value })}
                style={{ padding: "4px 8px", background: "#2a2a2a", color: "#fff", border: "1px solid #555", borderRadius: "4px" }}
              >
                <option value="'Noto Serif Telugu', serif">Noto Serif Telugu</option>
                <option value="sans-serif">Sans-Serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Courier New', monospace">Courier New</option>
              </select>
            </label>

          </div>

          {/* Controls Row 2: Color, Background, Rotation, Delete */}
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center", fontSize: "13px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              Color: 
              <input
                type="color"
                value={current.color}
                onChange={e => update({ color: e.target.value })}
                style={{ border: "none", width: "30px", height: "24px", cursor: "pointer", background: "none" }}
              />
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              Background: 
              <input
                type="color"
                value={current.backgroundColor === "transparent" ? "#000000" : current.backgroundColor}
                onChange={e => update({ backgroundColor: e.target.value })}
                style={{ border: "none", width: "30px", height: "24px", cursor: "pointer", background: "none" }}
              />
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              Rotate: {current.rotation}°
              <input
                type="range"
                min="-180"
                max="180"
                value={current.rotation}
                onChange={e => update({ rotation: Number(e.target.value) })}
                style={{ width: "90px" }}
              />
            </label>

            <button 
              className="delete-text-btn" 
              onClick={deleteText}
              style={{ background: "#e51c23", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", marginLeft: "auto" }}
            >
              Delete
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

// =====================================
// TEXT LAYERS (Named Export)
// =====================================

export function TextLayers({
  texts = [],
  setTexts,
  selected,
  setSelected,
  canvasRef
}) {
  const transformRef = useRef(null);
  const safeTexts = Array.isArray(texts) ? texts : [];

  const startMove = (id, e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    const item = safeTexts.find(t => t.id === id);
    if (!item) return;

    setSelected(id);
    e.currentTarget.setPointerCapture(e.pointerId);

    transformRef.current = {
      type: "move",
      id,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originalX: item.x,
      originalY: item.y
    };
  };

  const startResize = (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    const item = safeTexts.find(t => t.id === id);
    if (!item) return;

    setSelected(id);
    e.currentTarget.setPointerCapture(e.pointerId);

    transformRef.current = {
      type: "resize",
      id,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originalSize: item.size
    };
  };

  const startRotate = (id, e, boxElement) => {
    e.preventDefault();
    e.stopPropagation();

    const item = safeTexts.find(t => t.id === id);
    if (!item) return;

    setSelected(id);
    e.currentTarget.setPointerCapture(e.pointerId);

    const rect = boxElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    transformRef.current = {
      type: "rotate",
      id,
      pointerId: e.pointerId,
      centerX,
      centerY,
      originalRotation: item.rotation || 0,
      startAngle: Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
    };
  };

  const handlePointerMove = (e) => {
    if (!transformRef.current) return;
    const action = transformRef.current;

    if (action.type === "move") {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const dx = ((e.clientX - action.startX) / rect.width) * 100;
      const dy = ((e.clientY - action.startY) / rect.height) * 100;

      setTexts(prev =>
        (prev || []).map(t =>
          t.id === action.id
            ? {
                ...t,
                x: Math.max(0, Math.min(100, action.originalX + dx)),
                y: Math.max(0, Math.min(100, action.originalY + dy))
              }
            : t
        )
      );
    } else if (action.type === "resize") {
      const dx = e.clientX - action.startX;
      const dy = e.clientY - action.startY;
      const change = (dx + dy) / 2;

      const newSize = Math.max(6, Math.min(160, action.originalSize + change));

      setTexts(prev =>
        (prev || []).map(t => (t.id === action.id ? { ...t, size: newSize } : t))
      );
    } else if (action.type === "rotate") {
      const currentAngle = Math.atan2(e.clientY - action.centerY, e.clientX - action.centerX) * (180 / Math.PI);
      const angleDiff = currentAngle - action.startAngle;

      let newRotation = Math.round(action.originalRotation + angleDiff);
      if (Math.abs(newRotation) < 3) newRotation = 0;

      setTexts(prev =>
        (prev || []).map(t => (t.id === action.id ? { ...t, rotation: newRotation } : t))
      );
    }
  };

  const handlePointerUp = (e) => {
    if (!transformRef.current) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    transformRef.current = null;
  };

  return (
    <>
      {safeTexts.map(t => {
        const isSelected = selected === t.id;

        return (
          <div
            key={t.id}
            className="text-layer-box"
            onPointerDown={e => startMove(t.id, e)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              position: "absolute",
              left: `${t.x}%`,
              top: `${t.y}%`,
              transform: `translate(-50%, -50%) rotate(${t.rotation || 0}deg)`,
              display: "inline-block",
              zIndex: isSelected ? 20 : 10,
              cursor: "move",
              userSelect: "none",
              touchAction: "none"
            }}
          >
            <div
              style={{
                position: "relative",
                border: isSelected ? "1.5px dashed #00e5ff" : "1.5px transparent",
                padding: "6px 10px",
                borderRadius: "2px",
                backgroundColor: t.backgroundColor || "transparent",
                minWidth: "40px",
                maxWidth: "80vw",
                textAlign: "center"
              }}
            >
              <EditableText
                textItem={t}
                isSelected={isSelected}
                setSelected={setSelected}
                setTexts={setTexts}
              />

              {isSelected && (
                <>
                  <div style={{ ...handleStyle, top: "-5px", left: "-5px" }} />
                  <div style={{ ...handleStyle, top: "-5px", right: "-5px" }} />
                  <div style={{ ...handleStyle, bottom: "-5px", left: "-5px" }} />
                  <div
                    onPointerDown={e => startResize(t.id, e)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    style={{
                      ...handleStyle,
                      bottom: "-5px",
                      right: "-5px",
                      cursor: "nwse-resize",
                      backgroundColor: "#00e5ff"
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "-20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "1px",
                      height: "15px",
                      backgroundColor: "#00e5ff"
                    }}
                  />
                  <div
                    onPointerDown={e => startRotate(t.id, e, e.currentTarget.parentElement)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    style={{
                      position: "absolute",
                      top: "-28px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#ffffff",
                      border: "2px solid #00e5ff",
                      cursor: "grab"
                    }}
                  />
                </>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

function EditableText({ textItem, setSelected, setTexts }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerText !== textItem.value) {
      contentRef.current.innerText = textItem.value;
    }
  }, [textItem.value]);

  return (
    <div
      ref={contentRef}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onFocus={() => setSelected(textItem.id)}
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
      onInput={e => {
        const value = e.currentTarget.innerText;
        setTexts(prev =>
          (prev || []).map(item => (item.id === textItem.id ? { ...item, value } : item))
        );
      }}
      style={{
        color: textItem.color,
        fontSize: `${textItem.size}px`,
        fontWeight: textItem.fontWeight || "normal",
        fontStyle: textItem.fontStyle || "normal",
        fontFamily: textItem.fontFamily || "'Noto Serif Telugu', serif",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        overflowWrap: "break-word",
        outline: "none",
        caretColor: "#00e5ff",
        display: "inline-block",
        minWidth: "20px",
        cursor: "text"
      }}
    />
  );
}

const handleStyle = {
  position: "absolute",
  width: "8px",
  height: "8px",
  backgroundColor: "#ffffff",
  border: "1px solid #00e5ff",
  borderRadius: "2px"
};