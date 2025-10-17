import { Injectable } from '@nestjs/common';
import { CreateServiceContractDto } from '../dto/create-service-contract.dto';
import { UpdateServiceContractDto } from '../dto/update-service-contract.dto';
import { ServiceContract, ContractStatus } from '../entities/service-contract.entity';

@Injectable()
export class ServiceContractsService {
  private contracts: ServiceContract[] = [];
  private idCounter = 1;

  create(createServiceContractDto: CreateServiceContractDto): ServiceContract {
    const contract: ServiceContract = {
      id: `CONTRACT-${String(this.idCounter++).padStart(6, '0')}`,
      contractNumber: `AMC-${new Date().getFullYear()}-${String(this.idCounter).padStart(4, '0')}`,
      status: ContractStatus.DRAFT,
      ...createServiceContractDto,
      renewalCount: 0,
      totalBilled: 0,
      totalPaid: 0,
      outstandingAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.contracts.push(contract);
    return contract;
  }

  findAll(filters?: {
    status?: string;
    customerId?: string;
    contractType?: string;
  }): ServiceContract[] {
    let filtered = [...this.contracts];

    if (filters?.status) {
      filtered = filtered.filter((c) => c.status === filters.status);
    }
    if (filters?.customerId) {
      filtered = filtered.filter((c) => c.customerId === filters.customerId);
    }
    if (filters?.contractType) {
      filtered = filtered.filter((c) => c.contractType === filters.contractType);
    }

    return filtered;
  }

  findOne(id: string): ServiceContract | null {
    return this.contracts.find((c) => c.id === id) || null;
  }

  update(
    id: string,
    updateServiceContractDto: UpdateServiceContractDto,
  ): ServiceContract | null {
    const index = this.contracts.findIndex((c) => c.id === id);
    if (index === -1) return null;

    this.contracts[index] = {
      ...this.contracts[index],
      ...updateServiceContractDto,
      updatedAt: new Date(),
    };

    return this.contracts[index];
  }

  renewContract(
    id: string,
    duration: number,
    startDate: Date,
    updatedBy: string,
  ): ServiceContract | null {
    const contract = this.findOne(id);
    if (!contract) return null;

    // Create new contract for renewal
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + duration);

    const renewedContract: ServiceContract = {
      ...contract,
      id: `CONTRACT-${String(this.idCounter++).padStart(6, '0')}`,
      contractNumber: `AMC-${new Date().getFullYear()}-${String(this.idCounter).padStart(4, '0')}`,
      status: ContractStatus.DRAFT,
      startDate,
      endDate,
      duration,
      parentContractId: id,
      renewalCount: contract.renewalCount + 1,
      totalBilled: 0,
      totalPaid: 0,
      outstandingAmount: 0,
      updatedBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Update old contract
    contract.status = ContractStatus.RENEWED;
    contract.renewedToContractId = renewedContract.id;
    contract.updatedBy = updatedBy;
    contract.updatedAt = new Date();

    this.contracts.push(renewedContract);
    return renewedContract;
  }

  activateContract(id: string, updatedBy: string): ServiceContract | null {
    const contract = this.findOne(id);
    if (!contract) return null;

    contract.status = ContractStatus.ACTIVE;
    contract.activationDate = new Date();
    contract.updatedBy = updatedBy;
    contract.updatedAt = new Date();

    return contract;
  }

  suspendContract(
    id: string,
    reason: string,
    updatedBy: string,
  ): ServiceContract | null {
    const contract = this.findOne(id);
    if (!contract) return null;

    contract.status = ContractStatus.SUSPENDED;
    contract.suspensionDate = new Date();
    contract.terminationReason = reason;
    contract.updatedBy = updatedBy;
    contract.updatedAt = new Date();

    return contract;
  }

  terminateContract(
    id: string,
    reason: string,
    updatedBy: string,
  ): ServiceContract | null {
    const contract = this.findOne(id);
    if (!contract) return null;

    contract.status = ContractStatus.TERMINATED;
    contract.terminationDate = new Date();
    contract.terminationReason = reason;
    contract.updatedBy = updatedBy;
    contract.updatedAt = new Date();

    return contract;
  }

  getExpiringContracts(days: number): ServiceContract[] {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.contracts.filter((contract) => {
      return (
        contract.status === ContractStatus.ACTIVE &&
        contract.endDate >= now &&
        contract.endDate <= futureDate
      );
    });
  }

  getStatistics() {
    const total = this.contracts.length;
    const active = this.contracts.filter(
      (c) => c.status === ContractStatus.ACTIVE,
    ).length;
    const expiring30Days = this.getExpiringContracts(30).length;
    const totalValue = this.contracts
      .filter((c) => c.status === ContractStatus.ACTIVE)
      .reduce((sum, c) => sum + c.contractValue, 0);

    return {
      totalContracts: total,
      activeContracts: active,
      expiringIn30Days: expiring30Days,
      totalActiveValue: totalValue,
      renewalRate:
        total > 0
          ? (this.contracts.filter((c) => c.status === ContractStatus.RENEWED)
              .length /
              total) *
            100
          : 0,
    };
  }

  remove(id: string): { message: string } {
    const index = this.contracts.findIndex((c) => c.id === id);
    if (index === -1) {
      return { message: 'Contract not found' };
    }

    this.contracts.splice(index, 1);
    return { message: 'Contract deleted successfully' };
  }
}
