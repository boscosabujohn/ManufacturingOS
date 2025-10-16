import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { Interaction } from './entities/interaction.entity';

@Injectable()
export class InteractionsService {
  private interactions: Map<string, Interaction> = new Map();
  private idCounter = 1;

  create(createInteractionDto: CreateInteractionDto): Interaction {
    const id = String(this.idCounter++);
    const interaction: Interaction = {
      id,
      ...createInteractionDto,
      dateTime: createInteractionDto.dateTime ? new Date(createInteractionDto.dateTime) : new Date(),
      followUpDate: createInteractionDto.followUpDate ? new Date(createInteractionDto.followUpDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.interactions.set(id, interaction);
    console.log(`[CRM] Interaction logged: ${interaction.type} - ${interaction.subject}`);

    return interaction;
  }

  findAll(): Interaction[] {
    return Array.from(this.interactions.values()).sort(
      (a, b) => b.dateTime.getTime() - a.dateTime.getTime()
    );
  }

  findOne(id: string): Interaction {
    const interaction = this.interactions.get(id);
    if (!interaction) {
      throw new NotFoundException(`Interaction with ID ${id} not found`);
    }
    return interaction;
  }

  update(id: string, updateInteractionDto: UpdateInteractionDto): Interaction {
    const interaction = this.findOne(id);

    const updatedInteraction: Interaction = {
      ...interaction,
      ...updateInteractionDto,
      dateTime: updateInteractionDto.dateTime ? new Date(updateInteractionDto.dateTime) : interaction.dateTime,
      followUpDate: updateInteractionDto.followUpDate ? new Date(updateInteractionDto.followUpDate) : interaction.followUpDate,
      updatedAt: new Date(),
    };

    this.interactions.set(id, updatedInteraction);
    return updatedInteraction;
  }

  remove(id: string): void {
    const interaction = this.findOne(id);
    this.interactions.delete(id);
  }

  // Automatic page visit logging
  logPageVisit(userId: string, pageUrl: string, metadata?: Record<string, any>): Interaction {
    const pageVisitData: CreateInteractionDto = {
      type: 'page_visit' as any,
      subject: `Page visit: ${pageUrl}`,
      description: `User visited ${pageUrl}`,
      userId,
      dateTime: new Date().toISOString(),
      metadata: {
        ...metadata,
        pageUrl,
        timestamp: new Date().toISOString(),
      },
    };

    return this.create(pageVisitData);
  }

  // Get statistics
  getStatistics() {
    const allInteractions = this.findAll();
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: allInteractions.length,
      thisWeek: allInteractions.filter(i => new Date(i.dateTime) >= oneWeekAgo).length,
      calls: allInteractions.filter(i => i.type === 'call').length,
      meetings: allInteractions.filter(i => i.type === 'meeting').length,
      pageVisits: allInteractions.filter(i => i.type === 'page_visit').length,
      byType: this.getCountByType(allInteractions),
      byOutcome: this.getCountByOutcome(allInteractions),
    };
  }

  private getCountByType(interactions: Interaction[]) {
    const counts: Record<string, number> = {};
    interactions.forEach(i => {
      counts[i.type] = (counts[i.type] || 0) + 1;
    });
    return counts;
  }

  private getCountByOutcome(interactions: Interaction[]) {
    const counts: Record<string, number> = {};
    interactions.forEach(i => {
      if (i.outcome) {
        counts[i.outcome] = (counts[i.outcome] || 0) + 1;
      }
    });
    return counts;
  }
}
