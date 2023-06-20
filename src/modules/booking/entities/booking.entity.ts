import { Booking } from "@prisma/client";

export class BookingEntity implements Booking {
    id: number;
    customId: string;
    userId: number;
    screeningId: number;
    num: number;
    price_for_1: number;
    total: number;
    payStatus: boolean;
    createAt: Date;

    constructor(partial: Partial<BookingEntity>) {
        Object.assign(this, partial);
        this.total = this.num * this.price_for_1
    }
}
