import ReactMarkdown from "react-markdown";
import "./workoutMarkdown.css";

export default function Workout({ workout }) {
  return (
    <section className="flex justify-center mt-8">
      <div className="w-full max-w-3xl px-4 text-left">
        <div className="workout-md">
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer">
                  🎥 {props.children}
                </a>
              ),
            }}
          >
            {workout}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
