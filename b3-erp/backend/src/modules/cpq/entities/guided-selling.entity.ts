import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Sales Playbooks
@Entity('cpq_sales_playbooks')
export class SalesPlaybook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  industry: string;

  @Column({ type: 'varchar', nullable: true })
  customerSegment: string;

  @Column({ type: 'varchar', nullable: true })
  productCategory: string;

  @Column({ type: 'json' })
  stages: {
    stageNumber: number;
    stageName: string;
    description: string;
    objectives: string[];
    activities: {
      name: string;
      description: string;
      durationMinutes: number;
      isRequired: boolean;
    }[];
    exitCriteria: string[];
    suggestedContent: string[];
  }[];

  @Column({ type: 'json', nullable: true })
  talkingPoints: {
    topic: string;
    points: string[];
    objectionHandlers: { objection: string; response: string }[];
  }[];

  @Column({ type: 'json', nullable: true })
  competitiveInsights: {
    competitor: string;
    strengths: string[];
    weaknesses: string[];
    differentiators: string[];
  }[];

  @Column({ type: 'json', nullable: true })
  successMetrics: {
    metric: string;
    target: number;
    unit: string;
  }[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Product Recommendations Engine
@Entity('cpq_recommendation_rules')
export class RecommendationRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['cross_sell', 'up_sell', 'frequently_bought', 'similar_products', 'custom'],
    default: 'cross_sell',
  })
  recommendationType: 'cross_sell' | 'up_sell' | 'frequently_bought' | 'similar_products' | 'custom';

  @Column({ type: 'varchar', nullable: true })
  sourceProductId: string;

  @Column({ type: 'varchar', nullable: true })
  sourceProductCategory: string;

  @Column({ type: 'json' })
  recommendedProducts: {
    productId: string;
    productName: string;
    reason: string;
    priority: number;
    discountOffer?: number;
  }[];

  @Column({ type: 'json', nullable: true })
  conditions: {
    field: string;
    operator: string;
    value: unknown;
  }[];

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  minConfidenceScore: number;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  impressionCount: number;

  @Column({ type: 'int', default: 0 })
  clickCount: number;

  @Column({ type: 'int', default: 0 })
  conversionCount: number;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Sales Questionnaire
@Entity('cpq_sales_questionnaires')
export class SalesQuestionnaire {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  industry: string;

  @Column({ type: 'varchar', nullable: true })
  productCategory: string;

  @Column({ type: 'json' })
  questions: {
    questionId: string;
    questionText: string;
    questionType: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'scale';
    options?: {
      value: string;
      label: string;
      productRecommendations?: string[];
      score?: number;
    }[];
    isRequired: boolean;
    order: number;
    conditionalDisplay?: {
      dependsOnQuestion: string;
      dependsOnValue: unknown;
    };
    helpText?: string;
  }[];

  @Column({ type: 'json', nullable: true })
  scoringRules: {
    minScore: number;
    maxScore: number;
    recommendation: string;
    products: string[];
  }[];

  @Column({ type: 'json', nullable: true })
  outcomeMapping: {
    conditions: { questionId: string; value: unknown }[];
    recommendedProducts: string[];
    recommendedBundles: string[];
  }[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  completionCount: number;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Questionnaire Responses
@Entity('cpq_questionnaire_responses')
export class QuestionnaireResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  questionnaireId: string;

  @Column({ type: 'varchar', nullable: true })
  customerId: string;

  @Column({ type: 'varchar', nullable: true })
  opportunityId: string;

  @Column({ type: 'varchar', nullable: true })
  quoteId: string;

  @Column({ type: 'json' })
  responses: {
    questionId: string;
    questionText: string;
    answer: unknown;
  }[];

  @Column({ type: 'int', nullable: true })
  totalScore: number;

  @Column({ type: 'json', nullable: true })
  recommendedProducts: {
    productId: string;
    productName: string;
    confidenceScore: number;
  }[];

  @Column({ type: 'json', nullable: true })
  recommendedBundles: {
    bundleId: string;
    bundleName: string;
  }[];

  @Column({ type: 'varchar', nullable: true })
  completedBy: string;

  @CreateDateColumn()
  createdAt: Date;
}

// Cross-sell & Up-sell Tracking
@Entity('cpq_recommendation_events')
export class RecommendationEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column({ type: 'varchar', nullable: true })
  recommendationRuleId: string;

  @Column()
  sourceProductId: string;

  @Column()
  recommendedProductId: string;

  @Column({
    type: 'enum',
    enum: ['cross_sell', 'up_sell'],
  })
  recommendationType: 'cross_sell' | 'up_sell';

  @Column({
    type: 'enum',
    enum: ['impression', 'click', 'add_to_quote', 'purchase'],
  })
  eventType: 'impression' | 'click' | 'add_to_quote' | 'purchase';

  @Column({ type: 'varchar', nullable: true })
  customerId: string;

  @Column({ type: 'varchar', nullable: true })
  quoteId: string;

  @Column({ type: 'varchar', nullable: true })
  sessionId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  revenueGenerated: number;

  @Column({ type: 'varchar', nullable: true })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
