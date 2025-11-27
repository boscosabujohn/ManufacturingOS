```typescript
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowRule } from '../entities/workflow-rule.entity';

export interface Rule {
    id: string;
    name: string;
    description?: string;
    conditions: RuleCondition[];
    actions: RuleAction[];
    priority: number;
    enabled: boolean;
}

export interface RuleCondition {
    field: string;
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in';
    value: any;
}

export interface RuleAction {
    type: string;
    params: Record<string, any>;
}

@Injectable()
export class RuleEngineService {
    private readonly logger = new Logger(RuleEngineService.name);

    constructor(
        @InjectRepository(WorkflowRule)
        private ruleRepository: Repository<WorkflowRule>,
    ) {}

    /**
     * Evaluate rules for a specific event trigger
     */
    async evaluateRulesForEvent(eventName: string, context: any): Promise<void> {
        const rules = await this.ruleRepository.find({
            where: { triggerEvent: eventName, enabled: true },
            order: { priority: 'DESC' },
        });

        if (rules.length > 0) {
            this.logger.log(`Evaluating ${ rules.length } rules for event: ${ eventName } `);
            await this.evaluateRules(rules as unknown as Rule[], context);
        }
    }

    /**
     * Evaluate a set of rules against a context
     */
    async evaluateRules(rules: Rule[], context: any): Promise<void> {
        const sortedRules = rules
            .filter((r) => r.enabled)
            .sort((a, b) => b.priority - a.priority);

        for (const rule of sortedRules) {
            if (this.evaluateConditions(rule.conditions, context)) {
                this.logger.log(`Rule matched: ${ rule.name } `);
                await this.executeActions(rule.actions, context);
            }
        }
    }

    /**
     * Evaluate conditions for a single rule
     */
    private evaluateConditions(conditions: RuleCondition[], context: any): boolean {
        return conditions.every((condition) => {
            const value = this.getValueFromContext(context, condition.field);
            return this.compare(value, condition.operator, condition.value);
        });
    }

    /**
     * Get value from nested context object using dot notation
     */
    private getValueFromContext(context: any, field: string): any {
        return field.split('.').reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined), context);
    }

    /**
     * Compare values based on operator
     */
    private compare(actual: any, operator: string, expected: any): boolean {
        switch (operator) {
            case 'equals':
                return actual === expected;
            case 'not_equals':
                return actual !== expected;
            case 'greater_than':
                return actual > expected;
            case 'less_than':
                return actual < expected;
            case 'contains':
                return Array.isArray(actual) ? actual.includes(expected) : String(actual).includes(String(expected));
            case 'in':
                return Array.isArray(expected) ? expected.includes(actual) : false;
            default:
                return false;
        }
    }

    /**
   * Execute actions for a matched rule
   */
    private async executeActions(actions: RuleAction[], context: any): Promise<void> {
        for (const action of actions) {
            this.logger.log(`Executing action: ${ action.type } `, action.params);

            try {
                switch (action.type) {
                    case 'send_notification':
                        // await this.notificationService.notifyUser(...)
                        // For now, just log as we need to inject NotificationService
                        this.logger.log(`[Mock] Sending notification: ${ JSON.stringify(action.params) } `);
                        break;

                    case 'trigger_event':
                        // await this.eventBusService.emit(...)
                        // For now, just log as we need to inject EventBusService
                        this.logger.log(`[Mock] Triggering event: ${ JSON.stringify(action.params) } `);
                        break;

                    case 'update_context':
                        // Update the context object directly (if mutable)
                        if (action.params.field && action.params.value !== undefined) {
                            context[action.params.field] = action.params.value;
                        }
                        break;

                    default:
                        this.logger.warn(`Unknown action type: ${ action.type } `);
                }
            } catch (error) {
                this.logger.error(`Failed to execute action ${ action.type }: ${ error.message } `, error.stack);
            }
        }
    }
}
