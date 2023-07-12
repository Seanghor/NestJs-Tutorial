import { IsNotEmpty } from "class-validator";

export class CreateCampusDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    address: string

    @IsNotEmpty()
    phone:string


}
