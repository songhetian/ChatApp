import { URL } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import authRouter from './src/routes/auth.route.js';
import messageRouter from './src/routes/message.route.js';
import connectDB from './src/lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Socket } from 'socket.io';
dotenv.config();
const app = express();

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true
	})
);
app.use(express.json({ limit: '30mb' }));
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);

app.listen(process.env.PORT, () => {
	console.log('连接成功');
	connectDB();
});
