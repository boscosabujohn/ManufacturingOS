
import { Injectable, Logger, NotFoundException} from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { WorkflowDocument} from '../entities/workflow-document.entity';
import { v4 as uuidv4} from 'uuid';

@Injectable()
export class DocumentService {
    private readonly logger = new Logger(DocumentService.name);

    constructor(
        @InjectRepository(WorkflowDocument)
        private documentRepository: Repository<WorkflowDocument>,
    ) {}

    /**
     * Upload a new document
     */
    async uploadDocument(
        file: any, // Express.Multer.File
        projectId: string,
        documentType: string,
        userId: string,
        metadata: any = {},
    ): Promise<WorkflowDocument> {
        // Mock S3 upload
        const fileUrl = await this.mockS3Upload(file);

        const document = this.documentRepository.create({
            projectId,
            documentType,
            fileName: file.originalname,
            fileUrl,
            fileSize: file.size,
            mimeType: file.mimetype,
            version: '1.0',
            status: 'draft',
            uploadedBy: userId,
            metadata,
       });

        return this.documentRepository.save(document);
   }

    /**
     * Create a new version of an existing document
     */
    async createVersion(
        documentId: string,
        file: any,
        userId: string,
        changeDescription: string,
    ): Promise<WorkflowDocument> {
        const existingDoc = await this.documentRepository.findOne({ where: { id: documentId}});
        if (!existingDoc) {
            throw new NotFoundException(`Document ${documentId} not found`);
       }

        // Mock S3 upload
        const fileUrl = await this.mockS3Upload(file);

        // Increment version
        const newVersion = this.incrementVersion(existingDoc.version);

        // Create new document record (or update existing if we want to keep history separately)
        // Here we create a new record for the new version to keep full history
        const newDoc = this.documentRepository.create({
            ...existingDoc,
            id: undefined, // Generate new ID
            fileName: file.originalname,
            fileUrl,
            fileSize: file.size,
            mimeType: file.mimetype,
            version: newVersion,
            status: 'draft',
            uploadedBy: userId,
            uploadedAt: new Date(),
            metadata: {
                ...existingDoc.metadata,
                previousVersionId: existingDoc.id,
                changeDescription,
           },
       });

        return this.documentRepository.save(newDoc);
   }

    /**
     * Get document by ID
     */
    async getDocument(id: string): Promise<WorkflowDocument> {
        const doc = await this.documentRepository.findOne({ where: { id}});
        if (!doc) {
            throw new NotFoundException(`Document ${id} not found`);
       }
        return doc;
   }

    /**
     * Get all versions of a document
     * This assumes we can link them via metadata or some other ID.
     * For simplicity, let's assume we filter by projectId and documentType + fileName
     */
    async getDocumentVersions(projectId: string, documentType: string, fileName: string): Promise<WorkflowDocument[]> {
        return this.documentRepository.find({
            where: { projectId, documentType, fileName},
            order: { version: 'DESC'},
       });
   }

    /**
     * Check if a document of a specific type exists for a project
     */
    async checkDocumentExists(projectId: string, documentType: string): Promise<boolean> {
        const count = await this.documentRepository.count({
            where: { projectId, documentType},
       });
        return count > 0;
   }

    private async mockS3Upload(file: any): Promise<string> {
        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        return `https://s3.amazonaws.com/bucket/${uuidv4()}-${file.originalname}`;
   }

    private incrementVersion(version: string): string {
        const parts = version.split('.');
        if (parts.length === 2) {
            const major = parseInt(parts[0], 10);
            const minor = parseInt(parts[1], 10);
            return `${major}.${minor + 1}`;
       }
        return version + '.1';
   }

    /**
     * Compare two versions of a document
     * Returns a mock diff for now
     */
    async compareVersions(docId1: string, docId2: string): Promise<any> {
        const doc1 = await this.getDocument(docId1);
        const doc2 = await this.getDocument(docId2);

        return {
            doc1: { version: doc1.version, fileName: doc1.fileName, size: doc1.fileSize},
            doc2: { version: doc2.version, fileName: doc2.fileName, size: doc2.fileSize},
            diff: 'Binary comparison not implemented in mock',
            metadataDiff: this.getMetadataDiff(doc1.metadata, doc2.metadata),
       };
   }

    private getMetadataDiff(meta1: any, meta2: any): any {
        // Simple key-value diff
        const diff = {};
        const keys = new Set([...Object.keys(meta1 || {}), ...Object.keys(meta2 || {})]);

        keys.forEach(key => {
            if (meta1?.[key] !== meta2?.[key]) {
                diff[key] = { from: meta1?.[key], to: meta2?.[key]};
           }
       });
        return diff;
   }

    /**
     * Submit a document for parallel approval
     */
    async submitForApproval(documentId: string, approverIds: string[], submittedBy: string): Promise<any> {
        const document = await this.getDocument(documentId);
        if (!document) {
            throw new NotFoundException(`Document with ID ${documentId} not found.`);
       }

        // Update document status
        document.status = 'pending_approval';
        await this.documentRepository.save(document);

        // Initiate parallel approval process
        const approvalProcess = await this.parallelApprovalService.startApprovalProcess(
            documentId,
            approverIds,
            submittedBy,
        );

        return {
            message: `Document ${documentId} submitted for approval.`,
            approvalProcessId: approvalProcess.id,
            documentStatus: document.status,
       };
   }
}
```
