import React from "react";
import EqList from "./EqList";
import Workout from "./Workout";
import { training } from "../ai";

export default function Main() {
    const [machines, setMachines] = React.useState([
        // "lat pulldown",
        // "bench press",
        // "seated row",
    ]);

    const [workout, setWorkout] = React.useState(false);

    async function getWorkout() {
       const workoutMarkdown = await training(machines);
       setWorkout(workoutMarkdown)
    }

    function addMachine(formData) {
        const newMachine = formData.get("machine");
        setMachines((prevMachines) => [...prevMachines, newMachine]);
    }

    return (
        <main>
            <form
                action={addMachine}
                className=""
            >
                <input
                    type="text"
                    placeholder="e.g. smith machine"
                    aria-label="add machine"
                    name="machine"
                    className="bg-gray-300 text-gray-800 mr-10 px-2 py-2.5 rounded-xl"

                />
                <button className="px-5 py-2 rounded-xl bg-white/80 backdrop-blur text-gray-900 font-semibold shadow-md border border-white/40 hover:bg-white hover:shadow-lg active:scale-95 transition-all">
                  Add a machine
                  </button>
            </form>

            {machines.length > 0 &&
              <EqList machines={machines} getWorkout={getWorkout}/>
            }
            {workout && <Workout workout={workout} />}
        </main>
    );
}
