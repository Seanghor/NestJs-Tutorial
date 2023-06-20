import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class CreateBookingDto {
  @IsNotEmpty()
  userId: number

  // customId: string

  @IsNotEmpty()
  screeningId: number

  @IsNotEmpty()
  num: number

  @IsNotEmpty()
  price_for_1: number


  total: number

  @IsNotEmpty()
  @IsBoolean()
  payStatus: boolean
  customId: string

}

export class CreateBookingAndTicketDto {
  @IsNotEmpty()
  userId: number

  // customId: string

  @IsNotEmpty()
  screeningId: number

  @IsNotEmpty()
  num: number

  @IsNotEmpty()
  price_for_1: number


  total: number

  @IsNotEmpty()
  @IsBoolean()
  payStatus: boolean
  customId: string

  @IsArray()
  @ArrayNotEmpty()
  selectedSeat: number[];
}