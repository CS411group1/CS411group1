import GoogleStategy from "passport-google-oauth2";
import passport from "passport";
import dotenv from "dotenv";
import { firestore } from "./firebase";
import {
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	where,
} from "firebase/firestore";

dotenv.config();
//@ts-ignore
const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID;
//@ts-ignore
const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET;
passport.use(
	new GoogleStategy.Strategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: "http://localhost:3000/auth/google/callback",
			passReqToCallback: true,
		},
		//@ts-ignore
		async function (request, accessToken, refreshToken, profile, done) {
			const user = {
				email: profile.emails[0].value,
			};
			const usersRef = doc(firestore, "users", user.email);
			await setDoc(usersRef, user, { merge: true });
			return done(null, { ...user });
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, {
		//@ts-ignore
		email: user.email,
	});
});

passport.deserializeUser(async (user, done) => {
	const usersRef = collection(firestore, "airports");
	//@ts-ignore
	const q = query(usersRef, where("userid", "==", user.email));
	const docs = await getDocs(q);
	const airportName: string[] = [];
	const concert = [];
	const icaoCode = [];
	docs.forEach((doc) => {
		//@ts-ignore
		airportName.push(doc.data().airportName);
		concert.push(doc.data().concert);
		icaoCode.push(doc.data().icaoCode);
	});
	done(null, {
		//@ts-ignore
		email: user.email,
		airportName,
		concert,
		icaoCode,
	});
});
