import mongoose from 'mongoose'

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

const ShowtimesSchema = new mongoose.Schema({
  theater: { type: String, required: true },
  times: { type: [String], required: true }
}, { _id: false })

const PricingTiersSchema = new mongoose.Schema({
  regular: { type: Number, required: true },
  premium: { type: Number, required: true },
  vip: { type: Number, required: true }
}, { _id: false })

const ShowPeriodSchema = new mongoose.Schema({
  from: { type: Date, required: true },
  to: { type: Date, required: true }
}, { _id: false })

const MovieSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  poster_path: { type: String, required: true },
  isNowShowing: { type: Boolean, default: false },
  release: Date,
  genres: [String],
  runtime: String,
  rating: String,
  language: String,
  price: { type: Number, required: true },
  pricingTiers: { type: PricingTiersSchema, required: true },
  showPeriod: { type: ShowPeriodSchema, required: true },
  showtimes: { type: [ShowtimesSchema], default: [] }
}, { timestamps: true })

const MovieModel = mongoose.models.Movie || mongoose.model('Movie', MovieSchema)
export default MovieModel
