import mongoose, { Mongoose } from "mongoose";

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
        console.log("MongDB Connected!");
    } catch {
        console.log("Connection Failed!")
    }
}

await connectDB();

const BookingsSchema = new mongoose.Schema({
    user: String,
    email: String,
    seats: [String],
    bookingTime: String,
    bookingDate: Date,
    experience: String,
    experienceType: String,
    date: Date,
    time: String,
    price: Number,
})

const BookingsModel = mongoose.models.Bookings || mongoose.model("Bookings", BookingsSchema);

export default BookingsModel;