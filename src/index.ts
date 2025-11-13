import express, {Express, Request, Response} from 'express';
import cors from 'cors';
import userRoutes from './routes/user-route';
import postRoutes from './routes/post-route';
import uploadRoutes from './routes/upload-route';
import connectDB from './config/db';
import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();

const port = process.env.PORT || 8080;

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

connectDB(process.env.MONGO_URI || '');
app.use(express.json());
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});
app.use('/api/upload', uploadRoutes);
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/posts',postRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});