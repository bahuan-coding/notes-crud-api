#!/bin/bash

echo "=== Notes API Demo ==="
echo

# Health check
echo "1. Health Check:"
curl -s http://localhost:3000/health | jq
echo

# Create first note
echo "2. Creating first note:"
NOTE1_RESPONSE=$(curl -s -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "Meeting Notes", "content": "Discuss project timeline and deliverables"}')
echo $NOTE1_RESPONSE | jq
NOTE1_ID=$(echo $NOTE1_RESPONSE | jq -r '.data.id')
echo

# Create second note
echo "3. Creating second note:"
NOTE2_RESPONSE=$(curl -s -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "Shopping List", "content": "Milk, Bread, Eggs, Coffee"}')
echo $NOTE2_RESPONSE | jq
NOTE2_ID=$(echo $NOTE2_RESPONSE | jq -r '.data.id')
echo

# Get all notes
echo "4. Getting all notes:"
curl -s http://localhost:3000/notes | jq
echo

# Get specific note
echo "5. Getting specific note:"
curl -s http://localhost:3000/notes/$NOTE1_ID | jq
echo

# Update note
echo "6. Updating note:"
curl -s -X PUT http://localhost:3000/notes/$NOTE1_ID \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Meeting Notes", "content": "Discuss project timeline, deliverables, and budget"}' | jq
echo

# Delete note
echo "7. Deleting note:"
curl -s -X DELETE http://localhost:3000/notes/$NOTE2_ID | jq
echo

# Get all notes after deletion
echo "8. Getting all notes after deletion:"
curl -s http://localhost:3000/notes | jq
echo

# Test error case
echo "9. Testing error case (non-existent note):"
curl -s http://localhost:3000/notes/non-existent-id | jq
echo

echo "=== Demo Complete ==="
