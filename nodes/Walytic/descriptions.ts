import { INodeProperties } from 'n8n-workflow';

const STAGE_OPTIONS = [
	{ name: 'New', value: 'new' },
	{ name: 'Contacted', value: 'contacted' },
	{ name: 'Qualified', value: 'qualified' },
	{ name: 'Converted', value: 'converted' },
	{ name: 'Lost', value: 'lost' },
];

export const resourceOptions: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{ name: 'Session', value: 'session' },
		{ name: 'Message', value: 'message' },
		{ name: 'Group', value: 'group' },
		{ name: 'Contact', value: 'contact' },
		{ name: 'Conversation', value: 'conversation' },
		{ name: 'Campaign (Outreach)', value: 'campaign' },
		{ name: 'Bulk Campaign', value: 'bulkCampaign' },
		{ name: 'AutoFlow', value: 'autoflow' },
		{ name: 'Webhook', value: 'webhook' },
		{ name: 'Verification', value: 'verify' },
		{ name: 'Report', value: 'report' },
	],
	default: 'message',
};

const sessionOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['session'] } },
	options: [
		{ name: 'List', value: 'list', description: 'List all WhatsApp sessions', action: 'List sessions' },
		{ name: 'Create / Reconnect', value: 'create', description: 'Connect or reconnect a WhatsApp number', action: 'Create or reconnect session' },
		{ name: 'Delete', value: 'delete', description: 'Disconnect or permanently delete a session', action: 'Delete session' },
		{ name: 'Get Status', value: 'status', description: 'Get the live connection status of a session', action: 'Get session status' },
	],
	default: 'list',
};

const messageOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['message'] } },
	options: [
		{ name: 'Send Text', value: 'sendText', description: 'Send a text message to a contact', action: 'Send text message' },
		{ name: 'Send Media', value: 'sendMedia', description: 'Send media (image/video/document/audio) from a URL', action: 'Send media message' },
		{ name: 'Send to Group', value: 'sendGroup', description: 'Send a text message to a group', action: 'Send group message' },
		{ name: 'Update Status (Story)', value: 'updateStatus', description: 'Publish a WhatsApp Status (story)', action: 'Publish status story' },
		{ name: 'List', value: 'list', description: 'List messages with filters', action: 'List messages' },
		{ name: 'Approve Pending', value: 'approve', description: 'Approve a pending message (AI reply)', action: 'Approve pending message' },
		{ name: 'Get All History', value: 'history', description: 'Fetch all stored messages for a session', action: 'Get all history' },
		{ name: 'Get Chat History', value: 'chatHistory', description: 'Fetch paginated chat history with a counterparty', action: 'Get chat history' },
	],
	default: 'sendText',
};

const groupOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['group'] } },
	options: [
		{ name: 'List Groups', value: 'list', description: 'List groups joined by this session (processed)', action: 'List groups' },
		{ name: 'List Groups (Raw)', value: 'listRaw', description: 'List groups with raw WhatsApp payload', action: 'List groups raw' },
		{ name: 'Get Members', value: 'members', description: 'Resolve a group\'s members', action: 'Get group members' },
	],
	default: 'list',
};

const contactOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['contact'] } },
	options: [
		{ name: 'List', value: 'list', description: 'List contacts with filters', action: 'List contacts' },
		{ name: 'Get', value: 'get', description: 'Get a contact by ID', action: 'Get contact' },
		{ name: 'Create / Upsert', value: 'create', description: 'Create or upsert a contact by phone', action: 'Create contact' },
		{ name: 'Update', value: 'update', description: 'Update a contact', action: 'Update contact' },
		{ name: 'Delete', value: 'delete', description: 'Delete a contact', action: 'Delete contact' },
		{ name: 'Promote to Lead', value: 'promote', description: 'Promote a contact to a lead', action: 'Promote contact' },
		{ name: 'Assign Flow', value: 'assignFlow', description: 'Assign an automation flow to a contact', action: 'Assign flow' },
		{ name: 'Remove Flow', value: 'removeFlow', description: 'Remove the assigned flow from a contact', action: 'Remove flow' },
		{ name: 'Bulk Assign Flow', value: 'bulkAssignFlow', description: 'Assign a flow to many contacts at once', action: 'Bulk assign flow' },
		{ name: 'Bulk Update Stage', value: 'bulkUpdateStage', description: 'Update pipeline stage for many contacts', action: 'Bulk update stage' },
		{ name: 'Merge', value: 'merge', description: 'Merge a source contact into a target', action: 'Merge contacts' },
		{ name: 'Sync from WhatsApp', value: 'sync', description: 'Sync contacts from a session\'s message history', action: 'Sync contacts' },
	],
	default: 'list',
};

const conversationOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['conversation'] } },
	options: [
		{ name: 'List', value: 'list', description: 'Paginated conversation list for a session', action: 'List conversations' },
		{ name: 'Mark Read', value: 'markRead', description: 'Mark all inbound messages from a contact as read', action: 'Mark conversation read' },
	],
	default: 'list',
};

const campaignOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['campaign'] } },
	options: [
		{ name: 'List', value: 'list', description: 'List outreach campaigns with aggregate stats', action: 'List campaigns' },
		{ name: 'Get', value: 'get', description: 'Get campaign with executions and stats', action: 'Get campaign' },
		{ name: 'Create', value: 'create', description: 'Create an outreach campaign', action: 'Create campaign' },
		{ name: 'Update', value: 'update', description: 'Update editable fields of a campaign', action: 'Update campaign' },
		{ name: 'Delete', value: 'delete', description: 'Delete a campaign and cancel running jobs', action: 'Delete campaign' },
		{ name: 'Toggle Active', value: 'toggle', description: 'Activate or deactivate a campaign', action: 'Toggle campaign' },
		{ name: 'Duplicate', value: 'duplicate', description: 'Duplicate a campaign', action: 'Duplicate campaign' },
		{ name: 'Assign Leads', value: 'assign', description: 'Assign contacts as leads to a campaign', action: 'Assign leads' },
		{ name: 'Unassign Leads', value: 'unassign', description: 'Remove contacts from a campaign', action: 'Unassign leads' },
		{ name: 'Resolve Filters', value: 'resolveFilters', description: 'Preview which leads match a tag/stage filter', action: 'Resolve filters' },
		{ name: 'Get Stats', value: 'stats', description: 'Per-session campaign stats', action: 'Get campaign stats' },
	],
	default: 'list',
};

const bulkCampaignOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['bulkCampaign'] } },
	options: [
		{ name: 'List', value: 'list', description: 'List all bulk campaigns for a session', action: 'List bulk campaigns' },
		{ name: 'Pause', value: 'pause', description: 'Pause a running bulk campaign', action: 'Pause bulk campaign' },
		{ name: 'Resume', value: 'resume', description: 'Resume a paused bulk campaign', action: 'Resume bulk campaign' },
		{ name: 'Delete', value: 'delete', description: 'Delete a bulk campaign', action: 'Delete bulk campaign' },
	],
	default: 'list',
};

const autoflowOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['autoflow'] } },
	options: [
		{ name: 'List', value: 'list', description: 'List all flows', action: 'List autoflows' },
		{ name: 'Get', value: 'get', description: 'Get a single flow', action: 'Get autoflow' },
		{ name: 'Create', value: 'create', description: 'Create a new flow', action: 'Create autoflow' },
		{ name: 'Update', value: 'update', description: 'Update a flow', action: 'Update autoflow' },
		{ name: 'Delete', value: 'delete', description: 'Delete a flow', action: 'Delete autoflow' },
		{ name: 'Toggle Active', value: 'toggle', description: 'Activate or deactivate a flow', action: 'Toggle autoflow' },
		{ name: 'List Executions', value: 'executions', description: 'Recent executions of a flow', action: 'List autoflow executions' },
	],
	default: 'list',
};

const webhookOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['webhook'] } },
	options: [
		{ name: 'List by Session', value: 'list', description: 'List webhooks for a session', action: 'List webhooks' },
		{ name: 'Create / Upsert', value: 'upsert', description: 'Create or update a webhook by (sessionId, URL)', action: 'Upsert webhook' },
		{ name: 'Update by ID', value: 'update', description: 'Update a webhook by ID', action: 'Update webhook' },
		{ name: 'Delete by ID', value: 'deleteById', description: 'Delete a single webhook by ID', action: 'Delete webhook by ID' },
		{ name: 'Delete by Session', value: 'deleteBySession', description: 'Delete webhooks for a session', action: 'Delete webhooks by session' },
		{ name: 'Rotate Secret', value: 'rotateSecret', description: 'Rotate the HMAC signing secret', action: 'Rotate webhook secret' },
		{ name: 'Send Test', value: 'test', description: 'Fire a synthetic testWebhook payload', action: 'Test webhook' },
	],
	default: 'list',
};

const verifyOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['verify'] } },
	options: [
		{ name: 'Verify Single', value: 'single', description: 'Verify a single WhatsApp number', action: 'Verify single number' },
		{ name: 'History', value: 'history', description: 'List recent verification results', action: 'Get verification history' },
		{ name: 'Clear History', value: 'clear', description: 'Clear verification history', action: 'Clear verification history' },
	],
	default: 'single',
};

const reportOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['report'] } },
	options: [
		{ name: 'Overview', value: 'overview', description: 'Dashboard overview stats', action: 'Get overview' },
		{ name: 'Messages Daily', value: 'messagesDaily', description: 'Daily message breakdown', action: 'Get daily messages' },
		{ name: 'Messages by Status', value: 'messagesStatus', description: 'Message count by delivery status', action: 'Get message status' },
		{ name: 'Messages Hourly', value: 'messagesHourly', description: 'Hourly message distribution', action: 'Get hourly messages' },
		{ name: 'Campaign Stats', value: 'campaigns', description: 'Aggregated campaign statistics', action: 'Get campaign report' },
	],
	default: 'overview',
};

export const operationOptions: INodeProperties[] = [
	sessionOperations,
	messageOperations,
	groupOperations,
	contactOperations,
	conversationOperations,
	campaignOperations,
	bulkCampaignOperations,
	autoflowOperations,
	webhookOperations,
	verifyOperations,
	reportOperations,
];

const sessionIdBase = {
	displayName: 'Session ID',
	name: 'sessionId',
	type: 'string' as const,
	required: true,
	default: '',
	description: 'WhatsApp phone number in E.164 digits, no + sign (e.g. 919876543210)',
};

const sessionFields: INodeProperties[] = [
	{
		...sessionIdBase,
		displayOptions: { show: { resource: ['session'], operation: ['create', 'delete', 'status'] } },
	},
	{
		displayName: 'Force Delete',
		name: 'force',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['session'], operation: ['delete'] } },
		description: 'Whether to permanently delete the session (otherwise just disconnect)',
	},
];

