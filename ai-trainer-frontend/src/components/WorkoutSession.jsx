import { useState, useEffect } from 'react';
import Timer from './Timer';
import { parseWorkoutMarkdown, calculateWorkoutStats, createSessionState } from '../utils/workoutParser';

export default function WorkoutSession({ workout, onExit }) {
  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);

  // Parse workout on mount
  useEffect(() => {
    const parsed = parseWorkoutMarkdown(workout);
    console.log('Parsed exercises:', parsed);
    const withState = createSessionState(parsed);
    console.log('Exercises with state:', withState);
    setExercises(withState);
  }, [workout]);

  const currentExercise = exercises[currentExerciseIndex];
  const stats = calculateWorkoutStats(exercises);

  // Calculate overall progress
  const totalSetsCompleted = exercises.reduce(
    (sum, ex) => sum + ex.completedSets.filter(Boolean).length,
    0
  );
  const overallProgress = stats.totalSets > 0 ? (totalSetsCompleted / stats.totalSets) * 100 : 0;

  const handleSetComplete = (exerciseIdx, setIdx) => {
    // Check current state before toggling
    const wasUnchecked = !exercises[exerciseIdx].completedSets[setIdx];
    console.log(`\n=== Checkbox Click ===`);
    console.log(`Exercise ${exerciseIdx}, Set ${setIdx + 1}`);
    console.log(`Current state:`, exercises[exerciseIdx].completedSets[setIdx]);
    console.log(`Will toggle to:`, !exercises[exerciseIdx].completedSets[setIdx]);

    setExercises((prev) => {
      const updated = [...prev];
      // Need to spread the completedSets array to avoid mutation
      updated[exerciseIdx] = {
        ...updated[exerciseIdx],
        completedSets: [...updated[exerciseIdx].completedSets]
      };
      updated[exerciseIdx].completedSets[setIdx] = !prev[exerciseIdx].completedSets[setIdx];
      console.log(`State updated. New value:`, updated[exerciseIdx].completedSets[setIdx]);
      console.log(`All sets:`, updated[exerciseIdx].completedSets);

      // Check if this completes the entire workout
      if (wasUnchecked) {
        const allComplete = updated.every(ex => ex.completedSets.every(Boolean));
        if (allComplete) {
          console.log('Workout complete!');
          setTimeout(() => setWorkoutComplete(true), 300); // Small delay for smooth transition
        }
      }

      return updated;
    });

    // Auto-start rest timer when checking a set (only if it was unchecked before)
    if (wasUnchecked) {
      // Only start timer if not the last set of the exercise
      if (setIdx < exercises[exerciseIdx].sets - 1) {
        console.log('Starting rest timer');
        setCurrentExerciseIndex(exerciseIdx);
        setCurrentSetIndex(setIdx);
        setIsResting(true);
      } else {
        console.log('Last set - no timer needed');
      }
    }
  };

  const handleTimerComplete = () => {
    setIsResting(false);
    setShowAlert(true);
  };

  const handleAlertDismiss = () => {
    setShowAlert(false);

    // Move to next set
    const nextSetIndex = currentSetIndex + 1;

    if (nextSetIndex < currentExercise.sets) {
      // Next set in same exercise
      setCurrentSetIndex(nextSetIndex);
    } else if (currentExerciseIndex < exercises.length - 1) {
      // Move to next exercise
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
    } else {
      // Workout complete!
      setWorkoutComplete(true);
    }
  };

  if (!exercises.length) {
    return (
      <div className="py-6 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12"
            style={{ color: 'var(--text-muted)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          No Exercises Found
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          The workout format couldn't be parsed. Make sure exercises use the standard format with sets, reps, and rest times.
        </p>
        <button onClick={onExit} className="cta-btn px-6 py-2.5">
          Back to Workout
        </button>
      </div>
    );
  }

  if (workoutComplete) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-60" style={{ paddingTop: '8vh' }}>
        <div
          className="mx-4 w-full max-w-sm p-6 text-center"
          style={{
            animation: 'scaleIn 0.2s ease-out',
            height: 'fit-content',
            background: 'rgb(35, 35, 40)',
            border: '1px solid rgb(185, 28, 28)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16"
              style={{ color: 'rgb(34, 197, 94)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Congratulations!
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            You crushed your workout! All {stats.totalSets} sets completed.
          </p>
          <button
            onClick={onExit}
            className="w-full px-4 py-2.5 font-semibold rounded-lg transition-all"
            style={{
              background: 'rgb(34, 197, 94)',
              border: '1px solid rgb(22, 163, 74)',
              color: '#0a0a0a',
              boxShadow: '0 4px 16px rgba(34, 197, 94, 0.5)'
            }}
          >
            Finish Workout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="workout-session">
      {/* Alert Modal */}
      {showAlert && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-60" style={{ paddingTop: '25vh' }}>
          <div
            className="glass-card mx-4 w-full max-w-sm p-6 text-center"
            style={{ animation: 'scaleIn 0.2s ease-out', height: 'fit-content' }}
          >
            <h3 className="mb-2 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Rest Complete!
            </h3>
            <p className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Ready for your next set
            </p>
            <button onClick={handleAlertDismiss} className="cta-btn w-full px-4 py-2.5">
              Start Next Set
            </button>
          </div>
        </div>
      )}

      {/* Overall Progress */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-xs font-bold">
          <span style={{ color: 'var(--text-muted)' }}>WORKOUT PROGRESS</span>
          <span style={{ color: 'var(--text-primary)' }}>
            {totalSetsCompleted} / {stats.totalSets} sets
          </span>
        </div>
        <div
          className="h-2 w-full rounded-full overflow-hidden"
          style={{ background: 'var(--card-border)' }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${overallProgress}%`,
              background: 'linear-gradient(90deg, rgba(120, 120, 125, 0.6), rgba(160, 160, 165, 0.8))'
            }}
          />
        </div>
      </div>

      {/* Rest Timer */}
      {isResting && currentExercise && (
        <div className="mb-4 rounded-lg p-4" style={{ background: 'var(--pill-bg)', border: '1px solid var(--pill-border)' }}>
          <Timer
            duration={currentExercise.rest}
            onComplete={handleTimerComplete}
          />
        </div>
      )}

      {/* Exercises List */}
      <div className="space-y-4">
        {exercises
          .map((exercise, exIdx) => ({ exercise, originalIndex: exIdx }))
          .sort((a, b) => {
            const aComplete = a.exercise.completedSets.every(Boolean);
            const bComplete = b.exercise.completedSets.every(Boolean);
            // Incomplete exercises first, then completed ones
            if (aComplete === bComplete) return a.originalIndex - b.originalIndex;
            return aComplete ? 1 : -1;
          })
          .map(({ exercise, originalIndex: exIdx }) => {
          const allSetsComplete = exercise.completedSets.every(Boolean);
          const isCurrentExercise = exIdx === currentExerciseIndex;

          return (
            <div
              key={exIdx}
              className="rounded-lg p-4 transition-all"
              style={{
                background: isCurrentExercise ? 'var(--card-bg)' : 'var(--pill-bg)',
                border: `1px solid ${isCurrentExercise ? 'var(--accent)' : 'var(--pill-border)'}`,
                boxShadow: isCurrentExercise ? '0 2px 8px rgba(0,0,0,0.4)' : 'none'
              }}
            >
              {/* Exercise Header */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                    {exercise.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span>Sets: {exercise.sets}</span>
                    <span>Reps: {exercise.reps}</span>
                    <span>Rest: {exercise.rest}s</span>
                  </div>
                </div>

                {/* Video Link */}
                {exercise.videoLink && (
                  <a
                    href={exercise.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 flex h-8 w-8 items-center justify-center rounded-full"
                    style={{
                      background: 'var(--pill-bg)',
                      border: '1px solid var(--pill-border)'
                    }}
                    title="Watch video"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </a>
                )}
              </div>

              {/* Sets Checkboxes */}
              <div className="flex flex-wrap gap-2">
                {exercise.completedSets.map((completed, setIdx) => {
                  // Determine if this is the active set (next set after rest time)
                  const isActiveSet = exIdx === currentExerciseIndex &&
                                     setIdx === currentSetIndex &&
                                     !isResting &&
                                     !completed;

                  // Determine if this is a completed set (checked and rest time is over)
                  const isCompletedSet = completed &&
                                        (exIdx !== currentExerciseIndex ||
                                         setIdx < currentSetIndex ||
                                         !isResting);

                  // Get button styles based on state
                  let bgColor, borderColor;
                  if (isCompletedSet) {
                    // Completed sets - RED
                    bgColor = 'rgba(220, 38, 38, 0.9)';
                    borderColor = 'rgb(185, 28, 28)';
                  } else if (isActiveSet) {
                    // Active set - GREEN
                    bgColor = 'rgba(22, 163, 74, 0.9)';
                    borderColor = 'rgb(21, 128, 61)';
                  } else {
                    // Default/upcoming sets
                    bgColor = 'var(--input-bg)';
                    borderColor = 'var(--input-border)';
                  }

                  return (
                    <label
                      key={setIdx}
                      className={`flex items-center gap-2 rounded-md px-3 py-2 transition-all ${
                        allSetsComplete ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                      }`}
                      style={{
                        background: bgColor,
                        border: `1px solid ${borderColor}`,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completed}
                        onChange={() => handleSetComplete(exIdx, setIdx)}
                        disabled={allSetsComplete}
                        className={`h-5 w-5 rounded ${allSetsComplete ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        style={{ accentColor: isActiveSet ? 'rgb(21, 128, 61)' : isCompletedSet ? 'rgb(185, 28, 28)' : 'var(--accent)' }}
                      />
                      <span
                        className="text-sm font-semibold"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Set {setIdx + 1}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Completion indicator */}
              {allSetsComplete && (
                <div className="mt-3 flex items-center gap-2 text-xs font-bold" style={{ color: 'rgb(34, 197, 94)' }}>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Complete
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Exit Button */}
      <button
        onClick={onExit}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
        style={{
          background: 'var(--pill-bg)',
          border: '1px solid var(--pill-border)',
          color: 'var(--text-secondary)'
        }}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Exit Workout Session
      </button>
    </div>
  );
}
