import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true); // optional, removes warnings
        const connectionRes = await mongoose.connect(process.env.DATABASE_URL);
        console.log(`MongoDB connected !! DB host ${connectionRes.connection.host}`);
    } catch (error) {
        console.log("Database connection failed:", error);
        process.exit(1);
    }
}

export default connectDB;
