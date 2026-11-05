import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ImageCrop from "./components/ImageCrop";
import TextEditor, { TextLayers } from "./components/TextEditor";
import ImageLayer from "./components/ImageLayer";

import "./App.css";
import "./components/Header.css";
import "./components/Footer.css";
import "./components/TextEditor.css";
import "./components/ImageCrop.css";

export default function App() {
  // MULTIPLE IMAGES STATE
  const [images, setImages] = useState([]);

  // CROP QUEUE STATES FOR MULTIPLE UPLOADS
  const [cropQueue, setCropQueue] = useState([]);
  const [cropType, setCropType] = useState(null);

  // TEXT STATES
  const [texts, setTexts] = useState([]);
  const [selected, setSelected] = useState(null);

  // ANIMATION / VIDEO RECORDING STATES
  const [duration, setDuration] = useState(6);
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);

  const canvasRef = useRef(null);

  // MULTIPLE IMAGE UPLOAD HANDLER
  const upload = (e, type) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      alert("Please select valid image files");
      return;
    }

    const urls = imageFiles.map(file => URL.createObjectURL(file));
    setCropQueue(urls);
    setCropType(type);
    e.target.value = "";
  };

  // CANCEL CROP FOR CURRENT QUEUE
  const cancelCrop = () => {
    cropQueue.forEach(url => URL.revokeObjectURL(url));
    setCropQueue([]);
    setCropType(null);
  };

  // APPLY CROP & ADD TO IMAGES ARRAY
  const applyCrop = (croppedUrl) => {
    const newImageObj = {
      id: Date.now() + Math.random(),
      src: croppedUrl,
      type: cropType,
      position: { x: 0, y: 0 },
      scale: 1
    };

    setImages(prev => [...prev, newImageObj]);

    const remainingQueue = cropQueue.slice(1);
    if (remainingQueue.length > 0) {
      setCropQueue(remainingQueue);
    } else {
      setCropQueue([]);
      setCropType(null);
    }
  };

  // UPDATE INDIVIDUAL IMAGE POSITION OR SCALE
  const updateImage = (id, changes) => {
    setImages(prev =>
      prev.map(img => (img.id === id ? { ...img, ...changes } : img))
    );
  };

  // DELETE AN IMAGE LAYER
  const deleteImage = (id) => {
    setImages(prev => {
      const target = prev.find(img => img.id === id);
      if (target?.src) URL.revokeObjectURL(target.src);
      return prev.filter(img => img.id !== id);
    });
  };

  // DOWNLOAD PNG (STATIC)
  const download = async () => {
    if (!canvasRef.current) return;

    try {
      const data = await toPng(canvasRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#000000"
      });

      const link = document.createElement("a");
      link.download = "my-9-16-design.png";
      link.href = data;
      link.click();
    } catch (error) {
      console.error("Download Error:", error);
      alert("Image download failed");
    }
  };

  // EXPORT ANIMATED VIDEO WITH ANIMATION FRAMES SYNC
  const exportVideo = async () => {
    if (!canvasRef.current || isRecording) return;

    setIsRecording(true);
    setRecordProgress(0);

    try {
      const tempCanvas = document.createElement("canvas");
      const rect = canvasRef.current.getBoundingClientRect();
      tempCanvas.width = rect.width * 2;
      tempCanvas.height = rect.height * 2;
      const ctx = tempCanvas.getContext("2d");

      const stream = tempCanvas.captureStream(30); // 30 FPS
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `design-animation-${duration}s.webm`;
        link.href = videoUrl;
        link.click();
        setIsRecording(false);
      };

      recorder.start();

      const totalFrames = duration * 30;
      let frameCount = 0;

      const renderInterval = setInterval(async () => {
        if (frameCount >= totalFrames) {
          clearInterval(renderInterval);
          recorder.stop();
          return;
        }

        try {
          // Temporarily add a class to force CSS animations to evaluate accurately per frame
          canvasRef.current.style.setProperty("--anim-progress", `${(frameCount / totalFrames)}`);
          
          const frameData = await toPng(canvasRef.current, { pixelRatio: 2, cacheBust: true });
          const img = new Image();
          img.src = frameData;
          await img.decode();
          ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
          ctx.drawImage(img, 0, 0);
        } catch (err) {
          console.error("Frame capture error:", err);
        }

        frameCount++;
        setRecordProgress(Math.round((frameCount / totalFrames) * 100));
      }, 1000 / 30);

    } catch (err) {
      console.error("Video export failed:", err);
      alert("Video export failed.");
      setIsRecording(false);
    }
  };

  return (
    <div className="app">
      <h2>9:16 DESIGN EDITOR</h2>

      {/* TOOLBAR */}
      <div className="toolbar" style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <Header onUpload={(e) => upload(e, "header")} />
        <Footer onUpload={(e) => upload(e, "footer")} />

        <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "#fff", fontSize: "14px" }}>
          Run Time:
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            style={{ padding: "6px", borderRadius: "4px", background: "#222", color: "#fff", border: "1px solid #555" }}
          >
            <option value={3}>3 Seconds</option>
            <option value={6}>6 Seconds (Default)</option>
            <option value={10}>10 Seconds</option>
            <option value={15}>15 Seconds</option>
          </select>
        </label>

        <button className="download-btn" onClick={download}>
          Download PNG
        </button>

        <button
          className="download-btn"
          onClick={exportVideo}
          disabled={isRecording}
          style={{ background: isRecording ? "#666" : "#e5a100", color: "#000", fontWeight: "bold" }}
        >
          {isRecording ? `Exporting (${recordProgress}%)` : `Export ${duration}s Video`}
        </button>
      </div>

      {/* MULTIPLE IMAGES CONTROLS */}
      {images.length > 0 && (
        <div className="image-controls" style={{ display: "flex", flexDirection: "column", gap: "8px", background: "#1e1e1e", padding: "10px", borderRadius: "6px", marginTop: "10px" }}>
          <span style={{ fontSize: "12px", color: "#aaa", fontWeight: "bold" }}>Uploaded Image Layers ({images.length}):</span>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            {images.map((img, idx) => (
              <div key={img.id} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#2a2a2a", padding: "6px 10px", borderRadius: "4px" }}>
                <span style={{ fontSize: "12px", color: "#fff" }}>Img #{idx + 1} ({img.type})</span>
                <label style={{ fontSize: "12px", color: "#ccc", display: "flex", alignItems: "center", gap: "4px" }}>
                  Zoom:
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={img.scale}
                    onChange={(e) => updateImage(img.id, { scale: Number(e.target.value) })}
                    style={{ width: "60px" }}
                  />
                  <span>{img.scale.toFixed(1)}x</span>
                </label>
                <button
                  onClick={() => deleteImage(img.id)}
                  style={{ background: "#e51c23", color: "#fff", border: "none", borderRadius: "3px", padding: "2px 6px", cursor: "pointer", fontSize: "11px" }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEXT EDITOR */}
      <TextEditor
        texts={texts}
        setTexts={setTexts}
        selected={selected}
        setSelected={setSelected}
      />

      {/* 9:16 FRAME */}
      <div className="workspace">
        <div className="canvas" ref={canvasRef} style={{ position: "relative", overflow: "hidden" }}>
          {/* RENDER ALL MULTIPLE IMAGE LAYERS */}
          {images.map(img => (
            <ImageLayer
              key={img.id}
              src={img.src}
              className={`${img.type}-image`}
              position={img.position}
              setPosition={(pos) => updateImage(img.id, { position: pos })}
              scale={img.scale}
              duration={duration}
            />
          ))}

          {/* TEXT LAYERS */}
          <TextLayers
            texts={texts}
            setTexts={setTexts}
            selected={selected}
            setSelected={setSelected}
            canvasRef={canvasRef}
          />
        </div>
      </div>

      {/* CROP MODAL (HANDLES QUEUE ONE BY ONE) */}
      {cropQueue.length > 0 && (
        <ImageCrop
          image={cropQueue[0]}
          onCancel={cancelCrop}
          onApply={applyCrop}
        />
      )}
    </div>
  );
}