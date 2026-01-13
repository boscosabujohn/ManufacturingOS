import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillCategory, SkillCategoryStatus } from '../entities/skill-category.entity';
import { Skill, SkillStatus, SkillType } from '../entities/skill.entity';
import { ProficiencyLevel, ProficiencyLevelStatus } from '../entities/proficiency-level.entity';
import { SkillGap, SkillGapStatus, SkillGapPriority, SkillGapCategory } from '../entities/skill-gap.entity';

@Injectable()
export class SkillSeederService implements OnModuleInit {
  private readonly logger = new Logger(SkillSeederService.name);

  constructor(
    @InjectRepository(SkillCategory)
    private readonly categoryRepository: Repository<SkillCategory>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(ProficiencyLevel)
    private readonly proficiencyRepository: Repository<ProficiencyLevel>,
    @InjectRepository(SkillGap)
    private readonly skillGapRepository: Repository<SkillGap>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedAll();
  }

  async seedAll(): Promise<void> {
    await this.seedProficiencyLevels();
    await this.seedCategories();
    await this.seedSkills();
    await this.seedSkillGaps();
  }

  async seedProficiencyLevels(): Promise<void> {
    this.logger.log('Seeding proficiency levels...');

    const levels = [
      {
        code: 'BEGINNER',
        name: 'Beginner',
        description: 'Basic understanding and awareness',
        level: 1,
        color: '#94A3B8',
        criteria: 'Has basic knowledge but limited practical experience',
        status: ProficiencyLevelStatus.ACTIVE,
      },
      {
        code: 'INTERMEDIATE',
        name: 'Intermediate',
        description: 'Working knowledge with some experience',
        level: 2,
        color: '#22C55E',
        criteria: 'Can apply the skill with some guidance',
        status: ProficiencyLevelStatus.ACTIVE,
      },
      {
        code: 'ADVANCED',
        name: 'Advanced',
        description: 'Strong proficiency and extensive experience',
        level: 3,
        color: '#3B82F6',
        criteria: 'Can work independently and mentor others',
        status: ProficiencyLevelStatus.ACTIVE,
      },
      {
        code: 'EXPERT',
        name: 'Expert',
        description: 'Deep expertise and thought leadership',
        level: 4,
        color: '#8B5CF6',
        criteria: 'Recognized expert who drives innovation',
        status: ProficiencyLevelStatus.ACTIVE,
      },
      {
        code: 'MASTER',
        name: 'Master',
        description: 'Industry-leading expertise',
        level: 5,
        color: '#F59E0B',
        criteria: 'Industry expert and thought leader',
        status: ProficiencyLevelStatus.ACTIVE,
      },
    ];

    for (const level of levels) {
      try {
        const existing = await this.proficiencyRepository.findOne({
          where: { code: level.code },
        });
        if (!existing) {
          await this.proficiencyRepository.save(level);
          this.logger.log(`Created proficiency level: ${level.name}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed proficiency level ${level.name}: ${error.message}`);
      }
    }

    this.logger.log('Proficiency levels seeding completed');
  }

  async seedCategories(): Promise<void> {
    this.logger.log('Seeding skill categories...');

    const categories = [
      {
        code: 'DOMAIN',
        name: 'Domain Expertise',
        description: 'Industry-specific knowledge and expertise',
        icon: 'Briefcase',
        color: '#3B82F6',
        sortOrder: 1,
        status: SkillCategoryStatus.ACTIVE,
      },
      {
        code: 'AI-AUTOMATION',
        name: 'AI & Automation',
        description: 'AI-powered features and automation capabilities',
        icon: 'Brain',
        color: '#8B5CF6',
        sortOrder: 2,
        status: SkillCategoryStatus.ACTIVE,
      },
      {
        code: 'MARKETING',
        name: 'Marketing & Business',
        description: 'Marketing, sales, and business operations',
        icon: 'TrendingUp',
        color: '#10B981',
        sortOrder: 3,
        status: SkillCategoryStatus.ACTIVE,
      },
      {
        code: 'TECHNICAL',
        name: 'Technical Skills',
        description: 'Software development and technical capabilities',
        icon: 'Code',
        color: '#F59E0B',
        sortOrder: 4,
        status: SkillCategoryStatus.ACTIVE,
      },
    ];

    for (const category of categories) {
      try {
        const existing = await this.categoryRepository.findOne({
          where: { code: category.code },
        });
        if (!existing) {
          await this.categoryRepository.save(category);
          this.logger.log(`Created skill category: ${category.name}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed category ${category.name}: ${error.message}`);
      }
    }

    this.logger.log('Skill categories seeding completed');
  }

  async seedSkills(): Promise<void> {
    this.logger.log('Seeding skills...');

    // Get category IDs
    const domainCategory = await this.categoryRepository.findOne({ where: { code: 'DOMAIN' } });
    const aiCategory = await this.categoryRepository.findOne({ where: { code: 'AI-AUTOMATION' } });
    const marketingCategory = await this.categoryRepository.findOne({ where: { code: 'MARKETING' } });
    const technicalCategory = await this.categoryRepository.findOne({ where: { code: 'TECHNICAL' } });

    const skills = [
      {
        code: 'workflow-manager',
        name: 'Workflow Manager',
        description: 'Expert domain skill for designing and implementing embedded workflow engines that orchestrate business processes (claims, approvals, HR requests, sales orders).',
        useCases: 'Use when (1) Designing workflow definition JSON schemas for config-as-code approaches, (2) Implementing state machines with complex transitions, (3) Building approval hierarchies and delegation rules.',
        categoryId: domainCategory?.id,
        skillType: SkillType.DOMAIN,
        icon: 'GitBranch',
        color: '#3B82F6',
        tags: ['workflow', 'automation', 'business-process'],
        requiresCertification: false,
        sortOrder: 1,
        status: SkillStatus.ACTIVE,
      },
      {
        code: 'ai-automation',
        name: 'AI Automation',
        description: 'Documentation for AI-powered features and automation capabilities across the Chainora platform. Covers semantic search, quote comparison, ETA prediction, risk scoring, demand forecasting, document AI, route optimization, fraud detection, and intelligent automation.',
        useCases: 'Use when implementing AI features, machine learning models, predictive analytics, or automated decision-making systems.',
        categoryId: aiCategory?.id,
        skillType: SkillType.DOMAIN,
        icon: 'Brain',
        color: '#8B5CF6',
        tags: ['AI', 'automation', 'machine-learning', 'prediction'],
        requiresCertification: false,
        sortOrder: 2,
        status: SkillStatus.ACTIVE,
      },
      {
        code: 'platform-capabilities',
        name: 'Platform Capabilities',
        description: "Comprehensive documentation of Chainora platform's core competencies organized by domain. Use when discussing platform features, capabilities, user journeys, module specifications, or when designing new features that integrate with the platform.",
        useCases: 'Use when (1) Discussing platform features and capabilities, (2) Understanding user journeys, (3) Module specifications, (4) Designing new features.',
        categoryId: domainCategory?.id,
        skillType: SkillType.DOMAIN,
        icon: 'Layers',
        color: '#3B82F6',
        tags: ['platform', 'capabilities', 'features', 'documentation'],
        requiresCertification: false,
        sortOrder: 3,
        status: SkillStatus.ACTIVE,
      },
      {
        code: 'developer-guidelines',
        name: 'Developer Guidelines',
        description: 'Comprehensive development standards and best practices for Chainora platform. Use when developers need guidance on coding standards, API conventions, database patterns, microservices architecture, event-driven design, security best practices.',
        useCases: 'Use when (1) Setting up development environment, (2) Writing code that follows platform standards, (3) Designing APIs, (4) Implementing security measures.',
        categoryId: technicalCategory?.id,
        skillType: SkillType.TECHNICAL,
        icon: 'Code',
        color: '#F59E0B',
        tags: ['development', 'coding-standards', 'API', 'security'],
        requiresCertification: false,
        sortOrder: 4,
        status: SkillStatus.ACTIVE,
      },
      {
        code: 'business-ops-marketing-manager',
        name: 'Business Ops & Marketing Manager',
        description: 'Business Operations & Marketing Manager who drives products to customers through commercial excellence. Use when (1) Creating killer demo flows that convert prospects to customers, (2) Building industry-specific pitch decks for sales teams.',
        useCases: 'Use when creating demos, sales presentations, customer success materials, or marketing content.',
        categoryId: marketingCategory?.id,
        skillType: SkillType.DOMAIN,
        icon: 'Megaphone',
        color: '#10B981',
        tags: ['marketing', 'business-ops', 'sales', 'demos'],
        requiresCertification: false,
        sortOrder: 5,
        status: SkillStatus.ACTIVE,
      },
      {
        code: 'linkedin-expert',
        name: 'LinkedIn Expert',
        description: 'Expert content creator for LinkedIn posts, Meta (Facebook/Instagram) posts, Google Business posts, and blog articles. Use this skill when asked to create social media content, project announcements, company updates, thought leadership articles.',
        useCases: 'Use when creating LinkedIn posts, social media content, blog articles, or professional networking content.',
        categoryId: marketingCategory?.id,
        skillType: SkillType.DOMAIN,
        icon: 'Linkedin',
        color: '#0A66C2',
        tags: ['linkedin', 'social-media', 'content-creation', 'marketing'],
        requiresCertification: false,
        sortOrder: 6,
        status: SkillStatus.ACTIVE,
      },
      {
        code: 'facility-management-expert',
        name: 'Facility Management Expert',
        description: 'Facility Management domain expert with cross-industry experience covering commercial, healthcare, education, hospitality, industrial, retail, and infrastructure facilities. Use when (1) Designing FM software modules (space management, maintenance, asset tracking).',
        useCases: 'Use when designing facility management features, space planning, maintenance scheduling, or asset management systems.',
        categoryId: domainCategory?.id,
        skillType: SkillType.DOMAIN,
        icon: 'Building2',
        color: '#6366F1',
        tags: ['facility-management', 'maintenance', 'asset-tracking', 'space-planning'],
        requiresCertification: false,
        sortOrder: 7,
        status: SkillStatus.ACTIVE,
      },
      {
        code: 'kreupai-solution-architect',
        name: 'Kreupai Solution Architect',
        description: 'Expert solution architect for designing and proposing SaaS applications and custom enterprise solutions based on customer RFPs. Use when (1) Analyzing and responding to RFPs/RFQs/EOIs, (2) Designing enterprise solution architectures.',
        useCases: 'Use when analyzing customer requirements, designing solution architectures, creating technical proposals, or responding to RFPs.',
        categoryId: domainCategory?.id,
        skillType: SkillType.DOMAIN,
        icon: 'FileText',
        color: '#059669',
        tags: ['solution-architecture', 'RFP', 'enterprise', 'SaaS', 'proposals'],
        requiresCertification: false,
        sortOrder: 8,
        status: SkillStatus.ACTIVE,
      },
      {
        code: 'landing-page-developer',
        name: 'Landing Page Developer',
        description: 'Create high-converting landing pages with expert frontend development and marketing strategy. Use this skill when asked to build landing pages, sales pages, product launch pages, SaaS marketing pages, app download pages, waitlist pages, or similar conversion-focused web pages.',
        useCases: 'Use when building landing pages, sales pages, product launch pages, SaaS marketing pages, app download pages, or waitlist pages.',
        categoryId: technicalCategory?.id,
        skillType: SkillType.TECHNICAL,
        icon: 'Layout',
        color: '#EC4899',
        tags: ['landing-pages', 'frontend', 'marketing', 'conversion', 'web-development'],
        requiresCertification: false,
        sortOrder: 9,
        status: SkillStatus.ACTIVE,
      },
      {
        code: 'backend-engineer',
        name: 'Backend Engineer',
        description: 'Backend engineering skill that analyzes UI/UX components (React, React Native) and user flows to create normalized Prisma schemas, API endpoints, and proper frontend-backend wiring. Use when (1) Creating database schemas from UI designs.',
        useCases: 'Use when designing database schemas, creating API endpoints, implementing backend services, or wiring frontend to backend.',
        categoryId: technicalCategory?.id,
        skillType: SkillType.TECHNICAL,
        icon: 'Server',
        color: '#0EA5E9',
        tags: ['backend', 'API', 'database', 'Prisma', 'Node.js'],
        requiresCertification: false,
        sortOrder: 10,
        status: SkillStatus.ACTIVE,
      },
      {
        code: 'quality-assurance-engineer',
        name: 'Quality Assurance Engineer',
        description: 'Skilled professional responsible for ensuring software quality through systematic testing, defect identification, and quality process implementation. Core competencies include manual and automated testing, test case design, bug tracking, and quality metrics.',
        useCases: 'Use when designing test cases, implementing automated tests, performing QA reviews, or setting up quality processes.',
        categoryId: technicalCategory?.id,
        skillType: SkillType.TECHNICAL,
        icon: 'CheckCircle',
        color: '#14B8A6',
        tags: ['QA', 'testing', 'automation', 'quality', 'bug-tracking'],
        requiresCertification: false,
        sortOrder: 11,
        status: SkillStatus.ACTIVE,
      },
    ];

    for (const skill of skills) {
      try {
        const existing = await this.skillRepository.findOne({
          where: { code: skill.code },
        });
        if (!existing) {
          await this.skillRepository.save(skill);
          this.logger.log(`Created skill: ${skill.name}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed skill ${skill.name}: ${error.message}`);
      }
    }

    this.logger.log('Skills seeding completed');
  }

  async seedSkillGaps(): Promise<void> {
    this.logger.log('Seeding skill gaps...');

    // Get skill IDs
    const solutionArchitectSkill = await this.skillRepository.findOne({ where: { code: 'kreupai-solution-architect' } });
    const backendEngineerSkill = await this.skillRepository.findOne({ where: { code: 'backend-engineer' } });
    const qaEngineerSkill = await this.skillRepository.findOne({ where: { code: 'quality-assurance-engineer' } });

    const skillGaps = [
      {
        code: 'GAP-SOL-ARCH',
        name: 'Solution Architecture Capability Gap',
        description: 'Critical gap in solution architecture capabilities for enterprise RFP responses and custom solution design. Currently lacking senior architects who can analyze complex customer requirements and propose comprehensive SaaS solutions.',
        category: SkillGapCategory.ROLE_REQUIREMENT,
        roleName: 'Solution Architect',
        departmentName: 'Engineering',
        skillId: solutionArchitectSkill?.id,
        requiredProficiencyLevel: 4,
        currentAverageProficiency: 2,
        employeesWithSkill: 2,
        employeesRequired: 5,
        gapPercentage: 60,
        priority: SkillGapPriority.CRITICAL,
        impact: 'Unable to respond to large enterprise RFPs effectively. Lost 3 major opportunities in Q4 due to inadequate solution proposals. Revenue impact estimated at $2.5M.',
        recommendation: 'Hire 2 senior solution architects with enterprise SaaS experience. Implement internal training program for existing engineers. Partner with consulting firm for complex RFPs.',
        trainingPlan: '1. Enterprise Architecture Fundamentals (4 weeks)\n2. RFP Response Best Practices (2 weeks)\n3. Cloud Solution Design Patterns (3 weeks)\n4. Customer Requirements Analysis Workshop (1 week)',
        targetDate: new Date('2024-06-30'),
        requiredCompetencies: ['Enterprise Architecture', 'RFP Analysis', 'Solution Design', 'Technical Writing', 'Cloud Platforms'],
        status: SkillGapStatus.ACTIVE,
      },
      {
        code: 'GAP-BACKEND',
        name: 'Backend Engineering Proficiency Gap',
        description: 'Significant gap in backend engineering skills, particularly in database schema design from UI/UX specifications, API development, and frontend-backend integration. Team struggles with translating design requirements into efficient backend implementations.',
        category: SkillGapCategory.TEAM_CAPABILITY,
        roleName: 'Backend Engineer',
        departmentName: 'Engineering',
        skillId: backendEngineerSkill?.id,
        requiredProficiencyLevel: 4,
        currentAverageProficiency: 2,
        employeesWithSkill: 4,
        employeesRequired: 8,
        gapPercentage: 50,
        priority: SkillGapPriority.HIGH,
        impact: 'Development velocity reduced by 30%. Technical debt accumulating due to suboptimal database designs. API inconsistencies causing frontend integration delays.',
        recommendation: 'Conduct intensive backend bootcamp for existing developers. Hire 2 senior backend engineers. Establish code review standards and architectural guidelines.',
        trainingPlan: '1. Database Design & Prisma Mastery (3 weeks)\n2. RESTful API Design Patterns (2 weeks)\n3. Node.js Advanced Concepts (2 weeks)\n4. Frontend-Backend Integration Workshop (1 week)',
        targetDate: new Date('2024-05-15'),
        requiredCompetencies: ['Database Design', 'Prisma ORM', 'Node.js', 'API Development', 'TypeScript'],
        status: SkillGapStatus.ACTIVE,
      },
      {
        code: 'GAP-QA',
        name: 'Quality Assurance Engineering Gap',
        description: 'Gap in QA engineering capabilities affecting product quality and release cycles. Limited automation testing coverage, inconsistent test case documentation, and reactive rather than proactive quality processes.',
        category: SkillGapCategory.TEAM_CAPABILITY,
        roleName: 'QA Engineer',
        departmentName: 'Quality Assurance',
        skillId: qaEngineerSkill?.id,
        requiredProficiencyLevel: 3,
        currentAverageProficiency: 2,
        employeesWithSkill: 3,
        employeesRequired: 5,
        gapPercentage: 40,
        priority: SkillGapPriority.HIGH,
        impact: 'Bug escape rate increased by 25% in last quarter. Customer-reported issues doubled. Release cycles extended due to manual testing bottlenecks.',
        recommendation: 'Implement test automation framework. Train existing QA team on automation tools. Establish quality metrics and KPIs. Hire 1 senior QA automation engineer.',
        trainingPlan: '1. Test Automation with Playwright/Cypress (3 weeks)\n2. API Testing with Postman/Jest (2 weeks)\n3. CI/CD Integration for Testing (1 week)\n4. Quality Metrics & Reporting (1 week)',
        targetDate: new Date('2024-04-30'),
        requiredCompetencies: ['Test Automation', 'Manual Testing', 'CI/CD', 'Bug Tracking', 'Test Planning'],
        status: SkillGapStatus.ACTIVE,
      },
    ];

    for (const gap of skillGaps) {
      try {
        if (!gap.skillId) {
          this.logger.warn(`Skill not found for gap ${gap.code}, skipping...`);
          continue;
        }
        const existing = await this.skillGapRepository.findOne({
          where: { code: gap.code },
        });
        if (!existing) {
          await this.skillGapRepository.save(gap);
          this.logger.log(`Created skill gap: ${gap.name}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed skill gap ${gap.name}: ${error.message}`);
      }
    }

    this.logger.log('Skill gaps seeding completed');
  }
}
