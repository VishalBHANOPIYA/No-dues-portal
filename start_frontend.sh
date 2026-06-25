#!/bin/bash
# start_frontend.sh

# Get absolute path of frontend directory
FRONTEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/no-dues-portal"

echo "=== Starting React Vite Frontend on localhost ==="
cd "$FRONTEND_DIR" && npm run dev
