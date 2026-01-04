# AI Trainer

> **Note**: This is a demonstration project showcasing the basic setup and core functionality. The full implementation includes additional features and customization options not shown in this version.

An AI-powered workout generator built with React and Anthropic's Claude API. This application creates personalized training programs based on user preferences, available equipment, physical limitations, and workout goals.

## Features

- **AI-Powered Workout Generation**: Leverages Claude AI to create customized workout plans
- **Multi-Body Part Selection**: Choose up to 3 body parts or select Full Body/HIIT modes
- **Equipment Tracking**: Add and manage available gym equipment for tailored exercises
- **Injury Accommodation**: Specify injuries or limitations to receive safe workout alternatives
- **Customizable Duration**: Select workout length from 30 to 90 minutes
- **Dual Theme Support**: Toggle between light and dark modes
- **Glassmorphic UI**: Modern, polished interface with smooth animations

## Tech Stack

### Frontend
- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS with custom CSS variables
- **State Management**: React Hooks (useState)
- **Font**: Rajdhani (Google Fonts)

### Backend
- **Runtime**: Node.js with Express.js
- **AI Integration**: Anthropic Claude SDK (@anthropic-ai/sdk)
- **CORS**: CORS middleware for cross-origin requests
- **Environment**: dotenv for configuration management

## How to Use

### 1. Select Body Parts
- Click on body part pills to select up to 3 muscle groups (Chest, Shoulders, Back, Biceps, Triceps, Legs, Glutes, Core)
- **Special Modes**: "Full body" and "HIIT" are exclusive modes that replace other selections
- A counter shows your current selection (X/3)

### 2. Add Equipment (Optional)
- Type the name of available gym equipment (e.g., "smith machine", "dumbbells", "resistance bands")
- Click the + button or press Enter to add
- Click the X icon next to any equipment to remove it
- Leave empty if no specific equipment is required

### 3. Specify Injuries & Limitations (Optional)
- Enter any injuries, pain points, or physical limitations (e.g., "lower back pain", "knee issues")
- The AI will generate exercises that avoid aggravating these conditions
- Leave empty if you have no limitations

### 4. Select Workout Length
- Choose from 30, 45, 60, or 90-minute workout durations
- Default is 45 minutes

### 5. Generate Workout
- Click the "Generate Workout" button
- Wait for the AI to create your personalized workout plan
- The generated workout will display with:
  - Exercise names
  - Sets and reps
  - Rest periods
  - Form tips and modifications

### 6. Create New Workout
- After viewing your workout, click "Create New Workout" to start over with different parameters

### 7. Toggle Theme
- Use the theme switcher in the header to toggle between light and dark modes
- Your preference is saved in local storage

## Project Structure

```
ai-trainer-frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx       # App header with logo and theme toggle
│   │   ├── Main.jsx          # Main app logic and UI
│   │   ├── EqList.jsx        # Equipment list component
│   │   └── Workout.jsx       # Workout display component
│   ├── ai.js                 # AI integration logic
│   ├── App.jsx               # Root component
│   ├── App.css               # App-specific styles
│   ├── index.css             # Global styles and themes
│   └── main.jsx              # Entry point
├── public/
│   └── muscle_no_bg.svg      # Background watermark
├── package.json
└── vite.config.js
```

## Customization for Gyms

This application is designed to be customizable for fitness centers and gyms:

### Branding
- Update logos in the [Header.jsx](src/components/Header.jsx) component
- Modify the watermark image at `/public/muscle_no_bg.svg`

### Theme Colors
- Edit CSS custom properties in [index.css](src/index.css)
- Modify `--bg-*`, `--card-*`, `--pill-*`, and `--cta-*` variables for both light and dark themes

### Equipment Database
- Pre-populate the equipment list by modifying the initial state in [Main.jsx](src/components/Main.jsx)
- Add default equipment for specific gym locations

### Body Parts & Durations
- Customize available body parts by editing the `BODY_PARTS` array in [Main.jsx](src/components/Main.jsx)
- Adjust workout durations in the `DURATIONS` array

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

[Add contribution guidelines here]

## Support

For issues or questions, please [open an issue](your-repo-url/issues) on GitHub.

## Demo

[Link to live demo](https://your-demo-link.com)
