# React Todo List

A modern, feature-rich Todo List application built with React, TypeScript, and Material-UI.

## Features

- Add, remove, and mark todos as complete
- Input validation
- Sort todos by date, alphabetically, or completion status
- Filter todos by all, active, or completed
- Persistent storage using localStorage
- Responsive design with Material-UI
- TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd react-to-do-list
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Testing

To manually test the application:

1. Adding Todos:
   - Try adding an empty todo (should show validation error)
   - Try adding a todo longer than 100 characters (should show validation error)
   - Add a valid todo (should appear in the list)
   - Press Enter to add a todo (should work same as clicking Add button)

2. Managing Todos:
   - Click the checkbox to mark a todo as complete
   - Click the delete icon to remove a todo
   - Verify the todo count updates correctly

3. Sorting:
   - Test "Date" sorting (newest first)
   - Test "Alphabetical" sorting
   - Test "Completed" sorting

4. Filtering:
   - Test "All" filter
   - Test "Active" filter
   - Test "Completed" filter

5. Persistence:
   - Add some todos
   - Refresh the page
   - Verify todos are still present
   - Verify their completion status is preserved

## Built With

- React
- TypeScript
- Material-UI
- Vite
