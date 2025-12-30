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
      className={[
        "rounded-full px-4 py-2 text-sm font-semibold transition",
        "ring-1 ring-white/10",
        disabled ? "opacity-40 cursor-not-allowed" : "",
        active
          ? "bg-cyan-300/20 text-white ring-cyan-300/30"
          : "bg-white/10 text-white/75 hover:bg-white/15",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function Main() {
  const [machines, setMachines] = React.useState([]);
  const [workout, setWorkout] = React.useState("");
  const [loading, setLoading] = React.useState(false);

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

  // Disable non-selected pills once at 3 (except Full body/HIIT toggles)
  const selectedCount = bodyParts.filter((p) => p !== "Full body" && p !== "HIIT").length;

  return (
    <main className="app-bg px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        <section className="glass-card p-6">
          <Header />
          <ThemeToggle />

          <div className="my-5 h-px w-full bg-white/10" />

          <h2 className="text-center text-3xl font-extrabold text-white">
            Build Your Workout
          </h2>
          <p className="mt-2 text-center text-sm text-white/70">
            Add gym equipment and generate a personalized workout using AI.
          </p>

          {/* MACHINE FORM */}
          <form onSubmit={addMachine} className="mt-6 flex gap-3">
            <input
              name="machine"
              placeholder="e.g. smith machine"
              className="glass-input w-full px-4 py-3"
            />
            <button type="submit" className="glass-btn px-5 py-3">
              Add
            </button>
          </form>

          {/* MACHINES */}
          <div className="mt-4">
            <EqList machines={machines} removeMachine={removeMachine} />
          </div>

          {/* BODY PARTS (up to 3) */}
          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white/90">
                Select up to 3 body parts
              </h3>
              <span className="text-xs text-white/60">
                {selectedCount}/3
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {BODY_PARTS.map((p) => {
                const active = bodyParts.includes(p);

                const isSpecial = p === "Full body" || p === "HIIT";
                const disableBecauseMax =
                  !active && !isSpecial && selectedCount >= 3;

                // If Full body or HIIT is active, disable other specials? (we keep them clickable)
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

            <p className="mt-2 text-xs text-white/50">
              Tip: “Full body” and “HIIT” are exclusive modes.
            </p>
          </div>

          {/* INJURY / LIMITATIONS */}
          <div className="mt-7">
            <h3 className="mb-2 text-sm font-extrabold text-white/90">
              Injuries &amp; Limitations
            </h3>
            <input
              value={injury}
              onChange={(e) => setInjury(e.target.value)}
              placeholder="e.g. lower back pain"
              className="glass-input w-full px-4 py-3"
            />
            <p className="mt-2 text-xs text-white/50">Leave empty if none.</p>
          </div>

          {/* DURATION */}
          <div className="mt-7">
            <h3 className="mb-2 text-sm font-extrabold text-white/90">
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

          {/* CTA */}
          <button
            onClick={getWorkout}
            disabled={!machines.length || loading}
            className="cta-btn mt-8 w-full px-6 py-3 disabled:opacity-50"
          >
            {loading ? "Generating workout..." : "Design my Workout"}
          </button>

          {!machines.length && (
            <p className="mt-3 text-center text-xs text-white/50">
              Add at least 1 machine to generate a workout.
            </p>
          )}
        </section>

        {workout && (
          <section className="glass-card mt-8 p-6">
            <Workout workout={workout} />
          </section>
        )}
      </div>
    </main>
  );
}
