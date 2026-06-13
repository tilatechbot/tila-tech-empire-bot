# API Documentation

## Base URL

```
http://localhost:3000
```

## Authentication

No authentication required for public endpoints. Owner-only endpoints require valid WhatsApp JID.

---

## Endpoints

### 1. Get System Status

```http
GET /status
```

**Response:**
```json
{
  "status": "online",
  "bot": "TILA TECH EMPIRE BOT",
  "version": "2.0.0",
  "whatsapp": {
    "connected": "connected",
    "user": "John Doe"
  },
  "telegram": {
    "enabled": true,
    "connected": "connected"
  },
  "commands": 50,
  "uptime": "1h 30m",
  "timestamp": "2026-06-13T21:51:05Z"
}
```

---

### 2. Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-06-13T21:51:05Z"
}
```

---

### 3. List All Commands

```http
GET /api/commands
```

**Response:**
```json
{
  "total": 50,
  "commands": [
    {
      "name": "ping",
      "category": "system",
      "description": "Check bot response time",
      "usage": ".ping",
      "ownerOnly": false,
      "groupOnly": false
    }
  ]
}
```

---

### 4. WhatsApp Connection Info

```http
GET /api/whatsapp/info
```

**Response (Connected):**
```json
{
  "connected": true,
  "name": "John Doe",
  "jid": "1234567890@s.whatsapp.net",
  "status": "online"
}
```

---

### 5. System Metrics

```http
GET /metrics
```

**Response:**
```json
{
  "uptime": 5400.123,
  "memory": {
    "heapUsed": 125,
    "heapTotal": 256,
    "external": 8
  },
  "cpuUsage": {
    "user": 1200000,
    "system": 400000
  },
  "nodeVersion": "v18.16.0"
}
```

---

## cURL Examples

```bash
# Get Status
curl -s http://localhost:3000/status | jq

# Health Check
curl -s http://localhost:3000/health

# List Commands
curl -s http://localhost:3000/api/commands | jq '.total'

# WhatsApp Info
curl -s http://localhost:3000/api/whatsapp/info

# Metrics
curl -s http://localhost:3000/metrics
```

---

**Complete API Reference** ✅
