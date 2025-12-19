# Certificate API Documentation

## Overview
This API allows external systems to create insurance certificates and automatically handle CD (Credit/Debit) transactions.

## Base URL
```
http://your-domain.com/api/certificates
```

## Endpoints

### 1. Store Certificates (Bulk or Single)
**Endpoint:** `POST /api/certificates/store`

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body (Single Certificate):**
```json
{
  "master_policy_number": "22N38840",
  "status": "Active",
  "item_number": "ITEM001",
  "gr_lr_number": "GR2025001",
  "gr_lr_date": "2025-01-15",
  "insured_commodity": "Used Household Goods IntraCity",
  "cargo_value": 150000,
  "gross_premium": 1200.5,
  "gst_premium": 216.09,
  "total_premium": 1416.59,
  "insured_name": "ABC Electronics Ltd",
  "cc_mail": "finance@abcelectronics.com",
  "insured_address": "123 MG Road, Bangalore",
  "insured_mobile": "9876543210",
  "insured_email": "info@abcelectronics.com",
  "voyage_from": "Mumbai",
  "voyage_to": "Bangalore",
  "invoice_number": "INV2025-001",
  "invoice_date": "2025-01-14",
  "declaration_id": "DECL001",
  "description": "Electronic goods",
  "master_policy_type": "Marine",
  "policy_source": "Direct",
  "vb_64": "VB64-001",
  "is_cancelled": false
}
```

**Request Body (Bulk Certificates):**
```json
{
  "certificates": [
    {
      "master_policy_number": "22N38840",
      "cargo_value": 150000,
      "insured_name": "Company A",
      ...
    },
    {
      "master_policy_number": "22N38840",
      "cargo_value": 200000,
      "insured_name": "Company B",
      ...
    }
  ]
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Certificates processed successfully",
  "data": {
    "success": [
      {
        "index": 0,
        "certificate_id": 123,
        "cover_letter_no": "SSZOOM00000000123",
        "cd_transaction_id": "TXN202501180001",
        "cd_balance": 985000,
        "premium_charged": 15000
      }
    ],
    "failed": [],
    "success_count": 1,
    "failed_count": 0,
    "total": 1
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error processing certificates",
  "error": "Validation failed: insured_name is required"
}
```

### 2. Check Certificate Status
**Endpoint:** `POST /api/certificates/status`

**Request Body:**
```json
{
  "cover_letter_no": "SSZOOM00000000123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cover_letter_no": "SSZOOM00000000123",
    "status": "Active",
    "is_active": true,
    "is_cancelled": false,
    "insured_name": "ABC Electronics Ltd",
    "cargo_value": 150000,
    "total_premium": 15000,
    "master_policy_number": "22N38840"
  }
}
```

## Fields Description

### Required Fields
- `master_policy_number` (string) - Master policy number (not ID)
- `insured_name` (string) - Name of insured party
- `cargo_value` (numeric) - Value of cargo in INR
- `gross_premium` (numeric) - Gross premium (already calculated by client)
- `gst_premium` (numeric) - GST component of premium
- `total_premium` (numeric) - Total premium (gross + GST)

### Optional Fields
- `status` (string) - Default: "Active"
- `item_number` (string)
- `gr_lr_number` (string) - GR/LR number
- `gr_lr_date` (date) - Format: YYYY-MM-DD
- `insured_commodity` (string)
- `cc_mail` (string)
- `insured_address` (string)
- `insured_mobile` (string)
- `insured_email` (email)
- `voyage_from` (string)
- `voyage_to` (string)
- `invoice_number` (string)
- `invoice_date` (date)
- `declaration_id` (string)
- `description` (string)
- `master_policy_type` (string)
- `policy_source` (string)
- `vb_64` (string)
- `is_cancelled` (boolean) - Default: false
- `cancellation_reason` (string)
- `is_intracity` / `is_intercity` are **derived automatically** from `insured_commodity` and should **not** be sent explicitly.

## Premium Handling
- The API **does not calculate** premiums internally.
- Client must send `gross_premium`, `gst_premium`, and `total_premium`.

## Intracity / Intercity Detection
- The API inspects `insured_commodity` text:
  - If it contains `IntraCity` (or `Intra City`, case-insensitive) → `is_intracity = true`, `is_intercity = false`.
  - If it contains `InterCity` (or `Inter City`, case-insensitive) → `is_intercity = true`, `is_intracity = false`.
  - If neither is found → defaults to `is_intercity = true`.

## CD Transaction
For each certificate created (if not cancelled):
1. A CD debit transaction is created
2. The CD Master account balance is decreased by the total premium
3. Transaction ID is auto-generated with format: TXN{YYYYMMDD}{sequential}

## Testing

### Make scripts executable:
```bash
chmod +x test-api-single.sh
chmod +x test-api-bulk.sh
chmod +x test-api-status.sh
```

### Test single certificate:
```bash
./test-api-single.sh
```

### Test bulk certificates (10 records):
```bash
./test-api-bulk.sh
```

### Check certificate status:
```bash
./test-api-status.sh SSZOOM00000000123
```

## Error Handling
- The API processes certificates synchronously to avoid timeout
- Failed certificates are returned in the response with error details
- Database transactions ensure data consistency
- If master policy not found, certificate creation fails

## Notes
- No authentication required by default (add middleware if needed)
- Cover letter number auto-generated: SSZOOM + 11-digit ID
- CD Master account is auto-created if not exists
- Default opening balance: 1,000,000 INR
- All dates should be in format: YYYY-MM-DD
