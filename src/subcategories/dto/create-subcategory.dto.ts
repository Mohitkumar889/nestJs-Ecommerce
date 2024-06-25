import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Category } from "src/categories/entities/category.entity";
import { IsIdExists } from "src/common/validations/common-validations";

export class CreateSubcategoryDto {
    @IsString()
    name: string;

    @IsOptional()
    image: string;

    @IsNotEmpty()
    @IsInt()
    // @IsIdExists(Category, { message: 'The provided Category ID does not exist' })
    categoryId: number;
}
