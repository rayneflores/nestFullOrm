import { IsString, MinLength, IsEmail, IsOptional } from "class-validator";

export class CreateUserDto {

    @IsString()
    @MinLength(3)
    @IsOptional()
    name?: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    rol?: string;
}
