import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TaxType {
  GST = 'GST',
  CGST = 'CGST',
  SGST = 'SGST',
  IGST = 'IGST',
  CESS = 'CESS',
  TDS = 'TDS',
  TCS = 'TCS',
  VAT = 'VAT',
  SERVICE_TAX = 'Service Tax',
  CUSTOMS_DUTY = 'Customs Duty',
}

export enum TaxCategory {
  INPUT_TAX = 'Input Tax',
  OUTPUT_TAX = 'Output Tax',
  WITHHOLDING_TAX = 'Withholding Tax',
  COLLECTED_TAX = 'Collected Tax',
}

@Entity('tax_masters')
export class TaxMaster {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  taxCode: string;

  @Column({ length: 255 })
  taxName: string;

  @Column({
    type: 'enum',
    enum: TaxType,
  })
  taxType: TaxType;

  @Column({
    type: 'enum',
    enum: TaxCategory,
  })
  taxCategory: TaxCategory;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  taxRate: number;

  @Column({ type: 'date' })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true })
  effectiveTo: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  // GL Account mapping
  @Column({ nullable: true })
  taxPayableAccountId: string;

  @Column({ nullable: true })
  taxReceivableAccountId: string;

  @Column({ nullable: true })
  taxExpenseAccountId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('gst_transactions')
export class GSTTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  transactionNumber: string;

  @Column({ type: 'date' })
  transactionDate: Date;

  @Column({ length: 50 })
  transactionType: string; // Sales, Purchase, Sales Return, Purchase Return

  // Party details
  @Column()
  partyId: string;

  @Column({ length: 255 })
  partyName: string;

  @Column({ length: 50 })
  partyGSTIN: string;

  @Column({ length: 100 })
  partyState: string;

  // Invoice details
  @Column({ nullable: true })
  invoiceId: string;

  @Column({ nullable: true, length: 50 })
  invoiceNumber: string;

  // Amounts
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  taxableAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  cgstAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  sgstAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  igstAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  cessAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalTaxAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  // Tax rates
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  gstRate: number;

  // Place of supply
  @Column({ length: 100 })
  placeOfSupply: string;

  @Column({ default: false })
  isInterstate: boolean;

  @Column({ default: false })
  isReverseCharge: boolean;

  // HSN/SAC Code
  @Column({ nullable: true, length: 20 })
  hsnSacCode: string;

  // Filing details
  @Column({ nullable: true })
  gstrPeriodId: string;

  @Column({ default: false })
  isFiledInGSTR: boolean;

  @Column({ type: 'date', nullable: true })
  filedDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('tds_transactions')
export class TDSTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  tdsNumber: string;

  @Column({ type: 'date' })
  transactionDate: Date;

  @Column({ type: 'date' })
  deductionDate: Date;

  // Party (Deductee) details
  @Column()
  partyId: string;

  @Column({ length: 255 })
  partyName: string;

  @Column({ length: 50 })
  partyPAN: string;

  @Column({ length: 100 })
  partyType: string; // Vendor, Contractor, Professional, etc.

  // Payment details
  @Column({ nullable: true })
  paymentId: string;

  @Column({ nullable: true, length: 50 })
  paymentNumber: string;

  // TDS details
  @Column({ length: 50 })
  tdsSection: string; // 194C, 194J, etc.

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  grossAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  tdsRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  tdsAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  netPayableAmount: number;

  // Surcharge and cess
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  surcharge: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  educationCess: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalTDSAmount: number;

  // Certificate details
  @Column({ nullable: true, length: 100 })
  certificateNumber: string;

  @Column({ type: 'date', nullable: true })
  certificateDate: Date;

  @Column({ default: false })
  certificateIssued: boolean;

  // Quarterly filing
  @Column({ type: 'int' })
  financialYear: number;

  @Column({ type: 'int' })
  quarter: number; // 1, 2, 3, 4

  @Column({ default: false })
  isFiledInReturn: boolean;

  @Column({ type: 'date', nullable: true })
  filedDate: Date;

  // Challan details
  @Column({ nullable: true, length: 100 })
  challanNumber: string;

  @Column({ type: 'date', nullable: true })
  challanDate: Date;

  @Column({ nullable: true, length: 50 })
  bsrCode: string;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ type: 'date', nullable: true })
  paidDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('gstr_periods')
export class GSTRPeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  periodCode: string; // e.g., "GSTR-2024-04"

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ length: 20 })
  returnType: string; // GSTR-1, GSTR-2, GSTR-3B, etc.

  @Column({ type: 'date' })
  periodStartDate: Date;

  @Column({ type: 'date' })
  periodEndDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ default: 'Open', length: 50 })
  status: string; // Open, Filed, Closed

  @Column({ default: false })
  isFiled: boolean;

  @Column({ type: 'date', nullable: true })
  filedDate: Date;

  @Column({ nullable: true, length: 100 })
  acknowledgementNumber: string;

  // Summary
  @Column({ type: 'json', nullable: true })
  summary: {
    totalSales: number;
    totalPurchases: number;
    outputTax: number;
    inputTax: number;
    netTaxPayable: number;
  };

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
