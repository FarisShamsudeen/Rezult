import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { sendResponse } from './utils/responseHandler';
import { errorHandler } from './middleware/error.middleware';
import rezulterRoutes from './routes/rezulter.routes';
import testRoutes from './routes/test.routes';
import authRoutes from './routes/auth.routes';
import candidateRoutes from './routes/candidate.routes';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Update this to match your frontend URL in production
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/rezulters', rezulterRoutes);
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    sendResponse(res, 200, true, { message: 'Server is healthy' });
});

// Global Error Handler should be the last middleware
app.use(errorHandler);

export default app;
