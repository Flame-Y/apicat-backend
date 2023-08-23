import { PartialType } from '@nestjs/swagger';
import { CreateApiResponseDto } from './create-api-response.dto';

export class UpdateApiResponseDto extends PartialType(CreateApiResponseDto) {}
