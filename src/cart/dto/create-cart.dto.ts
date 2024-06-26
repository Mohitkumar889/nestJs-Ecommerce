import { IsInt, IsNotEmpty } from "class-validator";

export class CreateCartDto {
    @IsNotEmpty()
    @IsInt()
    productId: number;

    @IsInt()
    @IsNotEmpty()
    quantity: number;
}
