
import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    UseInterceptors,
    UploadedFile,
    Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from '../services/document.service';

@Controller('workflow/documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadDocument(
        @UploadedFile() file: any,
        @Body('projectId') projectId: string,
        @Body('documentType') documentType: string,
        @Body('userId') userId: string,
        @Body('metadata') metadata: string,
    ) {
        const parsedMetadata = metadata ? JSON.parse(metadata) : {};
        return this.documentService.uploadDocument(
            file,
            projectId,
            documentType,
            userId,
            parsedMetadata,
        );
    }

    @Post(':id/version')
    @UseInterceptors(FileInterceptor('file'))
    async createVersion(
        @Param('id') id: string,
        @UploadedFile() file: any,
        @Body('userId') userId: string,
        @Body('changeDescription') changeDescription: string,
    ) {
        return this.documentService.createVersion(
            id,
            file,
            userId,
            changeDescription,
        );
    }

    @Get(':id')
    async getDocument(@Param('id') id: string) {
        return this.documentService.getDocument(id);
    }

    @Get('versions')
    async getDocumentVersions(
        @Query('projectId') projectId: string,
        @Query('documentType') documentType: string,
        @Query('fileName') fileName: string,
    ) {
        return this.documentService.getDocumentVersions(
            projectId,
            documentType,
            fileName,
        );
    }

    @Get('compare')
    async compareVersions(
        @Query('docId1') docId1: string,
        @Query('docId2') docId2: string,
    ) {
        return this.documentService.compareVersions(docId1, docId2);
    }

    @Post(':id/submit-approval')
    async submitForApproval(
        @Param('id') id: string,
        @Body('approverIds') approverIds: string[],
        @Body('submittedBy') submittedBy: string,
    ) {
        return this.documentService.submitForApproval(id, approverIds, submittedBy);
    }
}
