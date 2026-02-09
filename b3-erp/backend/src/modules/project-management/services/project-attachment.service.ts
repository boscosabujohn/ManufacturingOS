import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectAttachment } from '../../project/entities/project-attachment.entity';

@Injectable()
export class ProjectAttachmentService {
    constructor(
        @InjectRepository(ProjectAttachment)
        private attachmentRepository: Repository<ProjectAttachment>,
    ) { }

    async createAttachment(projectId: string, data: Partial<ProjectAttachment>): Promise<ProjectAttachment> {
        const attachment = this.attachmentRepository.create({
            ...data,
            projectId,
        });
        return this.attachmentRepository.save(attachment);
    }

    async getProjectAttachments(projectId: string, category?: string): Promise<ProjectAttachment[]> {
        const where: any = { projectId };
        if (category) {
            where.category = category;
        }
        return this.attachmentRepository.find({
            where,
            order: { uploadedAt: 'DESC' },
        });
    }

    async deleteAttachment(id: string): Promise<void> {
        const result = await this.attachmentRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Attachment with ID ${id} not found`);
        }
    }

    async simulateUpload(fileName: string, contentType: string): Promise<{ url: string; key: string }> {
        // Mock S3 signed URL response
        const key = `projects/uploads/${Date.now()}-${fileName}`;
        return {
            url: `https://optiforge-storage-mock.s3.amazonaws.com/${key}`,
            key,
        };
    }
}
