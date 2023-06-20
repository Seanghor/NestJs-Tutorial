import { IsNotEmpty, isNotEmpty } from "class-validator";

export class CreateCampusDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    address: string

    @IsNotEmpty()
    phone:string


}
