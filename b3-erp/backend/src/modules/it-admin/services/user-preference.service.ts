import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreference } from '../entities/user-preference.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class UserPreferenceService {
    constructor(
        @InjectRepository(UserPreference)
        private readonly preferenceRepository: Repository<UserPreference>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findByUserId(userId: string): Promise<UserPreference> {
        const preference = await this.preferenceRepository.findOne({
            where: { userId },
        });

        if (!preference) {
            // Create default if not exists
            const newPreference = this.preferenceRepository.create({
                userId,
            });
            return this.preferenceRepository.save(newPreference);
        }

        return preference;
    }

    async update(userId: string, updateData: Partial<UserPreference>): Promise<UserPreference> {
        let preference = await this.preferenceRepository.findOne({
            where: { userId },
        });

        if (!preference) {
            preference = this.preferenceRepository.create({
                userId,
                ...updateData,
            });
        } else {
            Object.assign(preference, updateData);
        }

        return this.preferenceRepository.save(preference);
    }
}
