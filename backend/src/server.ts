import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import apiRouter from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend client
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser configurations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create 'uploads' folder for storage if not present
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded files statically for download/view
app.use('/uploads', express.static(uploadDir));

// Wire api routers
app.use('/api', apiRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled server exception:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "An unexpected error occurred on the server backend."
  });
});

// Boot listener
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🤖 AI STUDY ASSISTANT PLATFORM SERVER ACTIVE  `);
  console.log(`🚀 Port Address: http://localhost:${PORT}      `);
  console.log(`===============================================`);
});

export default app;
