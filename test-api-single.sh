#!/bin/bash

# Single Certificate API Test

API_URL="http://localhost/api/certificates/store"

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
  "master_policy_number": "22N38840",
  "status": "Active",
  "item_number": "TEST001",
  "gr_lr_number": "GR2025TEST001",
  "gr_lr_date": "2025-01-18",
  "insured_commodity": "Test Goods",
  "cargo_value": 100000,
  "insured_name": "Test Company Pvt Ltd",
  "cc_mail": "cc@testcompany.com",
  "insured_address": "Test Address, Test City 100001",
  "insured_mobile": "9999999999",
  "insured_email": "test@testcompany.com",
  "voyage_from": "Test City A",
  "voyage_to": "Test City B",
  "invoice_number": "TEST-INV-001",
  "invoice_date": "2025-01-17",
  "declaration_id": "TEST-DECL-001",
  "description": "Test shipment",
  "master_policy_type": "Marine",
  "policy_source": "API",
  "vb_64": "VB64-TEST-001",
  "is_cancelled": false,
  "is_intracity": false,
  "is_intercity": true
}'
