# NOIR AI HUB API Reference

## Base URL

```
https://api.noir-ai-hub.dev/api/v1
```

For local development:

```
http://localhost:4000/api/v1
```

## Authentication

NOIR uses JWT (JSON Web Token) authentication.

### Getting Started

```bash
# 1. Register
POST /auth/register

# 2. Verify email
GET /auth/verify-email?token=...

# 3. Login
POST /auth/login

# 4. Receive access token
# Response: { accessToken, refreshToken }

# 5. Use access token
Authorization: Bearer <accessToken>
```

### Refresh Token

Access tokens expire in 15 minutes. Use the refresh token to get a new one:

```bash
POST /auth/refresh
Authorization: Bearer <refreshToken>

# Response: { accessToken, refreshToken }
```

## Endpoints

### Authentication

#### Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure-password",
  "name": "John Doe"
}

# Response 201
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure-password"
}

# Response 200
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Logout

```http
POST /auth/logout
Authorization: Bearer <accessToken>

# Response 200
{ "message": "Logged out" }
```

### Models

#### List All Models

```http
GET /models
Authorization: Bearer <accessToken>

# Response 200
{
  "models": [
    {
      "id": "model-id",
      "slug": "gpt-4-turbo",
      "displayName": "GPT-4 Turbo",
      "provider": "openai",
      "capabilities": ["chat", "vision", "tools"],
      "supportsText": true,
      "supportsVision": true,
      "supportsAudio": false,
      "supportsTools": true,
      "supportsImages": false,
      "costPer1kInput": 0.01,
      "costPer1kOutput": 0.03
    }
  ]
}
```

#### Get Model by ID

```http
GET /models/{modelId}
Authorization: Bearer <accessToken>

# Response 200
{
  "id": "model-id",
  "slug": "gpt-4-turbo",
  "displayName": "GPT-4 Turbo",
  "provider": "openai",
  "capabilities": ["chat", "vision", "tools"],
  "supportsText": true,
  "supportsVision": true,
  "supportsAudio": false,
  "supportsTools": true,
  "supportsImages": false,
  "costPer1kInput": 0.01,
  "costPer1kOutput": 0.03
}
```

### Providers

#### List Providers

```http
GET /providers
Authorization: Bearer <accessToken>

# Response 200
{
  "providers": [
    {
      "id": "provider-id",
      "slug": "openai",
      "name": "OpenAI",
      "enabled": true,
      "health": "healthy",
      "models": 8,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Connect Provider (BYOK)

```http
POST /providers/{providerId}/connect
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "apiKey": "sk-...",
  "label": "My OpenAI Account"
}

# Response 201
{
  "id": "connection-id",
  "provider": "openai",
  "label": "My OpenAI Account",
  "connected": true,
  "connectedAt": "2024-01-01T00:00:00Z"
}
```

#### Disconnect Provider

```http
DELETE /providers/{providerId}/disconnect
Authorization: Bearer <accessToken>

# Response 200
{ "message": "Disconnected" }
```

### Conversations

#### Create Conversation

```http
POST /conversations
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "React Tips"
}

