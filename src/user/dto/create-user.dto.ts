import { IsNotEmpty, IsString, MinLength } from "class-validator";


export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;
  
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
  
  @IsString()
  @IsNotEmpty()
  name: string;
}