import { NextResponse } from "next/server";
import BookingsModel from "../(models)/Bookings";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, ...booking } = body;
        if (type == 'booking') {
            const newBooking = await BookingsModel.create(booking);
            console.log(newBooking);
            return NextResponse.json({ message: "Booking Updated" })
        } else if (type == 'cancel') {
            const removedBooking = await BookingsModel.deleteOne(booking);
            return NextResponse.json({ message: 'Successfully deleted' })
        } else if (type == 'list') {
            const existingBookings = await BookingsModel.find(booking);
            return NextResponse.json({ bookings: existingBookings });
        }
        return NextResponse.json({ message: "The given type doesn't exist" }, { status: 201 })
    } catch (error) {
        return NextResponse.json({error})
    }
}