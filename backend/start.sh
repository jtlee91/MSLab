#!/bin/bash
set -e

# Run migrations
echo "Running database migrations..."
uv run alembic upgrade head

# Seed data if database is empty
echo "Checking seed data..."
uv run python -c "
from app.database import SessionLocal
from app.models import User

db = SessionLocal()
user = db.query(User).first()
if not user:
    print('Seeding initial data...')
    import subprocess
    subprocess.run(['uv', 'run', 'python', '-m', 'app.seed'])
else:
    print('Database already has data, skipping seed.')
db.close()
"

# Start the server
echo "Starting server..."
exec uv run uvicorn app.main:app --host 0.0.0.0 --port 8080
