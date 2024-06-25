import { IsEmpty, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsCustomEmail } from "src/common/validations/common-validations";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsOptional()
    lastName: string;

    @IsInt()
    age: number;

    @IsNotEmpty()
    @IsString()
    @IsCustomEmail({ message: 'Email is not valid' })
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
