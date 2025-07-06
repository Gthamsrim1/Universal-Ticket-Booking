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

const VendorSchema = new mongoose.Schema({
  email: String,
  user: String,
  password: String,
  id: Number,
  contact: String,
  avatar: String,
});

const VendorModel = mongoose.models.Vendors || mongoose.model("Vendors", VendorSchema);

export default VendorModel;
