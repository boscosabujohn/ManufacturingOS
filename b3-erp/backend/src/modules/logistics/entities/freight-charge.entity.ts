import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Shipment } from './shipment.entity';

export enum ChargeType {
  BASE_FREIGHT = 'Base Freight',
  FUEL_SURCHARGE = 'Fuel Surcharge',
  HANDLING = 'Handling',
  LOADING = 'Loading',
  UNLOADING = 'Unloading',
  INSURANCE = 'Insurance',
  PACKAGING = 'Packaging',
  DOCUMENTATION = 'Documentation',
  CUSTOMS_CLEARANCE = 'Customs Clearance',
  TOLL = 'Toll',
  PARKING = 'Parking',
  STORAGE = 'Storage',
  DETENTION = 'Detention',
  DEMURRAGE = 'Demurrage',
  SPECIAL_HANDLING = 'Special Handling',
  COD_CHARGES = 'COD Charges',
  RETURN_CHARGES = 'Return Charges',
  WEIGHT_CHARGES = 'Weight Charges',
  DISTANCE_CHARGES = 'Distance Charges',
  VOLUMETRIC_CHARGES = 'Volumetric Charges',
  OTHER = 'Other',
}

export enum CalculationMethod {
  FLAT_RATE = 'Flat Rate',
  PER_KG = 'Per Kg',
  PER_KM = 'Per Km',
  PER_PACKAGE = 'Per Package',
  PER_HOUR = 'Per Hour',
  PER_DAY = 'Per Day',
  PERCENTAGE = 'Percentage',
  SLAB_RATE = 'Slab Rate',
}

export enum TaxType {
  GST = 'GST',
  IGST = 'IGST',
  CGST_SGST = 'CGST+SGST',
  VAT = 'VAT',
  SERVICE_TAX = 'Service Tax',
  NONE = 'None',
}

@Entity('logistics_freight_charges')
export class FreightCharge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Charge Identification
  @Column({ nullable: true })
  shipmentId: string;

  @ManyToOne(() => Shipment, (shipment) => shipment.freightChargeDetails, {
    nullable: true,
  })
  @JoinColumn({ name: 'shipmentId' })
  shipment: Shipment;

  @Column({ nullable: true })
  tripId: string;

  @Column({ nullable: true, length: 100 })
  referenceNumber: string;

  // Charge Details
  @Column({
    type: 'enum',
    enum: ChargeType,
  })
  chargeType: ChargeType;

  @Column({ length: 200 })
  chargeName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: CalculationMethod,
    default: CalculationMethod.FLAT_RATE,
  })
  calculationMethod: CalculationMethod;

  // Calculation Parameters
  @Column({ type: 'decimal', precision: 15, scale: 3, nullable: true })
  quantity: number;

  @Column({ nullable: true, length: 50 })
  unit: string;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  rate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  baseAmount: number;

  // Slab-based Calculation
  @Column({ type: 'json', nullable: true })
  slabRates: Array<{
    fromValue: number;
    toValue: number;
    rate: number;
    flatCharge?: number;
  }>;

  // Discounts
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amountAfterDiscount: number;

  // Tax Information
  @Column({
    type: 'enum',
    enum: TaxType,
    default: TaxType.GST,
  })
  taxType: TaxType;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  cgstPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  cgstAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  sgstPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  sgstAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  igstPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  igstAmount: number;

  // Total Amount
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ length: 10, default: 'INR' })
  currency: string;

  // Payment Information
  @Column({ nullable: true, length: 100 })
  payableBy: string; // Shipper, Consignee, Third Party

  @Column({ nullable: true })
  payerId: string;

  @Column({ nullable: true, length: 200 })
  payerName: string;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ type: 'date', nullable: true })
  paymentDueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ nullable: true, length: 100 })
  paymentReferenceNumber: string;

  // Service Provider
  @Column({ nullable: true })
  serviceProviderId: string;

  @Column({ nullable: true, length: 200 })
  serviceProviderName: string;

  @Column({ nullable: true })
  transportCompanyId: string;

  @Column({ nullable: true, length: 200 })
  transportCompanyName: string;

  // Billing Information
  @Column({ nullable: true })
  invoiceId: string;

  @Column({ nullable: true, length: 100 })
  invoiceNumber: string;

  @Column({ type: 'date', nullable: true })
  invoiceDate: Date;

  @Column({ nullable: true, length: 100 })
  billingDocumentNumber: string;

  // Auto-calculation
  @Column({ default: false })
  isAutoCalculated: boolean;

  @Column({ default: true })
  isApplicable: boolean;

  @Column({ default: false })
  isMandatory: boolean;

  @Column({ default: true })
  isEditable: boolean;

  // Conditions
  @Column({ type: 'json', nullable: true })
  applicabilityConditions: Record<string, any>;

  @Column({ nullable: true, length: 200 })
  appliedOn: string; // Weight, Distance, Volume, Packages

  @Column({ type: 'decimal', precision: 15, scale: 3, nullable: true })
  minimumCharge: number;

  @Column({ type: 'decimal', precision: 15, scale: 3, nullable: true })
  maximumCharge: number;

  // Approval
  @Column({ default: false })
  requiresApproval: boolean;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true, length: 100 })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  // Additional Information
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
