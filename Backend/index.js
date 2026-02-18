import express from "express";
import connectDB from "./src/DataBase/DBconnect.js";
import dotenv from "dotenv";
import routes from "./src/router/userRoute.js";

dotenv.config();

const app = express(); // already added

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Connect to DB
connectDB();

const PORT = process.env.PORT || 8000;

// Test route to check server
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});


app.listen(PORT, () => { 
    console.log(`Server running on port ${PORT}`);
});

import aiRoutes from "./routes/aiRoutes.js";

app.use("/api/ai", aiRoutes);
