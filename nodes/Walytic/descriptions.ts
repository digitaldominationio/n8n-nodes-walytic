import { INodeProperties } from 'n8n-workflow';

// ─── Resource selector ──────────────────────────────────────────────────────
export const resourceOptions: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{ name: 'Session', value: 'session' },
		{ name: 'Message', value: 'message' },
		{ name: 'Contact', value: 'contact' },
		{ name: 'Campaign', value: 'campaign' },
		{ name: 'AutoFlow', value: 'autoflow' },
		{ name: 'Report', value: 'report' },
	],
	default: 'message',
};

// ─── Operations per resource ────────────────────────────────────────────────
const sessionOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['session'] } },
	options: [
		{ name: 'List', value: 'list', description: 'List all WhatsApp sessions', action: 'List sessions' },
		{ name: 'Create', value: 'create', description: 'Connect a new WhatsApp number', action: 'Create session' },
		{ name: 'Delete', value: 'delete', description: 'Disconnect and remove a session', action: 'Delete session' },
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
		{ name: 'Send Text', value: 'sendText', description: 'Send a text message', action: 'Send text message' },
		{ name: 'Send Media', value: 'sendMedia', description: 'Send image, video, document, or audio', action: 'Send media message' },
		{ name: 'Send Template', value: 'sendTemplate', description: 'Send a pre-approved template', action: 'Send template message' },
		{ name: 'Reply', value: 'reply', description: 'Reply to a specific message', action: 'Reply to message' },
		{ name: 'Send to Group', value: 'sendGroup', description: 'Send a message to a group', action: 'Send group message' },
		{ name: 'List', value: 'list', description: 'List messages with filters', action: 'List messages' },
	],
	default: 'sendText',
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
		{ name: 'Create', value: 'create', description: 'Create or upsert a contact', action: 'Create contact' },
		{ name: 'Update', value: 'update', description: 'Update a contact', action: 'Update contact' },
		{ name: 'Delete', value: 'delete', description: 'Delete a contact', action: 'Delete contact' },
		{ name: 'Promote to Lead', value: 'promote', description: 'Promote a contact to a lead', action: 'Promote contact' },
		{ name: 'Merge', value: 'merge', description: 'Merge two contacts', action: 'Merge contacts' },
		{ name: 'Sync from WhatsApp', value: 'sync', description: 'Sync contacts from message history', action: 'Sync contacts' },
		{ name: 'Bulk Update Stage', value: 'bulkUpdateStage', description: 'Update pipeline stage for multiple contacts', action: 'Bulk update stage' },
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
		{ name: 'List', value: 'list', description: 'List all outreach campaigns', action: 'List campaigns' },
		{ name: 'Get', value: 'get', description: 'Get campaign with executions and stats', action: 'Get campaign' },
		{ name: 'Create', value: 'create', description: 'Create an outreach campaign', action: 'Create campaign' },
		{ name: 'Update', value: 'update', description: 'Update a campaign', action: 'Update campaign' },
		{ name: 'Delete', value: 'delete', description: 'Delete a campaign', action: 'Delete campaign' },
		{ name: 'Toggle', value: 'toggle', description: 'Start or pause a campaign', action: 'Toggle campaign' },
		{ name: 'Assign Contacts', value: 'assign', description: 'Assign contacts to a campaign', action: 'Assign contacts' },
		{ name: 'Unassign Contacts', value: 'unassign', description: 'Remove contacts from a campaign', action: 'Unassign contacts' },
		{ name: 'Get Stats', value: 'stats', description: 'Get per-session campaign stats', action: 'Get campaign stats' },
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
		{ name: 'List', value: 'list', description: 'List all autoflows', action: 'List autoflows' },
		{ name: 'Get', value: 'get', description: 'Get autoflow by ID', action: 'Get autoflow' },
		{ name: 'Create', value: 'create', description: 'Create an autoflow', action: 'Create autoflow' },
		{ name: 'Update', value: 'update', description: 'Update an autoflow', action: 'Update autoflow' },
		{ name: 'Delete', value: 'delete', description: 'Delete an autoflow', action: 'Delete autoflow' },
		{ name: 'Toggle', value: 'toggle', description: 'Enable or disable an autoflow', action: 'Toggle autoflow' },
		{ name: 'Get Executions', value: 'executions', description: 'View autoflow execution history', action: 'Get executions' },
	],
	default: 'list',
};

const reportOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['report'] } },
	options: [
		{ name: 'Overview', value: 'overview', description: 'Get dashboard overview stats', action: 'Get overview' },
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
	contactOperations,
	campaignOperations,
	autoflowOperations,
	reportOperations,
];

// ─── Fields ─────────────────────────────────────────────────────────────────

// Shared field: sessionId (used across many resources)
const sessionIdField: INodeProperties = {
	displayName: 'Session ID',
	name: 'sessionId',
	type: 'string',
	required: true,
	default: '',
	description: 'WhatsApp phone number in E.164 digits (no + sign), e.g. 919876543210',
};

// ── Session fields ──────────────────────────────────────────────────────────
const sessionFields: INodeProperties[] = [
	{
		...sessionIdField,
		displayOptions: { show: { resource: ['session'], operation: ['create'] } },
		description: 'Phone number to connect (E.164 digits, no + sign)',
	},
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['session'], operation: ['delete'] } },
		description: 'Session ID to disconnect and remove',
	},
];

// ── Message fields ──────────────────────────────────────────────────────────
const messageFields: INodeProperties[] = [
	// sessionId for send operations
	{
		...sessionIdField,
		displayOptions: {
			show: { resource: ['message'], operation: ['sendText', 'sendMedia', 'sendTemplate', 'reply', 'sendGroup'] },
		},
	},
	// recipient phone
	{
		displayName: 'Recipient Phone',
		name: 'phone',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['message'], operation: ['sendText', 'sendMedia', 'sendTemplate', 'reply'] },
		},
		description: 'Recipient phone in E.164 digits (no + sign)',
	},
	// text message body
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: { rows: 4 },
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['message'], operation: ['sendText'] },
		},
	},
	// media fields
	{
		displayName: 'Media Type',
		name: 'mediaType',
		type: 'options',
		options: [
			{ name: 'Image', value: 'image' },
			{ name: 'Video', value: 'video' },
			{ name: 'Document', value: 'document' },
			{ name: 'Audio', value: 'audio' },
		],
		required: true,
		default: 'image',
		displayOptions: { show: { resource: ['message'], operation: ['sendMedia'] } },
	},
	{
		displayName: 'Media URL',
		name: 'mediaUrl',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['sendMedia'] } },
		description: 'Public URL of the media file',
	},
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['sendMedia'] } },
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['message'], operation: ['sendMedia'], mediaType: ['document'] },
		},
	},
	// template fields
	{
		displayName: 'Template Name',
		name: 'templateName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['sendTemplate'] } },
	},
	{
		displayName: 'Template Language',
		name: 'templateLanguage',
		type: 'string',
		default: 'en',
		displayOptions: { show: { resource: ['message'], operation: ['sendTemplate'] } },
	},
	{
		displayName: 'Template Variables (JSON)',
		name: 'templateVariables',
		type: 'json',
		default: '[]',
		displayOptions: { show: { resource: ['message'], operation: ['sendTemplate'] } },
		description: 'Array of variable values for template placeholders',
	},
	// reply fields
	{
		displayName: 'Reply to Message ID',
		name: 'quotedMessageId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['reply'] } },
	},
	{
		displayName: 'Reply Message',
		name: 'message',
		type: 'string',
		typeOptions: { rows: 4 },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['reply'] } },
	},
	// group message
	{
		displayName: 'Group Identifier',
		name: 'groupIdentifier',
		type: 'options',
		options: [
			{ name: 'Group Name', value: 'groupName' },
			{ name: 'Group JID', value: 'groupJid' },
		],
		default: 'groupName',
		displayOptions: { show: { resource: ['message'], operation: ['sendGroup'] } },
		description: 'Identify the group by name (case-insensitive match) or JID',
	},
	{
		displayName: 'Group Name',
		name: 'groupName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['sendGroup'], groupIdentifier: ['groupName'] } },
		description: 'Case-insensitive match against group subjects',
	},
	{
		displayName: 'Group JID',
		name: 'groupJid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['sendGroup'], groupIdentifier: ['groupJid'] } },
		description: 'Group JID (e.g. 120363012345@g.us)',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: { rows: 4 },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['message'], operation: ['sendGroup'] } },
	},
	// list messages filters
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
		displayOptions: { show: { resource: ['message'], operation: ['list'] } },
	},
];

