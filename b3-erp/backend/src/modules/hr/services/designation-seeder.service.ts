import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Designation, DesignationLevel, DesignationStatus } from '../entities/designation.entity';

@Injectable()
export class DesignationSeederService implements OnModuleInit {
  private readonly logger = new Logger(DesignationSeederService.name);

  constructor(
    @InjectRepository(Designation)
    private readonly designationRepository: Repository<Designation>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedDesignations();
  }

  async seedDesignations(): Promise<void> {
    this.logger.log('Seeding designations...');

    const designations = [
      // C-Level Executives (Level 1-2)
      {
        code: 'CEO',
        title: 'Chief Executive Officer',
        description: 'Responsible for overall company strategy, vision, and leadership. Reports to the Board of Directors.',
        level: DesignationLevel.CXO,
        gradeLevel: 1,
        minExperience: 15,
        responsibilities: ['Strategic planning', 'Board relations', 'Company vision', 'Key stakeholder management'],
        requiredSkills: ['Leadership', 'Strategic thinking', 'Communication', 'Business acumen'],
        status: DesignationStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'CFO',
        title: 'Chief Financial Officer',
        description: 'Oversees all financial operations, planning, and reporting. Reports to CEO.',
        level: DesignationLevel.CXO,
        gradeLevel: 1,
        reportsToTitle: 'Chief Executive Officer',
        minExperience: 12,
        responsibilities: ['Financial strategy', 'Budgeting', 'Financial reporting', 'Risk management'],
        requiredSkills: ['Financial management', 'Accounting', 'Strategic planning', 'Regulatory compliance'],
        status: DesignationStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'COO',
        title: 'Chief Operating Officer',
        description: 'Manages day-to-day operations and ensures operational excellence. Reports to CEO.',
        level: DesignationLevel.CXO,
        gradeLevel: 1,
        reportsToTitle: 'Chief Executive Officer',
        minExperience: 12,
        responsibilities: ['Operations management', 'Process optimization', 'Resource allocation', 'Performance management'],
        requiredSkills: ['Operations management', 'Process improvement', 'Leadership', 'Problem solving'],
        status: DesignationStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'CTO',
        title: 'Chief Technology Officer',
        description: 'Leads technology strategy and innovation. Reports to CEO.',
        level: DesignationLevel.CXO,
        gradeLevel: 2,
        reportsToTitle: 'Chief Executive Officer',
        minExperience: 12,
        responsibilities: ['Technology strategy', 'Innovation', 'IT infrastructure', 'Digital transformation'],
        requiredSkills: ['Technology leadership', 'Innovation', 'Strategic thinking', 'Technical expertise'],
        status: DesignationStatus.ACTIVE,
        createdBy: 'system',
      },

      // Senior Management (Level 3)
      {
        code: 'GM',
        title: 'General Manager',
        description: 'Manages overall business unit or division operations. Reports to C-Level executives.',
        level: DesignationLevel.DIRECTOR,
        gradeLevel: 3,
        minExperience: 10,
        responsibilities: ['Business unit management', 'P&L responsibility', 'Team leadership', 'Strategy execution'],
        requiredSkills: ['Leadership', 'Business management', 'Decision making', 'Team building'],
        status: DesignationStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'AGM',
        title: 'Assistant General Manager',
        description: 'Assists GM in managing business operations. Reports to General Manager.',
        level: DesignationLevel.VP,
        gradeLevel: 3,
        reportsToTitle: 'General Manager',
        minExperience: 8,
        responsibilities: ['Operations support', 'Team coordination', 'Project management', 'Performance monitoring'],
        requiredSkills: ['Management', 'Coordination', 'Communication', 'Problem solving'],
        status: DesignationStatus.ACTIVE,
        createdBy: 'system',
      },

      // Middle Management (Level 4-5)
      {
        code: 'MANAGER',
        title: 'Manager',
        description: 'Manages departmental operations and team performance. Reports to Senior Management.',
        level: DesignationLevel.MANAGER,
        gradeLevel: 4,
        reportsToTitle: 'Assistant General Manager',
        minExperience: 6,
        responsibilities: ['Team management', 'Goal setting', 'Performance reviews', 'Process management'],
        requiredSkills: ['Team leadership', 'Communication', 'Planning', 'Problem solving'],
        status: DesignationStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'ASST_MANAGER',
        title: 'Assistant Manager',
        description: 'Supports Manager in daily operations and team supervision. Reports to Manager.',
        level: DesignationLevel.SENIOR_MANAGER,
        gradeLevel: 5,
        reportsToTitle: 'Manager',
        minExperience: 4,
        responsibilities: ['Team supervision', 'Task allocation', 'Reporting', 'Process execution'],
        requiredSkills: ['Supervision', 'Communication', 'Time management', 'Coordination'],
        status: DesignationStatus.ACTIVE,
        createdBy: 'system',
      },

      // Senior Staff (Level 6)
      {
        code: 'SR_EXEC',
        title: 'Senior Executive',
        description: 'Experienced professional handling complex tasks independently. Reports to Assistant Manager.',
        level: DesignationLevel.SENIOR,
        gradeLevel: 6,
        reportsToTitle: 'Assistant Manager',
        minExperience: 3,
        responsibilities: ['Independent task execution', 'Junior mentoring', 'Quality work delivery', 'Process improvement suggestions'],
        requiredSkills: ['Domain expertise', 'Problem solving', 'Communication', 'Mentoring'],
        status: DesignationStatus.ACTIVE,
        createdBy: 'system',
      },

      // Staff (Level 7-8)
      {
        code: 'EXEC',
        title: 'Executive',
        description: 'Professional handling assigned tasks and projects. Reports to Senior Executive.',
        level: DesignationLevel.INTERMEDIATE,
        gradeLevel: 7,
        reportsToTitle: 'Senior Executive',
        minExperience: 1,
        responsibilities: ['Task execution', 'Documentation', 'Coordination', 'Learning and development'],
        requiredSkills: ['Job knowledge', 'Communication', 'Teamwork', 'Time management'],
        status: DesignationStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'JR_EXEC',
        title: 'Junior Executive',
        description: 'Entry-level professional learning job responsibilities. Reports to Executive.',
        level: DesignationLevel.JUNIOR,
        gradeLevel: 8,
        reportsToTitle: 'Executive',
        minExperience: 0,
        responsibilities: ['Task support', 'Learning', 'Documentation', 'Basic operations'],
        requiredSkills: ['Basic job knowledge', 'Eagerness to learn', 'Communication', 'Teamwork'],
        status: DesignationStatus.ACTIVE,
        createdBy: 'system',
      },

      // Entry Level (Level 9-10)
      {
        code: 'TRAINEE',
        title: 'Trainee',
        description: 'New employee undergoing training program. Reports to assigned mentor/supervisor.',
        level: DesignationLevel.ENTRY,
        gradeLevel: 9,
        reportsToTitle: 'Junior Executive',
        minExperience: 0,
        responsibilities: ['Training attendance', 'Skill development', 'Task learning', 'Assessment completion'],
        requiredSkills: ['Willingness to learn', 'Basic education', 'Communication', 'Punctuality'],
        status: DesignationStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'INTERN',
        title: 'Intern',
        description: 'Student or fresh graduate gaining work experience. Reports to assigned supervisor.',
        level: DesignationLevel.ENTRY,
        gradeLevel: 10,
        reportsToTitle: 'Executive',
        minExperience: 0,
        responsibilities: ['Project assistance', 'Learning', 'Documentation support', 'Observation'],
        requiredSkills: ['Basic education', 'Eagerness to learn', 'Communication', 'Computer skills'],
        status: DesignationStatus.ACTIVE,
        createdBy: 'system',
      },
    ];

    for (const designation of designations) {
      try {
        const existing = await this.designationRepository.findOne({
          where: { code: designation.code },
        });
        if (!existing) {
          await this.designationRepository.save(designation);
          this.logger.log(`Created designation: ${designation.title}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed designation ${designation.title}: ${error.message}`);
      }
    }

    this.logger.log('Designations seeding completed');
  }
}
