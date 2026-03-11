import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuditLogger {
    private readonly logger = new Logger('Audit');

    logAction(action: string, user: string, details: any) {
        const maskedDetails = this.maskSensitiveData(details);
        this.logger.log(`[${action}] User: ${user} | Details: ${JSON.stringify(maskedDetails)}`);
    }

    private maskSensitiveData(data: any): any {
        if (!data || typeof data !== 'object') return data;

        const masked = { ...data };
        const sensitiveKeys = ['email', 'phone', 'password', 'token', 'secret', 'address', 'nic', 'tin', 'authorization'];

        for (const key of Object.keys(masked)) {
            if (sensitiveKeys.includes(key.toLowerCase())) {
                masked[key] = '********';
            } else if (typeof masked[key] === 'object') {
                masked[key] = this.maskSensitiveData(masked[key]);
            }
        }

        return masked;
    }
}
