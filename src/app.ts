import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
	res.send("Ready for some server-side shit!");
});

app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});
