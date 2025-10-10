import React, { useEffect, useState } from "react";

export const LoadingPage: React.FC = () => {
  const messages = [
    // "AI is thinking...",
    // "AI is Analyzing...",
    // "AI is generating...",
    "Dashboard is being prepared...",
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div
      className="d-flex flex-column align-center justify-center"
      style={{ height: "100vh", textAlign: "center" }}
    >
      <img
        src="/images/AI_Loader.gif"
        alt="AI Loader"
        style={{ width: "150px", marginBottom: "20px" }}
        onError={(e) => {
          console.error("Image failed to load");
          e.currentTarget.style.display = 'none';
        }}
      />
      <div style={{ fontSize: "16px", fontWeight: 500}}>
        {messages[currentMessageIndex]}
      </div>
    </div>
  );
};

export default LoadingPage;
