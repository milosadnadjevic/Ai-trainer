import ReactMarkdown from "react-markdown";
import "./workoutMarkdown.css";

export default function Workout({ workout }) {
  return (
    <div className="workout-md text-left">
      <ReactMarkdown
        components={{
          a: ({ ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-300/10 px-2 py-1 font-semibold text-cyan-200 hover:underline"
            >
              🎥 {props.children}
            </a>
          ),
        }}
      >
        {workout}
      </ReactMarkdown>
    </div>
  );
}
