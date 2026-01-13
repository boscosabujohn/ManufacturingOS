// Skill Category Types
export enum SkillCategoryStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export interface SkillCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  status: SkillCategoryStatus;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  skills?: Skill[];
}

// Skill Types
export enum SkillStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DEPRECATED = 'Deprecated',
}

export enum SkillType {
  TECHNICAL = 'Technical',
  SOFT_SKILL = 'Soft Skill',
  DOMAIN = 'Domain',
  TOOL = 'Tool',
  CERTIFICATION = 'Certification',
  LANGUAGE = 'Language',
}

export interface Skill {
  id: string;
  code: string;
  name: string;
  description?: string;
  useCases?: string;
  categoryId?: string;
  category?: SkillCategory;
  skillType: SkillType;
  icon?: string;
  color?: string;
  tags?: string[];
  relatedSkillCodes?: string[];
  requiresCertification: boolean;
  certificationUrl?: string;
  sortOrder: number;
  status: SkillStatus;
  metadata?: Record<string, any>;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Proficiency Level Types
export enum ProficiencyLevelStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export interface ProficiencyLevel {
  id: string;
  code: string;
  name: string;
  description?: string;
  level: number;
  color?: string;
  icon?: string;
  criteria?: string;
  status: ProficiencyLevelStatus;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User Skill Types
export enum UserSkillStatus {
  ACTIVE = 'Active',
  PENDING_VERIFICATION = 'Pending Verification',
  VERIFIED = 'Verified',
  EXPIRED = 'Expired',
  INACTIVE = 'Inactive',
}

export interface UserSkill {
  id: string;
  employeeId: string;
  skillId: string;
  skill?: Skill;
  proficiencyLevelId?: string;
  proficiencyLevel: number;
  yearsOfExperience?: number;
  lastAssessmentDate?: Date;
  certificationDate?: Date;
  certificationExpiryDate?: Date;
  certificateUrl?: string;
  certificateNumber?: string;
  verifiedById?: string;
  verifiedByName?: string;
  verifiedAt?: Date;
  verificationNotes?: string;
  isEnabled: boolean;
  status: UserSkillStatus;
  notes?: string;
  metadata?: Record<string, any>;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response Types
export interface CreateSkillDto {
  code: string;
  name: string;
  description?: string;
  useCases?: string;
  categoryId?: string;
  skillType?: SkillType;
  icon?: string;
  color?: string;
  tags?: string[];
  relatedSkillCodes?: string[];
  requiresCertification?: boolean;
  certificationUrl?: string;
  sortOrder?: number;
  status?: SkillStatus;
  metadata?: Record<string, any>;
}

export interface UpdateSkillDto extends Partial<CreateSkillDto> {}

export interface CreateUserSkillDto {
  employeeId: string;
  skillId: string;
  proficiencyLevelId?: string;
  proficiencyLevel?: number;
  yearsOfExperience?: number;
  lastAssessmentDate?: string;
  certificationDate?: string;
  certificationExpiryDate?: string;
  certificateUrl?: string;
  certificateNumber?: string;
  isEnabled?: boolean;
  status?: UserSkillStatus;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface UpdateUserSkillDto extends Partial<Omit<CreateUserSkillDto, 'employeeId' | 'skillId'>> {}
