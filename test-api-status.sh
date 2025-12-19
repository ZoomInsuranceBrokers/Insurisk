#!/bin/bash

# Check Certificate Status API

API_URL="http://localhost/api/certificates/status"

# Replace with actual cover letter number returned from store API
COVER_LETTER_NO="${1:-SSZOOM00000000001}"

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
  \"cover_letter_no\": \"$COVER_LETTER_NO\"
}"
