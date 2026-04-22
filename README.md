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

1. In Walytic, go to **Settings > API Keys** and generate an API key
2. In n8n, create a new **Walytic API** credential
3. Paste your API key and set the base URL (defaults to `https://api.walytic.com`)

## Resources & Operations

### Session
- **List** all connected WhatsApp sessions
- **Create** a new WhatsApp session
- **Delete** (disconnect) a session

### Message
- **Send Text** to a phone number
- **Send Media** (image, video, document, audio)
- **Send Template** with variables
- **Reply** to a specific message
- **Send to Group** via group JID
- **List** messages with filters

### Contact
- **List** contacts with filtering (stage, tags, search, lead status)
- **Get** a single contact
- **Create** or upsert a contact
- **Update** contact fields
- **Delete** a contact
- **Promote** a contact to a lead
- **Merge** two contacts
- **Sync** contacts from WhatsApp message history
- **Bulk Update Stage** for multiple contacts

### Campaign (Outreach)
- **List** all campaigns
- **Get** campaign with executions and stats
- **Create** a campaign (manual or filter-based targeting)
- **Update** campaign settings
- **Delete** a campaign
- **Toggle** start/pause
- **Assign/Unassign Contacts** to a campaign
- **Get Stats** per-session

### AutoFlow
- **List** all autoflows
- **Get** autoflow by ID
- **Create/Update/Delete** autoflows
- **Toggle** enable/disable
- **Get Executions** history

### Report
- **Overview** dashboard stats
- **Messages Daily/Hourly/Status** breakdowns
- **Campaign Stats** aggregated

## API Documentation

Full API spec available at: `https://api.walytic.com/api/openapi.json`

## License

MIT
