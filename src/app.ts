import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import { requireAuth } from "./middlewares/authMiddleware";

const app = express();

mongoose.connect(process.env.MONGO_URI!)
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log(`Listening on port ${process.env.PORT}`);
		});
	})
	.catch(err => console.error(err));

// const corsOptions = {}
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/auth", authRoutes);
app.get("/", requireAuth, (_req: Request, res: Response) => {
	res.send("Ready for some server-side shit!");
});


