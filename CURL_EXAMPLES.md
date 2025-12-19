## COPY-PASTE READY CURL COMMANDS

### 1. Test Single Certificate (Minimal Fields)
```bash
curl -X POST "http://localhost/api/certificates/store" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "master_policy_number": "22N38840",
    "cargo_value": 100000,
    "insured_name": "Test Company Pvt Ltd",
    "insured_email": "test@company.com",
    "is_intercity": true
  }'
```

### 2. Test Single Certificate (All Fields)
```bash
curl -X POST "http://localhost/api/certificates/store" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "master_policy_number": "22N38840",
    "status": "Active",
    "item_number": "ITEM001",
    "gr_lr_number": "GR2025001",
    "gr_lr_date": "2025-01-18",
    "insured_commodity": "Electronics",
    "cargo_value": 150000,
    "insured_name": "ABC Electronics Ltd",
    "cc_mail": "cc@abcelectronics.com",
    "insured_address": "123 MG Road, Bangalore, Karnataka 560001",
    "insured_mobile": "9876543210",
    "insured_email": "info@abcelectronics.com",
    "voyage_from": "Mumbai, Maharashtra",
    "voyage_to": "Bangalore, Karnataka",
    "invoice_number": "INV2025-001",
    "invoice_date": "2025-01-17",
    "declaration_id": "DECL001",
    "description": "Electronic goods shipment",
    "master_policy_type": "Marine",
    "policy_source": "Direct",
    "vb_64": "VB64-001",
    "is_cancelled": false,
    "is_intracity": false,
    "is_intercity": true
  }'
```

### 3. Test 3 Bulk Certificates
```bash
curl -X POST "http://localhost/api/certificates/store" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "certificates": [
      {
        "master_policy_number": "22N38840",
        "cargo_value": 150000,
        "insured_name": "ABC Electronics Ltd",
        "insured_email": "info@abc.com",
        "is_intercity": true
      },
      {
        "master_policy_number": "22N38840",
        "cargo_value": 200000,
        "insured_name": "XYZ Textiles",
        "insured_email": "info@xyz.com",
        "is_intercity": true
      },
      {
        "master_policy_number": "22N38840",
        "cargo_value": 300000,
        "insured_name": "PQR Industries",
        "insured_email": "info@pqr.com",
        "is_intercity": true
      }
    ]
  }'
```

### 4. Check Certificate Status
```bash
# Replace SSZOOM00000000001 with actual cover letter number
curl -X POST "http://localhost/api/certificates/status" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "cover_letter_no": "SSZOOM00000000001"
  }'
```

### 5. Test with Pretty JSON Output (using jq)
```bash
curl -X POST "http://localhost/api/certificates/store" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "master_policy_number": "22N38840",
    "cargo_value": 100000,
    "insured_name": "Test Company",
    "insured_email": "test@company.com",
    "is_intercity": true
  }' | jq .
```

---

**NOTE:** Replace `http://localhost` with your actual domain/IP address.

**Examples:**
- `http://192.168.1.100/api/certificates/store`
- `https://insurisk.yourdomain.com/api/certificates/store`
