#!/bin/bash
# start_backend.sh

# Get absolute path of backend directory
BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/no_dues_backend"

echo "=== Starting PostgreSQL Server ==="
if /usr/lib/postgresql/17/bin/pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    echo "PostgreSQL is already running."
else
    echo "Cleaning stale lock files..."
    rm -f "$BACKEND_DIR/pg_data/postmaster.pid" "$BACKEND_DIR/pg_data/.s.PGSQL.5432" "$BACKEND_DIR/pg_data/.s.PGSQL.5432.lock"
    echo "Starting PostgreSQL from local pg_data..."
    /usr/lib/postgresql/17/bin/pg_ctl -D "$BACKEND_DIR/pg_data" -l "$BACKEND_DIR/pg_data/pg_log" start
    sleep 2
fi

echo "=== Running Database Migrations ==="
"$BACKEND_DIR/venv/bin/python" "$BACKEND_DIR/manage.py" migrate

echo "=== Starting Django REST Framework on http://127.0.0.1:8000 ==="
"$BACKEND_DIR/venv/bin/python" "$BACKEND_DIR/manage.py" runserver 8000
