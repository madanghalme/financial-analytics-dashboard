# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### POST `/auth/login`

Request:

```json
{
  "email": "analyst@example.com",
  "password": "Password@123"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "token": "JWT...",
    "user": {
      "id": "...",
      "email": "analyst@example.com",
      "name": "Financial Analyst"
    }
  }
}
```

### GET `/auth/me`

Requires `Authorization: Bearer <token>`.

### POST `/auth/logout`

Requires `Authorization: Bearer <token>`. The client clears its local token after the request.

## Transactions

All transaction endpoints require a valid JWT.

### GET `/transactions`

Query parameters:

- `page` — 1-based page number
- `limit` — 1–100
- `search` — searches id, category, status and user_id
- `category` — Revenue / Expense
- `status` — Paid / Pending
- `userId` — user ID
- `dateFrom` — ISO date
- `dateTo` — ISO date
- `amountMin`
- `amountMax`
- `sortBy` — id/date/amount/category/status/user_id
- `sortOrder` — asc/desc

### GET `/transactions/export`

Same filters as `/transactions`, plus:

- `columns` — comma-separated columns from:
  `id,date,amount,category,status,user_id,user_profile`

Returns a CSV attachment.

### GET `/transactions/summary`

Returns totals and chart-ready aggregations.

## Health

### GET `/health`

Returns API status.

## Error format

```json
{
  "success": false,
  "message": "Human readable error",
  "errors": []
}
```
