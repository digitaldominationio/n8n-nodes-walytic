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

				/** Split comma-separated string into trimmed array */
				const splitCsv = (val: string): string[] =>
					val.split(',').map(s => s.trim()).filter(Boolean);

				// ── SESSION ─────────────────────────────────────────────────
				if (resource === 'session') {
					if (operation === 'list') {
						responseData = await callApi('GET', '/api/sessions');
					} else if (operation === 'create') {
						const phone = this.getNodeParameter('sessionId', i) as string;
						responseData = await callApi('POST', `/api/sessions/${phone}`);
					} else if (operation === 'delete') {
						const sid = this.getNodeParameter('sessionId', i) as string;
						responseData = await callApi('DELETE', `/api/sessions/${sid}`);
					}
				}

				// ── MESSAGE ─────────────────────────────────────────────────
				else if (resource === 'message') {
					if (operation === 'sendText') {
						const sid = this.getNodeParameter('sessionId', i) as string;
						responseData = await callApi('POST', `/api/whatsapp/${sid}/send`, {
							phone: this.getNodeParameter('phone', i) as string,
							message: this.getNodeParameter('message', i) as string,
						});
					} else if (operation === 'sendMedia') {
						const sid = this.getNodeParameter('sessionId', i) as string;
						const body: Record<string, any> = {
							phone: this.getNodeParameter('phone', i) as string,
							mediaType: this.getNodeParameter('mediaType', i) as string,
							mediaUrl: this.getNodeParameter('mediaUrl', i) as string,
						};
						const caption = this.getNodeParameter('caption', i, '') as string;
						if (caption) body.caption = caption;
						const fileName = this.getNodeParameter('fileName', i, '') as string;
						if (fileName) body.fileName = fileName;
						responseData = await callApi('POST', `/api/whatsapp/${sid}/send-media`, body);
					} else if (operation === 'sendTemplate') {
						const sid = this.getNodeParameter('sessionId', i) as string;
						const vars = this.getNodeParameter('templateVariables', i, '[]') as string;
						responseData = await callApi('POST', `/api/whatsapp/${sid}/send-template`, {
							phone: this.getNodeParameter('phone', i) as string,
							templateName: this.getNodeParameter('templateName', i) as string,
							language: this.getNodeParameter('templateLanguage', i) as string,
							variables: typeof vars === 'string' ? JSON.parse(vars) : vars,
						});
					} else if (operation === 'reply') {
						const sid = this.getNodeParameter('sessionId', i) as string;
						responseData = await callApi('POST', `/api/whatsapp/${sid}/send`, {
							phone: this.getNodeParameter('phone', i) as string,
							message: this.getNodeParameter('message', i) as string,
							quotedMessageId: this.getNodeParameter('quotedMessageId', i) as string,
						});
					} else if (operation === 'sendGroup') {
						const sid = this.getNodeParameter('sessionId', i) as string;
						const identifier = this.getNodeParameter('groupIdentifier', i) as string;
						const body: Record<string, any> = {
							message: this.getNodeParameter('message', i) as string,
						};
						if (identifier === 'groupName') {
							body.groupName = this.getNodeParameter('groupName', i) as string;
						} else {
							body.groupId = this.getNodeParameter('groupJid', i) as string;
						}
						responseData = await callApi('POST', `/api/whatsapp/${sid}/send-group`, body);
					} else if (operation === 'list') {
						const qs: Record<string, any> = {};
						const sid = this.getNodeParameter('sessionId', i, '') as string;
						if (sid) qs.sessionId = sid;
						qs.limit = this.getNodeParameter('limit', i, 50) as number;
						responseData = await callApi('GET', '/api/messages', undefined, qs);
					}
				}

				// ── CONTACT ─────────────────────────────────────────────────
				else if (resource === 'contact') {
					if (operation === 'list') {
						const filters = this.getNodeParameter('filters', i, {}) as Record<string, any>;
						const qs: Record<string, any> = {};
						if (filters.isLead !== undefined) qs.isLead = filters.isLead;
						if (filters.stage) qs.stage = filters.stage;
						if (filters.tag) qs.tag = filters.tag;
						if (filters.search) qs.search = filters.search;
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
						const body: Record<string, any> = { phone, source: 'n8n' };
						if (extra.firstName) body.firstName = extra.firstName;
						if (extra.lastName) body.lastName = extra.lastName;
						if (extra.email) body.email = extra.email;
						if (extra.stage) body.stage = extra.stage;
						if (extra.source) body.source = extra.source;
						if (extra.notes) body.notes = extra.notes;
						if (extra.isLead !== undefined) body.isLead = extra.isLead;
						if (extra.sessionId) body.sessionId = extra.sessionId;
						if (extra.tags) body.tags = splitCsv(extra.tags);
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
						if (upd.tags) body.tags = splitCsv(upd.tags);
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
						if (pf.notes) body.notes = pf.notes;
						if (pf.tags) body.tags = splitCsv(pf.tags);
						responseData = await callApi('POST', `/api/contacts/${id}/promote`, body);
					} else if (operation === 'merge') {
						responseData = await callApi('POST', '/api/contacts/merge', {
							sourceId: this.getNodeParameter('sourceId', i) as string,
							targetId: this.getNodeParameter('targetId', i) as string,
						});
					} else if (operation === 'sync') {
						responseData = await callApi('POST', '/api/contacts/sync', {
							sessionId: this.getNodeParameter('sessionId', i) as string,
						});
					} else if (operation === 'bulkUpdateStage') {
						const ids = splitCsv(this.getNodeParameter('contactIds', i) as string);
						responseData = await callApi('POST', '/api/contacts/bulk-update-stage', {
							contactIds: ids,
							stage: this.getNodeParameter('stage', i) as string,
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
						const msgs = this.getNodeParameter('messages', i, '[]') as string;
						body.messages = typeof msgs === 'string' ? JSON.parse(msgs) : msgs;
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
						responseData = await callApi('POST', '/api/outreach', body);
					} else if (operation === 'update') {
						const id = this.getNodeParameter('campaignId', i) as string;
						const upd = this.getNodeParameter('updateFields', i, {}) as Record<string, any>;
						const body: Record<string, any> = {};
						if (upd.name) body.name = upd.name;
						if (upd.duration) body.duration = upd.duration;
						if (upd.sessionIds) body.sessionIds = splitCsv(upd.sessionIds);
						if (upd.messages) {
							body.messages = typeof upd.messages === 'string' ? JSON.parse(upd.messages) : upd.messages;
						}
						responseData = await callApi('PUT', `/api/outreach/${id}`, body);
					} else if (operation === 'delete') {
						const id = this.getNodeParameter('campaignId', i) as string;
						responseData = await callApi('DELETE', `/api/outreach/${id}`);
					} else if (operation === 'toggle') {
						const id = this.getNodeParameter('campaignId', i) as string;
						responseData = await callApi('PUT', `/api/outreach/${id}/toggle`);
					} else if (operation === 'assign') {
						const id = this.getNodeParameter('campaignId', i) as string;
						const ids = splitCsv(this.getNodeParameter('contactIds', i) as string);
						responseData = await callApi('POST', `/api/outreach/${id}/assign`, { contactIds: ids });
					} else if (operation === 'unassign') {
						const id = this.getNodeParameter('campaignId', i) as string;
						const ids = splitCsv(this.getNodeParameter('contactIds', i) as string);
						responseData = await callApi('POST', `/api/outreach/${id}/unassign`, { contactIds: ids });
					} else if (operation === 'stats') {
						const id = this.getNodeParameter('campaignId', i) as string;
						responseData = await callApi('GET', `/api/outreach/${id}/stats`);
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
						const trigger = this.getNodeParameter('trigger', i) as string;
						const actions = this.getNodeParameter('actions', i) as string;
						responseData = await callApi('POST', '/api/autoflows', {
							name: this.getNodeParameter('name', i) as string,
							trigger: typeof trigger === 'string' ? JSON.parse(trigger) : trigger,
							actions: typeof actions === 'string' ? JSON.parse(actions) : actions,
						});
					} else if (operation === 'update') {
						const id = this.getNodeParameter('autoflowId', i) as string;
						const upd = this.getNodeParameter('updateFields', i, {}) as Record<string, any>;
						const body: Record<string, any> = {};
						if (upd.name) body.name = upd.name;
						if (upd.trigger) {
							body.trigger = typeof upd.trigger === 'string' ? JSON.parse(upd.trigger) : upd.trigger;
						}
						if (upd.actions) {
							body.actions = typeof upd.actions === 'string' ? JSON.parse(upd.actions) : upd.actions;
						}
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

				// ── REPORT ──────────────────────────────────────────────────
				else if (resource === 'report') {
					const dateRange = this.getNodeParameter('dateRange', i, {}) as Record<string, any>;
					const qs: Record<string, any> = {};
					if (dateRange.from) qs.from = dateRange.from;
					if (dateRange.to) qs.to = dateRange.to;
					if (dateRange.sessionId) qs.sessionId = dateRange.sessionId;

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

				// Normalise response
				if (responseData === undefined) {
					responseData = { success: true };
				}
				if (Array.isArray(responseData?.data)) {
					returnData.push(...responseData.data.map((item: any) => ({ json: item, pairedItem: { item: i } })));
				} else if (Array.isArray(responseData?.contacts)) {
					returnData.push(...responseData.contacts.map((item: any) => ({ json: item, pairedItem: { item: i } })));
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
