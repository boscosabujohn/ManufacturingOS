import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DefectSeverity {
  CRITICAL = 'Critical',
  MAJOR = 'Major',
  MINOR = 'Minor',
}

export enum DefectCategory {
  DIMENSIONAL = 'Dimensional',
  SURFACE = 'Surface',
  STRUCTURAL = 'Structural',
  FUNCTIONAL = 'Functional',
  MATERIAL = 'Material',
  ASSEMBLY = 'Assembly',
  COSMETIC = 'Cosmetic',
  OTHER = 'Other',
}

@Entity('defect_codes')
export class DefectCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: DefectSeverity, default: DefectSeverity.MAJOR })
  severity: DefectSeverity;

  @Column({ type: 'enum', enum: DefectCategory, default: DefectCategory.OTHER })
  category: DefectCategory;

  // Actions triggered by this defect
  @Column({ default: false })
  requiresNCR: boolean;

  @Column({ default: false })
  requiresCAPA: boolean;

  @Column({ default: false })
  requiresRework: boolean;

  @Column({ default: false })
  requiresScrap: boolean;

  @Column({ default: false })
  requiresQuarantine: boolean;

  // Inspection guidance
  @Column({ type: 'text', nullable: true })
  inspectionGuidance: string;

  @Column({ type: 'text', nullable: true })
  correctiveGuidance: string;

  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
  }[];

  // Sorting
  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  // Metadata
  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
