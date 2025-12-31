import ReactMarkdown from "react-markdown";
import "./workoutMarkdown.css";

export default function Workout({ workout, isDarkMode }) {
  return (
    <div className={`workout-md text-left ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <ReactMarkdown
        components={{
          a: ({ ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="workout-link"
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