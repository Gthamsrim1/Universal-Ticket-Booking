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

const TrainSchema = new mongoose.Schema({
  trainNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  start: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: String, required: true }, // use "HH:mm" format
  arrivalTime: { type: String, required: true },
  daysOfOperation: {
    type: [String],
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    required: true,
  },
  classes: {
    Sleeper: {
      price: { type: Number, required: true },
      totalSeats: { type: Number, required: true },
      availableSeats: { type: Number, required: true },
    },
    AC3: {
      price: { type: Number, required: true },
      totalSeats: { type: Number, required: true },
      availableSeats: { type: Number, required: true },
    },
    General: {
      price: { type: Number, required: true },
      totalSeats: { type: Number, required: true },
      availableSeats: { type: Number, required: true },
    },
  },
  stops: [
    {
      station: { type: String },
      arrivalTime: String,
      departureTime: String,
    },
  ],
  distance: Number,
  status: {
    type: String,
    enum: ['running', 'delayed', 'cancelled'],
    default: 'running',
  },
}, { timestamps: true });


const TrainModel = mongoose.models.Trains || mongoose.model("Trains", TrainSchema);

export default TrainModel;
