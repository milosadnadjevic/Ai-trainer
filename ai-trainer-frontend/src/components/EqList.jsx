export default function EqList({ machines, removeMachine }) {
  if (!machines.length) {
    return (
      <p className="text-center text-sm text-gray-400/60">
        You haven't added any equipment yet.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {machines.map((machine) => (
        <span
          key={machine}
          className="chip inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-400"
        >
          {machine}
          <button
            onClick={() => removeMachine(machine)}
            className="rounded-full bg-gray-100/10 px-2 text-gray-400 hover:bg-white/20"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
