FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY pyproject.toml uv.lock ./
RUN pip install uv && uv sync --frozen --no-dev

# Copy application code
COPY . .

# Create data directory for SQLite
RUN mkdir -p /data

# Expose port
EXPOSE 8080

# Make start script executable
RUN chmod +x start.sh

# Run the application
CMD ["./start.sh"]
