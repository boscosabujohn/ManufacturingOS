export class Interaction {
  id: string;
  type: string;
  customer?: string;
  contactPerson?: string;
  subject: string;
  description?: string;
  outcome?: string;
  duration?: string;
  location?: string;
  performedBy?: string;
  dateTime: Date;
  followUpRequired?: boolean;
  followUpDate?: Date;
  assignedTo?: string;
  tags?: string[];
  relatedOpportunity?: string;
  relatedOrder?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