const messageFields: INodeProperties[] = [
	{
		...sessionIdBase,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendText', 'sendMedia', 'sendGroup', 'updateStatus', 'approve', 'history', 'chatHistory'],
			},
		},
	},
	{
		displayName: 'Recipient Number',
		name: 'number',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['sendText'] } },
		description: 'Recipient phone in E.164 digits (no + sign)',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: { rows: 4 },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['sendText', 'sendGroup'] } },
	},
	{
		displayName: 'HTML Message',
		name: 'htmlMessage',
		type: 'string',
		typeOptions: { rows: 3 },
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['sendText'] } },
		description: 'Optional rich-text companion (sanitized server-side)',
	},
	// sendMedia
	{
		displayName: 'Target Type',
		name: 'mediaTarget',
		type: 'options',
		options: [
			{ name: 'Contact (Number)', value: 'number' },
			{ name: 'Group ID', value: 'groupId' },
			{ name: 'Group Name', value: 'groupName' },
		],
		default: 'number',
		displayOptions: { show: { resource: ['message'], operation: ['sendMedia'] } },
	},
	{
		displayName: 'Recipient Number',
		name: 'number',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['sendMedia'], mediaTarget: ['number'] } },
		description: 'E.164 digits (no + sign) or a contact JID',
	},
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['sendMedia'], mediaTarget: ['groupId'] } },
		description: 'Group JID ending in @g.us',
	},
	{
		displayName: 'Group Name',
		name: 'groupName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['sendMedia'], mediaTarget: ['groupName'] } },
		description: 'Case-insensitive group subject match',
	},
	{
		displayName: 'File URL',
		name: 'fileUrl',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['sendMedia'] } },
		description: 'Publicly reachable URL. Mime is detected from response headers.',
	},
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['sendMedia'] } },
	},
	// sendGroup
	{
		displayName: 'Group Identifier',
		name: 'groupIdentifier',
		type: 'options',
		options: [
			{ name: 'Group Name', value: 'groupName' },
			{ name: 'Group ID (JID)', value: 'groupId' },
		],
		default: 'groupName',
		displayOptions: { show: { resource: ['message'], operation: ['sendGroup'] } },
	},
	{
		displayName: 'Group Name',
		name: 'groupName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['sendGroup'], groupIdentifier: ['groupName'] } },
		description: 'Case-insensitive group subject match',
	},
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['sendGroup'], groupIdentifier: ['groupId'] } },
		description: 'Group JID ending in @g.us',
	},
	{
		displayName: 'Mentions',
		name: 'mentions',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['sendGroup'] } },
		description: 'Comma-separated phone numbers (E.164 digits) or JIDs to @mention',
	},
	// updateStatus
	{
		displayName: 'File URL',
		name: 'fileUrl',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['updateStatus'] } },
		description: 'Public image/video URL. Omit for a text-only story.',
	},
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['updateStatus'] } },
		description: 'Caption for media stories or text body for text-only stories',
	},
	{
		displayName: 'Background Color',
		name: 'backgroundColor',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['updateStatus'] } },
		description: 'Background color for text stories',
	},
	{
		displayName: 'Font',
		name: 'font',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['updateStatus'] } },
		description: 'Font for text stories',
	},
	// approve
	{
		displayName: 'Message ID',
		name: 'messageId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['approve'] } },
	},
	// list
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['list'] } },
		description: 'Filter by session (optional)',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		displayOptions: { show: { resource: ['message'], operation: ['list', 'chatHistory'] } },
	},
	// chatHistory
	{
		displayName: 'Counterparty Number',
		name: 'number',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['chatHistory'] } },
		description: 'Phone number (E.164 digits) of the contact',
	},
	{
		displayName: 'Before (Cursor)',
		name: 'before',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['chatHistory'] } },
		description: 'Pagination cursor from the previous response',
	},
];

const groupFields: INodeProperties[] = [
	{
		...sessionIdBase,
		displayOptions: { show: { resource: ['group'] } },
	},
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['group'], operation: ['members'] } },
		description: 'Group JID',
	},
];

