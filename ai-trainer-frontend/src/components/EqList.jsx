
export default function EqList(props) {
    const machinesListItems = props.machines.map((machine) => (
        <li key={machine}>{machine}</li>
    ));
    return (
        <section>
            {/* <h2 className="mt-5 text-2xl">Izabrali ste:</h2> */}
            <div className="flex justify-center">
                <ul
                className="list-disc list-inside mt-4 space-y-2 p-4 shadow-sm align-middle text-left text-lg"
                aria-live="polite"
            >
                {machinesListItems}
            </ul>
            </div>
            
            {props.machines.length > 3 && (
                <div className="">
                    {/* <div>
            <h3>Spreman za trening?</h3>
            <p>Napravi mi trening</p>
          </div> */}
                    <button
                        className="px-6 py-3 rounded-2xl bg-white/80 backdrop-blur text-gray-900 font-semibold shadow-md border border-white/40 hover:bg-white hover:shadow-lg active:scale-95 transition-all"
                        onClick={props.getWorkout}
                    >
                        Make me a Workout
                    </button>
                </div>
            )}
        </section>
    );
}
