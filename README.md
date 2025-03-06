# Document Scanner

A self-contained document scanning and matching system with a credit system.

## Setup Instructions
1. **Install Node.js**: Ensure Node.js is installed (v16+ recommended).
2. **Clone Repository**: Clone this repository to your local machine.
3. **Install Dependencies**: Run `npm install` in the project root.
4. **Create Uploads Folder**: Create a `backend/uploads` directory for storing uploaded files.
5. **Start Server**: Run `npm start` to launch the server on `http://localhost:3000`.
6. **Access Frontend**: Open `frontend/index.html` in a browser (serve via a static server like `npx serve frontend` for best results).

## Features
- User registration and login with JWT authentication.
- 20 free daily scans per user, reset at midnight.
- Credit request system with admin approval.
- Document upload and basic text matching using Levenshtein distance.
- Admin dashboard with analytics.

## Test Data
- Create a sample `.txt` file with some text (e.g., "Hello world") and upload it via the scan page.

## Notes
- Default admin user: Register a user and manually set `isAdmin = 1` in the SQLite database (`database.db`).
- No external AI is implemented; matching uses a custom Levenshtein algorithm.