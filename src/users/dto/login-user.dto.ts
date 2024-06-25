import { IsNotEmpty, IsString } from "class-validator";
import { IsCustomEmail } from "src/common/validations/common-validations";

export class LoginUserDto {
    @IsNotEmpty()
    @IsString()
    @IsCustomEmail({ message: 'Email is not valid' })
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
