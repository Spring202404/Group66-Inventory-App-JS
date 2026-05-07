import { useState, useEffect } from "react";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setShowBanner(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowBanner(false);
  };

  return (
    showBanner && (
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#333",
        color: "#fff",
        padding: "1em",
        textAlign: "center",
        zIndex: 1000
      }}>
        我们的网站使用 Cookie 来改善用户体验。
        <button onClick={handleAccept} style={{
          marginLeft: "1em",
          padding: "0.5em 1em",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}>
          同意
        </button>
        <a href="/privacy-policy" style={{ marginLeft: "1em", color: "#4CAF50" }}>隐私政策</a>
      </div>
    )
  );
};

export default CookieBanner;
