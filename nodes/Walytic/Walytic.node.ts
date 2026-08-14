import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

import { resourceOptions, operationOptions, fields } from './descriptions';

const splitCsv = (val: string): string[] =>
	val.split(',').map(s => s.trim()).filter(Boolean);

const parseJsonArray = (val: unknown): unknown[] => {
	if (Array.isArray(val)) return val;
	if (typeof val === 'string' && val.trim()) {
		try {
			const out = JSON.parse(val);
			return Array.isArray(out) ? out : [out];
		} catch {
			return [];
		}
	}
	return [];
};

export class Walytic implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Walytic',
		name: 'walytic',
		icon: 'file:walytic.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Walytic WhatsApp automation platform',
		defaults: {
			name: 'Walytic',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'walyticApi',
				required: true,
			},
		],
		properties: [
			resourceOptions,
			...operationOptions,
			...fields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('walyticApi');

		const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData: any;

				const callApi = async (
					method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
					endpoint: string,
					body?: Record<string, any>,
					qs?: Record<string, any>,
				) => {
					const opts: any = {
						method,
						url: `${baseUrl}${endpoint}`,
						headers: { 'Content-Type': 'application/json' },
						json: true,
					};
					if (body && Object.keys(body).length > 0) opts.body = body;
					if (qs && Object.keys(qs).length > 0) opts.qs = qs;
					return this.helpers.httpRequestWithAuthentication.call(this, 'walyticApi', opts);
				};

				// ── SESSION ─────────────────────────────────────────────────
				if (resource === 'session') {
					if (operation === 'list') {
						responseData = await callApi('GET', '/api/sessions');
					} else if (operation === 'create') {
						const sid = this.getNodeParameter('sessionId', i) as string;
						responseData = await callApi('POST', `/api/sessions/${sid}`);
					} else if (operation === 'delete') {
						const sid = this.getNodeParameter('sessionId', i) as string;
						const force = this.getNodeParameter('force', i, false) as boolean;
						const qs = force ? { force: 'true' } : undefined;
						responseData = await callApi('DELETE', `/api/sessions/${sid}`, undefined, qs);
					} else if (operation === 'status') {
						const sid = this.getNodeParameter('sessionId', i) as string;
						responseData = await callApi('GET', `/api/whatsapp/${sid}/status`);
					}
				}

				// ── MESSAGE ─────────────────────────────────────────────────
				else if (resource === 'message') {
					if (operation === 'sendText') {
						const sid = this.getNodeParameter('sessionId', i) as string;
						const body: Record<string, any> = {
							number: this.getNodeParameter('number', i) as string,
							message: this.getNodeParameter('message', i) as string,
						};
						const html = this.getNodeParameter('htmlMessage', i, '') as string;
						if (html) body.htmlMessage = html;
						responseData = await callApi('POST', `/api/whatsapp/${sid}/send`, body);
					} else if (operation === 'sendMedia') {
						const sid = this.getNodeParameter('sessionId', i) as string;
						const target = this.getNodeParameter('mediaTarget', i) as string;
						const body: Record<string, any> = {
							fileUrl: this.getNodeParameter('fileUrl', i) as string,
						};
						if (target === 'number') body.number = this.getNodeParameter('number', i) as string;
						else if (target === 'groupId') body.groupId = this.getNodeParameter('groupId', i) as string;
						else body.groupName = this.getNodeParameter('groupName', i) as string;
						const caption = this.getNodeParameter('caption', i, '') as string;
						if (caption) body.caption = caption;
						responseData = await callApi('POST', `/api/whatsapp/${sid}/send-media`, body);
					} else if (operation === 'sendGroup') {
						const sid = this.getNodeParameter('sessionId', i) as string;
						const idType = this.getNodeParameter('groupIdentifier', i) as string;
						const body: Record<string, any> = {
							message: this.getNodeParameter('message', i) as string,
						};
						if (idType === 'groupName') {
							body.groupName = this.getNodeParameter('groupName', i) as string;
						} else {
							body.groupId = this.getNodeParameter('groupId', i) as string;
						}
						const mentionsStr = this.getNodeParameter('mentions', i, '') as string;
						if (mentionsStr) body.mentions = splitCsv(mentionsStr);
						responseData = await callApi('POST', `/api/whatsapp/${sid}/send-group`, body);
					} else if (operation === 'updateStatus') {
						const sid = this.getNodeParameter('sessionId', i) as string;
						const body: Record<string, any> = {};
						const fileUrl = this.getNodeParameter('fileUrl', i, '') as string;
						const caption = this.getNodeParameter('caption', i, '') as string;
						const bg = this.getNodeParameter('backgroundColor', i, '') as string;
						const font = this.getNodeParameter('font', i, '') as string;
						if (fileUrl) body.fileUrl = fileUrl;
						if (caption) body.caption = caption;
						if (bg) body.backgroundColor = bg;
						if (font) body.font = font;
						responseData = await callApi('POST', `/api/whatsapp/${sid}/update-status`, body);
					} else if (operation === 'list') {
						const qs: Record<string, any> = {};
						const sid = this.getNodeParameter('sessionId', i, '') as string;
						if (sid) qs.sessionId = sid;
						qs.limit = this.getNodeParameter('limit', i, 50) as number;
						responseData = await callApi('GET', '/api/messages', undefined, qs);
					} else if (operation === 'approve') {
						const id = this.getNodeParameter('messageId', i) as string;
						responseData = await callApi('PATCH', `/api/messages/${id}/approve`);
					} else if (operation === 'history') {
						const sid = this.getNodeParameter('sessionId', i) as string;
						responseData = await callApi('GET', `/api/whatsapp/${sid}/history`);
					} else if (operation === 'chatHistory') {
						const sid = this.getNodeParameter('sessionId', i) as string;
						const num = this.getNodeParameter('number', i) as string;
						const qs: Record<string, any> = {};
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const before = this.getNodeParameter('before', i, '') as string;
						if (limit) qs.limit = limit;
						if (before) qs.before = before;
						responseData = await callApi('GET', `/api/whatsapp/${sid}/history/${num}`, undefined, qs);
					}
				}

				// ── GROUP ───────────────────────────────────────────────────
				else if (resource === 'group') {
					const sid = this.getNodeParameter('sessionId', i) as string;
					if (operation === 'list') {
						responseData = await callApi('GET', `/api/whatsapp/${sid}/groups`);
					} else if (operation === 'listRaw') {
						responseData = await callApi('GET', `/api/groups/${sid}`);
					} else if (operation === 'members') {
						const gid = this.getNodeParameter('groupId', i) as string;
						responseData = await callApi('GET', `/api/groups/${sid}/${gid}/members`);
					}
				}

				// ── CONTACT ─────────────────────────────────────────────────
				else if (resource === 'contact') {
					if (operation === 'list') {
						const filters = this.getNodeParameter('filters', i, {}) as Record<string, any>;
						const qs: Record<string, any> = {};
						if (filters.isLead !== undefined) qs.isLead = filters.isLead;
						if (filters.stage) qs.stage = filters.stage;
						if (filters.source) qs.source = filters.source;
						if (filters.tag) qs.tag = filters.tag;
						if (filters.search) qs.search = filters.search;
						if (filters.assignedFlowId) qs.assignedFlowId = filters.assignedFlowId;
						if (filters.sessionId) qs.sessionId = filters.sessionId;
						if (filters.page) qs.page = filters.page;
						if (filters.limit) qs.limit = filters.limit;
						responseData = await callApi('GET', '/api/contacts', undefined, qs);
					} else if (operation === 'get') {
						const id = this.getNodeParameter('contactId', i) as string;
						responseData = await callApi('GET', `/api/contacts/${id}`);
					} else if (operation === 'create') {
						const phone = this.getNodeParameter('phone', i) as string;
						const extra = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
						const body: Record<string, any> = { phone, source: extra.source || 'n8n' };
						if (extra.firstName) body.firstName = extra.firstName;
						if (extra.lastName) body.lastName = extra.lastName;
						if (extra.email) body.email = extra.email;
						if (extra.stage) body.stage = extra.stage;
						if (extra.notes) body.notes = extra.notes;
						if (extra.isLead !== undefined) body.isLead = extra.isLead;
						if (extra.sessionId) body.sessionId = extra.sessionId;
						if (extra.tags) body.tags = splitCsv(extra.tags);
						if (extra.customFields) body.customFields = parseJsonArray(extra.customFields);
						responseData = await callApi('POST', '/api/contacts', body);
					} else if (operation === 'update') {
						const id = this.getNodeParameter('contactId', i) as string;
						const upd = this.getNodeParameter('updateFields', i, {}) as Record<string, any>;
						const body: Record<string, any> = {};
						if (upd.firstName) body.firstName = upd.firstName;
						if (upd.lastName) body.lastName = upd.lastName;
						if (upd.email) body.email = upd.email;
						if (upd.stage) body.stage = upd.stage;
						if (upd.notes) body.notes = upd.notes;
						if (upd.isLead !== undefined) body.isLead = upd.isLead;
						if (upd.sessionId) body.sessionId = upd.sessionId;
						if (upd.tags) body.tags = splitCsv(upd.tags);
						if (upd.customFields) body.customFields = parseJsonArray(upd.customFields);
						responseData = await callApi('PUT', `/api/contacts/${id}`, body);
					} else if (operation === 'delete') {
						const id = this.getNodeParameter('contactId', i) as string;
						responseData = await callApi('DELETE', `/api/contacts/${id}`);
					} else if (operation === 'promote') {
						const id = this.getNodeParameter('contactId', i) as string;
						const pf = this.getNodeParameter('promoteFields', i, {}) as Record<string, any>;
						const body: Record<string, any> = {};
						if (pf.firstName) body.firstName = pf.firstName;
						if (pf.lastName) body.lastName = pf.lastName;
						if (pf.email) body.email = pf.email;
						if (pf.stage) body.stage = pf.stage;
						if (pf.source) body.source = pf.source;
						if (pf.notes) body.notes = pf.notes;
						if (pf.tags) body.tags = splitCsv(pf.tags);
						responseData = await callApi('POST', `/api/contacts/${id}/promote`, body);
					} else if (operation === 'assignFlow') {
						const id = this.getNodeParameter('contactId', i) as string;
						const flowId = this.getNodeParameter('flowId', i) as string;
						responseData = await callApi('POST', `/api/contacts/${id}/assign-flow`, { flowId });
					} else if (operation === 'removeFlow') {
						const id = this.getNodeParameter('contactId', i) as string;
						responseData = await callApi('POST', `/api/contacts/${id}/remove-flow`);
					} else if (operation === 'bulkAssignFlow') {
						const ids = splitCsv(this.getNodeParameter('contactIds', i) as string);
						const flowId = this.getNodeParameter('flowId', i) as string;
						responseData = await callApi('POST', '/api/contacts/bulk-assign-flow', {
							contactIds: ids,
							flowId,
						});
					} else if (operation === 'bulkUpdateStage') {
						const ids = splitCsv(this.getNodeParameter('contactIds', i) as string);
						responseData = await callApi('POST', '/api/contacts/bulk-update-stage', {
							contactIds: ids,
							stage: this.getNodeParameter('stage', i) as string,
						});
					} else if (operation === 'merge') {
						responseData = await callApi('POST', '/api/contacts/merge', {
							sourceId: this.getNodeParameter('sourceId', i) as string,
							targetId: this.getNodeParameter('targetId', i) as string,
						});
					} else if (operation === 'sync') {
						responseData = await callApi('POST', '/api/contacts/sync', {
							sessionId: this.getNodeParameter('sessionId', i) as string,
						});
					}
				}

				// ── CONVERSATION ────────────────────────────────────────────
				else if (resource === 'conversation') {
					const sid = this.getNodeParameter('sessionId', i) as string;
					if (operation === 'list') {
						const qs: Record<string, any> = { sessionId: sid };
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const cursor = this.getNodeParameter('cursor', i, '') as string;
						if (limit) qs.limit = limit;
						if (cursor) qs.cursor = cursor;
						responseData = await callApi('GET', '/api/conversations', undefined, qs);
					} else if (operation === 'markRead') {
						responseData = await callApi('POST', '/api/conversations/mark-read', {
							sessionId: sid,
							contactJid: this.getNodeParameter('contactJid', i) as string,
						});
					}
				}

				// ── CAMPAIGN (Outreach) ─────────────────────────────────────
				else if (resource === 'campaign') {
					if (operation === 'list') {
						responseData = await callApi('GET', '/api/outreach');
					} else if (operation === 'get') {
						const id = this.getNodeParameter('campaignId', i) as string;
						responseData = await callApi('GET', `/api/outreach/${id}`);
					} else if (operation === 'create') {
						const body: Record<string, any> = {
							name: this.getNodeParameter('name', i) as string,
							sessionIds: splitCsv(this.getNodeParameter('sessionIds', i) as string),
						};
						body.messages = parseJsonArray(this.getNodeParameter('messages', i, '[]'));
						const targetType = this.getNodeParameter('targetType', i) as string;
						body.targetType = targetType;
						if (targetType === 'filter') {
							const tags = this.getNodeParameter('filterTags', i, '') as string;
							const stages = this.getNodeParameter('filterStages', i, '') as string;
							body.targetFilters = {};
							if (tags) body.targetFilters.tags = splitCsv(tags);
							if (stages) body.targetFilters.stages = splitCsv(stages);
						} else {
							const leads = this.getNodeParameter('leads', i, '') as string;
							if (leads) body.leads = splitCsv(leads);
						}
						const extra = this.getNodeParameter('createExtra', i, {}) as Record<string, any>;
						if (extra.duration) body.duration = extra.duration;
						if (extra.stopOnReply !== undefined) body.stopOnReply = extra.stopOnReply;
						responseData = await callApi('POST', '/api/outreach', body);
					} else if (operation === 'update') {
						const id = this.getNodeParameter('campaignId', i) as string;
						const upd = this.getNodeParameter('updateFields', i, {}) as Record<string, any>;
						const body: Record<string, any> = {};
						if (upd.name) body.name = upd.name;
						if (upd.duration) body.duration = upd.duration;
						if (upd.sessionIds) body.sessionIds = splitCsv(upd.sessionIds);
						if (upd.messages) body.messages = parseJsonArray(upd.messages);
						if (upd.targetType) {
							body.targetType = upd.targetType;
							if (upd.targetType === 'filter') {
								body.targetFilters = {};
								if (upd.filterTags) body.targetFilters.tags = splitCsv(upd.filterTags);
								if (upd.filterStages) body.targetFilters.stages = splitCsv(upd.filterStages);
							}
						}
						if (upd.stopOnReply !== undefined) body.stopOnReply = upd.stopOnReply;
						if (upd.recomputeRunning !== undefined) body.recomputeRunning = upd.recomputeRunning;
						responseData = await callApi('PUT', `/api/outreach/${id}`, body);
					} else if (operation === 'delete') {
						const id = this.getNodeParameter('campaignId', i) as string;
						responseData = await callApi('DELETE', `/api/outreach/${id}`);
					} else if (operation === 'toggle') {
						const id = this.getNodeParameter('campaignId', i) as string;
						responseData = await callApi('PUT', `/api/outreach/${id}/toggle`);
					} else if (operation === 'duplicate') {
						const id = this.getNodeParameter('campaignId', i) as string;
						const opts = this.getNodeParameter('duplicateOptions', i, {}) as Record<string, any>;
						const body: Record<string, any> = {};
						if (opts.name) body.name = opts.name;
						if (opts.withLeads !== undefined) body.withLeads = opts.withLeads;
						responseData = await callApi('POST', `/api/outreach/${id}/duplicate`, body);
					} else if (operation === 'assign') {
						const id = this.getNodeParameter('campaignId', i) as string;
						const ids = splitCsv(this.getNodeParameter('contactIds', i) as string);
						responseData = await callApi('POST', `/api/outreach/${id}/assign`, { contactIds: ids });
					} else if (operation === 'unassign') {
						const id = this.getNodeParameter('campaignId', i) as string;
						const ids = splitCsv(this.getNodeParameter('contactIds', i) as string);
						responseData = await callApi('POST', `/api/outreach/${id}/unassign`, { contactIds: ids });
					} else if (operation === 'resolveFilters') {
						const id = this.getNodeParameter('campaignId', i) as string;
						const body: Record<string, any> = {};
						const tags = this.getNodeParameter('tags', i, '') as string;
						const stages = this.getNodeParameter('stages', i, '') as string;
						if (tags) body.tags = splitCsv(tags);
						if (stages) body.stages = splitCsv(stages);
						responseData = await callApi('POST', `/api/outreach/${id}/resolve-filters`, body);
					} else if (operation === 'stats') {
						const id = this.getNodeParameter('campaignId', i) as string;
						responseData = await callApi('GET', `/api/outreach/${id}/stats`);
					}
				}

				// ── BULK CAMPAIGN ───────────────────────────────────────────
				else if (resource === 'bulkCampaign') {
					const sid = this.getNodeParameter('sessionId', i) as string;
					if (operation === 'list') {
						responseData = await callApi('GET', `/api/bulk/${sid}/all`);
					} else if (operation === 'pause') {
						const cid = this.getNodeParameter('campaignId', i) as string;
						responseData = await callApi('PUT', `/api/bulk/${sid}/campaigns/${cid}/pause`);
					} else if (operation === 'resume') {
						const cid = this.getNodeParameter('campaignId', i) as string;
						responseData = await callApi('PUT', `/api/bulk/${sid}/campaigns/${cid}/resume`);
					} else if (operation === 'delete') {
						const cid = this.getNodeParameter('campaignId', i) as string;
						responseData = await callApi('DELETE', `/api/bulk/${sid}/campaigns/${cid}`);
					}
				}

				// ── AUTOFLOW ────────────────────────────────────────────────
				else if (resource === 'autoflow') {
					if (operation === 'list') {
						responseData = await callApi('GET', '/api/autoflows');
					} else if (operation === 'get') {
						const id = this.getNodeParameter('autoflowId', i) as string;
						responseData = await callApi('GET', `/api/autoflows/${id}`);
					} else if (operation === 'create') {
						const body: Record<string, any> = {
							name: this.getNodeParameter('name', i) as string,
							sessionId: this.getNodeParameter('sessionId', i) as string,
							nodes: parseJsonArray(this.getNodeParameter('nodes', i, '[]')),
							edges: parseJsonArray(this.getNodeParameter('edges', i, '[]')),
						};
						responseData = await callApi('POST', '/api/autoflows', body);
					} else if (operation === 'update') {
						const id = this.getNodeParameter('autoflowId', i) as string;
						const upd = this.getNodeParameter('updateFields', i, {}) as Record<string, any>;
						const body: Record<string, any> = {};
						if (upd.name) body.name = upd.name;
						if (upd.nodes) body.nodes = parseJsonArray(upd.nodes);
						if (upd.edges) body.edges = parseJsonArray(upd.edges);
						responseData = await callApi('PUT', `/api/autoflows/${id}`, body);
					} else if (operation === 'delete') {
						const id = this.getNodeParameter('autoflowId', i) as string;
						responseData = await callApi('DELETE', `/api/autoflows/${id}`);
					} else if (operation === 'toggle') {
						const id = this.getNodeParameter('autoflowId', i) as string;
						responseData = await callApi('PUT', `/api/autoflows/${id}/toggle`);
					} else if (operation === 'executions') {
						const id = this.getNodeParameter('autoflowId', i) as string;
						responseData = await callApi('GET', `/api/autoflows/${id}/executions`);
					}
				}

				// ── WEBHOOK ─────────────────────────────────────────────────
				else if (resource === 'webhook') {
					if (operation === 'list') {
						const sid = this.getNodeParameter('sessionId', i) as string;
						responseData = await callApi('GET', `/api/webhook/${sid}`);
					} else if (operation === 'upsert') {
						const body: Record<string, any> = {
							sessionId: this.getNodeParameter('sessionId', i) as string,
							webhookUrl: this.getNodeParameter('webhookUrl', i) as string,
							events: splitCsv(this.getNodeParameter('events', i) as string),
						};
						const extra = this.getNodeParameter('webhookExtra', i, {}) as Record<string, any>;
						if (extra.label) body.label = extra.label;
						if (extra.filterSenders) body.filterSenders = splitCsv(extra.filterSenders);
						responseData = await callApi('POST', '/api/webhook/set', body);
					} else if (operation === 'update') {
						const wid = this.getNodeParameter('webhookId', i) as string;
						const body: Record<string, any> = {
							webhookUrl: this.getNodeParameter('webhookUrl', i) as string,
							events: splitCsv(this.getNodeParameter('events', i) as string),
						};
						const extra = this.getNodeParameter('webhookExtra', i, {}) as Record<string, any>;
						if (extra.label) body.label = extra.label;
						if (extra.filterSenders) body.filterSenders = splitCsv(extra.filterSenders);
						responseData = await callApi('PUT', `/api/webhook/${wid}`, body);
					} else if (operation === 'deleteById') {
						const wid = this.getNodeParameter('webhookId', i) as string;
						responseData = await callApi('DELETE', `/api/webhook/id/${wid}`);
					} else if (operation === 'deleteBySession') {
						const sid = this.getNodeParameter('sessionId', i) as string;
						const filter = this.getNodeParameter('deleteFilter', i, {}) as Record<string, any>;
						const qs: Record<string, any> = {};
						if (filter.webhookUrl) qs.webhookUrl = filter.webhookUrl;
						if (filter.confirmAll) qs.confirmAll = 'true';
						responseData = await callApi('DELETE', `/api/webhook/${sid}`, undefined, qs);
					} else if (operation === 'rotateSecret') {
						const wid = this.getNodeParameter('webhookId', i) as string;
						responseData = await callApi('POST', `/api/webhook/${wid}/rotate-secret`);
					} else if (operation === 'test') {
						const target = this.getNodeParameter('testTarget', i) as string;
						const body: Record<string, any> = {};
						if (target === 'webhookId') {
							body.webhookId = this.getNodeParameter('webhookId', i) as string;
						} else {
							body.sessionId = this.getNodeParameter('sessionId', i) as string;
						}
						responseData = await callApi('POST', '/api/webhook/test', body);
					}
				}

				// ── VERIFY ──────────────────────────────────────────────────
				else if (resource === 'verify') {
					if (operation === 'single') {
						const sid = this.getNodeParameter('sessionId', i) as string;
						const num = this.getNodeParameter('number', i) as string;
						responseData = await callApi('POST', `/api/verify/${sid}/verify-single`, { number: num });
					} else if (operation === 'history') {
						const qs: Record<string, any> = {};
						const session = this.getNodeParameter('session', i, '') as string;
						if (session) qs.session = session;
						responseData = await callApi('GET', '/api/verify/history', undefined, qs);
					} else if (operation === 'clear') {
						const session = this.getNodeParameter('session', i) as string;
						responseData = await callApi('DELETE', '/api/verify/clear', undefined, { session });
					}
				}

				// ── REPORT ──────────────────────────────────────────────────
				else if (resource === 'report') {
					const range = this.getNodeParameter('range', i, {}) as Record<string, any>;
					const qs: Record<string, any> = {};
					if (range.days) qs.days = range.days;
					if (range.from) qs.from = range.from;
					if (range.to) qs.to = range.to;

					if (operation === 'overview') {
						responseData = await callApi('GET', '/api/reports/overview', undefined, qs);
					} else if (operation === 'messagesDaily') {
						responseData = await callApi('GET', '/api/reports/messages/daily', undefined, qs);
					} else if (operation === 'messagesStatus') {
						responseData = await callApi('GET', '/api/reports/messages/status', undefined, qs);
					} else if (operation === 'messagesHourly') {
						responseData = await callApi('GET', '/api/reports/messages/hourly', undefined, qs);
					} else if (operation === 'campaigns') {
						responseData = await callApi('GET', '/api/reports/campaigns', undefined, qs);
					}
				}

				else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
				}

				if (responseData === undefined) {
					responseData = { success: true };
				}
				const listKey = ['data', 'contacts', 'groups', 'records', 'members', 'results'].find(
					(k) => Array.isArray(responseData?.[k]),
				);
				if (listKey) {
					returnData.push(...responseData[listKey].map((item: any) => ({ json: item, pairedItem: { item: i } })));
				} else if (Array.isArray(responseData)) {
					returnData.push(...responseData.map((item: any) => ({ json: item, pairedItem: { item: i } })));
				} else {
					returnData.push({ json: responseData, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: i });
					continue;
				}
				if (error instanceof NodeApiError || error instanceof NodeOperationError) throw error;
				throw new NodeApiError(this.getNode(), error as any);
			}
		}

		return [returnData];
	}
}
