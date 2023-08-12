import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @IsNotEmpty()
    @ApiProperty()
    username: string;

    @IsNotEmpty()
    @ApiProperty({ minLength: 6, maxLength: 20 })
    password: string;
}
