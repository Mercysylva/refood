import { useState } from "react";

// Shows the user's own uploaded photo when there is one.
// Otherwise (or if the photo fails to load) shows their initials on brand green.
const isPlaceholder = (src) =>
  !src || src.includes("dicebear.com") || src.includes("unsplash.com");

export function initialsOf(name = "") {
  const parts = name.replace(/\./g, "").trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "R";
}

export function Avatar({ src, name, className = "w-10 h-10", textClass = "text-[14px]" }) {
  const [failed, setFailed] = useState(false);
  if (!isPlaceholder(src) && !failed) {
    return (
      <img
        src={src}
        alt={name ? `${name} profile photo` : "Profile photo"}
        onError={() => setFailed(true)}
        className={`${className} rounded-full object-cover bg-white`}
      />
    );
  }
  return (
    <span
      role="img"
      aria-label={name ? `${name} profile` : "Profile"}
      className={`${className} ${textClass} rounded-full bg-[#0f7a3b] text-white font-bold grid place-items-center select-none`}
    >
      {initialsOf(name)}
    </span>
  );
}
