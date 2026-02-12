import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ContentLibraryItem,
  Contract,
  ContractClause,
  ContractStatus,
  ContractTemplate,
  Proposal,
  ProposalStatus,
  ProposalTemplate,
} from '../entities/proposal-contract.entity';
import { ProposalContractService } from '../services/proposal-contract.service';

@Controller('cpq')
export class ProposalContractController {
  constructor(
    private readonly proposalContractService: ProposalContractService,
  ) {}

  // Proposals
  @Post('proposals')
  createProposal(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<Proposal>,
  ): Promise<Proposal> {
    return this.proposalContractService.createProposal(companyId, data);
  }

  @Get('proposals')
  findAllProposals(
    @Headers('x-company-id') companyId: string,
    @Query('status') status?: ProposalStatus,
    @Query('customerId') customerId?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ): Promise<Proposal[]> {
    return this.proposalContractService.findAllProposals(companyId, {
      status,
      customerId,
      fromDate,
      toDate,
    });
  }

  @Get('proposals/:id')
  findProposalById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<Proposal> {
    return this.proposalContractService.findProposalById(companyId, id);
  }

  @Patch('proposals/:id')
  updateProposal(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<Proposal>,
  ): Promise<Proposal> {
    return this.proposalContractService.updateProposal(companyId, id, data);
  }

  @Delete('proposals/:id')
  deleteProposal(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.proposalContractService.deleteProposal(companyId, id);
  }

