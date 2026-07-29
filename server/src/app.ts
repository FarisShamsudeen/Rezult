import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { sendResponse } from './utils/responseHandler';
import { errorHandler } from './middleware/error.middleware';
import { globalLimiter } from './middleware/rateLimiter.middleware';
import rezulterRoutes from './routes/rezulter.routes';
import testRoutes from './routes/test.routes';
import authRoutes from './routes/auth.routes';
import candidateRoutes from './routes/candidate.routes';
import { StatusCode } from './enums';
import { ENDPOINTS } from './constants/endpoints';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Update this to match your frontend URL in production
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Apply Global Rate Limiter to all API routes
app.use(ENDPOINTS.API_BASE, globalLimiter);

// Routes
app.use(`${ENDPOINTS.API_BASE}${ENDPOINTS.REZULTERS.BASE}`, rezulterRoutes);
app.use(`${ENDPOINTS.API_BASE}${ENDPOINTS.TEST.BASE}`, testRoutes);
app.use(`${ENDPOINTS.API_BASE}${ENDPOINTS.AUTH.BASE}`, authRoutes);
app.use(`${ENDPOINTS.API_BASE}${ENDPOINTS.CANDIDATES.BASE}`, candidateRoutes);

// Health check route
app.get(`${ENDPOINTS.API_BASE}${ENDPOINTS.HEALTH}`, (req, res) => {
    sendResponse(res, StatusCode.OK, true, { message: 'Server is healthy' });
});

// Global Error Handler should be the last middleware
app.use(errorHandler);

export default app;
