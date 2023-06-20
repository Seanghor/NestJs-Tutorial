import { PartialType } from '@nestjs/mapped-types';
import { CreateAuditoriumDto } from './create-auditorium.dto';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAuditoriumDto extends PartialType(CreateAuditoriumDto) {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @IsNumber()
    num_seats: number

    @IsNotEmpty()
    @IsBoolean()
    isAvailable: boolean
}
