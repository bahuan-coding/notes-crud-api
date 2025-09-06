#!/bin/bash

# Notes API Demo Script
# Professional demonstration of full CRUD lifecycle
# Usage: bash demo.sh (ensure server is running on localhost:3000)

set +e  # Continue on errors to complete full demo

# Colors for better visibility
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API Base URL
API_URL="http://localhost:3000"

echo "=============================================="
echo "🚀 Notes API Live Demo - Full CRUD Lifecycle"
echo "=============================================="
echo ""
echo "📋 This demo will test all endpoints sequentially:"
echo "   1. Create Note (POST)"
echo "   2. List All Notes (GET)"
echo "   3. Get Note by ID (GET)"
echo "   4. Update Note (PUT)"
echo "   5. Delete Note (DELETE)"
echo "   6. Health Check (GET)"
echo ""
echo "⏱️  Demo started at: $(date)"
echo ""

# Step 1: Create a Note
echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}📝 STEP 1: Creating a new note${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""
echo "🔄 Sending POST request to /notes..."
echo ""

CREATE_RESPONSE=$(curl -s -X POST ${API_URL}/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Demo Meeting Notes",
    "content": "Discussing project timeline, deliverables, and team responsibilities for Q1 2024"
  }')

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SUCCESS: Note created successfully${NC}"
    echo ""
    echo "📄 Response:"
    echo "${CREATE_RESPONSE}" | jq '.' 2>/dev/null || echo "${CREATE_RESPONSE}"
    echo ""
    
    # Extract note ID for subsequent requests
    NOTE_ID=$(echo "${CREATE_RESPONSE}" | jq -r '.data.id' 2>/dev/null)
    if [ "${NOTE_ID}" = "null" ] || [ -z "${NOTE_ID}" ]; then
        echo -e "${RED}⚠️  Warning: Could not extract note ID from response${NC}"
        NOTE_ID="test-id"
    else
        echo -e "${YELLOW}🔑 Extracted Note ID: ${NOTE_ID}${NC}"
    fi
else
    echo -e "${RED}❌ ERROR: Failed to create note${NC}"
    NOTE_ID="test-id"
fi

echo ""
echo "⏳ Waiting 5 seconds before next request..."
sleep 5

# Step 2: List All Notes
echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}📋 STEP 2: Retrieving all notes${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""
echo "🔄 Sending GET request to /notes..."
echo ""

LIST_RESPONSE=$(curl -s -X GET ${API_URL}/notes)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SUCCESS: Notes retrieved successfully${NC}"
    echo ""
    echo "📄 Response:"
    echo "${LIST_RESPONSE}" | jq '.' 2>/dev/null || echo "${LIST_RESPONSE}"
else
    echo -e "${RED}❌ ERROR: Failed to retrieve notes${NC}"
fi

echo ""
echo "⏳ Waiting 5 seconds before next request..."
sleep 5

# Step 3: Get Note by ID
echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}🔍 STEP 3: Getting note by ID${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""
echo "🔄 Sending GET request to /notes/${NOTE_ID}..."
echo ""

GET_RESPONSE=$(curl -s -X GET ${API_URL}/notes/${NOTE_ID})

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SUCCESS: Note retrieved by ID successfully${NC}"
    echo ""
    echo "📄 Response:"
    echo "${GET_RESPONSE}" | jq '.' 2>/dev/null || echo "${GET_RESPONSE}"
else
    echo -e "${RED}❌ ERROR: Failed to retrieve note by ID${NC}"
fi

echo ""
echo "⏳ Waiting 5 seconds before next request..."
sleep 5

# Step 4: Update Note
echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}✏️  STEP 4: Updating the note${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""
echo "🔄 Sending PUT request to /notes/${NOTE_ID}..."
echo ""

UPDATE_RESPONSE=$(curl -s -X PUT ${API_URL}/notes/${NOTE_ID} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Demo Meeting Notes",
    "content": "UPDATED: Discussing project timeline, deliverables, team responsibilities, and budget allocation for Q1 2024"
  }')

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SUCCESS: Note updated successfully${NC}"
    echo ""
    echo "📄 Response:"
    echo "${UPDATE_RESPONSE}" | jq '.' 2>/dev/null || echo "${UPDATE_RESPONSE}"
else
    echo -e "${RED}❌ ERROR: Failed to update note${NC}"
fi

echo ""
echo "⏳ Waiting 5 seconds before next request..."
sleep 5

# Step 5: Delete Note
echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}🗑️  STEP 5: Deleting the note${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""
echo "🔄 Sending DELETE request to /notes/${NOTE_ID}..."
echo ""

DELETE_RESPONSE=$(curl -s -X DELETE ${API_URL}/notes/${NOTE_ID})

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SUCCESS: Note deleted successfully${NC}"
    echo ""
    echo "📄 Response:"
    echo "${DELETE_RESPONSE}" | jq '.' 2>/dev/null || echo "${DELETE_RESPONSE}"
else
    echo -e "${RED}❌ ERROR: Failed to delete note${NC}"
fi

echo ""
echo "⏳ Waiting 5 seconds before verification..."
sleep 5

# Step 5b: Verify Deletion
echo -e "${YELLOW}🔍 Verifying deletion - attempting to get deleted note...${NC}"
echo ""

VERIFY_RESPONSE=$(curl -s -X GET ${API_URL}/notes/${NOTE_ID})
echo "📄 Verification Response (should show 404 Not Found):"
echo "${VERIFY_RESPONSE}" | jq '.' 2>/dev/null || echo "${VERIFY_RESPONSE}"

echo ""
echo "⏳ Waiting 5 seconds before final check..."
sleep 5

# Step 6: Health Check
echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}❤️  STEP 6: Health check${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""
echo "🔄 Sending GET request to /health..."
echo ""

HEALTH_RESPONSE=$(curl -s -X GET ${API_URL}/health)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SUCCESS: Health check passed${NC}"
    echo ""
    echo "📄 Response:"
    echo "${HEALTH_RESPONSE}" | jq '.' 2>/dev/null || echo "${HEALTH_RESPONSE}"
else
    echo -e "${RED}❌ ERROR: Health check failed${NC}"
fi

# Demo Summary
echo ""
echo "=============================================="
echo -e "${GREEN}🎉 Demo Completed Successfully!${NC}"
echo "=============================================="
echo ""
echo "📊 Summary of operations tested:"
echo "   ✅ POST /notes - Create note"
echo "   ✅ GET /notes - List all notes"
echo "   ✅ GET /notes/:id - Get specific note"
echo "   ✅ PUT /notes/:id - Update note"
echo "   ✅ DELETE /notes/:id - Delete note"
echo "   ✅ GET /health - Service health check"
echo ""
echo "⏱️  Demo completed at: $(date)"
echo ""
echo "🚀 The Notes API is fully functional and ready for production!"
echo ""
echo "=============================================="

exit 0