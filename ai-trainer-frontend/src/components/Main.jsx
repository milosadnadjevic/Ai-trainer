import React from "react";
import Header from "./Header";
import EqList from "./EqList";
import Workout from "./Workout";
import ThemeToggle from "./ThemeToggle";
import { training } from "../ai";

const BODY_PARTS = [
  "Chest",
  "Shoulders",
  "Back",
  "Biceps",
  "Triceps",
  "Legs",
  "Glutes",
  "Full body",
  "HIIT",
  "Core",
];

const DURATIONS = ["30 min", "45 min", "60 min", "90 min"];

function Pill({ active, disabled, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`pill ${active ? 'active' : ''}`}
    >
      {children}
    </button>
  );
}

export default function Main() {
  const [machines, setMachines] = React.useState([]);
  const [workout, setWorkout] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Track theme for logo switching
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "theme-purple" : true;
  });

  // NEW: up to 3 targets
  const [bodyParts, setBodyParts] = React.useState(["Full body"]);

  const [injury, setInjury] = React.useState("");
  const [duration, setDuration] = React.useState("45 min");

  function toggleBodyPart(part) {
    setBodyParts((prev) => {
      const isSelected = prev.includes(part);

      // remove if selected
      if (isSelected) {
        const next = prev.filter((p) => p !== part);
        return next.length ? next : ["Full body"]; // never empty
      }

      // if selecting "Full body" or "HIIT", make it exclusive
      if (part === "Full body" || part === "HIIT") {
        return [part];
      }

      // if "Full body" or "HIIT" is currently selected, replace it
      const cleaned = prev.filter((p) => p !== "Full body" && p !== "HIIT");

      // cap at 3
      if (cleaned.length >= 3) return cleaned;

      return [...cleaned, part];
    });
  }

  async function getWorkout() {
    setLoading(true);
    try {
      const bodyPartString = bodyParts.join(", ");

      const workoutMarkdown = await training(machines, {
        bodyPart: bodyPartString,
        injury,
        duration,
      });

      setWorkout(workoutMarkdown);
    } finally {
      setLoading(false);
    }
  }

  function addMachine(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMachine = formData.get("machine")?.toString().trim();
    if (!newMachine) return;

    setMachines((prev) => [...prev, newMachine]);
    e.currentTarget.reset();
  }

  function removeMachine(machine) {
    setMachines((prev) => prev.filter((m) => m !== machine));
  }


  const selectedCount = bodyParts.filter((p) => p !== "Full body" && p !== "HIIT").length;

  return (
    <main className="app-bg px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        <section className="glass-card p-6">
          <Header isDarkMode={isDarkMode} />
          <ThemeToggle onThemeChange={setIsDarkMode} />

          <div className="my-5 h-px w-full" style={{ background: 'var(--divider)' }} />

          <h2 className="text-center text-3xl font-extrabold text-primary">
            Build Your Workout
          </h2>
          <p className="mt-2 text-center text-sm text-secondary">
            Add gym equipment and generate a personalized workout using AI.
          </p>

          {/* BODY PARTS (up to 3) */}
          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>
                Select up to 3 body parts
              </h3>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {selectedCount}/3
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {BODY_PARTS.map((p) => {
                const active = bodyParts.includes(p);

                const isSpecial = p === "Full body" || p === "HIIT";
                const disableBecauseMax =
                  !active && !isSpecial && selectedCount >= 3;

                return (
                  <Pill
                    key={p}
                    active={active}
                    disabled={disableBecauseMax}
                    onClick={() => toggleBodyPart(p)}
                  >
                    {p}
                  </Pill>
                );
              })}
            </div>

            <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              Tip: "Full body" and "HIIT" are exclusive modes.
            </p>
          </div>

          {/* 3. ADD EQUIPMENT */}
          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                <span className="section-number">3.</span> Add Equipment{" "}
                <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>(Optional)</span>
              </h3>
              <svg 
                className="h-5 w-5" 
                style={{ color: 'var(--text-muted)' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <form onSubmit={addMachine} className="flex gap-2">
              <div className="relative flex-1">
                <svg 
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  name="machine"
                  placeholder="Search equipment..."
                  className="glass-input w-full py-3 pl-11 pr-4"
                />
              </div>
              <button 
                type="submit" 
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ 
                  background: 'var(--input-bg)', 
                  border: '1px solid var(--input-border)' 
                }}
              >
                <svg 
                  className="h-5 w-5" 
                  style={{ color: 'var(--text-primary)' }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </form>

            {/* MACHINES LIST */}
            <div className="mt-4">
              <EqList machines={machines} removeMachine={removeMachine} />
            </div>
          </div>

          {/* INJURIES & LIMITATIONS */}
          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                <svg 
                  className="h-5 w-5" 
                  style={{ color: 'var(--text-muted)' }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Injuries & Limitations{" "}
                <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>(Optional)</span>
              </h3>
              <svg 
                className="h-5 w-5" 
                style={{ color: 'var(--text-muted)' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div className="relative">
              <svg 
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" 
                style={{ color: 'var(--text-muted)' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={injury}
                onChange={(e) => setInjury(e.target.value)}
                placeholder="e.g. lower back pain"
                className="glass-input w-full py-3 pl-11 pr-4"
              />
            </div>
            <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>Leave empty if none.</p>
          </div>

          {/* DURATION */}
          <div className="mt-7">
            <h3 className="mb-2 text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>
              Select Workout Length
            </h3>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <Pill
                  key={d}
                  active={duration === d}
                  onClick={() => setDuration(d)}
                >
                  {d}
                </Pill>
              ))}
            </div>
          </div>
          
          <button
            onClick={getWorkout}
            disabled={loading}
            className="cta-btn mt-8 flex w-full items-center justify-center gap-2 px-6 py-3.5 disabled:opacity-50"
          >
            <svg 
              className="h-5 w-5" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            {loading ? "Generating workout..." : "Generate Workout"}
          </button>
        </section>

        {workout && (
          <section className="glass-card mt-8 p-6">
            <Workout workout={workout} isDarkMode={isDarkMode} />
          </section>
        )}
      </div>
    </main>
  );
}