/**
 * Expected markdown format:
 * # Workout Title
 * ## Section (e.g., Warm-up, Main Workout)
 * ### Exercise Name
 * - Sets: 3
 * - Reps: 8-10
 * - Rest: 60 seconds
 *
 * Returns array of exercises with metadata
 */

export function parseWorkoutMarkdown(markdown) {
  if (!markdown) return [];

  const exercises = [];
  const lines = markdown.split('\n');

  let currentExercise = null;
  let currentSection = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) continue;

    // Section header - title
    if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '').trim();
      continue;
    }

    // Exercise header - exercise name
    if (line.startsWith('### ')) {
      // Save previous exercise if exists
      if (currentExercise && currentExercise.sets > 0) {
        exercises.push(currentExercise);
      }

      const exerciseName = line.replace('### ', '').trim();
      currentExercise = {
        name: exerciseName,
        section: currentSection || 'Workout',
        sets: 3, // default 3 sets if not specified
        reps: '8-12', // default reps if not specified
        rest: 60, // default 60 seconds
        videoLink: null,
      };
      continue;
    }

    // Parse exercise details
    if (currentExercise && line.startsWith('- ')) {
      const detail = line.replace('- ', '').trim();

      // Sets - more flexible matching
      const setsMatch = detail.match(/Sets?[:\s]+(\d+)/i);
      if (setsMatch) {
        currentExercise.sets = parseInt(setsMatch[1], 10);
      }

      // Reps - more flexible matching
      const repsMatch = detail.match(/Reps?[:\s]+([^\n-]+)/i);
      if (repsMatch) {
        currentExercise.reps = repsMatch[1].trim();
      }

      // Rest time
      const restMatch = detail.match(/Rest[:\s]+(\d+)\s*(s|sec|second|seconds|min|minute|minutes)?/i);
      if (restMatch) {
        let restTime = parseInt(restMatch[1], 10);
        const unit = restMatch[2]?.toLowerCase();

        // Convert minutes to seconds
        if (unit && (unit === 'min' || unit === 'minute' || unit === 'minutes')) {
          restTime *= 60;
        }

        currentExercise.rest = restTime;
      }
    }

    // Video link
    if (currentExercise && line.includes('[') && line.includes('](')) {
      const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        currentExercise.videoLink = linkMatch[2];
      }
    }
  }

  // Add last exercise
  if (currentExercise && currentExercise.sets > 0) {
    exercises.push(currentExercise);
  }

  console.log('Parser found', exercises.length, 'exercises');

  return exercises;
}

/**
 * Calculate total workout stats
 */
export function calculateWorkoutStats(exercises) {
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const totalExercises = exercises.length;

  // Estimate total time (sets * 30s avg + rest time)
  const estimatedMinutes = Math.ceil(
    exercises.reduce((sum, ex) => {
      const setTime = ex.sets * 30; // 30 seconds per set
      const restTime = (ex.sets - 1) * ex.rest; // rest between sets
      return sum + setTime + restTime;
    }, 0) / 60
  );

  return {
    totalExercises,
    totalSets,
    estimatedMinutes,
  };
}

/**
 initial session state for tracking progress
 */
export function createSessionState(exercises) {
  return exercises.map(exercise => ({
    ...exercise,
    completedSets: Array(exercise.sets).fill(false),
  }));
}
