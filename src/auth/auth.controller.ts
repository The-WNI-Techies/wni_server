import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { CookieOptions, Request, Response } from "express";
import User from "../user/user.model";
import userValidationSchema from "../validation/userValidation";
import { compare, hash } from "bcryptjs";
import shortUUID from "short-uuid";
import { ResetPasswordToken } from "./auth.model";
import EmailService from "../emails/email.service";
import { tokens } from "../config/constants";

class AuthController {
	/**
	 * Creates a jwt token using the user's id as the payload
	 * @param secret_key - secret used to sign the token
	 * @param expiresIn - The expiry date of the token in seconds
	 * @return A signed JWT token
	 */
	private static createToken(payload: Types.ObjectId, secret_key: string, expiresIn: number) {

		return jwt.sign({ id: payload }, secret_key, { expiresIn });
	}

	private static generateOTP() {
		return crypto
			.randomUUID()
			.split("-")
			.map((token) => {
				if (typeof token[0] === "string") return token[0].toUpperCase();
				return token[0];
			})
			.join("-");
	}

	static async signUp(req: Request, res: Response) {
		let { username, email, password } = req.body;
		username = username.trim(), password = password.trim();
		if (!username || !email || !password) {
			return res.status(404).json("Username, email and password are required parameters!");
		}

		try {
			const { error } = userValidationSchema.validate({
				username,
				email,
				password,
			});
			if (error)
				return res.status(422).json({ error: error.details[0].message }); // Return 422 for invalid requests

			const usernameTaken = await User.exists({ username });
			const mailTaken = await User.exists({ email });
			if (usernameTaken || mailTaken) {
				return res.status(400).json({ error: `${usernameTaken ? 'Username' : 'Email'} taken!` });
			}

			const user = new User({ username, email, password });
			user.password = await hash(password, 10);
			user.short_id = shortUUID.generate();
			user.save();

			res.status(201).json(
				{
					success: "User created successfully",
					short_id: user.short_id,
				});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Internal server error!" });
		}
	}

	static async signIn(req: Request, res: Response) {
		const { username, email, password } = req.body;
		if ((!username && !email) || !password)
			return res.status(400).json({ error: "Username or Email and password are required!" });
		try {
			const user = await User.findOne(email ? { email } : { username });
			if (!user) {
				return res.status(401).json({ error: `Invalid ${username ? "username" : "email"} or password!` });
			}

			const passwordMatch = await compare(password, user.password);
			if (!passwordMatch)
				return res.status(401).json(
					{
						error: `Invalid ${username ? "username" : "email"} or password!`,
					});
			res.setHeader(
				"Authorization",
				`Bearer ${AuthController.createToken(
					user._id,
					tokens.ACCESS_SECRET,
					tokens.ACCESS_TOKEN_EXPIRES

				)}`
			);
			const cookieOpts: CookieOptions = {
				maxAge: tokens.REFRESH_COOKIE_EXPIRES,
				httpOnly: true,
				secure: process.env.NODE_ENV === 'PRODUCTION' ? true : false
			};
			res.cookie('refresh', AuthController.createToken(user._id,
				tokens.REFRESH_SECRET,
				tokens.REFRESH_TOKEN_EXPIRES
			), cookieOpts)
			return res.status(200).json({ success: "User sign-in successful" });
		} catch (error) {
			console.error(error);
			return res.status(500).json("Internal server error!");
		}
	}

	static async sendVerificationToken(req: Request, res: Response) {
		const { userID } = req.params;
		const { email } = req.body;

		if (!email) return res.status(400).json({ error: "Email required!" });
		try {
			const user = await User.findOne({ email });
			if (!user) return res.status(404).json({ error: "No user found for that email!" });

			if (userID !== user.short_id)
				return res.status(401).json({ error: "Unauthorized!" });
			if (user.verified)
				return res
					.status(400)
					.json({ error: "User has already been verified!" });

			const verificationToken = AuthController.generateOTP();

			user.vToken = verificationToken;
			user.save();
			await EmailService.sendVerificationEmail(
				user.email,
				user.username,
				user.vToken
			);
			return res.status(200).json({ success: "Check your mail for verification token" });

		} catch (error) {

			switch ((error as Error).name) {
				case "DNSException":
					return res.status(500).json({ error: "Error sending verification email" });
				default:
					console.log(error);
					break;
			}

			return res.status(500).json({ error: "Internal server error!" });
		}
	}

