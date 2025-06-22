import { useEffect, useRef, useState } from "react";

export default function TimedMessage({ message, duration = 3000, onClose }) {
  const [visible, setVisible] = useState(!!message);
  const progressRef = useRef();

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    if (progressRef.current) {
      progressRef.current.style.transition = "none";
      progressRef.current.style.width = "0%";
      // Allow DOM to update before animating
      setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.transition = `width ${duration}ms linear`;
          progressRef.current.style.width = "100%";
        }
      }, 30);
    }
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!visible || !message) return null;

  return (
    <div
      style={{
        background: "#fff",
        color: "#388e3c",
        border: "1.5px solid #388e3c",
        borderRadius: 10,
        boxShadow: "0 2px 12px rgba(56,142,60,0.10)",
        padding: "1rem 1.5rem",
        minWidth: 220,
        maxWidth: 400,
        margin: "1.5rem auto",
        textAlign: "center",
        fontWeight: 600,
        fontSize: 16,
        position: "relative",
        zIndex: 100,
      }}
      role="alert"
    >
      {message}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 4,
          width: "100%",
          background: "#e0e0e0",
          borderRadius: "0 0 10px 10px",
          overflow: "hidden",
        }}
      >
        <div
          ref={progressRef}
          style={{
            height: "100%",
            width: "0%",
            background: "linear-gradient(90deg, #388e3c 0%, #b2dfdb 100%)",
            transition: "width 0s",
          }}
        />
      </div>
    </div>
  );
}