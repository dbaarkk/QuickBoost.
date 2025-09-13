# QuickBoost.
The best smm panel in india 

## Order Completion API

### Endpoint
```
POST /functions/v1/complete-orders
```

### Authentication
Include API key in request header or body:
```
x-api-key: quickboost-api-2024
```

### Usage Examples

#### Complete All Pending Orders (Auto-mode)
```bash
curl -X POST https://your-supabase-url.supabase.co/functions/v1/complete-orders \
  -H "Content-Type: application/json" \
  -H "x-api-key: quickboost-api-2024"
```

#### Complete Specific Order
```bash
curl -X POST https://your-supabase-url.supabase.co/functions/v1/complete-orders \
  -H "Content-Type: application/json" \
  -H "x-api-key: quickboost-api-2024" \
  -d '{"order_id": "123e4567-e89b-12d3-a456-426614174000"}'
```

### Response Format
```json
{
  "status": "success",
  "order_id": "123e4567-e89b-12d3-a456-426614174000",
  "message": "Order completed successfully"
}
```

### Features
- ✅ Automatic order completion
- ✅ Bulk processing of pending orders
- ✅ Individual order completion
- ✅ API key authentication
- ✅ Error handling and validation
- ✅ CORS support
- ✅ No modification to existing site functionality
