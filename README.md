# n8n-nodes-walytic

n8n community node for the [Walytic](https://walytic.com) WhatsApp automation platform.

## Installation

In your n8n instance, go to **Settings > Community Nodes** and install:

```
n8n-nodes-walytic
```

Or install via CLI:

```bash
npm install n8n-nodes-walytic
```

## Configuration

1. In Walytic, open **Settings > API Keys** and generate an API key (copy it once, it is not displayed again).
2. Copy your **Workspace ID** from the same Settings > API Keys page or the workspace switcher.
3. In n8n, create a new **Walytic API** credential and supply:
   - **API Key** (sent as the `x-api-key` header)
   - **Workspace ID** (sent as the `X-Workspace-Id` header)
   - **Base URL** (defaults to `https://api.walytic.com`)

Every request must include both the API key and the workspace ID. The API key must belong to that workspace.

## sessionId — your WhatsApp number

Most messaging operations take a `sessionId`, which is your connected WhatsApp number in **E.164 digits without the plus sign** (e.g. `919876543210`). Connect a number via **Session > Create / Reconnect**, scan the QR over Socket.IO, then use that digit-only string everywhere a sessionId is required.

## Resources & Operations

### Session
- **List**, **Create / Reconnect**, **Delete**, **Get Status**

### Message
- **Send Text** — `{ number, message, htmlMessage? }`
- **Send Media** — `{ fileUrl, caption?, number | groupId | groupName }`
- **Send to Group** — `{ message, groupName | groupId, mentions? }`
- **Update Status (Story)** — text or media story
- **List**, **Approve Pending**, **Get All History**, **Get Chat History**

### Group
- **List** groups (processed), **List Groups Raw**, **Get Members**

### Contact
- **List / Get / Create / Update / Delete**
- **Promote to Lead**, **Assign Flow**, **Remove Flow**
- **Bulk Assign Flow**, **Bulk Update Stage**
- **Merge**, **Sync from WhatsApp**

### Conversation
- **List**, **Mark Read**

### Campaign (Outreach)
- **List / Get / Create / Update / Delete / Toggle / Duplicate**
- **Assign Leads**, **Unassign Leads**, **Resolve Filters**, **Get Stats**

### Bulk Campaign
- **List**, **Pause**, **Resume**, **Delete** (file upload is dashboard-only for now)

### AutoFlow
- **List / Get / Create / Update / Delete / Toggle / List Executions**

### Webhook
- **List by Session**, **Create / Upsert**, **Update by ID**, **Delete by ID / Session**, **Rotate Secret**, **Send Test**

### Verification
- **Verify Single**, **History**, **Clear History**

### Report
- **Overview**, **Messages Daily / Status / Hourly**, **Campaign Stats**

## API Documentation

Full OpenAPI spec: `https://api.walytic.com/api/openapi.json`

## License

MIT
