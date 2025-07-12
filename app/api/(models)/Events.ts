import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGODB_URI!);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

await connectDB();

const EventSchema = new mongoose.Schema({
  _id: Number,
  active: Boolean,
  title: { type: String, required: true },
  backdrop_path: String,
  poster_path: String,
  artist: String,
  description: String,
  venue: String,
  date: { type: Date, required: true },
  time: { type: String, required: true },
  eventType: String,
  price: Number,
  availableSeats: Number,
  maxSeats: Number,
}, { timestamps: true });

const EventModel = mongoose.models.Events || mongoose.model("Events", EventSchema);

export default EventModel;
