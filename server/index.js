import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import indexRouter from './routers/index.router.js';
import { errorMiddleware } from "./middlewares/error.middleware.js";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(cookieParser());
app.use(morgan('tiny'));

app.use('/api', indexRouter);

app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('Database running')
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        });
    } catch (e) {
        console.log('Error: ', e)
    }
}

start();
