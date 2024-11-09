import express, { NextFunction, Request, Response } from "express";
import DB from "./config/db";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import auth from "./auth/auth.routes";
import user from "./user/user.routes";
import chat from "./chat/chat.routes";
import AuthMiddleware from "./auth/auth.middlewares";
import SwaggerUI from 'swagger-ui-express';
import badge from "./badge/badge.routes";
import swaggerSpec from "./config/swagger";

const app = express();
const PATH = '/api/v1';
const PORT = process.env.PORT || 4000;
const corsOptions: CorsOptions = {
	origin: process.env.CORS_ORIGIN,
	credentials: true,
	exposedHeaders: ['Authorization']
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/docs', SwaggerUI.serve, SwaggerUI.setup(swaggerSpec));
app.use(`${PATH}/auth`, auth);
app.use(`${PATH}/users`, AuthMiddleware.requireAuth, user);
app.use(`${PATH}/badges`, AuthMiddleware.requireAuth, AuthMiddleware.requireVerification, badge);
app.use(`${PATH}/chats`, AuthMiddleware.requireAuth, AuthMiddleware.requireVerification, chat);


app.get("/healthz", (_req: Request, res: Response) => res.json({ active: "Ready for some server-side shit!" }));

app.use("*", (_req: Request, res: Response) => {
	res.status(404).json({ error: "Endpoint not found!" });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(error);
	res.status(500).json({ error: "Internal server  error" });
	next();
})

DB.connect()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Listening on port ${PORT}`);
		});
	})
	.catch(err => console.error(err));