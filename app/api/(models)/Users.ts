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

const UserSchema = new mongoose.Schema({
  email: String,
  user: String,
  password: String,
  id: Number,
  contact: String,
  avatar: String,
});

const UserModel = mongoose.models.Users || mongoose.model("Users", UserSchema);

export default UserModel;
