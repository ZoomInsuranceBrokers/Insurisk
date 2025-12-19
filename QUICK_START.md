# Certificate API - Quick Start Guide

## 🚀 Setup

1. **Make test scripts executable:**
```bash
chmod +x test-api-single.sh test-api-bulk.sh test-api-status.sh
```

2. **Update your domain in scripts:**
Replace `http://localhost` with your actual domain in:
- test-api-single.sh
- test-api-bulk.sh
- test-api-status.sh

## 📝 Testing

### Test 1: Single Certificate
```bash
./test-api-single.sh
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Certificates processed successfully",
  "data": {
    "success": [
      {
        "certificate_id": 1,
        "cover_letter_no": "SSZOOM00000000001",
        "cd_transaction_id": "TXN202501180001",
        "cd_balance": 985000,
        "premium_charged": 15000
      }
    ],
    "success_count": 1,
    "failed_count": 0
  }
}
```

### Test 2: Bulk Certificates (10 records)
```bash
./test-api-bulk.sh
```

**Processing Time:** ~2-5 seconds for 10 records

### Test 3: Check Certificate Status
```bash
./test-api-status.sh SSZOOM00000000001
```

Replace `SSZOOM00000000001` with actual cover letter number from Test 1 response.

## 🔧 Using CURL Directly

### Single Certificate:
```bash
curl -X POST "http://localhost/api/certificates/store" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "master_policy_number": "22N38840",
    "cargo_value": 100000,
    "insured_name": "Test Company Ltd",
    "insured_email": "test@company.com",
    "is_intercity": true
  }'
```

### Bulk Certificates:
```bash
curl -X POST "http://localhost/api/certificates/store" \
  -H "Content-Type: application/json" \
  -d '{
    "certificates": [
      {
        "master_policy_number": "22N38840",
        "cargo_value": 100000,
        "insured_name": "Company A",
        "insured_email": "a@company.com",
        "is_intercity": true
      },
      {
        "master_policy_number": "22N38840",
        "cargo_value": 200000,
        "insured_name": "Company B",
        "insured_email": "b@company.com",
        "is_intercity": true
      }
    ]
  }'
```

## 📊 What Happens Behind the Scenes

1. ✅ API receives certificate data
2. ✅ Validates required fields (master_policy_number, insured_name, cargo_value)
3. ✅ Looks up Master Policy by number (not ID)
4. ✅ Calculates premiums automatically:
   - Gross Premium = cargo_value × (rate / 100)
   - GST Premium = gross_premium × 0.18
   - Total Premium = gross + gst
5. ✅ Creates Certificate record
6. ✅ Generates Cover Letter Number (SSZOOM + 11 digits)
7. ✅ Creates CD Transaction (debit)
8. ✅ Updates CD Master balance
9. ✅ Returns response with certificate ID and transaction details

## 🔍 Troubleshooting

### Error: "Master policy not found"
- Check that master_policy_number exists in database
- Use policy NUMBER not ID

### Error: "No valid rate found"
- Master policy must have intracity_rate or intercity_rate set
- Check is_intracity/is_intercity flags

### Error: "Validation failed"
- Ensure required fields are present:
  - master_policy_number (string)
  - insured_name (string)
  - cargo_value (number)

### Timeout on bulk insert
- API processes synchronously to avoid timeout
- Large batches (1000+) may take longer
- Consider splitting into smaller batches (100-500 records)

## 📱 Postman Collection

Import `Certificate_API.postman_collection.json` into Postman for easy testing.

## 🔐 Security Notes

**Current Setup:** No authentication required

**For Production:**
Add authentication middleware in `routes/api.php`:
```php
Route::middleware('auth:sanctum')->prefix('certificates')->group(function () {
    Route::post('/store', [CertificateApiController::class, 'store']);
});
```

## 📚 Full Documentation

See `API_DOCUMENTATION.md` for complete field descriptions and examples.
