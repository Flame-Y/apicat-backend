import { Injectable, Logger } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PermissionService {
    private logger = new Logger();
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>;
    async findByUser(user: User): Promise<Permission[]> {
        try {
            const perms = await this.permissionRepository.findBy({
                uid: user.id
            });
            return perms;
        } catch (e) {
            this.logger.log(e);
        }
    }
}