const contactFields: INodeProperties[] = [
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['contact'], operation: ['list'] } },
		options: [
			{ displayName: 'Is Lead', name: 'isLead', type: 'boolean', default: false },
			{ displayName: 'Stage', name: 'stage', type: 'options', options: STAGE_OPTIONS, default: 'new' },
			{ displayName: 'Source', name: 'source', type: 'string', default: '' },
			{ displayName: 'Tag', name: 'tag', type: 'string', default: '' },
			{ displayName: 'Search', name: 'search', type: 'string', default: '', description: 'Search by name, phone, or email' },
			{ displayName: 'Assigned Flow ID', name: 'assignedFlowId', type: 'string', default: '' },
			{ displayName: 'Session ID', name: 'sessionId', type: 'string', default: '' },
			{ displayName: 'Page', name: 'page', type: 'number', default: 1 },
			{ displayName: 'Limit', name: 'limit', type: 'number', default: 50 },
		],
	},
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['contact'], operation: ['get', 'delete', 'update', 'promote', 'assignFlow', 'removeFlow'] },
		},
	},
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
		description: 'E.164 digits (7–15). Non-digits are stripped server-side.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
		options: [
			{ displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
			{ displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
			{ displayName: 'Email', name: 'email', type: 'string', default: '' },
			{ displayName: 'Stage', name: 'stage', type: 'options', options: STAGE_OPTIONS, default: 'new' },
			{ displayName: 'Source', name: 'source', type: 'string', default: 'n8n' },
			{ displayName: 'Tags (comma separated)', name: 'tags', type: 'string', default: '' },
			{ displayName: 'Notes', name: 'notes', type: 'string', default: '' },
			{ displayName: 'Is Lead', name: 'isLead', type: 'boolean', default: true },
			{ displayName: 'Session ID', name: 'sessionId', type: 'string', default: '' },
			{ displayName: 'Custom Fields (JSON Array)', name: 'customFields', type: 'json', default: '[]', description: 'Array of { key, value } objects' },
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['contact'], operation: ['update'] } },
		options: [
			{ displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
			{ displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
			{ displayName: 'Email', name: 'email', type: 'string', default: '' },
			{ displayName: 'Stage', name: 'stage', type: 'options', options: STAGE_OPTIONS, default: 'new' },
			{ displayName: 'Tags (comma separated)', name: 'tags', type: 'string', default: '' },
			{ displayName: 'Notes', name: 'notes', type: 'string', default: '' },
			{ displayName: 'Is Lead', name: 'isLead', type: 'boolean', default: false },
			{ displayName: 'Session ID', name: 'sessionId', type: 'string', default: '' },
			{ displayName: 'Custom Fields (JSON Array)', name: 'customFields', type: 'json', default: '[]' },
		],
	},
	{
		displayName: 'Promote Fields',
		name: 'promoteFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['contact'], operation: ['promote'] } },
		options: [
			{ displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
			{ displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
			{ displayName: 'Email', name: 'email', type: 'string', default: '' },
			{ displayName: 'Stage', name: 'stage', type: 'options', options: STAGE_OPTIONS, default: 'new' },
			{ displayName: 'Source', name: 'source', type: 'string', default: '' },
			{ displayName: 'Tags (comma separated)', name: 'tags', type: 'string', default: '' },
			{ displayName: 'Notes', name: 'notes', type: 'string', default: '' },
		],
	},
	// assignFlow
	{
		displayName: 'Flow ID',
		name: 'flowId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['contact'], operation: ['assignFlow', 'bulkAssignFlow'] } },
	},
	// bulkAssignFlow / bulkUpdateStage
	{
		displayName: 'Contact IDs (comma separated)',
		name: 'contactIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['contact'], operation: ['bulkAssignFlow', 'bulkUpdateStage'] } },
	},
	{
		displayName: 'Stage',
		name: 'stage',
		type: 'options',
		required: true,
		options: STAGE_OPTIONS,
		default: 'new',
		displayOptions: { show: { resource: ['contact'], operation: ['bulkUpdateStage'] } },
	},
	// merge
	{
		displayName: 'Source Contact ID',
		name: 'sourceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['contact'], operation: ['merge'] } },
		description: 'Contact to merge FROM (will be deleted)',
	},
	{
		displayName: 'Target Contact ID',
		name: 'targetId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['contact'], operation: ['merge'] } },
		description: 'Contact to merge INTO (will survive)',
	},
	// sync
	{
		...sessionIdBase,
		displayOptions: { show: { resource: ['contact'], operation: ['sync'] } },
		description: 'Session to sync contacts from',
	},
];

const conversationFields: INodeProperties[] = [
	{
		...sessionIdBase,
		displayOptions: { show: { resource: ['conversation'] } },
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		displayOptions: { show: { resource: ['conversation'], operation: ['list'] } },
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['conversation'], operation: ['list'] } },
		description: 'Pagination cursor',
	},
	{
		displayName: 'Contact JID',
		name: 'contactJid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['conversation'], operation: ['markRead'] } },
		description: 'Full JID of the counterparty (individual or @g.us group)',
	},
];

const campaignFields: INodeProperties[] = [
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['get', 'update', 'delete', 'toggle', 'duplicate', 'assign', 'unassign', 'resolveFilters', 'stats'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['campaign'], operation: ['create'] } },
	},
	{
		displayName: 'Session IDs (comma separated)',
		name: 'sessionIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['campaign'], operation: ['create'] } },
		description: 'WhatsApp sessions (E.164 digits) to send from',
	},
	{
		displayName: 'Messages (JSON Array)',
		name: 'messages',
		type: 'json',
		default: '[]',
		displayOptions: { show: { resource: ['campaign'], operation: ['create'] } },
		description: 'Ordered array of message step objects',
	},
	{
		displayName: 'Target Type',
		name: 'targetType',
		type: 'options',
		options: [
			{ name: 'Manual (lead IDs)', value: 'manual' },
			{ name: 'Filter (tags/stages)', value: 'filter' },
		],
		default: 'manual',
		displayOptions: { show: { resource: ['campaign'], operation: ['create'] } },
	},
	{
		displayName: 'Lead Contact IDs (comma separated)',
		name: 'leads',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['campaign'], operation: ['create'], targetType: ['manual'] } },
	},
	{
		displayName: 'Filter Tags (comma separated)',
		name: 'filterTags',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['campaign'], operation: ['create'], targetType: ['filter'] } },
	},
	{
		displayName: 'Filter Stages (comma separated)',
		name: 'filterStages',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['campaign'], operation: ['create'], targetType: ['filter'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'createExtra',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['campaign'], operation: ['create'] } },
		options: [
			{ displayName: 'Duration', name: 'duration', type: 'string', default: 'month' },
			{ displayName: 'Stop on Reply', name: 'stopOnReply', type: 'boolean', default: true },
		],
	},
	// Update
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['campaign'], operation: ['update'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Messages (JSON Array)', name: 'messages', type: 'json', default: '[]' },
			{ displayName: 'Duration', name: 'duration', type: 'string', default: '' },
			{ displayName: 'Session IDs (comma separated)', name: 'sessionIds', type: 'string', default: '' },
			{
				displayName: 'Target Type', name: 'targetType', type: 'options',
				options: [
					{ name: 'Manual', value: 'manual' },
					{ name: 'Filter', value: 'filter' },
				],
				default: 'manual',
			},
			{ displayName: 'Filter Tags (comma separated)', name: 'filterTags', type: 'string', default: '' },
			{ displayName: 'Filter Stages (comma separated)', name: 'filterStages', type: 'string', default: '' },
			{ displayName: 'Stop on Reply', name: 'stopOnReply', type: 'boolean', default: true },
			{ displayName: 'Recompute Running', name: 'recomputeRunning', type: 'boolean', default: false, description: 'Whether to recompute nextSendAt for running leads when messages change' },
		],
	},
	// Assign / Unassign
	{
		displayName: 'Contact IDs (comma separated)',
		name: 'contactIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['campaign'], operation: ['assign', 'unassign'] } },
	},
	// Duplicate
	{
		displayName: 'Duplicate Options',
		name: 'duplicateOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['campaign'], operation: ['duplicate'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Copy Leads', name: 'withLeads', type: 'boolean', default: false },
		],
	},
	// ResolveFilters
	{
		displayName: 'Tags (comma separated)',
		name: 'tags',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['campaign'], operation: ['resolveFilters'] } },
	},
	{
		displayName: 'Stages (comma separated)',
		name: 'stages',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['campaign'], operation: ['resolveFilters'] } },
	},
];

