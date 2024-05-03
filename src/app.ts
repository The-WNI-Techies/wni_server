import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/", (_req: Request, res: Response) => {
	res.send("Ready for some server-side shit!");
});

mongoose.connect(process.env.MONGO_URI!)
.then(() => {
	app.listen(process.env.PORT, () => {
		console.log(`Listening on port ${process.env.PORT}`);
	});
})
.catch(err => console.error(err));