// ── Contact fields ──────────────────────────────────────────────────────────
const contactFields: INodeProperties[] = [
	// List filters
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['contact'], operation: ['list'] } },
		options: [
			{ displayName: 'Is Lead', name: 'isLead', type: 'boolean', default: false },
			{
				displayName: 'Stage', name: 'stage', type: 'options',
				options: [
					{ name: 'New', value: 'new' },
					{ name: 'Contacted', value: 'contacted' },
					{ name: 'Qualified', value: 'qualified' },
					{ name: 'Converted', value: 'converted' },
					{ name: 'Lost', value: 'lost' },
				],
				default: 'new',
			},
			{ displayName: 'Tag', name: 'tag', type: 'string', default: '' },
			{ displayName: 'Search', name: 'search', type: 'string', default: '', description: 'Search by name, phone, or email' },
			{ displayName: 'Session ID', name: 'sessionId', type: 'string', default: '' },
			{ displayName: 'Page', name: 'page', type: 'number', default: 1 },
			{ displayName: 'Limit', name: 'limit', type: 'number', default: 50 },
		],
	},
	// Get / Delete / Promote by ID
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['contact'], operation: ['get', 'delete', 'promote', 'update'] } },
	},
	// Create fields
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
		description: 'E.164 digits, non-digits are stripped. 7 to 15 digits.',
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
			{
				displayName: 'Stage', name: 'stage', type: 'options',
				options: [
					{ name: 'New', value: 'new' },
					{ name: 'Contacted', value: 'contacted' },
					{ name: 'Qualified', value: 'qualified' },
					{ name: 'Converted', value: 'converted' },
					{ name: 'Lost', value: 'lost' },
				],
				default: 'new',
			},
			{ displayName: 'Source', name: 'source', type: 'string', default: 'n8n' },
			{ displayName: 'Tags (comma separated)', name: 'tags', type: 'string', default: '' },
			{ displayName: 'Notes', name: 'notes', type: 'string', default: '' },
			{ displayName: 'Is Lead', name: 'isLead', type: 'boolean', default: true },
			{ displayName: 'Session ID', name: 'sessionId', type: 'string', default: '' },
		],
	},
	// Update fields
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
			{
				displayName: 'Stage', name: 'stage', type: 'options',
				options: [
					{ name: 'New', value: 'new' },
					{ name: 'Contacted', value: 'contacted' },
					{ name: 'Qualified', value: 'qualified' },
					{ name: 'Converted', value: 'converted' },
					{ name: 'Lost', value: 'lost' },
				],
				default: 'new',
			},
			{ displayName: 'Tags (comma separated)', name: 'tags', type: 'string', default: '' },
			{ displayName: 'Notes', name: 'notes', type: 'string', default: '' },
			{ displayName: 'Is Lead', name: 'isLead', type: 'boolean', default: false },
		],
	},
	// Promote optional fields
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
			{
				displayName: 'Stage', name: 'stage', type: 'options',
				options: [
					{ name: 'New', value: 'new' },
					{ name: 'Contacted', value: 'contacted' },
					{ name: 'Qualified', value: 'qualified' },
					{ name: 'Converted', value: 'converted' },
					{ name: 'Lost', value: 'lost' },
				],
				default: 'new',
			},
			{ displayName: 'Tags (comma separated)', name: 'tags', type: 'string', default: '' },
			{ displayName: 'Notes', name: 'notes', type: 'string', default: '' },
		],
	},
	// Merge
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
	// Sync
	{
		...sessionIdField,
		displayOptions: { show: { resource: ['contact'], operation: ['sync'] } },
		description: 'Session to sync contacts from',
	},
	// Bulk update stage
	{
		displayName: 'Contact IDs (comma separated)',
		name: 'contactIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['contact'], operation: ['bulkUpdateStage'] } },
	},
	{
		displayName: 'Stage',
		name: 'stage',
		type: 'options',
		required: true,
		options: [
			{ name: 'New', value: 'new' },
			{ name: 'Contacted', value: 'contacted' },
			{ name: 'Qualified', value: 'qualified' },
			{ name: 'Converted', value: 'converted' },
			{ name: 'Lost', value: 'lost' },
		],
		default: 'new',
		displayOptions: { show: { resource: ['contact'], operation: ['bulkUpdateStage'] } },
	},
];

