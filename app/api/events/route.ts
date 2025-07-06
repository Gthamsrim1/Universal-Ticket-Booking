import { NextResponse } from "next/server";
import EventModel from "../(models)/Events";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, active, ...event} = body;

    if (type === 'add') {
      const requiredFields = ['title', 'date', 'time'];
      for (const field of requiredFields) {
        if (!event[field]) {
          return NextResponse.json({ message: `Missing required field: ${field}` }, { status: 400 });
        } 
      }

      const count = await EventModel.countDocuments();
      const existingEvent = await EventModel.findOne({title: event.title, artist: event.artist});

      if (existingEvent) {
        const updated = await EventModel.findOneAndUpdate({title: event.title, artist: event.artist}, {...event, active}, { new: true });
        return NextResponse.json({ message: "Event updated"});
      } else {
        const newEvent = await EventModel.create({...event, _id: count + 1, active, availableSeats: event.seats, venue: event.location});
        return NextResponse.json({ message: "Event created", event: newEvent }, { status: 201 });
      }
    } else if (type == "list") {
      const events = await EventModel.find({});
      return NextResponse.json({ events })
    } else if (type == "list-active") {
      const events = await EventModel.find({active: true});
      return NextResponse.json({ events })
    } else if (type == 'remove') {
      const deletedEvent = EventModel.deleteOne({_id: event._id})
      return NextResponse.json({message: "Event successfully deleted"});
    }
    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
