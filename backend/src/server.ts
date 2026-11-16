import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { authRouter } from './routes/auth.routes.js';
import { dashboardRouter } from './routes/dashboard.routes.js';
import { settingsRouter } from './routes/settings.routes.js';
import { uploadRouter } from './routes/upload.routes.js';
import { crudRouter } from './routes/crud.routes.js';
import { publicRouter } from './routes/public.routes.js';
import { UPLOADS_ROOT, ensureUploadDirsExist } from './services/storage.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

// Ensure uploads folder and subdirectories exist
ensureUploadDirsExist();

// Middlewares
app.use(
  cors({
    origin: [CLIENT_ORIGIN, 'http://127.0.0.1:3000'],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static local uploads directory (outside Next.js build tree for persistent VPS storage)
app.use(
  '/uploads',
  express.static(UPLOADS_ROOT, {
    maxAge: '30d',
    etag: true,
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  })
);

// Fallback to legacy frontend public uploads if exists
const legacyUploadsDir = path.resolve(process.cwd(), '../frontend/public/uploads');
if (fs.existsSync(legacyUploadsDir)) {
  app.use('/uploads', express.static(legacyUploadsDir));
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Byju Spark Salon Admin API', timestamp: new Date() });
});

// Admin REST API Routes
app.use('/api/admin', authRouter);
app.use('/api/admin/dashboard', dashboardRouter);
app.use('/api/admin/settings', settingsRouter);
app.use('/api/admin/uploads', uploadRouter);
app.use('/api/admin', crudRouter);

// Public REST API Routes (Published Content)
app.use('/api', publicRouter);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 [Express] Spark Admin API running at http://localhost:${PORT}`);
    console.log(`📁 [Storage] Dedicated local uploads directory: ${UPLOADS_ROOT}`);
  });
}

start();
