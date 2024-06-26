import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
    @IsInt()
    @IsNotEmpty()
    quantity: number;
}
