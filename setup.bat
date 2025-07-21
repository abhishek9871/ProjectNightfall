@echo off
echo ===================================================
echo Project Nightfall: Revenue Engine - Setup Script
echo ===================================================
echo.

echo Installing dependencies...
call npm install

echo.
echo Setting up environment...
if not exist .env.local (
    copy .env .env.local
    echo Created .env.local from template
)

echo.
echo Starting development server...
call npm run dev

echo.
echo ===================================================
echo Setup complete! Project is running at http://localhost:5173
echo ===================================================