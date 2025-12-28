import React from "react";
import Header from "./Header";
import EqList from "./EqList";
import Workout from "./Workout";
import { training } from "../ai";

export default function Main() {
    const [machines, setMachines] = React.useState([]);
    const [workout, setWorkout] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    async function getWorkout() {
        setLoading(true);
        const workoutMarkdown = await training(machines);
        setWorkout(workoutMarkdown);
        setLoading(false);
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

    return (
        <main className="app-bg px-4 py-10">
            <div className="mx-auto w-full max-w-xl">
                {/* SINGLE GLASS CARD */}
                <section className="glass-card p-6">
                    {/* HEADER INSIDE CARD */}
                    <Header />

                    {/* subtle divider */}
                    <div className="my-5 h-px w-full bg-white/10" />

                    {/* TITLE */}
                    <h2 className="text-center text-3xl font-extrabold text-white">
                        Build Your Workout
                    </h2>
                    <p className="mt-2 text-center text-sm text-white/70">
                        Add gym equipment and generate a personalized workout
                        using AI.
                    </p>

                    {/* FORM */}
                    <form
                        onSubmit={addMachine}
                        className="mt-6 flex gap-3"
                    >
                        <input
                            name="machine"
                            placeholder="e.g. smith machine"
                            className="glass-input w-full px-4 py-3"
                        />
                        <button
                            type="submit"
                            className="glass-btn px-5 py-3"
                        >
                            Add
                        </button>
                    </form>

                    {/* MACHINES */}
                    <div className="mt-4">
                        <EqList
                            machines={machines}
                            removeMachine={removeMachine}
                        />
                    </div>

                    {/* CTA */}
                    <button
                        onClick={getWorkout}
                        disabled={!machines.length || loading}
                        className="cta-btn mt-6 w-full px-6 py-3 disabled:opacity-50"
                    >
                        {loading
                            ? "Generating workout..."
                            : "Make me a Workout"}
                    </button>
                </section>

                {/* WORKOUT OUTPUT CARD */}
                {workout && (
                    <section className="glass-card mt-8 p-6">
                        <Workout workout={workout} />
                    </section>
                )}
            </div>
        </main>
    );
}
