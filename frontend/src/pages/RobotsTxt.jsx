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
    <div style={{ whiteSpace: "pre-wrap", background: "#222", color: "#fff", padding: "2rem", borderRadius: "8px" }}>
      <h2>robots.txt</h2>
      <pre>{content}</pre>
    </div>
  );
};

export default RobotsTxt; 