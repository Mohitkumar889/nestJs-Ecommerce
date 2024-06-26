import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class CategoryDto {
    @IsInt()
    @IsNotEmpty()
    id: number;
}

class SubCategoryDto {
    @IsInt()
    @IsNotEmpty()
    id: number;
}

class ImageDto {
    @IsString()
    @IsNotEmpty()
    url: string;
}
export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsInt()
    @IsNotEmpty()
    unit: number;

    @IsInt()
    @IsOptional()
    discount?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    feature?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategoryDto)
    categories: CategoryDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SubCategoryDto)
    subCategories: SubCategoryDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageDto)
    images: ImageDto[];

}
