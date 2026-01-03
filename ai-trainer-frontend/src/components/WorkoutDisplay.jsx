import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function WorkoutDisplay({ workout }) {
  const [expandedCards, setExpandedCards] = useState({});
  // Extract workout intro
  const firstExerciseIndex = workout.indexOf('###');
  const intro = firstExerciseIndex !== -1 ? workout.substring(0, firstExerciseIndex).trim() : '';

  // Parse exercises from markdown
  const exerciseBlocks = workout.split('###').slice(1); // Skip intro, split by ###

  return (
    <div className="space-y-4">
      {/* Workout Intro/Header */}
      {intro && (
        <div className="mb-4">
          <ReactMarkdown
            className="workout-intro"
            components={{
              h1: ({ children }) => (
                <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-base font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                  {children}
                </h2>
              ),
              p: ({ children }) => (
                <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {children}
                </p>
              ),
            }}
          >
            {intro}
          </ReactMarkdown>
        </div>
      )}

      {/* Exercise Cards */}
      {exerciseBlocks.map((block, idx) => {
        const lines = block.trim().split('\n');
        const title = lines[0].trim();
        const details = lines.slice(1).join('\n').trim();

        // Parse sets, reps, rest from the details
        const setsMatch = details.match(/Sets?[:\s]+(\d+)/i);
        const repsMatch = details.match(/Reps?[:\s]+([^\n-]+)/i);
        const restMatch = details.match(/Rest[:\s]+(\d+)\s*(s|sec|second|seconds|min|minute|minutes)?/i);

        const sets = setsMatch ? parseInt(setsMatch[1], 10) : null;
        const reps = repsMatch ? repsMatch[1].trim() : null;
        let rest = restMatch ? parseInt(restMatch[1], 10) : null;
        if (rest && restMatch[2] && (restMatch[2].toLowerCase().startsWith('min'))) {
          rest *= 60;
        }

        // Extract video link
        const linkMatch = details.match(/\[([^\]]+)\]\(([^)]+)\)/);
        const videoLink = linkMatch ? linkMatch[2] : null;

        // Filter out sets, reps, rest, and video links from details for description
        const filteredDetails = details
          .split('\n')
          .filter(line => {
            const trimmed = line.trim();
            // Remove sets/reps/rest lines
            if (trimmed.match(/^[-*]\s*(Sets?|Reps?|Rest)[:\s]/i)) return false;
            // Remove video link lines
            if (trimmed.match(/\[([^\]]+)\]\(([^)]+)\)/)) return false;
            return trimmed.length > 0;
          })
          .join('\n');

        const isExpanded = expandedCards[idx];

        return (
          <div
            key={idx}
            className="rounded-lg p-3 cursor-pointer transition-all duration-300 ease-in-out"
            style={{
              background: 'var(--pill-bg)',
              border: '1px solid var(--pill-border)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => {
              // Don't toggle if clicking on video link
              if (e.target.closest('a')) return;
              setExpandedCards(prev => ({
                ...prev,
                [idx]: !prev[idx]
              }));
            }}
          >
            {/* Exercise Header - Always Visible */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {title}
                </h3>
              </div>

              {/* Video Link - Always Visible */}
              {videoLink && (
                <a
                  href={videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    background: 'var(--pill-bg)',
                    border: '1px solid var(--pill-border)'
                  }}
                  title="Watch video"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </a>
              )}
            </div>

            {/* Expandable Content */}
            <div
              style={{
                maxHeight: isExpanded ? '1000px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                opacity: isExpanded ? '1' : '0'
              }}
            >
              <div className="mt-2">
                {/* Exercise Description/Details using markdown */}
                {filteredDetails && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <ReactMarkdown
                      className="exercise-description"
                      components={{
                        p: ({ children }) => (
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: '1.4', marginBottom: '0.125rem' }}>
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul style={{ color: 'var(--text-secondary)', marginBottom: '0.125rem' }}>
                            {children}
                          </ul>
                        ),
                        li: ({ children }) => (
                          <li style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '0' }}>
                            {children}
                          </li>
                        ),
                      }}
                    >
                      {filteredDetails}
                    </ReactMarkdown>
                  </div>
                )}

                {/* Sets/Reps/Rest Info */}
                {(sets || reps || rest) && (
                  <div className="flex flex-wrap gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {sets && <span>Sets: {sets}</span>}
                    {reps && <span>Reps: {reps}</span>}
                    {rest && <span>Rest: {rest}s</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Expand/Collapse Indicator */}
            <div className="flex justify-center mt-2">
              <svg
                className="h-4 w-4 transition-transform duration-300"
                style={{
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  color: 'var(--text-secondary)'
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
