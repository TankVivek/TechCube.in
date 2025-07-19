import React, { useEffect, useState } from "react";

const RobotsTxt = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/robots.txt")
      .then((res) => res.text())
      .then(setContent)
      .catch(() => setContent("Unable to load robots.txt"));
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", background: "#181f2a", color: "#fff", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}>
      <h2 aria-label="robots.txt file contents" style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: "#60a5fa" }}>robots.txt</h2>
      <p style={{ marginBottom: 24, color: "#cbd5e1", fontSize: 16 }}>
        This file tells search engines which parts of the site can be crawled and indexed. For most sites, allowing all is best for SEO. Below is the current <code>robots.txt</code> for this website:
      </p>
      <pre style={{ background: "#23272f", color: "#a7ffeb", padding: "1.5rem", borderRadius: "8px", fontSize: 16, overflowX: "auto" }}>{content}</pre>
    </div>
  );
};

export default RobotsTxt; 