const bulkCampaignFields: INodeProperties[] = [
	{
		...sessionIdBase,
		displayOptions: { show: { resource: ['bulkCampaign'] } },
	},
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['bulkCampaign'], operation: ['pause', 'resume', 'delete'] } },
	},
];

const autoflowFields: INodeProperties[] = [
	{
		displayName: 'AutoFlow ID',
		name: 'autoflowId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['autoflow'], operation: ['get', 'update', 'delete', 'toggle', 'executions'] },
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['autoflow'], operation: ['create'] } },
	},
	{
		displayName: 'Nodes (JSON Array)',
		name: 'nodes',
		type: 'json',
		default: '[]',
		displayOptions: { show: { resource: ['autoflow'], operation: ['create'] } },
		description: 'Canvas nodes',
	},
	{
		displayName: 'Edges (JSON Array)',
		name: 'edges',
		type: 'json',
		default: '[]',
		displayOptions: { show: { resource: ['autoflow'], operation: ['create'] } },
		description: 'Canvas edges connecting nodes',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['autoflow'], operation: ['update'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Nodes (JSON Array)', name: 'nodes', type: 'json', default: '[]' },
			{ displayName: 'Edges (JSON Array)', name: 'edges', type: 'json', default: '[]' },
		],
	},
];

const webhookFields: INodeProperties[] = [
	{
		...sessionIdBase,
		displayOptions: { show: { resource: ['webhook'], operation: ['list', 'deleteBySession', 'upsert', 'test'] } },
	},
	{
		displayName: 'Webhook URL',
		name: 'webhookUrl',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['webhook'], operation: ['upsert', 'update'] } },
	},
	{
		displayName: 'Events (comma separated)',
		name: 'events',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['webhook'], operation: ['upsert', 'update'] } },
		description: 'Subscribed event names (e.g. messageReceived,messageSent)',
	},
	{
		displayName: 'Additional Fields',
		name: 'webhookExtra',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['webhook'], operation: ['upsert', 'update'] } },
		options: [
			{ displayName: 'Label', name: 'label', type: 'string', default: '' },
			{
				displayName: 'Filter Senders (comma separated)',
				name: 'filterSenders',
				type: 'string',
				default: '',
				description: 'Optional allow-list of phone numbers',
			},
		],
	},
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['webhook'], operation: ['update', 'deleteById', 'rotateSecret'] } },
	},
	{
		displayName: 'Delete Filter',
		name: 'deleteFilter',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['webhook'], operation: ['deleteBySession'] } },
		options: [
			{ displayName: 'Webhook URL', name: 'webhookUrl', type: 'string', default: '', description: 'Only delete the webhook matching this URL' },
			{ displayName: 'Confirm All', name: 'confirmAll', type: 'boolean', default: false, description: 'Whether to delete all webhooks for the session' },
		],
	},
	{
		displayName: 'Test Target',
		name: 'testTarget',
		type: 'options',
		options: [
			{ name: 'By Session (all webhooks)', value: 'session' },
			{ name: 'By Webhook ID', value: 'webhookId' },
		],
		default: 'session',
		displayOptions: { show: { resource: ['webhook'], operation: ['test'] } },
	},
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['webhook'], operation: ['test'], testTarget: ['webhookId'] } },
	},
];

