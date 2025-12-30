import React from "react";

export default function ThemeToggle() {
  const [isPurple, setIsPurple] = React.useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "theme-purple" : true; // default purple
  });

  React.useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("theme-purple", "theme-cyan");

    const nextTheme = isPurple ? "theme-purple" : "theme-cyan";
    html.classList.add(nextTheme);

    localStorage.setItem("theme", nextTheme);
  }, [isPurple]);

  return (
    <div className="mt-3 flex items-center justify-center">
      <button
        type="button"
        role="switch"
        aria-checked={isPurple}
        onClick={() => setIsPurple((p) => !p)}
        className="theme-switch"
      >
        <span className="theme-switch-track" />
        <span className={`theme-switch-knob ${isPurple ? "is-on" : ""}`} />
        <span className="theme-switch-label">
          {isPurple ? "Dark" : "Light"}
        </span>
      </button>
    </div>
  );
}
