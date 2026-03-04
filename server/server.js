import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import profileRoutes from "./routes/profileRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import certificationRoutes from "./routes/certificationRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
// temporary debug - remove after fix
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("CLIENT_URL:", process.env.CLIENT_URL);
// Connect to MongoDB
connectDB();

// make sure upload folders exist right away (helps when starting server
// from a different working directory or before any file has been saved)
import fs from "fs";
import path from "path";
fs.mkdirSync(path.join(process.cwd(), "uploads/avatars"), { recursive: true });
fs.mkdirSync(path.join(process.cwd(), "uploads/resumes"), { recursive: true });

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded avatars/resumes so URLs stored in Mongo will resolve
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// also expose under /api/uploads so links generated with an API base that
// includes "/api" still work.  this avoids 404s when REACT_APP_API_URL ends
// with "/api" (the common case during development).
app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/profile", profileRoutes);
app.use("/api/profile", experienceRoutes);
app.use("/api/profile", educationRoutes);
app.use("/api/profile", skillRoutes);
app.use("/api/profile", certificationRoutes);

// Health check
app.get("/", (req, res) => res.json({ message: "Gidy Profile API is running" }));

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));