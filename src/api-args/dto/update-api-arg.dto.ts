import { PartialType } from '@nestjs/swagger';
import { CreateApiArgDto } from './create-api-arg.dto';

export class UpdateApiArgDto extends PartialType(CreateApiArgDto) {}
