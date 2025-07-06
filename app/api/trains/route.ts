import { NextResponse } from "next/server";
import TrainModel from "../(models)/Trains";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { from, to, date } = body;

    if (!from || !to || !date) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const travelDate = new Date(date);
    const dayOfWeek = travelDate.toLocaleString('en-US', { weekday: 'short' });

    const trains = await TrainModel.find({
      start: from,
      destination: to,
      daysOfOperation: dayOfWeek,
    });

    return NextResponse.json({ trains }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}