// ── Campaign fields ─────────────────────────────────────────────────────────
const campaignFields: INodeProperties[] = [
	// Campaign ID for get/update/delete/toggle/assign/unassign/stats
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['campaign'], operation: ['get', 'update', 'delete', 'toggle', 'assign', 'unassign', 'stats'] },
		},
	},
	// Create
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
		description: 'WhatsApp sessions to use for sending',
	},
	{
		displayName: 'Messages (JSON)',
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
			{ name: 'Manual', value: 'manual' },
			{ name: 'Filter', value: 'filter' },
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
	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['campaign'], operation: ['update'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Messages (JSON)', name: 'messages', type: 'json', default: '[]' },
			{ displayName: 'Duration', name: 'duration', type: 'string', default: '' },
			{ displayName: 'Session IDs (comma separated)', name: 'sessionIds', type: 'string', default: '' },
		],
	},
	// Assign / Unassign contact IDs
	{
		displayName: 'Contact IDs (comma separated)',
		name: 'contactIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['campaign'], operation: ['assign', 'unassign'] } },
	},
];

// ── AutoFlow fields ─────────────────────────────────────────────────────────
const autoflowFields: INodeProperties[] = [
	// ID for get/update/delete/toggle/executions
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
	// Create
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['autoflow'], operation: ['create'] } },
	},
	{
		displayName: 'Trigger',
		name: 'trigger',
		type: 'json',
		required: true,
		default: '{}',
		displayOptions: { show: { resource: ['autoflow'], operation: ['create'] } },
		description: 'Trigger configuration object (JSON)',
	},
	{
		displayName: 'Actions (JSON)',
		name: 'actions',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: { show: { resource: ['autoflow'], operation: ['create'] } },
		description: 'Array of action step objects',
	},
	// Update
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['autoflow'], operation: ['update'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Trigger (JSON)', name: 'trigger', type: 'json', default: '{}' },
			{ displayName: 'Actions (JSON)', name: 'actions', type: 'json', default: '[]' },
		],
	},
];

// ── Report fields ───────────────────────────────────────────────────────────
const reportFields: INodeProperties[] = [
	{
		displayName: 'Date Range',
		name: 'dateRange',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: { resource: ['report'], operation: ['overview', 'messagesDaily', 'messagesStatus', 'messagesHourly', 'campaigns'] },
		},
		options: [
			{ displayName: 'From', name: 'from', type: 'dateTime', default: '' },
			{ displayName: 'To', name: 'to', type: 'dateTime', default: '' },
			{ displayName: 'Session ID', name: 'sessionId', type: 'string', default: '' },
		],
	},
];

export const fields: INodeProperties[] = [
	...sessionFields,
	...messageFields,
	...contactFields,
	...campaignFields,
	...autoflowFields,
	...reportFields,
];
