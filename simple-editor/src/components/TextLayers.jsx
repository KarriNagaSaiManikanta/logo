import React, { useRef, useEffect } from "react";

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

      const newSize = Math.max(12, Math.min(160, action.originalSize + change));

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
                padding: "8px 12px",
                borderRadius: "2px",
                backgroundColor: t.backgroundColor || "transparent",
                maxWidth: "80vw", // స్క్రీన్ దాటిపోకుండా ఉండేందుకు max-width
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
                      ...handleStyleBase,
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

function EditableText({ textItem, isSelected, setSelected, setTexts }) {
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
        e.stopPropagation(); // కర్జర్ కరెక్ట్ ప్లేస్ లో పెట్టడానికి ఇది ముఖ్యం
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
        fontFamily: textItem.fontFamily || "sans-serif",
        whiteSpace: "pre-wrap",        // టెక్స్ట్ ఎంటర్ కొడితే కిందకి రావడానికి
        wordBreak: "break-word",       // పెద్ద పదాలు ఉన్నప్పుడు కట్ అవ్వకుండా బ్రేక్ అవ్వడానికి
        overflowWrap: "break-word",
        outline: "none",
        caretColor: "#00e5ff",         // బ్రైట్ కర్జర్ కలర్
        minWidth: "100px",
        display: "inline-block",
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

const handleStyleBase = {
  position: "absolute"
};