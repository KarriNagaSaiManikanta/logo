
import React, { useRef } from "react";

export default function ImageLayer({
  src,
  className,
  position,
  setPosition,
  scale,
  duration = 6
}) {
  const dragRef = useRef(null);

  if (!src) return null;

  // START DRAG
  const startDrag = (e) => {
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    e.currentTarget.setPointerCapture(e.pointerId);

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originalX: position.x,
      originalY: position.y
    };
  };

  // MOVE IMAGE FREELY
  const onDrag = (e) => {
    if (!dragRef.current) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    setPosition({
      x: dragRef.current.originalX + dx,
      y: dragRef.current.originalY + dy
    });
  };

  // STOP DRAG
  const stopDrag = (e) => {
    if (!dragRef.current) return;

    dragRef.current = null;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes imageZoomPulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }

          @keyframes whiteShadowBlink {
            0% {
              box-shadow:
                0 0 15px 3px rgba(255,255,255,0.7),
                0 0 5px rgba(0,229,255,0.8);
              border-color: #00e5ff;
            }

            50% {
              box-shadow:
                0 0 25px 8px rgba(255,255,255,1),
                0 0 12px rgba(255,0,127,0.9);
              border-color: #ff007f;
            }

            100% {
              box-shadow:
                0 0 15px 3px rgba(255,255,255,0.7),
                0 0 5px rgba(0,229,255,0.8);
              border-color: #00e5ff;
            }
          }

          .animated-image-box {
            animation:
              whiteShadowBlink 1.5s infinite ease-in-out;
          }

          .image-zoom-inner {
            animation:
              imageZoomPulse ${duration}s infinite ease-in-out;
          }
        `}
      </style>

      {/* IMAGE DRAG CONTAINER */}
      <div
        className={`${className || ""} animated-image-box`}
        onPointerDown={startDrag}
        onPointerMove={onDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        style={{
          position: "absolute",

          left: "50%",
          top: "50%",

          transform: `
            translate(
              calc(-50% + ${position.x}px),
              calc(-50% + ${position.y}px)
            )
          `,

          width: "85%",
          height: "auto",
          maxHeight: "40%",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          cursor: "grab",
          userSelect: "none",
          touchAction: "none",

          borderRadius: "12px",
          border: "2px solid #00e5ff",
          overflow: "hidden",
          backgroundColor: "#111",

          zIndex: 5
        }}
      >
        {/* INNER IMAGE ZOOM */}
        <div
          className="image-zoom-inner"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <img
            src={src}
            alt="Layer"
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              pointerEvents: "none"
            }}
          />
        </div>
      </div>
    </>
  );
}
