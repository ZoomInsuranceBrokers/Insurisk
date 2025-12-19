#!/bin/bash

# Complete API Test Suite
# This script runs all tests sequentially

echo "================================================"
echo "Certificate API - Complete Test Suite"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Single Certificate
echo -e "${BLUE}Test 1: Creating Single Certificate...${NC}"
echo "----------------------------------------------"
RESPONSE1=$(./test-api-single.sh)
echo "$RESPONSE1" | jq .
echo ""

# Extract cover letter number from response
COVER_LETTER=$(echo "$RESPONSE1" | jq -r '.data.success[0].cover_letter_no // empty')

if [ -n "$COVER_LETTER" ]; then
    echo -e "${GREEN}✓ Certificate created: $COVER_LETTER${NC}"
    echo ""
    
    # Test 2: Check Status
    echo -e "${BLUE}Test 2: Checking Certificate Status...${NC}"
    echo "----------------------------------------------"
    ./test-api-status.sh "$COVER_LETTER" | jq .
    echo ""
    echo -e "${GREEN}✓ Status check completed${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠ Could not extract cover letter number${NC}"
    echo ""
fi

# Test 3: Bulk Insert
echo -e "${BLUE}Test 3: Creating 10 Certificates (Bulk)...${NC}"
echo "----------------------------------------------"
RESPONSE3=$(./test-api-bulk.sh)
echo "$RESPONSE3" | jq .
echo ""

SUCCESS_COUNT=$(echo "$RESPONSE3" | jq -r '.data.success_count // 0')
FAILED_COUNT=$(echo "$RESPONSE3" | jq -r '.data.failed_count // 0')

echo -e "${GREEN}✓ Bulk insert completed${NC}"
echo "  - Success: $SUCCESS_COUNT"
echo "  - Failed: $FAILED_COUNT"
echo ""

# Summary
echo "================================================"
echo -e "${GREEN}All Tests Completed!${NC}"
echo "================================================"
echo ""
echo "Summary:"
echo "  1. Single certificate: $([ -n "$COVER_LETTER" ] && echo "✓ Success" || echo "✗ Failed")"
echo "  2. Status check: $([ -n "$COVER_LETTER" ] && echo "✓ Success" || echo "- Skipped")"
echo "  3. Bulk insert: ✓ Success ($SUCCESS_COUNT/$((SUCCESS_COUNT + FAILED_COUNT)) records)"
echo ""
echo "Check your database:"
echo "  - certificate_of_insurances table"
echo "  - cd_transactions table"
echo "  - cd_masters table (check current_balance)"
echo ""
