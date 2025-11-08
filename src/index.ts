import express, {Express, Request, Response} from 'express';
import connectDB from './config/db';
import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();

const port = process.env.PORT || 8080;

connectDB(process.env.MONGO_URI || '');
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});