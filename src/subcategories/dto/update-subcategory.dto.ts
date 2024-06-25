import { PartialType } from '@nestjs/mapped-types';
import { CreateSubcategoryDto } from './create-subcategory.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {
    @IsOptional()
    name: string;

    @IsOptional()
    image: string;

    @IsOptional()
    @IsInt()
    // @IsIdExists(Category, { message: 'The provided Category ID does not exist' })
    categoryId: number;
}