  // Proposal Workflow
  @Post('proposals/:id/submit')
  submitProposalForApproval(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<Proposal> {
    return this.proposalContractService.submitProposalForApproval(companyId, id);
  }

  @Post('proposals/:id/approve')
  approveProposal(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ): Promise<Proposal> {
    return this.proposalContractService.approveProposal(
      companyId,
      id,
      body.approvedBy,
    );
  }

  @Post('proposals/:id/send')
  sendProposal(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() body: { sentBy: string },
  ): Promise<Proposal> {
    return this.proposalContractService.sendProposal(companyId, id, body.sentBy);
  }

  @Post('proposals/:id/view')
  recordProposalView(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.proposalContractService.recordProposalView(companyId, id);
  }

  @Post('proposals/:id/response')
  recordProposalResponse(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() body: { accepted: boolean; feedback?: string },
  ): Promise<Proposal> {
    return this.proposalContractService.recordProposalResponse(
      companyId,
      id,
      body.accepted,
      body.feedback,
    );
  }

  // Proposal Templates
  @Post('proposal-templates')
  createProposalTemplate(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<ProposalTemplate>,
  ): Promise<ProposalTemplate> {
    return this.proposalContractService.createProposalTemplate(companyId, data);
  }

  @Get('proposal-templates')
  findAllProposalTemplates(
    @Headers('x-company-id') companyId: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ): Promise<ProposalTemplate[]> {
    return this.proposalContractService.findAllProposalTemplates(companyId, {
      category,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Post('proposal-templates/:id/create-proposal')
  createProposalFromTemplate(
    @Headers('x-company-id') companyId: string,
    @Param('id') templateId: string,
    @Body() data: Partial<Proposal>,
  ): Promise<Proposal> {
    return this.proposalContractService.createProposalFromTemplate(
      companyId,
      templateId,
      data,
    );
  }

  // Content Library
  @Post('content-library')
  createContentLibraryItem(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<ContentLibraryItem>,
  ): Promise<ContentLibraryItem> {
    return this.proposalContractService.createContentLibraryItem(companyId, data);
  }

  @Get('content-library')
  findAllContentLibraryItems(
    @Headers('x-company-id') companyId: string,
    @Query('contentType') contentType?: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ): Promise<ContentLibraryItem[]> {
    return this.proposalContractService.findAllContentLibraryItems(companyId, {
      contentType,
      category,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Patch('content-library/:id')
  updateContentLibraryItem(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<ContentLibraryItem>,
  ): Promise<ContentLibraryItem> {
    return this.proposalContractService.updateContentLibraryItem(
      companyId,
      id,
      data,
    );
  }

  @Delete('content-library/:id')
  deleteContentLibraryItem(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.proposalContractService.deleteContentLibraryItem(companyId, id);
  }

  // Contracts
  @Post('contracts')
  createContract(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<Contract>,
  ): Promise<Contract> {
    return this.proposalContractService.createContract(companyId, data);
  }

  @Get('contracts')
  findAllContracts(
    @Headers('x-company-id') companyId: string,
    @Query('status') status?: ContractStatus,
    @Query('customerId') customerId?: string,
    @Query('contractType') contractType?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ): Promise<Contract[]> {
    return this.proposalContractService.findAllContracts(companyId, {
      status,
      customerId,
      contractType,
      fromDate,
      toDate,
    });
  }

  @Get('contracts/expiring')
  getExpiringContracts(
    @Headers('x-company-id') companyId: string,
    @Query('days') days: string,
  ): Promise<Contract[]> {
    return this.proposalContractService.getExpiringContracts(
      companyId,
      parseInt(days, 10) || 30,
    );
  }

  @Get('contracts/:id')
  findContractById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<Contract> {
    return this.proposalContractService.findContractById(companyId, id);
  }

  @Patch('contracts/:id')
  updateContract(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<Contract>,
  ): Promise<Contract> {
    return this.proposalContractService.updateContract(companyId, id, data);
  }

  @Delete('contracts/:id')
  deleteContract(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.proposalContractService.deleteContract(companyId, id);
  }

  // Contract Workflow
  @Post('contracts/:id/submit')
  submitContractForApproval(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<Contract> {
    return this.proposalContractService.submitContractForApproval(companyId, id);
  }

  @Post('contracts/:id/approve')
  approveContract(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() body: { approvedBy: string; notes?: string },
  ): Promise<Contract> {
    return this.proposalContractService.approveContract(
      companyId,
      id,
      body.approvedBy,
      body.notes,
    );
  }

  @Post('contracts/:id/send-for-signature')
  sendContractForSignature(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<Contract> {
    return this.proposalContractService.sendContractForSignature(companyId, id);
  }

  @Post('contracts/:id/sign')
  recordSignature(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() body: { signatoryEmail: string; signatureData: string },
  ): Promise<Contract> {
    return this.proposalContractService.recordSignature(
      companyId,
      id,
      body.signatoryEmail,
      body.signatureData,
    );
  }

  @Post('contracts/:id/activate')
  activateContract(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<Contract> {
    return this.proposalContractService.activateContract(companyId, id);
  }

  @Post('contracts/:id/renew')
  renewContract(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() body: { newEndDate: string; createdBy: string },
  ): Promise<Contract> {
    return this.proposalContractService.renewContract(
      companyId,
      id,
      new Date(body.newEndDate),
      body.createdBy,
    );
  }

  // Contract Templates
  @Post('contract-templates')
  createContractTemplate(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<ContractTemplate>,
  ): Promise<ContractTemplate> {
    return this.proposalContractService.createContractTemplate(companyId, data);
  }

  @Get('contract-templates')
  findAllContractTemplates(
    @Headers('x-company-id') companyId: string,
    @Query('contractType') contractType?: string,
    @Query('isActive') isActive?: string,
  ): Promise<ContractTemplate[]> {
    return this.proposalContractService.findAllContractTemplates(companyId, {
      contractType,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Post('contract-templates/:id/create-contract')
  createContractFromTemplate(
    @Headers('x-company-id') companyId: string,
    @Param('id') templateId: string,
    @Body() data: Partial<Contract>,
  ): Promise<Contract> {
    return this.proposalContractService.createContractFromTemplate(
      companyId,
      templateId,
      data,
    );
  }

  // Contract Clauses Library
  @Post('clauses')
  createClause(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<ContractClause>,
  ): Promise<ContractClause> {
    return this.proposalContractService.createClause(companyId, data);
  }

  @Get('clauses')
  findAllClauses(
    @Headers('x-company-id') companyId: string,
    @Query('category') category?: string,
    @Query('clauseType') clauseType?: string,
    @Query('isActive') isActive?: string,
  ): Promise<ContractClause[]> {
    return this.proposalContractService.findAllClauses(companyId, {
      category,
      clauseType,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Patch('clauses/:id')
  updateClause(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<ContractClause>,
  ): Promise<ContractClause> {
    return this.proposalContractService.updateClause(companyId, id, data);
  }

  @Delete('clauses/:id')
  deleteClause(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.proposalContractService.deleteClause(companyId, id);
  }
}
