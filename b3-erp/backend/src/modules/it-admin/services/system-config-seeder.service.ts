import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SystemConfig,
  ConfigCategory,
  ConfigDataType,
  ConfigStatus,
} from '../entities/system-config.entity';

interface ConfigDefinition {
  key: string;
  name: string;
  description: string;
  value: string;
  defaultValue: string;
  category: ConfigCategory;
  dataType: ConfigDataType;
  isEditable?: boolean;
  isSystemConfig?: boolean;
  requiresRestart?: boolean;
  allowedValues?: string[];
  validationRegex?: string;
  validationMessage?: string;
  constraints?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: string[];
  };
  module?: string;
}

@Injectable()
export class SystemConfigSeederService implements OnModuleInit {
  private readonly logger = new Logger(SystemConfigSeederService.name);

  constructor(
    @InjectRepository(SystemConfig)
    private readonly configRepository: Repository<SystemConfig>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedConfigs();
  }

  async seedConfigs(): Promise<void> {
    this.logger.log('Seeding system configurations...');

    const configs: ConfigDefinition[] = [
      // Company Information
      {
        key: 'company.name',
        name: 'Company Name',
        description: 'Official registered name of the company',
        value: 'ManufacturingOS Pvt. Ltd.',
        defaultValue: 'ManufacturingOS Pvt. Ltd.',
        category: ConfigCategory.SYSTEM,
        dataType: ConfigDataType.STRING,
        isEditable: true,
        isSystemConfig: true,
        module: 'system',
      },
      {
        key: 'company.address',
        name: 'Company Address',
        description: 'Registered address of the company',
        value: JSON.stringify({
          line1: '123 Industrial Park',
          line2: 'Sector 62',
          city: 'Noida',
          state: 'Uttar Pradesh',
          country: 'India',
          postalCode: '201301',
        }),
        defaultValue: '{}',
        category: ConfigCategory.SYSTEM,
        dataType: ConfigDataType.JSON,
        isEditable: true,
        isSystemConfig: true,
        module: 'system',
      },
      {
        key: 'company.phone',
        name: 'Company Phone',
        description: 'Primary contact phone number',
        value: '+91-120-4567890',
        defaultValue: '',
        category: ConfigCategory.SYSTEM,
        dataType: ConfigDataType.STRING,
        isEditable: true,
        isSystemConfig: true,
        module: 'system',
      },
      {
        key: 'company.email',
        name: 'Company Email',
        description: 'Primary contact email address',
        value: 'info@manufacturingos.com',
        defaultValue: '',
        category: ConfigCategory.SYSTEM,
        dataType: ConfigDataType.STRING,
        isEditable: true,
        isSystemConfig: true,
        validationRegex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        validationMessage: 'Please enter a valid email address',
        module: 'system',
      },
      {
        key: 'company.gstin',
        name: 'GSTIN Number',
        description: 'GST Identification Number',
        value: '09AAACM1234F1ZV',
        defaultValue: '',
        category: ConfigCategory.SYSTEM,
        dataType: ConfigDataType.STRING,
        isEditable: true,
        isSystemConfig: true,
        validationRegex: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$',
        validationMessage: 'Please enter a valid GSTIN',
        module: 'system',
      },
      {
        key: 'company.pan',
        name: 'PAN Number',
        description: 'Permanent Account Number',
        value: 'AAACM1234F',
        defaultValue: '',
        category: ConfigCategory.SYSTEM,
        dataType: ConfigDataType.STRING,
        isEditable: true,
        isSystemConfig: true,
        validationRegex: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
        validationMessage: 'Please enter a valid PAN',
        module: 'system',
      },

      // Regional Settings
      {
        key: 'regional.currency',
        name: 'Default Currency',
        description: 'Default currency for all financial transactions',
        value: 'INR',
        defaultValue: 'INR',
        category: ConfigCategory.SYSTEM,
        dataType: ConfigDataType.STRING,
        isEditable: true,
        isSystemConfig: true,
        allowedValues: ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'],
        module: 'finance',
      },
      {
        key: 'regional.currency_symbol',
        name: 'Currency Symbol',
        description: 'Symbol to display for currency',
        value: '\u20B9',
        defaultValue: '\u20B9',
        category: ConfigCategory.SYSTEM,
        dataType: ConfigDataType.STRING,
        isEditable: true,
        isSystemConfig: true,
        module: 'finance',
      },
      {
        key: 'regional.date_format',
        name: 'Date Format',
        description: 'Default date format for display and input',
        value: 'DD/MM/YYYY',
        defaultValue: 'DD/MM/YYYY',
        category: ConfigCategory.SYSTEM,
        dataType: ConfigDataType.STRING,
        isEditable: true,
        isSystemConfig: true,
        allowedValues: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'DD-MMM-YYYY'],
        module: 'system',
      },
      {
        key: 'regional.time_format',
        name: 'Time Format',
        description: 'Default time format (12-hour or 24-hour)',
        value: '12h',
        defaultValue: '12h',
        category: ConfigCategory.SYSTEM,
        dataType: ConfigDataType.STRING,
        isEditable: true,
        isSystemConfig: true,
        allowedValues: ['12h', '24h'],
        module: 'system',
      },
      {
        key: 'regional.timezone',
        name: 'Timezone',
        description: 'Default timezone for the system',
        value: 'Asia/Kolkata',
        defaultValue: 'Asia/Kolkata',
        category: ConfigCategory.SYSTEM,
        dataType: ConfigDataType.STRING,
        isEditable: true,
        isSystemConfig: true,
        module: 'system',
      },

      // Fiscal Settings
      {
        key: 'fiscal.year_start',
        name: 'Fiscal Year Start',
        description: 'Start month of the fiscal year (1-12)',
        value: '4',
        defaultValue: '4',
        category: ConfigCategory.BUSINESS_RULE,
        dataType: ConfigDataType.NUMBER,
        isEditable: true,
        isSystemConfig: true,
        constraints: { min: 1, max: 12 },
        validationMessage: 'Fiscal year start month must be between 1 and 12',
        module: 'finance',
      },
      {
        key: 'fiscal.year_format',
        name: 'Fiscal Year Format',
        description: 'Display format for fiscal year',
        value: 'YYYY-YY',
        defaultValue: 'YYYY-YY',
        category: ConfigCategory.BUSINESS_RULE,
        dataType: ConfigDataType.STRING,
        isEditable: true,
        isSystemConfig: true,
        allowedValues: ['YYYY-YY', 'YYYY-YYYY', 'FY YYYY'],
        module: 'finance',
      },
      {
        key: 'fiscal.current_year',
        name: 'Current Fiscal Year',
        description: 'Current active fiscal year',
        value: '2024-25',
        defaultValue: '2024-25',
        category: ConfigCategory.BUSINESS_RULE,
        dataType: ConfigDataType.STRING,
        isEditable: true,
        isSystemConfig: true,
        module: 'finance',
      },

      // Email Settings
      {
        key: 'email.smtp_host',
        name: 'SMTP Host',
        description: 'SMTP server hostname for sending emails',
        value: 'smtp.gmail.com',
        defaultValue: 'smtp.gmail.com',
        category: ConfigCategory.EMAIL,
        dataType: ConfigDataType.STRING,
        isEditable: true,
        isSystemConfig: true,
        requiresRestart: true,
        module: 'system',
      },
      {
        key: 'email.smtp_port',
        name: 'SMTP Port',
        description: 'SMTP server port',
        value: '587',
        defaultValue: '587',
        category: ConfigCategory.EMAIL,
        dataType: ConfigDataType.NUMBER,
        isEditable: true,
        isSystemConfig: true,
        requiresRestart: true,
        constraints: { min: 1, max: 65535 },
        module: 'system',
      },
      {
        key: 'email.smtp_secure',
        name: 'SMTP Secure',
        description: 'Use TLS/SSL for SMTP connection',
        value: 'true',
        defaultValue: 'true',
        category: ConfigCategory.EMAIL,
        dataType: ConfigDataType.BOOLEAN,
        isEditable: true,
        isSystemConfig: true,
        requiresRestart: true,
        module: 'system',
      },
      {
        key: 'email.from_name',
        name: 'Email From Name',
        description: 'Default sender name for system emails',
        value: 'ManufacturingOS',
        defaultValue: 'ManufacturingOS',
        category: ConfigCategory.EMAIL,
        dataType: ConfigDataType.STRING,
        isEditable: true,
        isSystemConfig: true,
        module: 'system',
      },
      {
        key: 'email.from_address',
        name: 'Email From Address',
        description: 'Default sender email address for system emails',
        value: 'noreply@manufacturingos.com',
        defaultValue: 'noreply@manufacturingos.com',
        category: ConfigCategory.EMAIL,
        dataType: ConfigDataType.STRING,
        isEditable: true,
        isSystemConfig: true,
        validationRegex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        validationMessage: 'Please enter a valid email address',
        module: 'system',
      },

      // Notification Settings
      {
        key: 'notification.email_enabled',
        name: 'Email Notifications',
        description: 'Enable email notifications for system events',
        value: 'true',
        defaultValue: 'true',
        category: ConfigCategory.NOTIFICATION,
        dataType: ConfigDataType.BOOLEAN,
        isEditable: true,
        isSystemConfig: true,
        module: 'system',
      },
      {
        key: 'notification.sms_enabled',
        name: 'SMS Notifications',
        description: 'Enable SMS notifications for critical alerts',
        value: 'false',
        defaultValue: 'false',
        category: ConfigCategory.NOTIFICATION,
        dataType: ConfigDataType.BOOLEAN,
        isEditable: true,
        isSystemConfig: true,
        module: 'system',
      },
      {
        key: 'notification.push_enabled',
        name: 'Push Notifications',
        description: 'Enable browser push notifications',
        value: 'true',
        defaultValue: 'true',
        category: ConfigCategory.NOTIFICATION,
        dataType: ConfigDataType.BOOLEAN,
        isEditable: true,
        isSystemConfig: true,
        module: 'system',
      },
      {
        key: 'notification.digest_frequency',
        name: 'Digest Frequency',
        description: 'Frequency for notification digest emails',
        value: 'daily',
        defaultValue: 'daily',
        category: ConfigCategory.NOTIFICATION,
        dataType: ConfigDataType.STRING,
        isEditable: true,
        isSystemConfig: true,
        allowedValues: ['immediate', 'hourly', 'daily', 'weekly', 'never'],
        module: 'system',
      },

      // Security Settings
      {
        key: 'security.password_min_length',
        name: 'Minimum Password Length',
        description: 'Minimum required length for user passwords',
        value: '8',
        defaultValue: '8',
        category: ConfigCategory.SECURITY,
        dataType: ConfigDataType.NUMBER,
        isEditable: true,
        isSystemConfig: true,
        constraints: { min: 6, max: 32 },
        module: 'security',
      },
      {
        key: 'security.password_require_uppercase',
        name: 'Require Uppercase',
        description: 'Require at least one uppercase letter in passwords',
        value: 'true',
        defaultValue: 'true',
        category: ConfigCategory.SECURITY,
        dataType: ConfigDataType.BOOLEAN,
        isEditable: true,
        isSystemConfig: true,
        module: 'security',
      },
      {
        key: 'security.password_require_number',
        name: 'Require Number',
        description: 'Require at least one number in passwords',
        value: 'true',
        defaultValue: 'true',
        category: ConfigCategory.SECURITY,
        dataType: ConfigDataType.BOOLEAN,
        isEditable: true,
        isSystemConfig: true,
        module: 'security',
      },
      {
        key: 'security.password_require_special',
        name: 'Require Special Character',
        description: 'Require at least one special character in passwords',
        value: 'true',
        defaultValue: 'true',
        category: ConfigCategory.SECURITY,
        dataType: ConfigDataType.BOOLEAN,
        isEditable: true,
        isSystemConfig: true,
        module: 'security',
      },
      {
        key: 'security.session_timeout',
        name: 'Session Timeout',
        description: 'Session timeout in minutes (0 = no timeout)',
        value: '120',
        defaultValue: '120',
        category: ConfigCategory.SECURITY,
        dataType: ConfigDataType.NUMBER,
        isEditable: true,
        isSystemConfig: true,
        constraints: { min: 0, max: 1440 },
        module: 'security',
      },
      {
        key: 'security.max_login_attempts',
        name: 'Max Login Attempts',
        description: 'Maximum failed login attempts before account lockout',
        value: '5',
        defaultValue: '5',
        category: ConfigCategory.SECURITY,
        dataType: ConfigDataType.NUMBER,
        isEditable: true,
        isSystemConfig: true,
        constraints: { min: 3, max: 10 },
        module: 'security',
      },
      {
        key: 'security.lockout_duration',
        name: 'Lockout Duration',
        description: 'Account lockout duration in minutes',
        value: '30',
        defaultValue: '30',
        category: ConfigCategory.SECURITY,
        dataType: ConfigDataType.NUMBER,
        isEditable: true,
        isSystemConfig: true,
        constraints: { min: 5, max: 1440 },
        module: 'security',
      },
      {
        key: 'security.two_factor_enabled',
        name: 'Two-Factor Authentication',
        description: 'Enable two-factor authentication for all users',
        value: 'false',
        defaultValue: 'false',
        category: ConfigCategory.SECURITY,
        dataType: ConfigDataType.BOOLEAN,
        isEditable: true,
        isSystemConfig: true,
        module: 'security',
      },

      // API Settings
      {
        key: 'api.rate_limit_enabled',
        name: 'API Rate Limiting',
        description: 'Enable rate limiting for API requests',
        value: 'true',
        defaultValue: 'true',
        category: ConfigCategory.API,
        dataType: ConfigDataType.BOOLEAN,
        isEditable: true,
        isSystemConfig: true,
        requiresRestart: true,
        module: 'api',
      },
      {
        key: 'api.rate_limit_requests',
        name: 'Rate Limit Requests',
        description: 'Maximum API requests per minute per user',
        value: '100',
        defaultValue: '100',
        category: ConfigCategory.API,
        dataType: ConfigDataType.NUMBER,
        isEditable: true,
        isSystemConfig: true,
        constraints: { min: 10, max: 1000 },
        module: 'api',
      },
      {
        key: 'api.pagination_default_limit',
        name: 'Default Page Size',
        description: 'Default number of records per page',
        value: '20',
        defaultValue: '20',
        category: ConfigCategory.API,
        dataType: ConfigDataType.NUMBER,
        isEditable: true,
        isSystemConfig: true,
        constraints: { min: 10, max: 100 },
        module: 'api',
      },
      {
        key: 'api.pagination_max_limit',
        name: 'Max Page Size',
        description: 'Maximum number of records per page',
        value: '100',
        defaultValue: '100',
        category: ConfigCategory.API,
        dataType: ConfigDataType.NUMBER,
        isEditable: true,
        isSystemConfig: true,
        constraints: { min: 50, max: 500 },
        module: 'api',
      },
    ];

    for (const config of configs) {
      try {
        const existing = await this.configRepository.findOne({
          where: { key: config.key },
        });
        if (!existing) {
          const configEntity = this.configRepository.create({
            key: config.key,
            name: config.name,
            description: config.description,
            value: config.value,
            defaultValue: config.defaultValue,
            category: config.category,
            dataType: config.dataType,
            status: ConfigStatus.ACTIVE,
            isEditable: config.isEditable ?? true,
            isSystemConfig: config.isSystemConfig ?? true,
            requiresRestart: config.requiresRestart ?? false,
            allowedValues: config.allowedValues,
            validationRegex: config.validationRegex,
            validationMessage: config.validationMessage,
            constraints: config.constraints,
            module: config.module,
            metadata: {
              seededAt: new Date().toISOString(),
            },
            createdBy: 'system',
          } as Partial<SystemConfig>);
          await this.configRepository.save(configEntity);
          this.logger.log(`Created config: ${config.key}`);
        } else {
          this.logger.debug(`Config already exists: ${config.key}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed config ${config.key}: ${error.message}`);
      }
    }

    this.logger.log(`System configurations seeding completed. Total: ${configs.length} configs`);
  }
}
