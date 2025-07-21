#!/bin/bash

echo "==================================================="
echo "Project Nightfall: Revenue Engine - Setup Script"
echo "==================================================="
echo

echo "Installing dependencies..."
npm install

echo
echo "Setting up environment..."
if [ ! -f .env.local ]; then
    cp .env .env.local
    echo "Created .env.local from template"
fi

echo
echo "Starting development server..."
npm run dev

echo
echo "==================================================="
echo "Setup complete! Project is running at http://localhost:5173"
echo "==================================================="