# Response 201
{
  "id": "conv-id",
  "userId": "user-id",
  "title": "React Tips",
  "archived": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### List Conversations

```http
GET /conversations?limit=20&offset=0
Authorization: Bearer <accessToken>

# Response 200
{
  "conversations": [
    {
      "id": "conv-id",
      "userId": "user-id",
      "title": "React Tips",
      "archived": false,
      "messageCount": 5,
      "lastMessageAt": "2024-01-01T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

#### Get Conversation

```http
GET /conversations/{conversationId}
Authorization: Bearer <accessToken>

# Response 200
{
  "id": "conv-id",
  "userId": "user-id",
  "title": "React Tips",
  "archived": false,
  "messages": [
    {
      "id": "msg-id",
      "role": "user",
      "content": "How do I use hooks?",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "msg-id",
      "role": "assistant",
      "content": "Hooks allow you to...",
      "model": "gpt-4-turbo",
      "provider": "openai",
      "inputTokens": 100,
      "outputTokens": 250,
      "latencyMs": 1200,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Delete Conversation

```http
DELETE /conversations/{conversationId}
Authorization: Bearer <accessToken>

# Response 200
{ "message": "Deleted" }
```

### Messages

#### Send Message

```http
POST /conversations/{conversationId}/messages
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "content": "Explain React hooks",
  "model": "auto",
  "mode": "chat",
  "stream": false
}

# Response 200
{
  "id": "msg-id",
  "conversationId": "conv-id",
  "role": "user",
  "content": "Explain React hooks",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Send Message (Streaming)

```http
POST /conversations/{conversationId}/messages?stream=true
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "content": "Explain React hooks",
  "model": "auto",
  "mode": "chat"
}

# Response 200 (Server-Sent Events)
data: {"delta": "Hooks", "index": 0}
data: {"delta": " are", "index": 1}
data: {"delta": " functions", "index": 2}
...
data: {"done": true, "inputTokens": 100, "outputTokens": 250}
```

#### Delete Message

```http
DELETE /conversations/{conversationId}/messages/{messageId}
Authorization: Bearer <accessToken>

# Response 200
{ "message": "Deleted" }
```

### Chat

#### Quick Chat (No History)

```http
POST /chat
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "message": "What is 2+2?",
  "model": "auto",
  "mode": "chat",
  "stream": false
}

# Response 200
{
  "id": "msg-id",
  "content": "2+2 equals 4.",
  "model": "gpt-4-turbo",
  "provider": "openai",
  "usage": {
    "inputTokens": 50,
    "outputTokens": 10,
    "totalTokens": 60
  },
  "latencyMs": 800
}
```

### Compare Models

#### Compare Models (Parallel)

```http
POST /compare
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "prompt": "Explain quantum computing",
  "models": ["gpt-4-turbo", "claude-3-opus", "gemini-pro"],
  "stream": false
}

# Response 200
{
  "prompt": "Explain quantum computing",
  "results": [
    {
      "model": "gpt-4-turbo",
      "provider": "openai",
      "content": "Quantum computing uses...",
      "usage": { "inputTokens": 100, "outputTokens": 300 },
      "latencyMs": 1200
    },
    {
      "model": "claude-3-opus",
      "provider": "anthropic",
      "content": "Quantum computers leverage...",
      "usage": { "inputTokens": 100, "outputTokens": 280 },
      "latencyMs": 900
    }
  ]
}
```

### Usage

#### Get Usage Stats

```http
GET /usage/stats?period=month
Authorization: Bearer <accessToken>

# Response 200
{
  "period": "month",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "requestCount": 1234,
  "totalTokens": 2500000,
  "inputTokens": 1500000,
  "outputTokens": 1000000,
  "estimatedCost": 45.67,
  "byProvider": [
    {
      "provider": "openai",
      "requests": 500,
      "tokens": 1000000,
      "cost": 25.00
    }
  ]
}
```

#### Get Usage Records

```http
GET /usage/records?limit=50&offset=0&provider=openai
Authorization: Bearer <accessToken>

# Response 200
{
  "records": [
    {
      "id": "record-id",
      "provider": "openai",
      "model": "gpt-4-turbo",
      "inputTokens": 100,
      "outputTokens": 250,
      "totalTokens": 350,
      "estimatedCost": 0.01,
      "latencyMs": 1200,
      "status": "success",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 500
}
```

### Admin

#### Get System Health

```http
GET /admin/health
Authorization: Bearer <adminToken>

# Response 200
{
  "status": "healthy",
  "uptime": 86400,
  "database": "healthy",
  "redis": "healthy",
  "providers": {
    "openai": "healthy",
    "gemini": "healthy",
    "anthropic": "healthy"
  }
}
```

## Error Responses

### 400 Bad Request

```json
{
  "error": "INVALID_REQUEST",
  "message": "Missing required field: email",
  "details": {
    "field": "email",
    "reason": "required"
  }
}
```

### 401 Unauthorized

```json
{
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden

```json
{
  "error": "FORBIDDEN",
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found

```json
{
  "error": "NOT_FOUND",
  "message": "Conversation not found"
}
```

### 429 Too Many Requests

```json
{
  "error": "RATE_LIMITED",
  "message": "Too many requests. Try again in 60 seconds.",
  "retryAfter": 60
}
```

### 500 Internal Server Error

```json
{
  "error": "INTERNAL_ERROR",
  "message": "An unexpected error occurred",
  "requestId": "req-uuid"
}
```

## Rate Limiting

NOIR implements rate limiting per user:

- **Free users**: 100 requests/hour
- **Paid users**: 10,000 requests/hour

Rate limit headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1704067200
```

## Pagination

List endpoints support pagination:

```
GET /conversations?limit=20&offset=0

Query Parameters:
- limit: Number of results (1-100, default: 20)
- offset: Starting position (default: 0)

Response includes:
- total: Total number of items
- limit: Requested limit
- offset: Current offset
```

## SDK

NOIR client SDKs:

- **JavaScript/TypeScript**: `@noir/sdk-js`
- **Python**: `noir-sdk`
- **Go**: `noir-go-sdk`

## Support

For API support:

- Email: support@noir-ai-hub.dev
- Issues: https://github.com/mrutyunjaya-design/noir-ai-hub/issues
- Discussions: https://github.com/mrutyunjaya-design/noir-ai-hub/discussions
