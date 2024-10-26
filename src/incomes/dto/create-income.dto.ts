import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

//income dto    
export class CreateIncomeDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;
}