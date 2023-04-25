import GoogleStategy from "passport-google-oauth2";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();
//@ts-ignore
const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID;
//@ts-ignore
const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_ID;
passport.use(
	new GoogleStategy.Strategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: "http://localhost:3000/auth/google/callback",
			passReqToCallback: true,
		},
		//@ts-ignore
		function (request, accessToken, refreshToken, profile, done) {}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});
