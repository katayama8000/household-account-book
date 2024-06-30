#!/bin/bash
# Start generating TypeScript types for your Supabase schema
echo "Generating TypeScript types for your Supabase schema..."

# Ensure the PROJECT_REF environment variable is set
if [ -z "$PROJECT_REF" ]; then
  echo "Error: PROJECT_REF environment variable is not set." >&2
  exit 1
fi

# Generate TypeScript types for your Supabase schema
npx supabase gen types typescript \
  --project-id "$PROJECT_REF" \
  --schema public > types/supabase.ts

# Check if the generation was successful
if [ $? -eq 0 ]; then
  echo "TypeScript types generated successfully."
else
  echo "Failed to generate TypeScript types." >&2
  exit 1
fi
