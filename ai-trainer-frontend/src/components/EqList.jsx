export default function EqList({ machines, removeMachine }) {
  if (!machines.length) {
    return (
      <p className="text-center text-sm text-white/60">
        No machines added yet.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {machines.map((machine) => (
        <span
          key={machine}
          className="chip inline-flex items-center gap-2 px-4 py-2 text-sm text-white"
        >
          {machine}
          <button
            onClick={() => removeMachine(machine)}
            className="rounded-full bg-white/10 px-2 text-white/70 hover:bg-white/20"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
