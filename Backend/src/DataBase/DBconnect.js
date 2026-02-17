import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connnectionRes = await mongoose.connect(`${process.env.DATABASE_URL}`);
        console.log(`MongoDB connected !! DB host ${connnectionRes.connection.host}`);

    } catch (error) {
        console.log("DataBase connection failed error: ", error);
        process.exit(1);
    }
}

export default connectDB;