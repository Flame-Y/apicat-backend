import { Injectable } from '@nestjs/common';
import { CreateApiArgDto } from './dto/create-api-arg.dto';
import { UpdateApiArgDto } from './dto/update-api-arg.dto';

@Injectable()
export class ApiArgsService {
    create(createApiArgDto: CreateApiArgDto) {
        return 'This action adds a new apiArg';
    }

    findAll() {
        return `This action returns all apiArgs`;
    }

    findOne(id: number) {
        return `This action returns a #${id} apiArg`;
    }

    update(id: number, updateApiArgDto: UpdateApiArgDto) {
        return `This action updates a #${id} apiArg`;
    }

    remove(id: number) {
        return `This action removes a #${id} apiArg`;
    }
}
