import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SupportSeederService implements OnModuleInit {
    private readonly logger = new Logger(SupportSeederService.name);

    constructor(private readonly prisma: PrismaService) {}

    async onModuleInit(): Promise<void> {
        await this.seedSupportData();
    }

    async seedSupportData(): Promise<void> {
        const company = await this.prisma.company.findFirst();
        if (!company) {
            this.logger.warn('No company found. Skipping support seeding.');
            return;
        }

        await this.seedChannels(company.id);
        await this.seedRoutingRules(company.id);
        await this.seedKnowledgeCategories(company.id);
        await this.seedResponseTemplates(company.id);
        await this.seedCSATTemplates(company.id);
        await this.seedSupportSettings(company.id);
    }

    private async seedChannels(companyId: string): Promise<void> {
        this.logger.log('Seeding support channels...');

        const channels = [
            {
                code: 'EMAIL',
                name: 'Email Support',
                type: 'email',
                description: 'Customer support via email',
                priority: 3,
                autoAssign: true,
                autoResponseEnabled: true,
                autoResponseTemplate: 'Thank you for contacting us. Your request has been received and a support representative will respond shortly.',
                companyId,
            },
            {
                code: 'PHONE',
                name: 'Phone Support',
                type: 'phone',
                description: 'Customer support via phone',
                priority: 1,
                autoAssign: true,
                companyId,
            },
            {
                code: 'CHAT',
                name: 'Live Chat',
                type: 'chat',
                description: 'Real-time chat support',
                priority: 2,
                autoAssign: true,
                companyId,
            },
            {
                code: 'PORTAL',
                name: 'Self-Service Portal',
                type: 'portal',
                description: 'Customer self-service portal tickets',
                priority: 4,
                autoAssign: false,
                companyId,
            },
            {
                code: 'SOCIAL',
                name: 'Social Media',
                type: 'social',
                description: 'Social media channels (Twitter, Facebook)',
                priority: 5,
                autoAssign: true,
                companyId,
            },
        ];

        for (const channel of channels) {
            const existing = await this.prisma.supportChannel.findFirst({
                where: { code: channel.code, companyId },
            });

            if (!existing) {
                await this.prisma.supportChannel.create({ data: channel });
                this.logger.log(`Created support channel: ${channel.name}`);
            }
        }
    }

    private async seedRoutingRules(companyId: string): Promise<void> {
        this.logger.log('Seeding routing rules...');

        const rules = [
            {
                name: 'Critical Priority - Urgent Keywords',
                description: 'Route tickets with urgent keywords to high priority',
                priority: 10,
                conditions: [
                    { field: 'subject', operator: 'contains', value: 'urgent' },
                ],
                setPriority: 'critical',
                escalateAfter: 30,
                companyId,
            },
            {
                name: 'Billing Category - Finance Team',
                description: 'Route billing tickets to finance team',
                priority: 50,
                conditions: [
                    { field: 'category', operator: 'equals', value: 'billing' },
                ],
                assignToTeamId: 'finance-team',
                setCategory: 'billing',
                companyId,
            },
            {
                name: 'Technical Category - Tech Support',
                description: 'Route technical tickets to tech support team',
                priority: 50,
                conditions: [
                    { field: 'category', operator: 'equals', value: 'technical' },
                ],
                assignToTeamId: 'tech-support',
                setCategory: 'technical',
                companyId,
            },
            {
                name: 'VIP Customers - Priority Handling',
                description: 'Elevate priority for VIP customers',
                priority: 20,
                conditions: [
                    { field: 'tags', operator: 'contains', value: 'vip' },
                ],
                setPriority: 'high',
                addTags: ['vip-handling'],
                companyId,
            },
        ];

        for (const rule of rules) {
            const existing = await this.prisma.channelRoutingRule.findFirst({
                where: { name: rule.name, companyId },
            });

            if (!existing) {
                await this.prisma.channelRoutingRule.create({
                    data: {
                        ...rule,
                        conditions: rule.conditions,
                        addTags: rule.addTags || [],
                    },
                });
                this.logger.log(`Created routing rule: ${rule.name}`);
            }
        }
    }

    private async seedKnowledgeCategories(companyId: string): Promise<void> {
        this.logger.log('Seeding knowledge categories...');

        const categories = [
            {
                code: 'GETTING_STARTED',
                name: 'Getting Started',
                description: 'Onboarding and setup guides',
                icon: 'rocket',
                color: '#10B981',
                displayOrder: 1,
                isPublic: true,
                companyId,
            },
            {
                code: 'PRODUCT_FEATURES',
                name: 'Product Features',
                description: 'Feature documentation and tutorials',
                icon: 'book',
                color: '#3B82F6',
                displayOrder: 2,
                isPublic: true,
                companyId,
            },
            {
                code: 'TROUBLESHOOTING',
                name: 'Troubleshooting',
                description: 'Common issues and solutions',
                icon: 'wrench',
                color: '#F59E0B',
                displayOrder: 3,
                isPublic: true,
                companyId,
            },
            {
                code: 'BILLING',
                name: 'Billing & Payments',
                description: 'Billing, invoicing, and payment information',
                icon: 'credit-card',
                color: '#8B5CF6',
                displayOrder: 4,
                isPublic: true,
                companyId,
            },
            {
                code: 'INTERNAL',
                name: 'Internal Guides',
                description: 'Internal support team documentation',
                icon: 'lock',
                color: '#6B7280',
                displayOrder: 10,
                isPublic: false,
                isInternal: true,
                companyId,
            },
        ];

        for (const category of categories) {
            const existing = await this.prisma.knowledgeCategory.findFirst({
                where: { code: category.code, companyId },
            });

            if (!existing) {
                await this.prisma.knowledgeCategory.create({ data: category });
                this.logger.log(`Created knowledge category: ${category.name}`);
            }
        }
    }

    private async seedResponseTemplates(companyId: string): Promise<void> {
        this.logger.log('Seeding response templates...');

        const templates = [
            {
                code: 'GREETING',
                name: 'Standard Greeting',
                description: 'Standard greeting for new tickets',
                content: 'Hello {{customer_name}},\n\nThank you for contacting our support team. We have received your request and will review it shortly.\n\nBest regards,\nSupport Team',
                shortcut: '/greet',
                category: 'general',
                tags: ['greeting', 'opening'],
                ticketTypes: ['issue', 'question', 'feedback'],
                companyId,
            },
            {
                code: 'CLOSING',
                name: 'Standard Closing',
                description: 'Standard closing for resolved tickets',
                content: 'If you have any further questions, please don\'t hesitate to reach out.\n\nThank you for your patience and understanding.\n\nBest regards,\nSupport Team',
                shortcut: '/close',
                category: 'general',
                tags: ['closing', 'resolution'],
                companyId,
            },
            {
                code: 'NEED_INFO',
                name: 'Request More Information',
                description: 'Request additional details from customer',
                content: 'To better assist you, could you please provide the following information:\n\n- [Specific detail 1]\n- [Specific detail 2]\n\nThis will help us investigate and resolve your issue more efficiently.',
                shortcut: '/info',
                category: 'general',
                tags: ['information', 'clarification'],
                ticketTypes: ['issue', 'question'],
                companyId,
            },
            {
                code: 'ESCALATION',
                name: 'Escalation Notice',
                description: 'Notify customer of escalation',
                content: 'I\'m escalating your case to our senior support team for further investigation. They will review your issue and follow up with you within [timeframe].\n\nWe appreciate your patience.',
                shortcut: '/escalate',
                category: 'escalation',
                tags: ['escalation', 'senior-support'],
                ticketTypes: ['issue', 'complaint'],
                companyId,
            },
            {
                code: 'BILLING_INQUIRY',
                name: 'Billing Inquiry Response',
                description: 'Standard response for billing questions',
                content: 'Thank you for reaching out regarding your billing inquiry.\n\nI\'ve reviewed your account and [provide explanation].\n\nIf you need further clarification on your invoice or payment, please let me know.',
                shortcut: '/billing',
                category: 'billing',
                tags: ['billing', 'invoice', 'payment'],
                ticketTypes: ['question'],
                ticketCategories: ['billing'],
                companyId,
            },
            {
                code: 'TECHNICAL_TROUBLESHOOT',
                name: 'Technical Troubleshooting Steps',
                description: 'Common troubleshooting steps',
                content: 'Please try the following troubleshooting steps:\n\n1. Clear your browser cache and cookies\n2. Try using a different browser or incognito mode\n3. Check your internet connection\n4. Restart the application\n\nLet me know if the issue persists after trying these steps.',
                shortcut: '/troubleshoot',
                category: 'technical',
                tags: ['technical', 'troubleshooting'],
                useAiEnhancement: true,
                aiPrompt: 'Customize these troubleshooting steps based on the specific technical issue described.',
                ticketTypes: ['issue'],
                ticketCategories: ['technical'],
                companyId,
            },
        ];

        for (const template of templates) {
            const existing = await this.prisma.aIResponseTemplate.findFirst({
                where: { code: template.code, companyId },
            });

            if (!existing) {
                await this.prisma.aIResponseTemplate.create({
                    data: {
                        ...template,
                        tags: template.tags || [],
                        ticketTypes: template.ticketTypes || [],
                        ticketCategories: template.ticketCategories || [],
                    },
                });
                this.logger.log(`Created response template: ${template.name}`);
            }
        }
    }

    private async seedCSATTemplates(companyId: string): Promise<void> {
        this.logger.log('Seeding CSAT survey templates...');

        const existing = await this.prisma.cSATSurveyTemplate.findFirst({
            where: { code: 'DEFAULT', companyId },
        });

        if (!existing) {
            await this.prisma.cSATSurveyTemplate.create({
                data: {
                    code: 'DEFAULT',
                    name: 'Post-Resolution Survey',
                    description: 'Default survey sent after ticket resolution',
                    surveyType: 'post_resolution',
                    triggerEvent: 'ticket_closed',
                    questions: [
                        {
                            id: 'q1',
                            type: 'rating',
                            question: 'How satisfied are you with the support you received?',
                            scale: 5,
                            labels: { 1: 'Very Unsatisfied', 5: 'Very Satisfied' },
                            required: true,
                        },
                        {
                            id: 'q2',
                            type: 'rating',
                            question: 'How likely are you to recommend our support to others?',
                            scale: 10,
                            labels: { 0: 'Not Likely', 10: 'Very Likely' },
                            required: true,
                            isNPS: true,
                        },
                        {
                            id: 'q3',
                            type: 'text',
                            question: 'What could we have done better?',
                            required: false,
                            maxLength: 500,
                        },
                    ],
                    sendDelay: 60,
                    expiresAfter: 168,
                    reminderEnabled: true,
                    reminderAfter: 48,
                    thankYouMessage: 'Thank you for taking the time to provide feedback. Your input helps us improve our service!',
                    isDefault: true,
                    companyId,
                },
            });
            this.logger.log('Created default CSAT survey template');
        }
    }

    private async seedSupportSettings(companyId: string): Promise<void> {
        this.logger.log('Seeding support settings...');

        const existing = await this.prisma.supportSettings.findUnique({
            where: { companyId },
        });

        if (!existing) {
            await this.prisma.supportSettings.create({
                data: {
                    companyId,
                    ticketPrefix: 'TKT',
                    autoAssignEnabled: true,
                    businessHoursStart: '09:00',
                    businessHoursEnd: '18:00',
                    businessDays: [1, 2, 3, 4, 5],
                    timezone: 'Asia/Kolkata',
                    defaultResponseTime: 240,
                    defaultResolutionTime: 1440,
                    csatEnabled: true,
                    csatAutoSend: true,
                    csatDelay: 60,
                    aiSuggestionsEnabled: true,
                    aiAutoResponse: false,
                    aiConfidenceThreshold: 0.8,
                    itilEnabled: true,
                    incidentPrefix: 'INC',
                    problemPrefix: 'PRB',
                    changePrefix: 'CHG',
                    escalationNotifyEmail: true,
                    breachNotifyEmail: true,
                },
            });
            this.logger.log('Created support settings');
        }
    }
}