	static async verifyUser(req: Request, res: Response) {
		const { vToken } = req.body;
		const { userID } = req.params;

		try {
			const user = await User.findOne({ short_id: userID });
			if (!user) return res.status(404).json({ error: "User not found!" });
			if (vToken !== user.vToken) {
				return res.status(401).json({ error: "Invalid verification token!" });
			}
			if (user.verified) {
				return res.status(400).json({ error: "User has already been verified!" });
			}

			user.verified = true;
			user.save();

			res.setHeader(
				"Authorization",
				`Bearer ${AuthController.createToken(user._id,
					tokens.ACCESS_SECRET,
					tokens.ACCESS_TOKEN_EXPIRES
				)}`
			);
			res.cookie('refresh',
				AuthController.createToken(user._id, tokens.REFRESH_SECRET, tokens.REFRESH_TOKEN_EXPIRES),
				{
					maxAge: tokens.REFRESH_COOKIE_EXPIRES
				}
			)
			return res.status(200).json({
					success: "User verified successfully",
					verified: user.verified,
				});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Internal server error!" });
		}
	}

	static async generatePasswordResetToken(req: Request, res: Response) {
		const { userID } = req.params;
		const { email } = req.body;

		try {
			if (!userID || !email)
				return res.status(422).json({ error: "Malformed request" });

			const user = await User.findOne({ email });
			if (!user) return res.status(404).json({ error: "User not found" });
			if (userID !== user.short_id) {
				return res.status(401).json({ error: "Unauthorized!" });
			}

			// Delete old tokens anytime there is a newly generated token if any to avoid duplicate error
			const oldToken = await ResetPasswordToken.exists({ user: user._id });
			if (oldToken) {
				const deletedToken = await ResetPasswordToken.findOneAndDelete({
					user: user._id,
				});
				if (!deletedToken)
					return res.status(500).json({ error: "Error in generating reset token. Please try again" });
			}

			const userTokenStore = await ResetPasswordToken.create({
				user: user._id,
				token: AuthController.generateOTP(),
			});
			userTokenStore.save();

			//!Send token to user mail
			EmailService.sendPasswordResetToken(
				user.email,
				user.username,
				userTokenStore.token
			);
			return res.status(200)
				.json({
					success: "ResetPassword Token has been created",
					short_id: user.short_id,
				});
		} catch (error) {
			switch ((error as Error).name) {
				case "TokenExpiredError":
					return res.status(403).json({ error: "Auth session Expired!" });
				default:
					console.error(error);
					break;
			}
			return res.status(500).json({ error: "Internal server error!" });
		}

	}

	static async resetPassword(req: Request, res: Response) {
		const { password, resetToken } = req.body;
		try {
			if (!password || !resetToken) return res.status(422).json({ error: "Malformed request!" });
			const passwordTokenStore = await ResetPasswordToken.findOne({
				token: resetToken,
			});
			if (!passwordTokenStore)
				return res.status(401).json({ error: "Password token not found!" });
			if (passwordTokenStore.expires.valueOf() < Date.now().valueOf()) {
				await ResetPasswordToken.findOneAndDelete({ token: resetToken });
				return res.status(400).json({ error: "Token has expired :(" });
			}
			const user = await User.findById(passwordTokenStore.user);
			if (!user) return res.status(404).json({ error: "User not found!" });

			const { error } = userValidationSchema.validate({
				username: user.username,
				email: user.email,
				password,
			});
			if (error)
				return res.status(400).json({ error: error.details[0].message });

			// !TODO: Make password reset atomic
			user.password = await hash(password, 10);
			// Delete reset tokens for the user before you save
			const deletedToken = await ResetPasswordToken.findOneAndDelete({
				token: resetToken,
			});
			if (!deletedToken)
				return res.status(400).json({ error: "Couldn't update your password" });
			user.save();

			return res.status(200).json({ success: "Password reset successful! " });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Internal server error!" });
		}
	}

	static async refreshAccessToken(req: Request, res: Response) {
		try {
			const refreshToken = req.cookies?.['refresh'];
			if (!refreshToken) {
				return res.status(401).json({ error: 'Unauthorized!' })
			}
			const decodedToken = jwt.verify(refreshToken, tokens.REFRESH_SECRET);
			if (!decodedToken) return res.status(403).json({ error: 'Unauthorized' });

			const userID = (decodedToken as any).id as Types.ObjectId;
			const user = await User.findById(userID);

			if (!user) {
				return res.status(404).json({ error: 'User not found!' });
			}
			res.setHeader('Authorization',
				`Bearer ${AuthController.createToken(
					userID,
					tokens.ACCESS_SECRET,
					tokens.ACCESS_TOKEN_EXPIRES)
				}`
			);
			return res.status(200).json({ success: 'Token refresh successful' })
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal server errror!' });
		}
	}

	static async logout(_req: Request, res: Response) {
		try {
			res.clearCookie("refresh");
			return res.status(200).json({ success: "User logged out successfully!"});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal server errror!' });

		}
		
	}
}

export default AuthController;