const verifyFields: INodeProperties[] = [
	{
		...sessionIdBase,
		displayOptions: { show: { resource: ['verify'], operation: ['single'] } },
	},
	{
		displayName: 'Number',
		name: 'number',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['verify'], operation: ['single'] } },
		description: 'Phone in any format — non-digits are stripped',
	},
	{
		displayName: 'Session ID',
		name: 'session',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['verify'], operation: ['history'] } },
		description: 'Filter by session (optional)',
	},
];

const reportFields: INodeProperties[] = [
	{
		displayName: 'Range',
		name: 'range',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['overview', 'messagesDaily', 'messagesStatus', 'messagesHourly', 'campaigns'],
			},
		},
		options: [
			{ displayName: 'Days (rolling window)', name: 'days', type: 'number', default: 30 },
			{ displayName: 'From (ISO date)', name: 'from', type: 'string', default: '' },
			{ displayName: 'To (ISO date)', name: 'to', type: 'string', default: '' },
		],
	},
];

export const fields: INodeProperties[] = [
	...sessionFields,
	...messageFields,
	...groupFields,
	...contactFields,
	...conversationFields,
	...campaignFields,
	...bulkCampaignFields,
	...autoflowFields,
	...webhookFields,
	...verifyFields,
	...reportFields,
];
